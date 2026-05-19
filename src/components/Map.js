import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MAP_CENTER,
  MAP_CONTAINER_STYLE,
  MAP_OPTIONS,
} from "../utils/Constant";
import { createMarkerIcon } from "../utils/mapUtils";
import {
  getGroupStatus,
  getMapViewportKey,
  groupRobotsByLocation,
} from "../utils/robotUtils";

const MapHeader = ({ locationCount }) => (
  <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 py-2">
    <div>
      <p className="text-sm font-semibold text-white">Live Map</p>
      <p className="text-xs text-zinc-300">
        {locationCount} active location{locationCount === 1 ? "" : "s"}
      </p>
    </div>
    <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
      Powered by Google Maps
    </span>
  </div>
);

const RobotGroupMarker = ({ group, onClick }) => {
  const groupStatus = getGroupStatus(group.robots);

  return (
    <Marker
      key={group.id}
      position={group.position}
      onClick={onClick}
      icon={createMarkerIcon(groupStatus, group.robots.length)}
      title={`${group.robots.length} robot${group.robots.length > 1 ? "s" : ""} at ${group.label}`}
    />
  );
};

const RobotGroupInfoWindow = ({ group, onClose, onRobotClick }) => (
  <InfoWindow position={group.position} onCloseClick={onClose}>
    <div className="min-w-56">
      <p className="mb-1 text-xs text-gray-500">{group.label}</p>
      <h3 className="mb-3 font-bold text-slate-900">
        {group.robots.length} robot{group.robots.length > 1 ? "s" : ""}
      </h3>

      <div className="flex flex-col gap-2">
        {group.robots.map((robot) => (
        <button
            key={robot.id}
            type="button"
          onClick={() => onRobotClick(robot.id)}
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
);

const LiveMap = ({ robots }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const mapRef = useRef(null);
  const robotGroupsRef = useRef([]);
  const navigate = useNavigate();

  const robotGroups = useMemo(() => groupRobotsByLocation(robots), [robots]);
  const mapViewportKey = useMemo(() => getMapViewportKey(robots), [robots]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    robotGroupsRef.current = robotGroups;
  }, [robotGroups]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const currentRobotGroups = robotGroupsRef.current;

    if (currentRobotGroups.length === 0) {
      mapRef.current.panTo(MAP_CENTER);
      mapRef.current.setZoom(5);
      setSelectedGroup(null);
      return;
    }

    if (currentRobotGroups.length === 1) {
      mapRef.current.panTo(currentRobotGroups[0].position);
      mapRef.current.setZoom(11);
      setSelectedGroup(currentRobotGroups[0]);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    currentRobotGroups.forEach((group) => bounds.extend(group.position));

    mapRef.current.fitBounds(bounds, 80);
    setSelectedGroup(null);
  }, [isLoaded, mapViewportKey]);

  if (!isLoaded) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400 shadow-sm">
        Loading map...
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm">
      <MapHeader locationCount={robotGroups.length} />

      <div className="p-2">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={MAP_CENTER}
          zoom={5}
          options={MAP_OPTIONS}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onUnmount={() => {
            mapRef.current = null;
          }}
        >
          {robotGroups.map((group) => (
            <RobotGroupMarker
              key={group.id}
              group={group}
              onClick={() => setSelectedGroup(group)}
            />
          ))}

          {selectedGroup && (
            <RobotGroupInfoWindow
              group={selectedGroup}
              onClose={() => setSelectedGroup(null)}
              onRobotClick={(robotId) => navigate(`/robot/${robotId}`)}
            />
          )}
        </GoogleMap>
      </div>
    </section>
  );
};

export default LiveMap;
