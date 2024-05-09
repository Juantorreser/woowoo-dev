import React,
		{ useEffect,
		//useState
		}
	from 'react';
import { GoogleMap, LoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import MapStyle from "./mapStyle.json";

/* DEV NOTES
* API calls should use an environment variable or be adjusted to point to
* woo-woonetwork.com/api/[name of api endpoint].
*
* Google maps API key should be hidden.
*
* Description needs to be added to the healer response data
*
* History back causes issues with the map not loading. Possible state issues
*  ^ this should no longer be happening as of July 2022
*/

const containerStyle = {
	width: '100%',
	height: '100%'
};

const Map = ({data, handleActiveMarker, active, setActive, range, location, setLocation, currMarkers}) => {
	//a backup, default location if the user rejects the geolocation request for the map.
	const victoria = { view:{ "lat": 48.407326,"lng": -123.329773 } };

	const currentPos = navigator.geolocation.getCurrentPosition(
        (pos) => {
			setLocation({ view: {lat: pos.coords.latitude, lng: pos.coords.longitude}});
        },
        (err) =>{
			setLocation(victoria);
        }
    );

    if (!location){
		setLocation(currentPos);
    }

	//map rerenders when markers, healers, or range state are updated
	useEffect(() => {

	}, [data.markers, data.healers, currMarkers, range]);

	//old api key: AIzaSyB0-ftuMjsHGds4c5TrWgEa7h6ilMfJye8
	return (
		<LoadScript
			googleMapsApiKey='AIzaSyD4YzQMWoVijPevGTur61ekzEvgzlrkAyI'
			libraries={['geometry']}
		>
			<GoogleMap
				onClick={() => setActive(null)} //closes the active marker on click
				options={{
					streetViewControl: false,
					mapTypeControl: false,
					styles: MapStyle,
				}}
				mapContainerStyle={containerStyle}
				center={location.view}
				zoom={12}
			>
				{
					//only if there are markers, display them.
					data.markers && data.markers.map(({ id, healer, position, description }) => (
						<Marker
							key={id}
							position={position}
							onClick={() => handleActiveMarker(id)} //change the clicked marker state to currently active.
						>
						{
							active === id ? (
								<InfoWindow className="markerInfoWindow" onCloseClick={() => setActive(null)}>
									<div className="markerContainer">
										<div className="markerHealer">
											<pre className="noMargin">{ healer }</pre>
										</div>
										<div className="markerDescription">
											<pre className="noMargin">{ description }</pre>
										</div>
									</div>
								</InfoWindow>
							) : null
						}
						</Marker>
					))
				}
			</GoogleMap>
		</LoadScript>
	);
}

export default Map
