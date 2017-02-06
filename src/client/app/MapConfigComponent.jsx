import React from 'react';
import { GoogleMapLoader, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

//CREATES MAP
class MapConfigComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			location: {
		        lat:37.7831708,
		        lng: -122.4100967
		     }
      	}
	}

	render() {
		//CREATES DIV FOR THE MAP
		//CREATE A NEW MARKER FOR EACH ELEMENT IN THE MARKERS ARRAY AND RETURNS THAT MARKER
		const mapContainer = <div style={{ height: '100%', width: '100%' }}></div>;
		const markers = this.props.markers.map((venue, i) => {
			const marker = {
				position: {
					lat: venue.location.lat,
					lng: venue.location.lng
				}
			}
			return <Marker key={i} {...marker} />
		})

		//CREATES THE MAP
			//REF RE-CENTERS THE MAP WHEN LOCATION CHANGES
		return (
			<GoogleMapLoader
				containerElement = { mapContainer }
				googleMapElement = {
					<GoogleMap
						defaultZoom={12}
						ref = {(map) => map && map.panTo(this.props.center)}
						options={{streetViewControl: true, mapTypeControl: true}}>
						{ markers }
					</GoogleMap>
				} />
		);
	}
}

export default MapConfigComponent;
