import axios from "axios";
import React from "react";
import ILocation from '../types/location';
import { serverUrl } from "../configs/accessCodeServer";
import LocationMarker from './LocationMarker';

export interface ILocationMarkerProps {
}

export default function LocationMarkers(props: ILocationMarkerProps) {
	const [locations, setLocations ] = React.useState<ILocation[]>([]);
	
	function onRemoveMarker(_id: string)
	{
		// Remove the marker from the ones on the map.
		setLocations(locations.filter(loc => loc._id !== _id));

		console.log(`Removing ${_id}`);
	}

	React.useEffect(() => {
		axios.get<ILocation[]>(new URL("locations", serverUrl).toString())
		.then(response => {
			const locations = response.data.map(location => ({
				...location,
				lastModified: new Date(location.lastModified)
			}))
			setLocations(locations);
		})
		.catch(function (error) {
			console.log(error);
		});
	}, []);

	return (
			<>
				{
					locations?.map(location => (
						<LocationMarker location={location} key={location._id} onRemoveMarker={onRemoveMarker}/>
					))
				}
			</>
	);
}