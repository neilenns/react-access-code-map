import axios from "axios";
import React, { useContext } from "react";
import ILocation from '../types/location';
import { serverUrl } from "../configs/accessCodeServer";
import LocationMarker from './LocationMarker';
import { useMapEvent } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { UserContext } from "../context/UserContext";

export interface ILocationMarkerProps {
}

export default function LocationMarkers(props: ILocationMarkerProps) {
	const [locations, setLocations ] = React.useState<ILocation[]>([]);
	const [ userContext ] = useContext(UserContext)

	function onRemoveMarker(_id: string)
	{
		// Remove the marker from the ones on the map.
		setLocations(locations.filter(loc => loc._id !== _id));

		console.log(`Removing ${_id}`);
	}

	useMapEvent('contextmenu', (e: LeafletMouseEvent) => {
		const newLocation = {
			latitude: e.latlng.lat,
			longitude: e.latlng.lng,
			note: "note",
			title: "title",
		};

			axios.post<ILocation>(new URL("locations", serverUrl).toString(),
				newLocation,
				{
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${userContext.token}`
					}
				}).then(response => {
					if (response.status === 201)
					{
						setLocations((prevValue) => [...prevValue, {
							...response.data,
							lastModified: new Date(response.data.lastModified),
							created: new Date(response.data.created)
						}]);
					}
				}).catch(err =>{
					console.log(`Unable to create new marker: ${err}`);
				});
		}
	);
		
	React.useEffect(() => {
		axios.get<ILocation[]>(new URL("locations", serverUrl).toString(), {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${userContext.token}`
				}
		})
		.then(response => {
			const locations = response.data.map(location => ({
				...location,
				lastModified: new Date(location.lastModified),
				created: new Date(location.created)
			}))
			setLocations(locations);
		})
		.catch(function (error) {
			console.log(error);
		});
	}, [userContext.token]);

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