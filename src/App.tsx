import React, { ReactElement, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

import './App.css';

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return <div>Loading...</div>;
};

let label = 1;

const addMarker = (
  location: google.maps.LatLngLiteral,
  map: google.maps.Map,
): void => {
  new google.maps.Marker({
    position: location,
    label: String(label++),
    map: map,
  });
};

const MyMapComponent = ({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}): ReactElement => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });
      google.maps.event.addListener(map, 'click', (event) => {
        addMarker(event.latLng, map);
      });
    }
  }, [center, zoom]);

  return <div className="map" ref={mapRef} />;
};

const App = (): ReactElement => {
  const center = { lat: -25.363, lng: 131.044 };
  const zoom = 4;

  return (
    <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} render={render}>
      <MyMapComponent center={center} zoom={zoom} />
    </Wrapper>
  );
};

export default App;
