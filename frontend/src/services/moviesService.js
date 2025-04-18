import axios from 'axios';

// Endpoint points to the gateway path for the movies API
const SOAP_ENDPOINT = '/api/movies/soap';

// Helper to create SOAP request body
const createSoapRequest = (operationBody) => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mov="http://example.com/movieservice">
       <soapenv:Header/>
       <soapenv:Body>
          ${operationBody}
       </soapenv:Body>
    </soapenv:Envelope>
  `.trim();
};

// Helper to parse XML response and extract movies
// This is a basic parser and might need refinement based on actual XML structure
const parseMoviesResponse = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Check for SOAP Fault first
    const faultNode = xmlDoc.getElementsByTagName('soapenv:Fault')[0];
    if (faultNode) {
      const faultString = faultNode.getElementsByTagName('faultstring')[0]?.textContent;
      throw new Error(`SOAP Fault: ${faultString || 'Unknown error'}`);
    }

    const movieNodes = xmlDoc.getElementsByTagName('Movie');
    const movies = Array.from(movieNodes).map(node => ({
      ID: parseInt(node.getElementsByTagName('ID')[0]?.textContent || '0', 10),
      Title: node.getElementsByTagName('Title')[0]?.textContent || '',
      Genre: node.getElementsByTagName('Genre')[0]?.textContent || '',
      Year: parseInt(node.getElementsByTagName('Year')[0]?.textContent || '0', 10),
    }));
    return movies;
  } catch (error) {
    console.error("Error parsing SOAP response:", error);
    throw new Error("Failed to parse SOAP response.");
  }
};

export const listMovies = async () => {
  const operationBody = `<mov:ListMoviesRequest/>`;
  const requestBody = createSoapRequest(operationBody);

  try {
    const response = await axios.post(SOAP_ENDPOINT, requestBody, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        // SOAPAction header might be required by some servers, but likely not for our simple Go service
        // 'SOAPAction': 'http://example.com/movieservice/ListMovies'
      },
    });
    return parseMoviesResponse(response.data);
  } catch (error) {
    console.error('Error calling ListMovies SOAP operation:', error.response?.data || error.message);
    // Try to extract fault string if it's an Axios error with XML data
    if (error.response && typeof error.response.data === 'string' && error.response.data.includes('faultstring')) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(error.response.data, "text/xml");
            const faultString = xmlDoc.getElementsByTagName('faultstring')[0]?.textContent;
             if (faultString) throw new Error(`SOAP Fault: ${faultString}`);
        } catch (parseError) {
             // Ignore parse error, throw original
        }
    }
    throw error; // Re-throw
  }
};

export const getMovieDetails = async (id) => {
  const operationBody = `<mov:GetMovieDetailsRequest><ID>${id}</ID></mov:GetMovieDetailsRequest>`;
  const requestBody = createSoapRequest(operationBody);

  try {
    const response = await axios.post(SOAP_ENDPOINT, requestBody, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        // 'SOAPAction': 'http://example.com/movieservice/GetMovieDetails'
      },
    });
    // Response for GetMovieDetails returns a single movie inside GetMovieDetailsResponse
    // We adapt the parser or handle it specifically
     const parser = new DOMParser();
     const xmlDoc = parser.parseFromString(response.data, "text/xml");
     const faultNode = xmlDoc.getElementsByTagName('soapenv:Fault')[0];
     if (faultNode) {
       const faultString = faultNode.getElementsByTagName('faultstring')[0]?.textContent;
       throw new Error(`SOAP Fault: ${faultString || 'Unknown error'}`);
     }
     const movieNode = xmlDoc.getElementsByTagName('Movie')[0];
     if (!movieNode) throw new Error('Movie data not found in SOAP response');
     return [{
       ID: parseInt(movieNode.getElementsByTagName('ID')[0]?.textContent || '0', 10),
       Title: movieNode.getElementsByTagName('Title')[0]?.textContent || '',
       Genre: movieNode.getElementsByTagName('Genre')[0]?.textContent || '',
       Year: parseInt(movieNode.getElementsByTagName('Year')[0]?.textContent || '0', 10),
     }]; // Return as an array for consistency maybe?

  } catch (error) {
    console.error(`Error calling GetMovieDetails SOAP operation for ID ${id}:`, error.response?.data || error.message);
     if (error.response && typeof error.response.data === 'string' && error.response.data.includes('faultstring')) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(error.response.data, "text/xml");
            const faultString = xmlDoc.getElementsByTagName('faultstring')[0]?.textContent;
             if (faultString) throw new Error(`SOAP Fault: ${faultString}`);
        } catch (parseError) { /* Ignore */ }
    }
    throw error;
  }
}; 