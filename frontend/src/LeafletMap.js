import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import { v1 } from 'uuid';
import axios from 'axios';
import socketIOClient from "socket.io-client";

import { LeafletMapPin } from './LeafletMapPin';
import './LeafletMap.css';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: [],
            connected: false,
        }
    }

    componentWillMount() {
        const socket = socketIOClient('http://localhost:3000');

        socket.on('update', pins => {
            const mappedPins = pins.map(el => [el.latitude, el.longitude]);
            this.setState(state => {
                return { positions: [...mappedPins], connected: true }
            });
        });

        socket.on('disconnect', () => {
            this.setState({ connected: false });
        });
    }

    getAllPins = function () {
        // alternative for sockets
        axios.get('http://localhost:3000/pins').then(res => res.data).then(data => console.log(data));
    }

    render() {
        const bounds = this.state.positions.length > 0 ? latLngBounds([...this.state.positions]) : null;
        return (
            <main className="map">
                <LeafletMap
                    center={[54.38, 18.59]}
                    bounds={bounds ? bounds : null}
                    zoom={14}
                    maxZoom={17}
                    attributionControl={true}
                    zoomControl={true}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}
                    dragging={true}
                    animate={true}
                    easeLinearity={0.35}
                >
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    />
                    {this.state.positions.map((position, index) =>
                        <LeafletMapPin position={position} key={v1()} id={v1()} />)}
                </LeafletMap>
                <p className="map__status">{this.state.connected ? 'Connected' : 'Disconnect'}</p>
            </main>
        );
    }
}

export default Map
