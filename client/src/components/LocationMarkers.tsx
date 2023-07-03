import { Marker, Popup } from 'react-leaflet'
import axios from "axios";
import React from "react";
import ILocation from '../types/location';
import { serverUrl } from "../configs/accessCodeServer";
import { Button, Icon } from '@blueprintjs/core';

export default function LocationMarkers() {
	const [posts, setPosts ] = React.useState<ILocation[]>([]);

	React.useEffect(() => {
		axios.get<ILocation[]>(new URL("locations", serverUrl).toString())
		.then(response => {
			const locations = response.data.map(location => ({
				...location,
				lastModified: new Date(location.lastModified)
			}))
			setPosts(locations);
		})
		.catch(function (error) {
			console.log(error);
		});
	}, []);

	return (
			<>
				{
					posts?.map(location => (
						<Marker position={[location.latitude, location.longitude]} key={location._id}>
							<Popup>
								<h1 className="small-heading">{location.title}</h1>
								<p>{location.note}</p>
								<p><i>Last modified by {location.modifiedByFirstName} on {location.lastModified?.toISOString().slice(0, 10)}</i></p>
								<div className="button-container">
									<Button id="markerEdit">
										<Icon icon="edit"/>
									</Button>
									<Button id="markerDelete">
										<Icon icon="delete"/>
									</Button>
								</div>
							</Popup>
						</Marker>
					))
				}
			</>
	);
}