package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/gorilla/mux"
)

// Series struct definition
type Series struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Genre       string `json:"genre"`
	TotalEpisodes int    `json:"totalEpisodes"`
	WatchedEpisodes int `json:"watchedEpisodes"` // Example additional field
}

// In-memory data store (using a map for easier ID lookup)
var seriesStore = make(map[int]Series)
var nextSeriesID = 3
var storeMutex = &sync.RWMutex{} // Mutex to handle concurrent access

// Initialize with some sample data
func init() {
	seriesStore[1] = Series{ID: 1, Title: "Breaking Bad", Genre: "Crime Drama", TotalEpisodes: 62, WatchedEpisodes: 62}
	seriesStore[2] = Series{ID: 2, Title: "Stranger Things", Genre: "Sci-Fi Horror", TotalEpisodes: 34, WatchedEpisodes: 25} 
}

// --- Handler Functions ---

// getSeriesHandler handles GET /series
func getSeriesHandler(w http.ResponseWriter, r *http.Request) {
	storeMutex.RLock() // Read lock
	defer storeMutex.RUnlock()

	seriesList := make([]Series, 0, len(seriesStore))
	for _, s := range seriesStore {
		seriesList = append(seriesList, s)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(seriesList); err != nil {
		log.Printf("Error encoding series list: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	log.Println("Handled GET /series request")
}

// getSeriesByIDHandler handles GET /series/{id}
func getSeriesByIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr, ok := vars["id"]
	if !ok {
		http.Error(w, "Missing series ID", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid series ID format", http.StatusBadRequest)
		return
	}

	storeMutex.RLock() // Read lock
	series, exists := seriesStore[id]
	storeMutex.RUnlock()

	if !exists {
		http.Error(w, fmt.Sprintf("Series with ID %d not found", id), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(series); err != nil {
		log.Printf("Error encoding series (ID: %d): %v", id, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	log.Printf("Handled GET /series/%d request", id)
}

// createSeriesHandler handles POST /series
func createSeriesHandler(w http.ResponseWriter, r *http.Request) {
	var newSeries Series
	if err := json.NewDecoder(r.Body).Decode(&newSeries); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		log.Printf("Error decoding request body: %v", err)
		return
	}
	defer r.Body.Close()

	// Basic validation (e.g., title is required)
	if newSeries.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	storeMutex.Lock() // Write lock
	newSeries.ID = nextSeriesID
	seriesStore[newSeries.ID] = newSeries
	nextSeriesID++
	storeMutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(newSeries); err != nil {
		log.Printf("Error encoding created series (ID: %d): %v", newSeries.ID, err)
		// Note: Cannot write header again here as it's already sent.
	}
	log.Printf("Handled POST /series request, created series ID: %d", newSeries.ID)
}

func main() {
	r := mux.NewRouter()

	// Define routes
	apiRouter := r.PathPrefix("/series").Subrouter() // Base path for series API
	apiRouter.HandleFunc("", getSeriesHandler).Methods("GET")
	apiRouter.HandleFunc("", createSeriesHandler).Methods("POST")
	apiRouter.HandleFunc("/{id:[0-9]+}", getSeriesByIDHandler).Methods("GET")

	// Simple root handler for health check / info
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Series REST API is running. Try /series")
	})

	port := "8081"
	fmt.Printf("Series REST API starting on port %s...\n", port)
	log.Printf("Series REST API starting on port %s...", port)

	// Start server
	log.Fatal(http.ListenAndServe(":"+port, r))
} 