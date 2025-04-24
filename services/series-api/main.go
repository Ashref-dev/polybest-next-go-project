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

// Episode struct definition
type Episode struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	WatchURL string `json:"watchUrl"`
}

// Series struct definition
type Series struct {
	ID              int       `json:"id"`
	Title           string    `json:"title"`
	Genre           string    `json:"genre"`
	TotalEpisodes   int       `json:"totalEpisodes"`
	WatchedEpisodes int       `json:"watchedEpisodes"` // Example additional field
	CoverURL        string    `json:"coverUrl"`        // New field
	Episodes        []Episode `json:"episodes"`        // New field
}

// In-memory data store (using a map for easier ID lookup)
var seriesStore = make(map[int]Series)
var nextSeriesID = 4
var storeMutex = &sync.RWMutex{} // Mutex to handle concurrent access

// Initialize with some sample data
func init() {
	seriesStore[1] = Series{
		ID:              1,
		Title:           "Breaking Bad",
		Genre:           "Crime Drama",
		TotalEpisodes:   7,
		WatchedEpisodes: 0,
		CoverURL:        "https://www.bpmcdn.com/f/files/kelowna/import/2022-06/29555137_web1_220630-KCN-Breaking-Bad-_1.jpg",
		Episodes: []Episode{
			{ID: 1, Title: "Pilot", WatchURL: "https://example.com/breakingbad/s01e01.mp4"},
			{ID: 2, Title: "Cat's in the Bag...", WatchURL: "https://example.com/breakingbad/s01e02.mp4"},
			{ID: 3, Title: "...And the Bag's in the River", WatchURL: "https://example.com/breakingbad/s01e03.mp4"},
			{ID: 4, Title: "Cancer Man", WatchURL: "https://example.com/breakingbad/s01e04.mp4"},
			{ID: 5, Title: "Gray Matter", WatchURL: "https://example.com/breakingbad/s01e05.mp4"},
			{ID: 6, Title: "Crazy Handful of Nothin'", WatchURL: "https://example.com/breakingbad/s01e06.mp4"},
			{ID: 7, Title: "A No-Rough-Stuff-Type Deal", WatchURL: "https://example.com/breakingbad/s01e07.mp4"},
		},
	}
	seriesStore[2] = Series{
		ID:              2,
		Title:           "Invincible",
		Genre:           "Action, Adventure, Animation",
		TotalEpisodes:   8,
		WatchedEpisodes: 0,
		CoverURL:        "https://www.vitalthrills.com/wp-content/uploads/2024/12/invincibleccxp1.jpg",
		Episodes: []Episode{
			{ID: 1, Title: "It's About Time",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP1.ia.mp4"},
			{ID: 2, Title: "Here Goes Nothing",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP2.ia.mp4"},
			{ID: 3, Title: "Who You Calling Ugly?",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP3.ia.mp4"},
			{ID: 4, Title: "Neil Armstrong, Eat Your Heart Out",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP4.ia.mp4"},
			{ID: 5, Title: "That Actually Hurt",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP5.ia.mp4"},
			{ID: 6, Title: "You Look Kinda Dead",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP6.ia.mp4"},
			{ID: 7, Title: "We Need to Talk",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP7.ia.mp4"},
			{ID: 8, Title: "Where I Really Come From",
				WatchURL: "https://dn721603.ca.archive.org/0/items/Invincible_Season_1/EP8.ia.mp4"},
		},
	}

	seriesStore[3] = Series{
		ID:              3,
		Title:           "Severance",
		Genre:           "Sci-Fi Thriller", // Assumed genre
		TotalEpisodes:   12,                // Counted from the provided image (may be incomplete)
		WatchedEpisodes: 0,
		CoverURL:        "https://img.newsroom.cj.net/wp-content/uploads/2023/07/image-1.png",
		Episodes: []Episode{
			// Based on provided image and URL structure, encoding special characters in URL filename part
			// Using the base path from S01E01 and host from S01E02 example for all episodes
			{ID: 1, Title: "GOOD NEWS ABOUT HELL-1", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S01E01%20-%20GOOD%20NEWS%20ABOUT%20%20HELL-1.mp4"}, // S01E01
			{ID: 2, Title: "HALF LOOP", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S01E02%20-%20HALF%20LOOP.mp4"},                                  // S01E02
			{ID: 3, Title: "IN PERPETUITY", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S01E03%20-%20IN%20PERPETUITY.mp4"},                          // S01E03
			{ID: 4, Title: "HIDE AND SEEK", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S01E06%20-%20HIDE%20AND%20SEEK.mp4"},                        // S01E06 (Skipped E04, E05, E07 as not in image)
			{ID: 5, Title: "WHAT'S FOR DINNER", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S01E08%20-%20WHAT%27S%20FOR%20DINNER.mp4"},              // S01E08 - Encoded ' as %27
			{ID: 6, Title: "HELLO, MS. COBELL", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S02E01%20-%20HELLO%2C%20MS.%20COBELL.mp4"},              // S02E01 - Encoded , as %2C and . as %2E
			{ID: 7, Title: "GOODBYE MS. SELVIG", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S02E02%20-%20GOODBYE%20MS.%20SELVIG.mp4"},              // S02E02 - Encoded . as %2E
			{ID: 8, Title: "WHO IS ALIVE", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S02E03%20-%20WHO%20IS%20ALIVE.mp4"},                          // S02E03
			{ID: 9, Title: "WOES HOLLOW", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S02E04%20-%20WOES%20HOLLOW.mp4"},                              // S02E04
			{ID: 10, Title: "TROJAN'S HORSE", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S02E05%20-%20TROJAN%27S%20HORSE.mp4"},                     // S02E05 - Encoded ' as %27
			{ID: 11, Title: "ATTILA", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S02E06%20-%20ATTILA.mp4"},                                         // S02E06
			{ID: 12, Title: "CHIKHAI BARDO", WatchURL: "https://ia800107.us.archive.org/28/items/severance-s-01-e-01-good-news-about-hell-1/SEVERANCE%20S02E07%20-%20CHIKHAI%20BARDO.mp4"},                         // S02E07 (Skipped E08+ as not in image)
		},
	}
}

// --- Handler Functions ---

// getSeriesHandler handles GET /series
func getSeriesHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received request path: %s", r.URL.Path) // Log received path
	storeMutex.RLock()                                  // Read lock
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
	log.Printf("Received request path: %s", r.URL.Path) // Log received path
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
	// Log the current state of the store before lookup
	log.Printf("Current seriesStore: %+v\n", seriesStore)
	// Use direct map lookup
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
	// Add default empty slice for episodes if not provided, prevents null in JSON
	if newSeries.Episodes == nil {
		newSeries.Episodes = []Episode{}
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
	apiRouter := r.PathPrefix("/api/series").Subrouter() // Base path for series API
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
