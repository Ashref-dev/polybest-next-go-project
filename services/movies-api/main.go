package main

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
)

// Movie struct definition
type Movie struct {
	XMLName xml.Name `xml:"Movie"` // Used for XML marshalling
	ID      int      `xml:"ID"`
	Title   string   `xml:"Title"`
	Genre   string   `xml:"Genre"`
	Year    int      `xml:"Year"`
}

// In-memory data store
var movieStore = make(map[int]Movie)
var nextMovieID = 3
var storeMutex = &sync.RWMutex{}

// Initialize with sample data
func init() {
	movieStore[1] = Movie{ID: 1, Title: "Inception", Genre: "Sci-Fi Action", Year: 2010}
	movieStore[2] = Movie{ID: 2, Title: "The Dark Knight", Genre: "Action Thriller", Year: 2008}
}

// --- Simplified SOAP Structure Definitions ---

const soapEnvelopeStart = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="http://example.com/movieservice">
   <soapenv:Header/>
   <soapenv:Body>`
const soapEnvelopeEnd = `
   </soapenv:Body>
</soapenv:Envelope>`

// Generic Request struct to find the operation
type SoapRequest struct {
	XMLName xml.Name
	Body    []byte `xml:",innerxml"`
}

// --- ListMovies Operation ---

type ListMoviesRequest struct {
	XMLName xml.Name `xml:"mov:ListMoviesRequest"`
	// No parameters for list all
}

type ListMoviesResponse struct {
	XMLName xml.Name `xml:"mov:ListMoviesResponse"`
	Movies  []Movie  `xml:"Movies>Movie"`
}

// --- GetMovieDetails Operation ---

type GetMovieDetailsRequest struct {
	XMLName xml.Name `xml:"mov:GetMovieDetailsRequest"`
	ID      int      `xml:"ID"`
}

type GetMovieDetailsResponse struct {
	XMLName xml.Name `xml:"mov:GetMovieDetailsResponse"`
	Movie   Movie    `xml:"Movie"`
}

// --- SOAP Fault (Error) Structure ---

type SoapFault struct {
	XMLName   xml.Name `xml:"soapenv:Fault"`
	FaultCode string   `xml:"faultcode"`
	FaultString string `xml:"faultstring"`
}

// --- Handler ---

func soapHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		sendSoapFault(w, "Client", "Failed to read request body")
		return
	}
	defer r.Body.Close()

	log.Printf("Received SOAP request: %s", string(bodyBytes))

	// Determine the operation by inspecting the XML structure
	// This is a simplified approach; real SOAP would use SOAPAction header or specific namespaces
	requestBodyStr := string(bodyBytes)
	var responsePayload interface{}
	var responseErr error

	if strings.Contains(requestBodyStr, "ListMoviesRequest") {
		log.Println("Detected ListMoviesRequest operation")
		responsePayload, responseErr = handleListMovies()
	} else if strings.Contains(requestBodyStr, "GetMovieDetailsRequest") {
		log.Println("Detected GetMovieDetailsRequest operation")
		// Need to properly unmarshal the ID from the request body
		var req GetMovieDetailsRequest
		if err := xml.Unmarshal(bodyBytes, &req); err != nil {
			// Attempt to extract ID if direct unmarshal fails (due to envelope)
			// A more robust parser would handle the envelope properly.
			start := strings.Index(requestBodyStr, "<ID>")
			end := strings.Index(requestBodyStr, "</ID>")
			if start > 0 && end > start {
				idStr := requestBodyStr[start+4 : end]
				id, convErr := strconv.Atoi(idStr)
				if convErr == nil {
					log.Printf("Extracted Movie ID: %d", id)
					responsePayload, responseErr = handleGetMovieDetails(id)
				} else {
					responseErr = fmt.Errorf("invalid ID format in request")
				}
			} else {
				responseErr = fmt.Errorf("could not parse GetMovieDetailsRequest ID")
			}
		} else {
			responsePayload, responseErr = handleGetMovieDetails(req.ID)
		}

	} else {
		log.Println("Unknown SOAP operation requested")
		responseErr = fmt.Errorf("unknown operation")
	}

	// Send Response or Fault
	if responseErr != nil {
		log.Printf("Error processing SOAP request: %v", responseErr)
		sendSoapFault(w, "Server", responseErr.Error())
		return
	}

	sendSoapResponse(w, responsePayload)
}

// --- Logic Functions ---

func handleListMovies() (ListMoviesResponse, error) {
	storeMutex.RLock()
	defer storeMutex.RUnlock()

	movieList := make([]Movie, 0, len(movieStore))
	for _, m := range movieStore {
		movieList = append(movieList, m)
	}

	log.Printf("Returning %d movies", len(movieList))
	return ListMoviesResponse{Movies: movieList}, nil
}

func handleGetMovieDetails(id int) (GetMovieDetailsResponse, error) {
	storeMutex.RLock()
	defer storeMutex.RUnlock()

	movie, exists := movieStore[id]
	if !exists {
		log.Printf("Movie with ID %d not found", id)
		return GetMovieDetailsResponse{}, fmt.Errorf("movie with ID %d not found", id)
	}

	log.Printf("Returning details for movie ID %d", id)
	return GetMovieDetailsResponse{Movie: movie}, nil
}

// --- Helper Functions ---

func sendSoapResponse(w http.ResponseWriter, payload interface{}) {
	respBytes, err := xml.MarshalIndent(payload, "      ", "  ") // Indent for readability
	if err != nil {
		log.Printf("Error marshalling SOAP response: %v", err)
		sendSoapFault(w, "Server", "Failed to construct response")
		return
	}

	w.Header().Set("Content-Type", "application/soap+xml; charset=utf-8") // Or text/xml
	// Manually wrap with Envelope
	fmt.Fprint(w, xml.Header)
	fmt.Fprint(w, soapEnvelopeStart)
	fmt.Fprint(w, string(respBytes))
	fmt.Fprint(w, soapEnvelopeEnd)
	log.Println("Sent SOAP response successfully")
}

func sendSoapFault(w http.ResponseWriter, faultCode, faultString string) {
	fault := SoapFault{
		FaultCode:   faultCode,
		FaultString: faultString,
	}
	faultBytes, err := xml.MarshalIndent(fault, "      ", "  ")
	if err != nil {
		log.Printf("Error marshalling SOAP fault: %v", err)
		// Fallback to plain text error if fault marshalling fails
		http.Error(w, "Internal Server Error during fault generation", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/soap+xml; charset=utf-8")
	w.WriteHeader(http.StatusInternalServerError) // SOAP faults usually use 500
	fmt.Fprint(w, xml.Header)
	fmt.Fprint(w, soapEnvelopeStart)
	fmt.Fprint(w, string(faultBytes))
	fmt.Fprint(w, soapEnvelopeEnd)
	log.Printf("Sent SOAP Fault: Code=%s, String=%s", faultCode, faultString)
}

// --- Main Function ---

func main() {
	http.HandleFunc("/soap", soapHandler)

	// Simple root handler for health check / info
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Movies SOAP API (Simplified) is running. POST requests to /soap")
	})

	port := "8083"
	fmt.Printf("Movies SOAP API starting on port %s...\n", port)
	log.Printf("Movies SOAP API (Simplified) starting on port %s...", port)

	// Start server
	log.Fatal(http.ListenAndServe(":"+port, nil))
} 