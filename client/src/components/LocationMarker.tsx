import { Marker, Popup } from 'react-leaflet'
import ILocation from '../types/location';
import { Button, Icon } from '@blueprintjs/core';
import { serverUrl } from "../configs/accessCodeServer";
import axios from "axios";
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export type RemoveMarkerHandler = (_id: string) => void;

export interface ILocationMarkerProps {
	location: ILocation;
	onRemoveMarker: RemoveMarkerHandler;
}

export default function LocationMarkers(props: ILocationMarkerProps) {
	const { location, onRemoveMarker } = props;
	const [ userContext ] = useContext(UserContext)

	const onMarkerEdit = () => {
		console.log(`Editing ${location._id}`);
	}

	const onMarkerDelete = () => {
		axios.delete(new URL(`locations/${location._id}`, serverUrl).toString(),
		{
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${userContext.token}`
      }
		})
		.then(() => {
			console.log(`Successfully deleted ${location._id} from the database`);
			onRemoveMarker(location._id);
		})
		.catch(err => {
			console.log(`Unable to delete ${location._id} from the database: ${err}`);
		});
	}

	return (
		<Marker position={[location.latitude, location.longitude]} key={location._id}>
			<Popup>
				<h1 className="small-heading">{location.title}</h1>
				<p>{location.note}</p>
				<p><i>Last modified by {location.modifiedByFirstName} on {location.lastModified?.toISOString().slice(0, 10)}</i></p>
				<div className="button-container">
					<Button id="markerEdit"  onClick={onMarkerEdit}>
						<Icon icon="edit"/>
					</Button>
					<Button id="markerDelete" onClick={onMarkerDelete}>
						<Icon icon="delete"/>
					</Button>
				</div>
			</Popup>
		</Marker>
	);
}