"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export type Hotspot = {
  id: string
  lat: number
  lng: number
  intensity: "low" | "medium" | "high" | "critical"
  radius: number
  label?: string
  reason?: string
}

// Custom Neon Icons for Dark Mode
const createGlowingIcon = (intensity: Hotspot['intensity'], size: number) => {
  let colorClass = ""
  let shadowColor = ""
  
  switch (intensity) {
    case 'low': 
      colorClass = "bg-emerald-500"
      shadowColor = "rgba(16, 185, 129, 0.6)"
      break
    case 'medium': 
      colorClass = "bg-yellow-400"
      shadowColor = "rgba(250, 204, 21, 0.6)"
      break
    case 'high': 
      colorClass = "bg-orange-500"
      shadowColor = "rgba(249, 115, 22, 0.7)"
      break
    case 'critical': 
      colorClass = "bg-red-600"
      shadowColor = "rgba(220, 38, 38, 0.8)"
      break
  }

  return L.divIcon({
    className: "custom-glow-icon",
    html: `
      <div class="relative w-full h-full flex items-center justify-center">
        <div class="${colorClass} w-full h-full rounded-full opacity-40 animate-pulse"></div>
        <div class="${colorClass} absolute w-[50%] h-[50%] rounded-full opacity-90 blur-[1px]"></div>
        <div class="absolute w-full h-full rounded-full" style="box-shadow: 0 0 20px ${shadowColor};"></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

interface DriverMapProps {
  hotspots: Hotspot[]
}

export default function DriverMap({ hotspots }: DriverMapProps) {
  const position: [number, number] = [30.615, -96.34] 

  return (
    <MapContainer 
      center={position} 
      zoom={14} 
      style={{ height: "100%", width: "100%", background: "#0f172a" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      {hotspots.map((spot) => (
        <Marker 
          key={spot.id} 
          position={[spot.lat, spot.lng]} 
          icon={createGlowingIcon(spot.intensity, spot.radius / 2)}
        >
          {spot.reason && (
            <Popup className="custom-popup" closeButton={false} autoPan={false}>
              <div className="text-center">
                <div className="font-bold text-sm uppercase tracking-wider mb-1">{spot.reason}</div>
                <div className="text-xs text-slate-500">Demand: {spot.intensity.toUpperCase()}</div>
              </div>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  )
}
