import { Marker, Popup } from 'react-leaflet'
import ILocation from '../types/location';
import { Button, Icon } from '@blueprintjs/core';

export interface ILocationMarkerProps {
	location: ILocation;
}

export default function LocationMarkers(props: ILocationMarkerProps) {
	const { location } = props;

	return (
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
	);
}