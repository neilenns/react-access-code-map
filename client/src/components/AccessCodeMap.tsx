import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { LocateControl } from "./LocateControl";
import { GeocodeControl } from './GeocodeControl';
import axios from "axios";
import React from "react";
import ILocation from '../types/location';

export default function AccessCodeMap() {
	const [posts, setPosts ] = React.useState<ILocation[]>([]);

	React.useEffect(() => {
		axios.get<ILocation[]>("http://localhost:3001/locations")
		.then(response => {
			const locations = response.data.map(location => ({
				...location,
				lastModified: new Date(location.lastModified)
			}))
			setPosts(locations);
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		});
	}, []);

	return (
		<MapContainer center={[47.65496185820956, -122.25201847353225]} zoom={11} scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{
				posts?.map(location => (
					<Marker position={[location.latitude, location.longitude]}>
						<Popup>
							<h1 className="small-heading">${location.title}</h1>
							<p>${location.note}</p>
							<p><i>Last modified by ${location.modifiedByFirstName} on ${location.lastModified?.toISOString().slice(0, 10)}</i></p>
							<div className="button-container">
							</div>
						</Popup>
					</Marker>
				))
			}
		<GeocodeControl position="topright"/>
		<LocateControl position="topright" />
		</MapContainer>
	);
}