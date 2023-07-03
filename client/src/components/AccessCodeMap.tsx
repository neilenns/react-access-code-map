import { MapContainer, TileLayer } from 'react-leaflet'
import { LocateControl } from "./LocateControl";
import { GeocodeControl } from './GeocodeControl';
import LocationMarkers from './LocationMarkers';
import Control from 'react-leaflet-custom-control';
import { Button, Icon } from '@blueprintjs/core';

export interface IAccessCodeMapProps {
	onSignOutClick: React.MouseEventHandler;
}

export default function AccessCodeMap(props : IAccessCodeMapProps) {
	const { onSignOutClick } = props;

	return (
		<MapContainer center={[47.65496185820956, -122.25201847353225]} zoom={11} scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<GeocodeControl position="topright"/>
			<LocateControl position="topright" />
			<LocationMarkers/>
			<Control position='topright'>
				<Button onClick={onSignOutClick}>
					<Icon icon="log-out"/>
				</Button>
			</Control>
		</MapContainer>
	);
}