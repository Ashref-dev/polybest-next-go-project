import { Series, CreateSeriesRequest } from "../types";

const API_BASE_URL = "/api/series";

/**
 * REST client for the Series API
 */
export const seriesClient = {
  /**
   * Fetches all series from the API
   */
  async getAllSeries(): Promise<Series[]> {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch series: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Series[];
  },
  
  /**
   * Fetches a single series by ID
   */
  async getSeriesById(id: number): Promise<Series> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (response.status === 404) {
      throw new Error(`Series with ID ${id} not found`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch series: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Series;
  },
  
  /**
   * Creates a new series
   */
  async createSeries(seriesData: CreateSeriesRequest): Promise<Series> {
    // Ensure the required title field is present
    if (!seriesData.title) {
      throw new Error("Series title is required");
    }
    
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seriesData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create series: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    return data as Series;
  },
  
  /**
   * Updates the watched episodes count for a series
   */
  async updateWatchedEpisodes(id: number, watchedEpisodes: number): Promise<Series> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ watchedEpisodes }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update series: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Series;
  }
}; 