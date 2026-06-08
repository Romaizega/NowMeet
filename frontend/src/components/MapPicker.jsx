import { useState, useCallback } from "react";
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"

const containerStyle = {
  width: '100%',
  height: '400px'
}



export default function EventMap ({lat, lng, onLocationSelect, readonly = false }) {
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  
    const handleMapClick = (event) => {
      if(readonly) {
        return
      }
      const clickedLat = event.latLng.lat();
      const clickedLng = event.latLng.lng();
      onLocationSelect({ lat: clickedLat, lng: clickedLng });
    }
  if(!isLoaded) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl">
      <span className="loading loading-spinner text-orange-400">Loading map...</span>
      </div>
    )
  }

  return (
    <> 
    <div className="w-full overflow-hidden border border-zinc-800 rounded-2xl shadow-xl">
      <GoogleMap
      mapContainerStyle={containerStyle}
      center={{lat, lng}}
      zoom={13}
      onClick={handleMapClick}
      options={{
        disableDefaultUI: readonly,
        draggableCursor: !readonly
      }}
      >
        <Marker
        position={{lat, lng}}
        title="Location"
        />

      </GoogleMap>

    </div>
    </>
  )


}