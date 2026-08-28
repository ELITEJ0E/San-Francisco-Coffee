"use client";

import { type Libraries, useJsApiLoader } from "@react-google-maps/api";
import { type ReactNode } from "react";

const libraries = ["places", "drawing", "geometry"];

export function MapProvider({ children, loadingFallback }: { children: ReactNode; loadingFallback?: ReactNode }) {
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API!,
    libraries: libraries as Libraries,
  });

  if (loadError) return <p className="p-4 text-center text-red-500">Encountered error while loading google maps</p>;

  if (!scriptLoaded) return <>{loadingFallback || <p className="p-4 text-center text-gray-500">Map Script is loading ...</p>}</>;

  return <>{children}</>;
}
