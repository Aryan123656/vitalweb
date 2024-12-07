// import React, { useEffect, useState } from 'react';
// import { Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import "leaflet/dist/leaflet.css";
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import * as ELG from 'esri-leaflet-geocoder';

// let DefaultIcon = L.icon({
//     iconUrl: icon,
//     shadowUrl: iconShadow
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// const GeoCoderMarker = ({ address }) => {
//     const map = useMap();
//     const [position, setPosition] = useState([0, 0]); // Default position

//     useEffect(() => {
//         // Create a geocoder with your Esri API token
//         const geocoder = ELG.geocode({
//             apikey: 'YOUR_ESRI_API_KEY' // Replace with your actual API key
//         });

//         geocoder.text(address).run((err, results, response) => {
//             if (err) {
//                 console.error("Geocoding error:", err);
//                 return;
//             }
//             if (results?.results?.length > 0) {
//                 const { lat, lng } = results.results[0].latlng;
//                 console.log("Geocoded position:", lat, lng);
//                 setPosition([lat, lng]);
//                 map.flyTo([lat, lng], 12);
//             } else {
//                 console.log("No results found for address:", address);
//             }
//         });
//     }, [address, map]);

//     return position[0] !== 0 && position[1] !== 0 ? (
//         <Marker position={position} icon={DefaultIcon}>
//             <Popup>{address}</Popup>
//         </Marker>
//     ) : null;
// };

// export default GeoCoderMarker;

import React, { useEffect, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios'

const GeocoderMarker = ({ address }) => {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        const geocodeAddress = async () => {
            if (!address) return;

            // Combine address lines for geocoding
            const fullAddress = `${address.line1}, ${address.line2}`.trim();
            
            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                    params: {
                        q: fullAddress,
                        format: 'json',
                        limit: 1
                    }
                });

                if (response.data && response.data.length > 0) {
                    const { lat, lon } = response.data[0];
                    const coordinates = [parseFloat(lat), parseFloat(lon)];
                    
                    // Set the position for the marker
                    setPosition(coordinates);
                    
                    // Programmatically center and zoom the map
                    map.setView(coordinates, 15);
                } else {
                    console.error('No coordinates found for address');
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        };

        geocodeAddress();
    }, [address, map]);

    if (!position) return null;

    return (
        <Marker position={position}>
            <Popup>
                {address.line1}<br />
                {address.line2}
            </Popup>
        </Marker>
    );
};

export default GeocoderMarker;