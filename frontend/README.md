# API Documentation

This document outlines the available API endpoints for the different services.

**Base URL through Gateway:** Assume Traefik gateway is running on `http://localhost`. The paths below are relative to this base URL.

---

## Series API (REST)

**Base Path:** `/api/series`

**Data Models:**

*   **`Episode`**
    ```json
    {
      "id": 0,         // integer
      "title": "string", // string
      "watchUrl": "string" // string (URL to watch the episode)
    }
    ```

*   **`Series`**
    ```json
    {
      "id": 0,                // integer, read-only
      "title": "string",        // string, required on create
      "genre": "string",        // string
      "totalEpisodes": 0,   // integer
      "watchedEpisodes": 0, // integer
      "coverUrl": "string",     // string (URL to cover image)
      "episodes": [          // array of Episode objects
        // ... see Episode model above ...
      ]
    }
    ```

**Endpoints:**

*   **`GET /api/series`**
    *   Description: Retrieves a list of all series.
    *   Response: `200 OK` with JSON array of Series objects.
    *   Example Response:
        ```json
        [
          {
            "id": 1,
            "title": "Breaking Bad",
            "genre": "Crime Drama",
            "totalEpisodes": 62,
            "watchedEpisodes": 62,
            "coverUrl": "https://example.com/covers/breaking_bad.jpg",
            "episodes": [
              { "id": 1, "title": "Pilot", "watchUrl": "https://example.com/watch/bb/s01e01" },
              { "id": 2, "title": "Cat's in the Bag...", "watchUrl": "https://example.com/watch/bb/s01e02" }
            ]
          },
          {
            "id": 2,
            "title": "Stranger Things",
            "genre": "Sci-Fi Horror",
            "totalEpisodes": 34,
            "watchedEpisodes": 25,
            "coverUrl": "https://example.com/covers/stranger_things.jpg",
            "episodes": [
              { "id": 1, "title": "Chapter One: The Vanishing of Will Byers", "watchUrl": "https://example.com/watch/st/s01e01" },
              { "id": 2, "title": "Chapter Two: The Weirdo on Maple Street", "watchUrl": "https://example.com/watch/st/s01e02" }
            ]
          }
        ]
        ```

*   **`GET /api/series/{id}`**
    *   Description: Retrieves details for a specific series by its ID.
    *   Path Parameter: `{id}` (integer) - The ID of the series.
    *   Response:
        *   `200 OK`: JSON object of the Series.
        *   `404 Not Found`: If the series with the given ID doesn't exist.
        *   `400 Bad Request`: If the ID format is invalid.
    *   Example Response (for ID 1):
        ```json
        {
          "id": 1,
          "title": "Breaking Bad",
          "genre": "Crime Drama",
          "totalEpisodes": 62,
          "watchedEpisodes": 62,
          "coverUrl": "https://example.com/covers/breaking_bad.jpg",
          "episodes": [
            { "id": 1, "title": "Pilot", "watchUrl": "https://example.com/watch/bb/s01e01" },
            { "id": 2, "title": "Cat's in the Bag...", "watchUrl": "https://example.com/watch/bb/s01e02" }
            // ... potentially more episodes
          ]
        }
        ```

*   **`POST /api/series`**
    *   Description: Creates a new series.
    *   Request Body: JSON object representing the new series (ID is ignored, `title` is required). `coverUrl` and `episodes` are optional.
    *   Response:
        *   `201 Created`: JSON object of the newly created series (including its assigned ID).
        *   `400 Bad Request`: If the request body is invalid or `title` is missing.
    *   Example Request Body:
        ```json
        {
          "title": "The Mandalorian",
          "genre": "Sci-Fi Western",
          "totalEpisodes": 24,
          "watchedEpisodes": 16,
          "coverUrl": "https://example.com/covers/mandalorian.jpg",
          "episodes": [] // Can provide episodes or omit
        }
        ```
    *   Example Response:
        ```json
        {
          "id": 3, // Assuming next ID is 3
          "title": "The Mandalorian",
          "genre": "Sci-Fi Western",
          "totalEpisodes": 24,
          "watchedEpisodes": 16,
          "coverUrl": "https://example.com/covers/mandalorian.jpg",
          "episodes": []
        }
        ```

---

## Anime API (GraphQL)

**Endpoint:** `/api/anime/graphql` (Handles POST requests)

**Schema Overview:**

*   **Type `AnimeEpisode`:**
    *   `id: Int!`
    *   `title: String`
    *   `watchUrl: String`

*   **Type `Anime`:**
    *   `id: Int!`
    *   `title: String`
    *   `genre: String`
    *   `episodes: Int` (Total number of episodes)
    *   `coverUrl: String`
    *   `episodeList: [AnimeEpisode]` (List of actual episodes)

*   **Query:**
    *   `animeList: [Anime]` - Fetches all anime.
    *   `anime(id: Int!): Anime` - Fetches a single anime by ID.

*   **Mutation:**
    *   `addAnime(title: String!, genre: String!, episodes: Int!, coverUrl: String): Anime` - Adds a new anime.

**Example Queries/Mutations:**

*   **Get All Anime (with episodes):**
    ```graphql
    query {
      animeList {
        id
        title
        genre
        coverUrl
        episodeList {
          id
          title
          watchUrl
        }
      }
    }
    ```

*   **Get Anime by ID (with episodes):**
    ```graphql
    query {
      anime(id: 1) {
        id
        title
        genre
        episodes
        coverUrl
        episodeList {
          id
          title
          watchUrl
        }
      }
    }
    ```

*   **Add Anime:**
    ```graphql
    mutation {
      addAnime(title: "Jujutsu Kaisen", genre: "Supernatural Action", episodes: 47, coverUrl: "https://example.com/covers/jjk.jpg") {
        id
        title
        coverUrl
        episodeList # Will be empty initially
      }
    }
    ```

---

## Movies API (SOAP - Simplified)

**Endpoint:** `/api/movies/soap` (Handles POST requests with XML body)

**Data Model (`Movie`):**
```xml
<Movie>
  <ID>int</ID>
  <Title>string</Title>
  <Genre>string</Genre>
  <Year>int</Year>
  <CoverURL>string</CoverURL> <!-- URL to cover image -->
  <WatchURL>string</WatchURL> <!-- URL to watch the movie -->
</Movie>
```

**Operations:**

1.  **`ListMovies`**
    *   Description: Retrieves a list of all movies.
    *   Request Body:
        ```xml
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="http://example.com/movieservice">
           <soapenv:Header/>
           <soapenv:Body>
              <mov:ListMoviesRequest/>
           </soapenv:Body>
        </soapenv:Envelope>
        ```
    *   Success Response Body (`200 OK`):
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="http://example.com/movieservice">
           <soapenv:Header/>
           <soapenv:Body>
              <mov:ListMoviesResponse>
                 <Movies>
                    <Movie>
                       <ID>1</ID>
                       <Title>Inception</Title>
                       <Genre>Sci-Fi Action</Genre>
                       <Year>2010</Year>
                       <CoverURL>https://example.com/covers/inception.jpg</CoverURL>
                       <WatchURL>https://example.com/watch/inception</WatchURL>
                    </Movie>
                    <Movie>
                       <ID>2</ID>
                       <Title>The Dark Knight</Title>
                       <Genre>Action Thriller</Genre>
                       <Year>2008</Year>
                       <CoverURL>https://example.com/covers/dark_knight.jpg</CoverURL>
                       <WatchURL>https://example.com/watch/dark_knight</WatchURL>
                    </Movie>
                    <!-- More movies... -->
                 </Movies>
              </mov:ListMoviesResponse>
           </soapenv:Body>
        </soapenv:Envelope>
        ```

2.  **`GetMovieDetails`**
    *   Description: Retrieves details for a specific movie by ID.
    *   Request Body:
        ```xml
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="http://example.com/movieservice">
           <soapenv:Header/>
           <soapenv:Body>
              <mov:GetMovieDetailsRequest>
                 <ID>int</ID>  <!-- Replace int with the desired movie ID -->
              </mov:GetMovieDetailsRequest>
           </soapenv:Body>
        </soapenv:Envelope>
        ```
    *   Success Response Body (`200 OK`):
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="http://example.com/movieservice">
           <soapenv:Header/>
           <soapenv:Body>
              <mov:GetMovieDetailsResponse>
                 <Movie>
                    <ID>1</ID>
                    <Title>Inception</Title>
                    <Genre>Sci-Fi Action</Genre>
                    <Year>2010</Year>
                    <CoverURL>https://example.com/covers/inception.jpg</CoverURL>
                    <WatchURL>https://example.com/watch/inception</WatchURL>
                 </Movie>
              </mov:GetMovieDetailsResponse>
           </soapenv:Body>
        </soapenv:Envelope>
        ```
    *   Error Response (`500 Internal Server Error` - Example for Not Found):
        ```xml
        <?xml version="1.0" encoding="UTF-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="http://example.com/movieservice">
           <soapenv:Header/>
           <soapenv:Body>
              <soapenv:Fault>
                 <faultcode>Server</faultcode>
                 <faultstring>movie with ID 99 not found</faultstring>
              </soapenv:Fault>
           </soapenv:Body>
        </soapenv:Envelope>
        ``` 