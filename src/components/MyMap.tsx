import React, { ReactElement, useEffect, useRef } from 'react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

import { db } from '../firebase';

let label = 1;
const collectionName = 'quests';
let parentId = '';

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

const addParentMarker = async (
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
    const doc = await addDoc(collection(db, collectionName), data);
    return doc.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    return '';
  }
};

const addChildMarker = async (
  location: google.maps.LatLngLiteral,
  labelToAdd: string,
  parentId: string,
) => {
  try {
    const subCollectionName = 'next'; // Replace with your subcollection name
    const data = {
      Quest: String(labelToAdd),
      Lat: location.lat(),
      Long: location.lng(),
      Timestamp: new Date().toISOString(),
    };
    const parentDocRef = doc(db, collectionName, parentId);
    const subCollectionRef = collection(parentDocRef, subCollectionName);
    await addDoc(subCollectionRef, data);
    console.log('Child document added successfully!');
    return parentId;
  } catch (e) {
    console.error('Error adding child document: ', e);
    return '';
  }
};

const addListenerToMap = (
  map: google.maps.Map,
  callback: (location: google.maps.LatLngLiteral, map: google.maps.Map) => void,
) => {
  google.maps.event.addListener(
    map,
    'click',
    (event: { latLng: google.maps.LatLngLiteral }) =>
      callback(event.latLng, map),
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

  const addMarker = async (
    location: google.maps.LatLngLiteral,
    map: google.maps.Map,
  ): Promise<void> => {
    const labelToAdd = String(label++);
    addMarkerToMap(location, map, labelToAdd);
    if (!!parentId) {
      parentId = await addChildMarker(location, labelToAdd, parentId);
    } else {
      parentId = await addParentMarker(location, labelToAdd);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      const map = createMap(mapRef, center, zoom);
      addListenerToMap(map, addMarker);
    }
  }, []);

  return <div className="map" ref={mapRef} />;
};

export default MyMap;
