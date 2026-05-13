import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "340px",
};

const center = {
  lat: 28.6139,
  lng: 77.209,
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [{ visibility: "simplified" }, { color: "#64748b" }],
    },
    {
      featureType: "landscape",
      stylers: [{ color: "#eef2f7" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#cbd5e1" }, { lightness: 10 }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#94a3b8" }],
    },
    {
      featureType: "water",
      stylers: [{ color: "#bfdbfe" }],
    },
  ],
};

const statusStyles = {
  active: {
    fill: "#16a34a",
    ring: "#bbf7d0",
  },
  idle: {
    fill: "#64748b",
    ring: "#e2e8f0",
  },
  charging: {
    fill: "#d97706",
    ring: "#fef3c7",
  },
  error: {
    fill: "#dc2626",
    ring: "#fecaca",
  },
};

const statusPriority = ["error", "charging", "active", "idle"];

const getGroupStatus = (robots) => (
  statusPriority.find((status) => robots.some((robot) => robot.status === status)) || "idle"
);

const createMarkerIcon = (status, count) => {
  const markerStyle = statusStyles[status] || statusStyles.idle;
  const label = count > 1 ? count : "";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="21" fill="${markerStyle.ring}" opacity="0.9"/>
      <circle cx="27" cy="27" r="14" fill="${markerStyle.fill}" stroke="#ffffff" stroke-width="4"/>
      ${label ? `<text x="27" y="32" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#ffffff">${label}</text>` : ""}
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(46, 46),
    anchor: new window.google.maps.Point(23, 23),
  };
};

const groupRobotsByLocation = (robots) => {
  const groups = new Map();

  robots.forEach((robot) => {
    const key = `${robot.location.lat}-${robot.location.lng}`;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.robots.push(robot);
      return;
    }

    groups.set(key, {
      id: key,
      position: {
        lat: robot.location.lat,
        lng: robot.location.lng,
      },
      label: robot.location.label,
      robots: [robot],
    });
  });

  return Array.from(groups.values());
};

const LiveMap = ({ robots }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const robotGroups = useMemo(() => groupRobotsByLocation(robots), [robots]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (robotGroups.length === 0) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(5);
      setSelectedGroup(null);
      return;
    }

    if (robotGroups.length === 1) {
      mapRef.current.panTo(robotGroups[0].position);
      mapRef.current.setZoom(11);
      setSelectedGroup(robotGroups[0]);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    robotGroups.forEach((group) => bounds.extend(group.position));

    mapRef.current.fitBounds(bounds, 80);
    setSelectedGroup(null);
  }, [isLoaded, robotGroups]);

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400 shadow-sm">
        Loading map...
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 py-2">
        <div>
          <p className="text-sm font-semibold text-white">Live Map</p>
          <p className="text-xs text-zinc-300">{robotGroups.length} active location{robotGroups.length === 1 ? "" : "s"}</p>
        </div>
        <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
          Powered by Google Maps
        </span>
      </div>

      <div className="p-2">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={5}
          options={mapOptions}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
        >
        {robotGroups.map((group) => {
          const groupStatus = getGroupStatus(group.robots);

          return (
            <Marker
              key={group.id}
              position={group.position}
              onClick={() => setSelectedGroup(group)}
              icon={createMarkerIcon(groupStatus, group.robots.length)}
              title={`${group.robots.length} robot${group.robots.length > 1 ? "s" : ""} at ${group.label}`}
            />
          );
        })}

        {selectedGroup && (
          <InfoWindow
            position={selectedGroup.position}
            onCloseClick={() => setSelectedGroup(null)}
          >
            <div className="min-w-56">
              <p className="text-xs text-gray-500 mb-1">
                {selectedGroup.label}
              </p>
              <h3 className="font-bold text-slate-900 mb-3">
                {selectedGroup.robots.length} robot{selectedGroup.robots.length > 1 ? "s" : ""}
              </h3>

              <div className="flex flex-col gap-2">
                {selectedGroup.robots.map((robot) => (
                  <button
                    key={robot.id}
                    type="button"
                    onClick={() => navigate(`/robot/${robot.id}`)}
                    className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-left transition-colors duration-150 hover:border-red-500 hover:bg-zinc-800"
                  >
                    <span className="block text-sm font-semibold text-zinc-100">
                      {robot.name}
                    </span>
                    <span className="block text-xs text-zinc-400">
                      {robot.status} - {robot.battery}% battery
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </InfoWindow>
        )}
        </GoogleMap>
      </div>
    </section>
  );
};

export default LiveMap;
