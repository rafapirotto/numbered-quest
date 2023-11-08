import React, { ReactElement } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

import './App.css';
import MyMap from './components/MyMap';

const render = (status: Status): React.ReactElement => {
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return <div>Loading...</div>;
};

const App = (): ReactElement => {
  const center = { lat: -25.363, lng: 131.044 };
  const zoom = 4;
  const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;

  return (
    <Wrapper apiKey={VITE_GOOGLE_MAPS_API_KEY} render={render}>
      <MyMap center={center} zoom={zoom} />
    </Wrapper>
  );
};

export default App;
