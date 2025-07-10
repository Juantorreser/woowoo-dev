// import React, { useState, useEffect } from 'react';
// import Map from './map.js';
// import Healers from './healers.js';
// import './search.css';
// import axios from 'axios';

// //These three variables need to be here otherwise getHealersWithFilter() won't work
// //If there's a way for these to be persistent AND be located inside getHealersWithFilter() then that'd be cool, I'm not gonna look into it though
// let city = null;
// let service = null;
// let deliveryFormat = '0';

// const Search = () => {
//     const victoria = { view:{ "lat": 48.407326,"lng": -123.329773 } }, //default location :)
//     [initHealers, setInitHealers] = useState(null),
//     [markers, setMarkers] = useState(null), //map markers
//     [currMarkers, setCurrMarkers] = useState(null),
//     [healers, setHealers] = useState(null), //healers to place on the map
//     [active, setActive] = useState(null), //state for which marker is open
//     [range, setRange] = useState(50), //healer search radius (units determined by google)
// 	[location, setLocation] = useState(victoria); //the user's location
//     //[reviews, setReviews] = useState('');

// 	const handleActiveMarker = (marker) => {
//     if (marker === active) {
//         return;
//     }
//         setActive(marker);
//     };

    

//     /**
//      * using the response from the healers API, sets the healer and marker states based on the filtered response
//      'Cities' filters by cities. only one city can be selected at a time currently (June 2023)
//      'Services' filters by the types of services provided (e.g. Meditation, Yoga, etc.). 
//      'deliveryFormat' is an integer representing whether the healer is available online, in-person, or both:
//      - 0 is both, 1 is in-person only, 2 is online onl

//      * @param {*} filters 
//      */
//     const getHealersWithFilter = async (filters) => {
        
// 		if (filters.Cities) {
// 			//console.log("city found: " + filters.param);
// 			city = filters.param;
// 		}
// 		if (filters.Services) {
// 			//console.log("service found: " + filters.param);
// 			service = filters.param;
// 		}
// 		if (filters.deliveryFormat !== undefined) {
// 			console.log("delivery format found: " + filters.deliveryFormat);
// 			deliveryFormat = filters.deliveryFormat;
// 		}
        

// 		filters = {
// 			Cities: 'Cities', cityParam: city,
// 			Services: 'Services', serviceParam: service,
// 			deliveryFormat: deliveryFormat
// 		};
//         //console.log('filters ', filters);

//         await axios.post('http://localhost:8080/users/healers', filters)
//         .then((response) => {
//             //filter the healer response by the selected range (default 50)
//             let inRangeResponse = response.data.filter((healer) => {
                
//                 let currMarkerPos = markers.find(mrkrObj => mrkrObj.id === healer.uid);
                
//                 if(currMarkerPos){
//                     let distanceBetweenPoints = window.google.maps.geometry.spherical.computeDistanceBetween(
//                         {lat: parseFloat(location.view.lat), lng: parseFloat(location.view.lng)},
//                         {lat: parseFloat(currMarkerPos.position.lat), lng: parseFloat(currMarkerPos.position.lng)}
//                     ) / 1000;

//                     if(distanceBetweenPoints <= range){
//                         return healer;
//                     }
//                 }
//                 else {
//                     return healer;
//                 }
//             });

//             //console.log('getHealersWithFilter ', inRangeResponse);
//             setHealers(inRangeResponse);
//             getMarkers(inRangeResponse, false).then(() => {
//                 return inRangeResponse;
//             });
//         });
//     };

    

//     /**
//      * uses healers to get each individual id, saves those to an array,
//        and passes that as the parameter to the location api.
//       'first' parameter indicates whether to get all markers or just those associated
//       with the current healers array.
//      * @param {*} returnedHealers 
//      * @param {*} first 
//      */
//     const getMarkers = async (returnedHealers, first) => {
//         //console.log('getMarkers called with healers: ', returnedHealers, ' ', first);
//         let ids = returnedHealers.map((healer) => {
//             return healer.uid;
//         });

//         await axios.post('http://localhost:8080/locations', ids)
//             .then((markerResponse) => {
//                 let responseMarkers = markerResponse.data.map((mrkr) => {
//                     let currHealer = returnedHealers.find(healerObj => healerObj.uid === mrkr.uid);
//                     return {
//                         id: mrkr.uid,
//                         position: {
//                         lat: mrkr.lat,
//                         lng: mrkr.lng
//                         },
//                         healer: `${currHealer.firstName} ${currHealer.lastName}`,
//                         description: currHealer.description
//                     };
//                 });

//                 if(first){
//                     setMarkers(responseMarkers);
//                     setCurrMarkers(responseMarkers);
//                 } else {
//                     setCurrMarkers(responseMarkers);
//                 }

//             return responseMarkers;
//         });
//     };

//     /*
//     const getReviews = async (healerID) => {
//         console.log('getReviews ', healerID)
// 		await axios.get(`http://localhost:8080/review/${healerID}`)
// 			.then((response) => {
				
// 				let reviewTotal = 0;
// 				const reviewAvgArray = response.data.map((review) => {
// 					reviewTotal += review.rating;
// 					return review.rating;
// 				});

// 				const avgReviews = reviewTotal/reviewAvgArray.length;
// 				console.log('avgReviews ', avgReviews);
// 				setReviews(avgReviews);
// 			});
// 	};*/


//     //will execute once when the page loads. rerenders occur on the array
//     //second argument.
//     useEffect(() => {
//         // //gets the initial list of healers (will eventually be all in range)
//         const getInitialHealers = async () => { //add range param when ready.
//             //console.log('getInitialHealers');
//             await axios.get('http://localhost:8080/users/healers')    //might need to be changed so that only enabled healers can be seen.
//             .then((response) => {
//                 setInitHealers(response.data);
//                 setHealers(response.data);
//                 getMarkers(response.data, true);
//             });
//         };

//         getInitialHealers();
//     }, []);

//     return (
//         <div className="container">
//             <div className="row">
//                 {/* For larger screens, this will take up 4 columns; for smaller, it'll take full width */}
//                 <div className="col-lg-4 col-md-12 mb-3">
//                     <div className='healerFrame'>
//                         {initHealers ? (
//                             <Healers
//                                 data={{
//                                     healers: healers,
//                                     initHealers: initHealers,
//                                     markers: currMarkers
//                                 }}
//                                 getHealersWithFilter={getHealersWithFilter}
//                                 setHealers={setHealers}
//                                 range={range}
//                                 setRange={setRange}
//                                 getMarkers={getMarkers}
//                             />
//                         ) : (
//                             <div className="loaderContainer">
//                                 <div className="loader"></div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
    
//                 {/* Map section: Takes 8 columns on larger screens and full width on smaller ones */}
//                 <div className="col-lg-8 col-md-12">
//                     <div className='mapFrame'>
//                         <div className='center_bar'></div>
//                         {markers && initHealers ? (
//                             <Map
//                                 data={{ healers: initHealers, markers: currMarkers }}
//                                 handleActiveMarker={handleActiveMarker}
//                                 active={active}
//                                 setActive={setActive}
//                                 range={range}
//                                 location={location}
//                                 setLocation={setLocation}
//                             />
//                         ) : (
//                             <div className="loaderContainer">
//                                 <div className="loader"></div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
    
// }

// export default Search

import React, { useState, useEffect } from 'react';
import Map from './map.js';
import Healers from './healers.js';
import './search.css';
import axios from 'axios';

// Persistent filter state
let city = null;
let service = null;
let deliveryFormat = '0';

const Search = () => {
    const victoria = { view: { lat: 48.407326, lng: -123.329773 } };
    
    const [initHealers, setInitHealers] = useState(null);
    const [markers, setMarkers] = useState(null);
    const [currMarkers, setCurrMarkers] = useState(null);
    const [healers, setHealers] = useState(null);
    const [active, setActive] = useState(null);
    const [range, setRange] = useState(50);
    const [location, setLocation] = useState(victoria);

    const handleActiveMarker = (marker) => {
        if (marker === active) return;
        setActive(marker);
    };

    const getHealersWithFilter = async (filters = {}) => {
        if (filters.Cities) city = filters.param;
        if (filters.Services) service = filters.param;
        if (filters.deliveryFormat !== undefined) deliveryFormat = filters.deliveryFormat;

        const rangeToUse = filters.range || range;

        filters = {
            Cities: 'Cities',
            cityParam: city,
            Services: 'Services',
            serviceParam: service,
            deliveryFormat: deliveryFormat
        };

        await axios.post('http://localhost:8080/users/healers', filters)
            .then((response) => {
                const inRangeResponse = response.data.filter((healer) => {
                    const currMarkerPos = markers?.find(m => m.id === healer.uid);
                    if (currMarkerPos) {
                        const dist = window.google.maps.geometry.spherical.computeDistanceBetween(
                            new window.google.maps.LatLng(location.view.lat, location.view.lng),
                            new window.google.maps.LatLng(currMarkerPos.position.lat, currMarkerPos.position.lng)
                        ) / 1000;

                        return dist <= rangeToUse;
                    }
                    return false;
                });

                setHealers(inRangeResponse);
                getMarkers(inRangeResponse, false);
            });
    };

    const getMarkers = async (returnedHealers, first) => {
        const ids = returnedHealers.map(healer => healer.uid);

        await axios.post('http://localhost:8080/locations', ids)
            .then((markerResponse) => {
                const responseMarkers = markerResponse.data.map((mrkr) => {
                    const currHealer = returnedHealers.find(h => h.uid === mrkr.uid);
                    return {
                        id: mrkr.uid,
                        position: {
                            lat: mrkr.lat,
                            lng: mrkr.lng
                        },
                        healer: `${currHealer.firstName} ${currHealer.lastName}`,
                        description: currHealer.description
                    };
                });

                if (first) {
                    setMarkers(responseMarkers);
                    setCurrMarkers(responseMarkers);
                } else {
                    setCurrMarkers(responseMarkers);
                }

                return responseMarkers;
            });
    };

    // Initial load of all healers and markers
    useEffect(() => {
        const getInitialHealers = async () => {
            await axios.get('http://localhost:8080/users/healers')
                .then((response) => {
                    setInitHealers(response.data);
                    setHealers(response.data);
                    getMarkers(response.data, true);
                });
        };

        getInitialHealers();
    }, []);

    // NEW: Watch for range change and refilter
    useEffect(() => {
        if (!initHealers || !markers) return;
        getHealersWithFilter({ range });
    }, [range]);

    return (
        <div className="container"><div className="row">

                <div className="col-lg-4 col-md-12 mb-3">
                    <div className='healerFrame'>
                        {initHealers ? (
                            <Healers
                                data={{
                                    healers,
                                    initHealers,
                                    markers: currMarkers
                                }}
                                getHealersWithFilter={getHealersWithFilter}
                                setHealers={setHealers}
                                range={range}
                                setRange={setRange}
                                getMarkers={getMarkers}
                            />
                        ) : (
                            <div className="loaderContainer">
                                <div className="loader"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-8 col-md-12">
                    <div className='mapFrame'>
                        <div className='center_bar'></div>
                        {markers && initHealers ? (
                            <Map
                                data={{ healers: initHealers, markers: currMarkers }}
                                handleActiveMarker={handleActiveMarker}
                                active={active}
                                setActive={setActive}
                                range={range}
                                location={location}
                                setLocation={setLocation}
                            />
                        ) : (
                            <div className="loaderContainer">
                                <div className="loader"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;

