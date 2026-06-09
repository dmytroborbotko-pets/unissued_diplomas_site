import { memo, useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";
import { geoMercator } from "d3-geo";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useNavigate } from "react-router-dom";
import { MapTooltip } from "./MapTooltip";

const ANTARCTICA_ID = "010";
const UKRAINE_ID = "804";

const DEFAULT_FILL = "#2a2a2a";
const HIGHLIGHT_FILL = "#a83232";
const STROKE_COLOR = "#171717";
const DOT_COLOR = "#a83232";

const HIDE_DELAY = 700;

// Must match <ComposableMap> props
const MAP_WIDTH = 800;
const MAP_HEIGHT = 420;
const PROJECTION_CONFIG = { scale: 130, center: [10, 30] };

// Crimea polygon extracted from TopoJSON Russia geometry — belongs to Ukraine
const CRIMEA_COORDS = [
  [33.435, 45.972], [33.698, 46.219], [34.411, 46.004], [34.731, 45.965],
  [34.861, 45.767], [35.012, 45.737], [35.019, 45.651], [35.509, 45.410],
  [36.531, 45.469], [36.333, 45.114], [35.239, 44.940], [33.882, 44.361],
  [33.327, 44.566], [33.547, 45.034], [32.453, 45.327], [32.633, 45.519],
  [33.587, 45.852], [33.435, 45.972],
];

const CRIMEA_GEO = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: UKRAINE_ID,
      properties: { name: "Crimea" },
      geometry: {
        type: "Polygon",
        coordinates: [CRIMEA_COORDS],
      },
    },
  ],
};

const COUNTRY_TRANSITION = "fill 0.8s ease, filter 0.8s ease, transform 0.8s ease";

const STYLE_DEFAULT = {
  default: { outline: "none", transition: COUNTRY_TRANSITION, transformBox: "fill-box", transformOrigin: "center", filter: "none", transform: "scale(1)" },
  hover:   { outline: "none", transition: COUNTRY_TRANSITION, transformBox: "fill-box", transformOrigin: "center", filter: "none", transform: "scale(1)" },
  pressed: { outline: "none", transition: COUNTRY_TRANSITION, transformBox: "fill-box", transformOrigin: "center", filter: "none", transform: "scale(1)" },
};

const STYLE_HIGHLIGHTED = {
  default: { outline: "none", transition: COUNTRY_TRANSITION, transformBox: "fill-box", transformOrigin: "center", filter: "drop-shadow(0 0 6px rgba(168, 50, 50, 0.6)) brightness(1.2)", transform: "scale(1.03)" },
  hover:   { outline: "none", transition: COUNTRY_TRANSITION, transformBox: "fill-box", transformOrigin: "center", filter: "drop-shadow(0 0 6px rgba(168, 50, 50, 0.6)) brightness(1.2)", transform: "scale(1.03)" },
  pressed: { outline: "none", transition: COUNTRY_TRANSITION, transformBox: "fill-box", transformOrigin: "center", filter: "drop-shadow(0 0 6px rgba(168, 50, 50, 0.6)) brightness(1.2)", transform: "scale(1.03)" },
};

const CountryPath = memo(({ geo, isHighlighted, onMouseEnter, onMouseLeave, onClick }) => {
  const baseStyle = isHighlighted ? STYLE_HIGHLIGHTED : STYLE_DEFAULT;
  const style = onClick
    ? {
        default: { ...baseStyle.default, cursor: "pointer" },
        hover: { ...baseStyle.hover, cursor: "pointer" },
        pressed: { ...baseStyle.pressed, cursor: "pointer" },
      }
    : baseStyle;

  return (
    <Geography
      geography={geo}
      fill={isHighlighted ? HIGHLIGHT_FILL : DEFAULT_FILL}
      stroke={STROKE_COLOR}
      strokeWidth={0.5}
      style={style}
      tabIndex={-1}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  );
});

const DotMarker = memo(({ coordinates, onEnter, onLeave, countryId, onClick }) => {
  const handleMouseEnter = useCallback(
    (e) => onEnter(e, countryId),
    [onEnter, countryId]
  );

  return (
    <Marker coordinates={coordinates}>
      <circle
        r={10}
        fill="transparent"
        style={{ cursor: "pointer" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
      />
    </Marker>
  );
});

// Build a d3 projection matching <ComposableMap> settings
function buildProjection() {
  return geoMercator()
    .scale(PROJECTION_CONFIG.scale)
    .center(PROJECTION_CONFIG.center)
    .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
}

export const WorldMap = ({ exhibitionsByCountry }) => {
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState(null);
  const [hoveredCountryId, setHoveredCountryId] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [dotScreenPos, setDotScreenPos] = useState(null);
  const [mapContainerWidth, setMapContainerWidth] = useState(0);

  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    fetch("/data/countries-110m.json")
      .then((res) => res.json())
      .then(setGeoData);
  }, []);

  const markers = useMemo(() => {
    const result = [];
    for (const [id, data] of exhibitionsByCountry) {
      result.push({ id, coordinates: data.coordinates, data });
    }
    return result;
  }, [exhibitionsByCountry]);

  // Project geo coordinates to SVG-space pixel positions
  const projection = useMemo(() => buildProjection(), []);

  const dotPositions = useMemo(() => {
    const positions = new Map();
    for (const marker of markers) {
      const projected = projection(marker.coordinates);
      if (projected) {
        positions.set(marker.id, {
          svgX: projected[0],
          svgY: projected[1],
        });
      }
    }
    return positions;
  }, [markers, projection]);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const clearHoverState = useCallback(() => {
    setHoveredCountryId(null);
    setTooltipData(null);
    setDotScreenPos(null);
  }, []);

  const showTooltipForCountry = useCallback(
    (countryId) => {
      clearHideTimeout();

      const data = exhibitionsByCountry.get(countryId);
      if (!data || !containerRef.current) return;

      const pos = dotPositions.get(countryId);
      if (!pos) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = rect.width / MAP_WIDTH;
      const scaleY = rect.height / MAP_HEIGHT;

      setHoveredCountryId(countryId);
      setTooltipData(data);
      setMapContainerWidth(rect.width);
      setDotScreenPos({
        x: pos.svgX * scaleX,
        y: pos.svgY * scaleY,
      });
    },
    [exhibitionsByCountry, dotPositions, clearHideTimeout]
  );

  const scheduleHide = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(clearHoverState, HIDE_DELAY);
  }, [clearHideTimeout, clearHoverState]);

  const handleDotEnter = useCallback(
    (_e, countryId) => showTooltipForCountry(countryId),
    [showTooltipForCountry]
  );

  const handleDotLeave = useCallback(() => {
    scheduleHide();
  }, [scheduleHide]);

  // Set of country IDs that have exhibitions (for enabling hover on shapes)
  const exhibitionCountryIds = useMemo(
    () => new Set(exhibitionsByCountry.keys()),
    [exhibitionsByCountry]
  );

  const handleCountryMouseEnter = useCallback(
    (countryId) => {
      if (exhibitionCountryIds.has(countryId)) {
        showTooltipForCountry(countryId);
      }
    },
    [exhibitionCountryIds, showTooltipForCountry]
  );

  const handleCountryMouseLeave = useCallback(() => {
    scheduleHide();
  }, [scheduleHide]);

  const handleCountryClick = useCallback(
    (countryId) => {
      const data = exhibitionsByCountry.get(countryId);
      if (data?.isoAlpha2) {
        navigate(`/exhibitions?country=${data.isoAlpha2}`);
      }
    },
    [exhibitionsByCountry, navigate]
  );

  const handleContainerClickCapture = useCallback(
    (e) => {
      if (!tooltipRef.current || !tooltipData) return;
      const rect = tooltipRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        e.stopPropagation();
        if (tooltipData.isoAlpha2) {
          navigate(`/exhibitions?country=${tooltipData.isoAlpha2}`);
        }
      }
    },
    [tooltipData, navigate]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearHideTimeout();
  }, [clearHideTimeout]);

  if (!geoData) return null;

  return (
      <div ref={containerRef} className="relative w-full" onClickCapture={handleContainerClickCapture}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={PROJECTION_CONFIG}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          style={{ width: "100%", height: "auto" }}
        >
          {/* Main country geometries */}
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies
                .filter((geo) => geo.id !== ANTARCTICA_ID)
                .map((geo) => {
                  const isHighlighted =
                    geo.id === hoveredCountryId ||
                    (geo.id === UKRAINE_ID && hoveredCountryId === UKRAINE_ID);

                  const hasExhibition = exhibitionCountryIds.has(geo.id);

                  return (
                    <CountryPath
                      key={geo.rsmKey}
                      geo={geo}
                      isHighlighted={isHighlighted}
                      onMouseEnter={hasExhibition ? () => handleCountryMouseEnter(geo.id) : undefined}
                      onMouseLeave={hasExhibition ? handleCountryMouseLeave : undefined}
                      onClick={hasExhibition ? () => handleCountryClick(geo.id) : undefined}
                    />
                  );
                })
            }
          </Geographies>

          {/* Crimea overlay — always rendered with Ukraine's fill */}
          <Geographies geography={CRIMEA_GEO}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key="crimea"
                  geography={geo}
                  fill={
                    hoveredCountryId === UKRAINE_ID
                      ? HIGHLIGHT_FILL
                      : DEFAULT_FILL
                  }
                  stroke={STROKE_COLOR}
                  strokeWidth={0.5}
                  style={hoveredCountryId === UKRAINE_ID ? STYLE_HIGHLIGHTED : STYLE_DEFAULT}
                  tabIndex={-1}
                />
              ))
            }
          </Geographies>

          {/* Invisible SVG hit areas for mouse events */}
          {markers.map((marker) => (
            <DotMarker
              key={marker.id}
              countryId={marker.id}
              coordinates={marker.coordinates}
              onEnter={handleDotEnter}
              onLeave={handleDotLeave}
              onClick={() => handleCountryClick(marker.id)}
            />
          ))}
        </ComposableMap>

        {/* HTML dot overlay — visible dots rendered on top of SVG */}
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker) => {
            const pos = dotPositions.get(marker.id);
            if (!pos) return null;

            return (
              <div
                key={marker.id}
                className="absolute rounded-full"
                style={{
                  left: `${(pos.svgX / MAP_WIDTH) * 100}%`,
                  top: `${(pos.svgY / MAP_HEIGHT) * 100}%`,
                  width: 7,
                  height: 7,
                  marginLeft: -3.5,
                  marginTop: -3.5,
                  backgroundColor: DOT_COLOR,
                }}
              />
            );
          })}
        </div>

        <MapTooltip
          data={tooltipData}
          dotPos={dotScreenPos}
          containerWidth={mapContainerWidth}
          tooltipRef={tooltipRef}
          countryCode={tooltipData?.isoAlpha2 ?? null}
        />
      </div>
  );
};
