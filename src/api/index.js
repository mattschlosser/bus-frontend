/**
 * @typedef {Object} BusStop
 * @property {string} stop_id
 * @property {string} stop_code
 * @property {string} stop_name
 * @property {string} stop_lat
 * @property {string} stop_lon
 * @property {string} zone_id
 * @property {string} location_type
 * @property {string} level_name
 * 
 */

/**
 * @typedef {Object} GeometryLine
 * @property {"MultiLineString"} type
 * @property {CoridnateSet[]} coordinates
 */

/**
 * @typedef {[number, number][]} CoridnateSet
 */

/**
 * @typedef {Object} Trip
 * @property {string} route_id
 * @property {string} service_id
 * @property {string} trip_id
 * @property {string} trip_headsign
 * @property {string} direction_id
 * @property {string} block_id
 * @property {string} shape_id
 * @property {boolean} wheelchair_accessible
 * @property {boolean} bikes_allowed
 * @property {GeometryLine} geometry_line  
 */

/**
 * Gets a list of 1000 bus stops from the edmonton data api
 * @param {number} offset 
 * 
 */
const getBusStops = async (offset = null) => {
    let url = "https://data.edmonton.ca/resource/4vt2-8zrq.json";
    if (offset) {
        url += `?$offset=${offset}`;
    } 
    let result = await fetch(url, {
        headers: {
            "Accept": "application/json",
            "X-App-Token": import.meta.env.VITE_APP_SODA_APP_TOKEN
        }
    })
    if (result.ok) {
        return  result.json();
    } else {
        throw Error(result.status);
    }
    
}

/**
 * 
 * @returns {Promise<BusStop[]>}
 */
export const getAllBusStops = async () => {
    let stops = await getBusStops();
    let offset = 0;
    while (stops.length % 1000 === 0 && offset < stops.length) {
        offset += 1000;
        stops = [...stops, ...await getBusStops(offset)];
    }
    return stops;
}

/** 
 * @typedef {Object} BusStopTime 
 * @property {string} trip_id Identifies a trip.
 * @property {string} arrival_time 	
Arrival time at a specific stop for a specific trip on a route. For times occurring after midnight on the service day, the time has a value greater than 24:00:00 in HH:MM:SS local time for the day on which the trip schedule begins.
 * @property {string} departure_time 	
Departure time from a specific stop for  a specific trip on a route. For times occurring after midnight on the service day, the time has a value greater than 24:00:00 in HH:MM:SS local time for the day on which the trip schedule begins.
 * @property {string} stop_id Identifies the serviced stop.
 * @property {string} stop_sequence 	
Order of stops for a particular trip. The values must increase along the trip but do not need to be consecutive.
 * @property {string} drop_off_type 	
Indicates drop off method. Valid options are: 0 or empty - Regularly scheduled drop off. 1 - No drop off available. 2 - Must phone agency to arrange drop off. 3 - Must coordinate with driver to arrange drop off.
 * @property {string} arrival_time_fixed Not from the GTFS feed. For times occurring after midnight on the service day, times have values greater than 24:00:00; this column represents such times normally (i.e. for hours >= 24, 24 is subtracted)
 * @property {string} departure_time_fixed Not from the GTFS feed. For times occurring after midnight on the service day, times have values greater than 24:00:00; this column represents such times normally (i.e. for hours >= 24, 24 is subtracted)
 * 
 */

/**
 * 
 * @param {string} tripId The trip id to get bus stop times for
 * @returns {Promise<BusStopTime[]>} 
 */
export const getBusStopTimes = async (tripId) => {
    let url = `https://data.edmonton.ca/resource/greh-g7ac.json?trip_id=${tripId}`;
        
    let result = await fetch(url, {
        headers: {
            "Accept": "application/json",
            "X-App-Token": import.meta.env.VITE_APP_SODA_APP_TOKEN
        }
    })
    if (result.ok) {
        return result.json();
    }
    return [];
}

/**
 * 
 * @param {} tripId 
 * @returns {Promise<Trip | null>}
 */
export const getTrip = async (tripId) => {
    let result = await  fetch(`https://data.edmonton.ca/resource/ctwr-tvrd.json?trip_id=${tripId}`, {
        headers: {
            "Accept": "application/json",
            "X-App-Token": import.meta.env.VITE_APP_SODA_APP_TOKEN
        }
    })
    if (result.ok) {
        let trip = (await result.json())[0];
        if (trip) {
            return trip;
        }
    }
    return null;
}