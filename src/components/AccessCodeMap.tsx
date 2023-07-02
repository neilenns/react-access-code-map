import { MapContainer, TileLayer } from 'react-leaflet'
import { LocateControl } from "./LocateControl";
import { GeocodeControl } from './GeocodeControl';

export function AccessCodeMap() {
	return (
		<MapContainer center={[47.65496185820956, -122.25201847353225]} zoom={11} scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
		<GeocodeControl position="topright"/>
		<LocateControl position="topright" />
		</MapContainer>
	);
}