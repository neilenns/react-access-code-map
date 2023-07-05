import axios from "axios";
import React, { useContext } from "react";
import ILocation from '../interfaces/ILocation.mjs';
import { serverUrl } from "../configs/accessCodeServer";
import LocationMarker from './LocationMarker';
import { useMapEvent } from "react-leaflet";
import { LatLng, LeafletMouseEvent } from "leaflet";
import { UserContext } from "../context/UserContext";
import { Types } from "mongoose";
import { MarkerEditDialog } from "./MarkerEditDialog";
import INominatimReverseResponse from "../interfaces/INominatimReverseResponse.mjs";
import { resolve } from "path";

export interface ILocationMarkerProps {
}

export default function LocationMarkers(props: ILocationMarkerProps) {
	const [ locations, setLocations ] = React.useState<ILocation[]>([]);
	const [ isOpen, setIsOpen ] = React.useState<boolean>(false);
	const [ selectedLocation, setSelectedLocation ] = React.useState<Partial<ILocation>>({});
	const [ userContext ] = useContext(UserContext)

	function onRemoveMarker(_id: Types.ObjectId)
	{
		console.log(`Removing ${_id}`);
	}

	function onMarkerEditCancel()
	{
		setIsOpen(false);
	}

	function onMarkerEditSave(location: Partial<ILocation>)
	{
		console.log(location);
		axios.post<ILocation>(new URL("locations", serverUrl).toString(),
		location,
		{
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${userContext.token}`
			}
		})
		.then(response => {
			setLocations((prevValue) => [...prevValue, {
				...response.data,
				lastModified: new Date(response.data.lastModified),
				created: new Date(response.data.created)
			}]);
		})
		.catch(err =>{
			console.log(`Unable to create new marker: ${err}`);
		});

		setIsOpen(false);
	}

	async function reverseGeocode(latlng: LatLng): Promise<INominatimReverseResponse | null> {
		return axios
			.get<INominatimReverseResponse>(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
			.then(response => response.data)
			.catch(error => {
				console.error('Error during reverse geocoding:', error);
				throw error;
			})
	};

	useMapEvent('contextmenu', async (e: LeafletMouseEvent) => {
		const geoDetails = await reverseGeocode(e.latlng);

		const newLocation = {
			title: geoDetails ? `${geoDetails.address?.house_number ?? ""} ${geoDetails.address?.road ?? ""}`.trim() : "",
			latitude: e.latlng.lat,
			longitude: e.latlng.lng,
			note: "",
		};

		setSelectedLocation(newLocation);
		setIsOpen(true);
});
		
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
		})
		.finally(() =>
		{
		});
	}, [userContext.token]);

	return (
			<>
				{
					locations?.map(location => (
						<LocationMarker location={location} key={location._id.toString()} onRemoveMarker={onRemoveMarker}/>
					))
				}
				<MarkerEditDialog	isOpen={isOpen} location={selectedLocation} onSave={onMarkerEditSave} onCancel={onMarkerEditCancel}/>
			</>
	);
}