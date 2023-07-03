import axios from "axios";
import React from "react";
import ILocation from '../types/location';
import { serverUrl } from "../configs/accessCodeServer";
import LocationMarker from './LocationMarker';

export interface ILocationMarkerProps {
	onDeleteMarkerClick: React.MouseEventHandler;
}

export default function LocationMarkers(props: ILocationMarkerProps) {
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
						<LocationMarker location={location}/>
					))
				}
			</>
	);
}