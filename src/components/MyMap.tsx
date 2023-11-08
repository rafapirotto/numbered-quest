import React, { ReactElement, useEffect, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';

import { db } from '../firebase';

let label = 1;

const addMarkerToMap = (
  location: google.maps.LatLngLiteral,
  map: google.maps.Map,
  labelToAdd: string,
): void => {
  new google.maps.Marker({
    position: location,
    label: String(labelToAdd),
    map: map,
  });
};

const addMarkerToFirebase = async (
  location: google.maps.LatLngLiteral,
  labelToAdd: string,
) => {
  try {
    const data = {
      Quest: String(labelToAdd),
      Lat: location.lat(),
      Long: location.lng(),
      Timestamp: new Date().toISOString(),
    };
    await addDoc(collection(db, 'quests'), data);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const addMarker = (
  location: google.maps.LatLngLiteral,
  map: google.maps.Map,
): void => {
  const labelToAdd = String(label++);
  addMarkerToMap(location, map, labelToAdd);
  addMarkerToFirebase(location, labelToAdd);
};

const addListenerToMap = (map: google.maps.Map) => {
  google.maps.event.addListener(
    map,
    'click',
    (event: { latLng: google.maps.LatLngLiteral }) => {
      addMarker(event.latLng, map);
    },
  );
};

const createMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  center: { lat: number; lng: number },
  zoom: number,
): google.maps.Map => {
  return new window.google.maps.Map(mapRef.current!, {
    center,
    zoom,
  });
};

const MyMap = ({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}): ReactElement => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = createMap(mapRef, center, zoom);
      addListenerToMap(map);
    }
  }, []);

  return <div className="map" ref={mapRef} />;
};

export default MyMap;
