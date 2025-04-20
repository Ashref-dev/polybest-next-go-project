import { Movie, SoapFault } from "../types";

const SOAP_ENDPOINT = "/api/movies/soap";
const SOAP_NAMESPACE = "http://example.com/movieservice";

/**
 * Helper function to create a SOAP envelope
 */
function createSoapEnvelope(bodyContent: string): string {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="${SOAP_NAMESPACE}">
      <soapenv:Header/>
      <soapenv:Body>
        ${bodyContent}
      </soapenv:Body>
    </soapenv:Envelope>
  `;
}

/**
 * Parse XML string to DOM
 */
function parseXML(xmlString: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, "text/xml");
}

/**
 * Extract SOAP fault if present
 */
function extractSoapFault(doc: Document): SoapFault | null {
  const faultElement = doc.getElementsByTagName("soapenv:Fault")[0] || doc.getElementsByTagName("Fault")[0];
  
  if (faultElement) {
    const faultcode = faultElement.getElementsByTagName("faultcode")[0]?.textContent || "Unknown";
    const faultstring = faultElement.getElementsByTagName("faultstring")[0]?.textContent || "Unknown error";
    
    return { faultcode, faultstring };
  }
  
  return null;
}

/**
 * Convert Movie XML element to Movie object
 */
function xmlToMovie(movieElement: Element): Movie {
  return {
    ID: parseInt(movieElement.getElementsByTagName("ID")[0]?.textContent || "0", 10),
    Title: movieElement.getElementsByTagName("Title")[0]?.textContent || "",
    Genre: movieElement.getElementsByTagName("Genre")[0]?.textContent || "",
    Year: parseInt(movieElement.getElementsByTagName("Year")[0]?.textContent || "0", 10),
    CoverURL: movieElement.getElementsByTagName("CoverURL")[0]?.textContent || "",
    WatchURL: movieElement.getElementsByTagName("WatchURL")[0]?.textContent || ""
  };
}

/**
 * SOAP client for the Movies API
 */
export const moviesClient = {
  /**
   * Fetches all movies from the API
   */
  async listMovies(): Promise<Movie[]> {
    const soapRequest = createSoapEnvelope("<mov:ListMoviesRequest/>");
    
    const response = await fetch(SOAP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": `${SOAP_NAMESPACE}/ListMovies`
      },
      body: soapRequest
    });
    
    const xmlText = await response.text();
    const xmlDoc = parseXML(xmlText);
    
    // Check for SOAP fault
    const fault = extractSoapFault(xmlDoc);
    if (fault) {
      throw new Error(`SOAP Fault: ${fault.faultstring}`);
    }
    
    // Extract movies from response
    const moviesResponse = xmlDoc.getElementsByTagName("mov:ListMoviesResponse")[0] || 
                           xmlDoc.getElementsByTagName("ListMoviesResponse")[0];
    
    if (!moviesResponse) {
      throw new Error("Invalid SOAP response: ListMoviesResponse element not found");
    }
    
    const moviesElement = moviesResponse.getElementsByTagName("Movies")[0];
    if (!moviesElement) {
      return [];
    }
    
    const movieElements = moviesElement.getElementsByTagName("Movie");
    const movies: Movie[] = [];
    
    for (let i = 0; i < movieElements.length; i++) {
      movies.push(xmlToMovie(movieElements[i]));
    }
    
    return movies;
  },
  
  /**
   * Fetches a single movie by ID
   */
  async getMovieDetails(id: number): Promise<Movie> {
    const soapRequest = createSoapEnvelope(`
      <mov:GetMovieDetailsRequest>
        <ID>${id}</ID>
      </mov:GetMovieDetailsRequest>
    `);
    
    const response = await fetch(SOAP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": `${SOAP_NAMESPACE}/GetMovieDetails`
      },
      body: soapRequest
    });
    
    const xmlText = await response.text();
    const xmlDoc = parseXML(xmlText);
    
    // Check for SOAP fault
    const fault = extractSoapFault(xmlDoc);
    if (fault) {
      throw new Error(`SOAP Fault: ${fault.faultstring}`);
    }
    
    // Extract movie from response
    const detailsResponse = xmlDoc.getElementsByTagName("mov:GetMovieDetailsResponse")[0] || 
                            xmlDoc.getElementsByTagName("GetMovieDetailsResponse")[0];
    
    if (!detailsResponse) {
      throw new Error("Invalid SOAP response: GetMovieDetailsResponse element not found");
    }
    
    const movieElement = detailsResponse.getElementsByTagName("Movie")[0];
    if (!movieElement) {
      throw new Error("Movie not found in response");
    }
    
    return xmlToMovie(movieElement);
  }
}; 