import { MAP_STATUS_STYLES } from "./Constant";

export const createMarkerIcon = (status, count) => {
  const markerStyle = MAP_STATUS_STYLES[status] || MAP_STATUS_STYLES.idle;
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
