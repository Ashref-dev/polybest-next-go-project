# API Documentation

This document outlines the available API endpoints for the different services.

**Base URL through Gateway:** Assume Traefik gateway is running on `http://localhost`. The paths below are relative to this base URL.

---

## Series API (REST)

**Base Path:** `/api/series`

**Data Model:**
```json
{
  "id": 0,                // integer, read-only
  "title": "string",        // string, required on create
  "genre": "string",        // string
  "totalEpisodes": 0,   // integer
  "watchedEpisodes": 0  // integer
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
            "watchedEpisodes": 62
          },
          {
            "id": 2,
            "title": "Stranger Things",
            "genre": "Sci-Fi Horror",
            "totalEpisodes": 34,
            "watchedEpisodes": 25
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
          "watchedEpisodes": 62
        }
        ```

*   **`POST /api/series`**
    *   Description: Creates a new series.
    *   Request Body: JSON object representing the new series (ID is ignored, `title` is required).
    *   Response:
        *   `201 Created`: JSON object of the newly created series (including its assigned ID).
        *   `400 Bad Request`: If the request body is invalid or `title` is missing.
    *   Example Request Body:
        ```json
        {
          "title": "The Mandalorian",
          "genre": "Sci-Fi Western",
          "totalEpisodes": 24,
          "watchedEpisodes": 16
        }
        ```
    *   Example Response:
        ```json
        {
          "id": 3, // Assuming next ID is 3
          "title": "The Mandalorian",
          "genre": "Sci-Fi Western",
          "totalEpisodes": 24,
          "watchedEpisodes": 16
        }
        ```

---

## Anime API (GraphQL)

**Endpoint:** `/api/anime/graphql` (Handles POST requests)

**Schema Overview:**

*   **Type `Anime`:**
    *   `id: Int!`
    *   `title: String`
    *   `genre: String`
    *   `episodes: Int`

*   **Query:**
    *   `animeList: [Anime]` - Fetches all anime.
    *   `anime(id: Int!): Anime` - Fetches a single anime by ID.

*   **Mutation:**
    *   `addAnime(title: String!, genre: String!, episodes: Int!): Anime` - Adds a new anime.

**Example Queries/Mutations:**

*   **Get All Anime:**
    ```graphql
    query {
      animeList {
        id
        title
        genre
      }
    }
    ```

*   **Get Anime by ID:**
    ```graphql
    query {
      anime(id: 1) {
        id
        title
        genre
        episodes
      }
    }
    ```

*   **Add Anime:**
    ```graphql
    mutation {
      addAnime(title: "Jujutsu Kaisen", genre: "Supernatural Action", episodes: 47) {
        id
        title
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
                    </Movie>
                    <Movie>
                       <ID>2</ID>
                       <Title>The Dark Knight</Title>
                       <Genre>Action Thriller</Genre>
                       <Year>2008</Year>
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