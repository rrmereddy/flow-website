export type HotspotIntensity = 'low' | 'medium' | 'high' | 'critical'

export type Hotspot = {
  id: string
  lat: number
  lng: number
  intensity: HotspotIntensity
  radius: number // in meters
  label?: string
  reason?: string
}

export type TimeSlice = {
  hour: number
  label: string
  hotspots: Hotspot[]
}
