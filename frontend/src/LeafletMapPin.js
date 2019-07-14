import React from 'react';
import { Marker, Popup } from 'react-leaflet';

export const LeafletMapPin = ({ position, id }) => {
    return (
        <Marker position={position}>
            <Popup>
                <span>ID = {id}</span>
            </Popup>
        </Marker>
    )
}