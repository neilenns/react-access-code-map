export default interface INominatimReverseResponse {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    building?: string;
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country: string;
    country_code: string;
  };
  boundingbox: [string, string, string, string];
}
