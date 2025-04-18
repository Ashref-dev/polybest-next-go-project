package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

// Anime struct definition
type Anime struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Genre    string `json:"genre"`
	Episodes int    `json:"episodes"`
}

// In-memory data store
var animeList []Anime
var nextAnimeID = 3

// Initialize with some sample data
func init() {
	animeList = []Anime{
		{ID: 1, Title: "Attack on Titan", Genre: "Action, Dark Fantasy", Episodes: 88},
		{ID: 2, Title: "Demon Slayer", Genre: "Adventure, Dark Fantasy", Episodes: 55},
	}
}

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
			"episodes": &graphql.Field{
				Type: graphql.Int,
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
				},
				Resolve: func(params graphql.ResolveParams) (interface{}, error) {
					log.Printf("Resolving addAnime mutation with args: %v", params.Args)
					title, _ := params.Args["title"].(string)
					genre, _ := params.Args["genre"].(string)
					episodes, _ := params.Args["episodes"].(int)

					newAnime := Anime{
						ID:       nextAnimeID,
						Title:    title,
						Genre:    genre,
						Episodes: episodes,
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
