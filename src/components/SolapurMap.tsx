import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  SOLAPUR_CENTER, WARD_GEO, HOSPITAL_GEO, OUTBREAK_HOTSPOTS,
  RISK_COLORS, type HospitalGeo, type OutbreakHotspot, type WardGeo,
} from "@/lib/geo-data";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [map, bounds]);
  return null;
}

interface SolapurMapProps {
  showHospitals?: boolean;
  showOutbreaks?: boolean;
  showWardBoundaries?: boolean;
  wardRiskLevels?: Record<string, string>;
  height?: string;
  className?: string;
}

export default function SolapurMap({
  showHospitals = true,
  showOutbreaks = true,
  showWardBoundaries = true,
  wardRiskLevels = {},
  height = "420px",
  className = "",
}: SolapurMapProps) {
  const allCoords = [
    ...WARD_GEO.flatMap((w) => w.boundary),
    ...HOSPITAL_GEO.map((h) => h.coords),
  ];
  const bounds = L.latLngBounds(allCoords.map(([lat, lng]) => [lat, lng]));

  return (
    <div className={`rounded-xl overflow-hidden border ${className}`} style={{ height }}>
      <MapContainer
        center={SOLAPUR_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds bounds={bounds} />

        {/* Ward boundaries */}
        {showWardBoundaries &&
          WARD_GEO.map((ward) => {
            const risk = wardRiskLevels[ward.shortName] || wardRiskLevels[ward.name] || "low";
            const color = RISK_COLORS[risk] || RISK_COLORS.low;
            return (
              <Polygon
                key={ward.shortName}
                positions={ward.boundary}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.12,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-sm font-sans">
                    <p className="font-semibold">{ward.name}</p>
                    <p className="text-xs mt-1">
                      Risk: <span className="font-medium capitalize">{risk}</span>
                    </p>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

        {/* Outbreak hotspots */}
        {showOutbreaks &&
          OUTBREAK_HOTSPOTS.map((hotspot) => (
            <Circle
              key={hotspot.id}
              center={hotspot.coords}
              radius={hotspot.radius}
              pathOptions={{
                color: RISK_COLORS[hotspot.riskLevel],
                fillColor: RISK_COLORS[hotspot.riskLevel],
                fillOpacity: 0.25,
                weight: 2,
                dashArray: hotspot.riskLevel === "critical" ? "6 4" : undefined,
              }}
            >
              <Popup>
                <div className="text-sm font-sans">
                  <p className="font-semibold">{hotspot.disease}</p>
                  <p className="text-xs text-gray-600">{hotspot.ward} · {hotspot.cases} cases</p>
                  <span
                    className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full text-white capitalize"
                    style={{ backgroundColor: RISK_COLORS[hotspot.riskLevel] }}
                  >
                    {hotspot.riskLevel}
                  </span>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* Hospital markers */}
        {showHospitals &&
          HOSPITAL_GEO.map((hospital) => (
            <Marker key={hospital.id} position={hospital.coords} icon={hospitalIcon}>
              <Popup>
                <div className="text-sm font-sans">
                  <p className="font-semibold">{hospital.name}</p>
                  <p className="text-xs text-gray-600">{hospital.ward}</p>
                  <div className="mt-1.5 text-xs">
                    <span className="font-medium text-green-700">{hospital.availableBeds}</span>
                    <span className="text-gray-500"> / {hospital.beds} beds available</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
