// Same aspect ratio as WorldMap's SVG (800x420), so nothing shifts when the map appears.
// Kept out of WorldMap.jsx so Suspense fallbacks don't pull in the lazy map chunk.
export const MapSkeleton = () => (
  <div className="w-full aspect-[800/420] rounded-lg bg-white/5 animate-pulse" />
);
