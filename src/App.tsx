import React, { ReactElement, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return <div>Loading...</div>;
};

const MyMapComponent = ({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });
    }
  }, [center, zoom]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

const App = (): ReactElement => {
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 4;

  return (
    <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} render={render}>
      <MyMapComponent center={center} zoom={zoom} />
    </Wrapper>
  );
};

export default App;
