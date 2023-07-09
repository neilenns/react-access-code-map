import { useEffect } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider";

interface IGeoSearchControlProps extends L.ControlOptions {
  setSelectedSearchItem: (result: SearchResult) => void;
  options?: L.LocateOptions;
}

// Most of the code from this comes from https://github.com/smeijer/leaflet-geosearch/issues/310
export const GeocodeControl = (props: IGeoSearchControlProps) => {
  const { options, setSelectedSearchItem } = props;
  const provider = new OpenStreetMapProvider({
    params: {
      countrycodes: "us",
    },
  });

  // @ts-ignore
  const searchControl = new GeoSearchControl({
    provider: provider,
    style: "bar",
    showMarker: false,
    autoClose: false,
    keepResult: true,
    ...options,
  });

  const handleResult = (result: any) => {
    if (result) {
      setSelectedSearchItem(result.location);
    }
  };

  const map = useMap();

  // @ts-ignore
  useEffect(() => {
    map.addControl(searchControl);
    // Typescript doesn't know this is a custom event added by
    // the geosearch control that returns a different type for the
    // function parameter than the standard map events.
    // @ts-ignore
    map.on("geosearch/showlocation", handleResult);

    return () => map.removeControl(searchControl);
  });

  return null;
};
