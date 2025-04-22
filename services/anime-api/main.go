package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

// AnimeEpisode struct definition
type AnimeEpisode struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	WatchURL string `json:"watchUrl"`
}

// Anime struct definition
type Anime struct {
	ID          int            `json:"id"`
	Title       string         `json:"title"`
	Genre       string         `json:"genre"`
	Episodes    int            `json:"episodes"` // Total number of episodes
	CoverURL    string         `json:"coverUrl"`
	EpisodeList []AnimeEpisode `json:"episodeList"` // List of actual episodes
}

// In-memory data store
var animeList []Anime
var nextAnimeID = 3

// Initialize with some sample data
func init() {
	animeList = []Anime{
		{ID: 1, Title: "Monster", Genre: "Drama, Mystery, Psychological", Episodes: 74,
			CoverURL: "https://wallpapers.com/images/hd/anime-pictures-8hfh38y3ck06cjif.jpg",
			EpisodeList: []AnimeEpisode{
				{ID: 1, Title: "Herr Doktor Tenma", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2001.mp4"},
				{ID: 2, Title: "Downfall", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2002.mp4"},
				{ID: 3, Title: "Murder Case", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2003.mp4"},
				{ID: 4, Title: "Night of Punishment", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2004.mp4"},
				{ID: 5, Title: "The Girl from Heidelberg", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2005.mp4"},
				{ID: 6, Title: "Reported Disappearance", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2006.mp4"},
				{ID: 7, Title: "Mansion of Tragedy", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2007.mp4"},
				{ID: 8, Title: "The Fugitive", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2008.mp4"},
				{ID: 9, Title: "Rouhei to shoujo", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2009.mp4"},
				{ID: 10, Title: "The Past That Was Erased", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2010.mp4"},
				{ID: 11, Title: "Kinderheim 511", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2011.mp4"},
				{ID: 12, Title: "A Meaker Little Experiment", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2012.mp4"},
				{ID: 13, Title: "Petra and Schumann", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2013.mp4"},
				{ID: 14, Title: "The Only Man Left, the Only Woman Left", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2014.mp4"},
				{ID: 15, Title: "Be My Baby", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2015.mp4"},
				{ID: 16, Title: "Wolf's Confession", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2016.mp4"},
				{ID: 17, Title: "Reunion", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2017.mp4"},
				{ID: 18, Title: "The Fifth Spoonful of Sugar", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2018.mp4"},
				{ID: 19, Title: "Abyss of the Monster", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2019.mp4"},
				{ID: 20, Title: "Journey to Freiham", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2020.mp4"},
				{ID: 21, Title: "Happy Holidays", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2021.mp4"},
				{ID: 22, Title: "Lunge's Trap", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2022.mp4"},
				{ID: 23, Title: "Eva's Confession", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2023.mp4"},
				{ID: 24, Title: "Of Men and Dining", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2024.mp4"},
				{ID: 25, Title: "Thursday's Boy", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2025.mp4"},
				{ID: 26, Title: "The Secret Woods", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2026.mp4"},
				{ID: 27, Title: "Proof", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2027.mp4"},
				{ID: 28, Title: "Just One Case", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2028.mp4"},
				{ID: 29, Title: "Execution", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2029.mp4"},
				{ID: 30, Title: "Decision", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2030.mp4"},
				{ID: 31, Title: "In Broad Daylight", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2031.mp4"},
				{ID: 32, Title: "Sanctuary", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2032.mp4"},
				{ID: 33, Title: "Kodomo no joukei", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2033.mp4"},
				{ID: 34, Title: "At the Edge of Darkness", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2034.mp4"},
				{ID: 35, Title: "My Nameless Hero", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2035.mp4"},
				{ID: 36, Title: "The Monster of Chaos", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2036.mp4"},
				{ID: 37, Title: "Namae no nai kaibutsu", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2037.mp4"},
				{ID: 38, Title: "The Demon in My Eyes", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2038.mp4"},
				{ID: 39, Title: "The Hell in His Eyes", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2039.mp4"},
				{ID: 40, Title: "Grimmer", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2040.mp4"},
				{ID: 41, Title: "Ghosts of 511", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2041.mp4"},
				{ID: 42, Title: "The Adventures of the Magnificent Steiner", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2042.mp4"},
				{ID: 43, Title: "Jan Suk", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2043.mp4"},
				{ID: 44, Title: "Two Darknesses", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2044.mp4"},
				{ID: 45, Title: "The Monster Afterimage", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2045.mp4"},
				{ID: 46, Title: "Point of Contact", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2046.mp4"},
				{ID: 47, Title: "The Door to Nightmares", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2047.mp4"},
				{ID: 48, Title: "The Scariest Thing", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2048.mp4"},
				{ID: 49, Title: "The Cruelest Thing", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2049.mp4"},
				{ID: 50, Title: "Mansion of Roses", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2050.mp4"},
				{ID: 51, Title: "The Rose Mansion, Part 1", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2051.mp4"},
				{ID: 52, Title: "The Rose Mansion, Part 2", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2052.mp4"},
				{ID: 53, Title: "The Rose Mansion, Part 3", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2053.mp4"},
				{ID: 54, Title: "The Rose Mansion, Part 4", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2054.mp4"},
				{ID: 55, Title: "Room 402", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2055.mp4"},
				{ID: 56, Title: "The Escape", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2056.mp4"},
				{ID: 57, Title: "That Night", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2057.mp4"},
				{ID: 58, Title: "The Demon in the Bottle", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2058.mp4"},
				{ID: 59, Title: "The Man Who Saw the Devil", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2059.mp4"},
				{ID: 60, Title: "The Man Who Knew Too Much", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2060.mp4"},
				{ID: 61, Title: "The Door to Memories", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2061.mp4"},
				{ID: 62, Title: "The Law of the Monster", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2062.mp4"},
				{ID: 63, Title: "Unrelated Murders", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2063.mp4"},
				{ID: 64, Title: "The Baby's Depression", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2064.mp4"},
				{ID: 65, Title: "The Monster's Afterimage", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2065.mp4"},
				{ID: 66, Title: "The Real Monster", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2066.mp4"},
				{ID: 67, Title: "The Nameless Monster", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2067.mp4"},
				{ID: 68, Title: "The Peaceful House", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2068.mp4"},
				{ID: 69, Title: "The End of the Monster", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2069.mp4"},
				{ID: 70, Title: "The Town Massacre", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2070.mp4"},
				{ID: 71, Title: "The Wrath of the Magnificent Steiner", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2071.mp4"},
				{ID: 72, Title: "A Wonderful Holiday", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2072.mp4"},
				{ID: 73, Title: "The Real Monster's End", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2073.mp4"},
				{ID: 74, Title: "The Real Monster's End, Part 2", WatchURL: "https://ia801602.us.archive.org/11/items/monster-encode-raws/Ep%2074.mp4"},
			},
		},
		{ID: 2, Title: "Ergo Proxy", Genre: "Action, Adventure, Mystery", Episodes: 23,
			CoverURL: "https://indigomusic.com/wp-content/uploads/2024/06/untitled-design-11-min-4.png",
			EpisodeList: []AnimeEpisode{
				{ID: 1, Title: "Pulse of Awakening / awakening", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep01_%28D7AF57E5%29.mp4"},
				{ID: 2, Title: "Confession of a Fellow Citizen / confession", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep02_%28D7AF57E5%29.mp4"},
				{ID: 3, Title: "Mazecity / leap into the void", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep03_%28D7AF57E5%29.mp4"},
				{ID: 4, Title: "Futu-risk / signs of future, hades of future", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep04_%28D7AF57E5%29.mp4"},
				{ID: 5, Title: "Tasogare / recall", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep05_%28D7AF57E5%29.mp4"},
				{ID: 6, Title: "Domecoming / return home", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep06_%28D7AF57E5%29.mp4"},
				{ID: 7, Title: "RE-L124C41+ / re-l124c41+", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep07_%28D7AF57E5%29.mp4"},
				{ID: 8, Title: "Shining Sign / light ray", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep08_%28D7AF57E5%29.mp4"},
				{ID: 9, Title: "Angel's Share / brilliant shards", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep09_%28D7AF57E5%29.mp4"},
				{ID: 10, Title: "Cytotropism / existence", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep10_%28D7AF57E5%29.mp4"},
				{ID: 11, Title: "Anamnesis / in the white darkness", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep11_%28D7AF57E5%29.mp4"},
				{ID: 12, Title: "Hideout / when you're smiling", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep12_%28D7AF57E5%29.mp4"},
				{ID: 13, Title: "Wrong Way Home / conceptual blind spot", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep13_%28D7AF57E5%29.mp4"},
				{ID: 14, Title: "Ophelia / someone like you", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep14_%28D7AF57E5%29.mp4"},
				{ID: 15, Title: "Who Wants to be in Jeopardy? / nightmare quiz show", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep15_%28D7AF57E5%29.mp4"},
				{ID: 16, Title: "Busy Doing Nothing / dead calm", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep16_%28D7AF57E5%29.mp4"},
				{ID: 17, Title: "Terra Incognita / never-ending battle", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep17_%28D7AF57E5%29.mp4"},
				{ID: 18, Title: "Life After God / sign of the end", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep18_%28D7AF57E5%29.mp4"},
				{ID: 19, Title: "Eternal Smile / the girl with a smile", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep19_%28D7AF57E5%29.mp4"},
				{ID: 20, Title: "Goodbye Vincent / sacred eye of the void", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep20_%28D7AF57E5%29.mp4"},
				{ID: 21, Title: "Shampoo Planet / the place at the end of time", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep21_%28D7AF57E5%29.mp4"},
				{ID: 22, Title: "Bilbul / bonds", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep22_%28D7AF57E5%29.mp4"},
				{ID: 23, Title: "Proxy / deus ex machina", WatchURL: "https://dn720400.ca.archive.org/0/items/ergo-proxy-9500/Ergo_Proxy_Ep23_%28D7AF57E5%29.mp4"},
			},
		},
	}
}

// GraphQL AnimeEpisode Type
var animeEpisodeType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "AnimeEpisode",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"title": &graphql.Field{
				Type: graphql.String,
			},
			"watchUrl": &graphql.Field{
				Type: graphql.String,
			},
		},
	},
)

// GraphQL Anime Type
var animeType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Anime",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"title": &graphql.Field{
				Type: graphql.String,
			},
			"genre": &graphql.Field{
				Type: graphql.String,
			},
			"episodes": &graphql.Field{ // Total episode count
				Type: graphql.Int,
			},
			"coverUrl": &graphql.Field{ // New field
				Type: graphql.String,
			},
			"episodeList": &graphql.Field{ // New field
				Type:        graphql.NewList(animeEpisodeType),
				Description: "List of episodes for the anime",
			},
		},
	},
)

// GraphQL Root Query
var rootQuery = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "RootQuery",
		Fields: graphql.Fields{
			"animeList": &graphql.Field{
				Type:        graphql.NewList(animeType),
				Description: "Get all anime",
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					log.Println("Resolving animeList query")
					return animeList, nil
				},
			},
			"anime": &graphql.Field{
				Type:        animeType,
				Description: "Get anime by ID",
				Args: graphql.FieldConfigArgument{
					"id": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
				},
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					id, ok := params.Args["id"].(int)
					log.Printf("Resolving anime query for ID: %v (exists: %t)", params.Args["id"], ok)
					if ok {
						for _, anime := range animeList {
							if anime.ID == id {
								return anime, nil
							}
						}
					}
					log.Printf("Anime with ID %d not found", id)
					return nil, fmt.Errorf("anime with id %d not found", id)
				},
			},
		},
	},
)

// GraphQL Root Mutation
var rootMutation = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "RootMutation",
		Fields: graphql.Fields{
			"addAnime": &graphql.Field{
				Type:        animeType,
				Description: "Add a new anime",
				Args: graphql.FieldConfigArgument{
					"title": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"genre": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.String),
					},
					"episodes": &graphql.ArgumentConfig{
						Type: graphql.NewNonNull(graphql.Int),
					},
					"coverUrl": &graphql.ArgumentConfig{ // New argument
						Type: graphql.String,
					},
				},
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					log.Printf("Resolving addAnime mutation with args: %v", params.Args)
					title, _ := params.Args["title"].(string)
					genre, _ := params.Args["genre"].(string)
					episodes, _ := params.Args["episodes"].(int)
					coverUrl, _ := params.Args["coverUrl"].(string) // Get new argument

					newAnime := Anime{
						ID:          nextAnimeID,
						Title:       title,
						Genre:       genre,
						Episodes:    episodes,
						CoverURL:    coverUrl,         // Assign new field
						EpisodeList: []AnimeEpisode{}, // Initialize with empty list
					}
					animeList = append(animeList, newAnime)
					nextAnimeID++ // Increment ID for the next addition
					log.Printf("Added new anime: %+v", newAnime)
					return newAnime, nil
				},
			},
		},
	},
)

// GraphQL Schema
var schema, _ = graphql.NewSchema(
	graphql.SchemaConfig{
		Query:    rootQuery,
		Mutation: rootMutation,
	},
)

func executeQuery(query string, schema graphql.Schema) *graphql.Result {
	result := graphql.Do(graphql.Params{
		Schema:        schema,
		RequestString: query,
	})
	if len(result.Errors) > 0 {
		fmt.Printf("errors: %v", result.Errors)
		log.Printf("GraphQL errors encountered: %v", result.Errors)
	}
	return result
}

func main() {
	// Create a new GraphQL handler
	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true, // Enable GraphiQL interface
	})

	// Assign handler to the /graphql endpoint
	// Wrap the handler to add logging
	http.Handle("/api/anime/graphql", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Received request for %s from %s", r.URL.Path, r.RemoteAddr)
		h.ServeHTTP(w, r)
	}))

	// Basic health check endpoint
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Anime GraphQL API is running. Access GraphiQL at /graphql")
	})

	port := "8082"
	fmt.Printf("Anime GraphQL API starting on port %s... Access GraphiQL at http://localhost:%s/graphql\n", port, port)
	log.Printf("Anime GraphQL API starting on port %s... Access GraphiQL at http://localhost:%s/graphql", port, port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
