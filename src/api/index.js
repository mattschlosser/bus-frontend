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
 * @param {nunber} offset 
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
 * 
 * @param {} tripId 
 * @returns {Trip}
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
        return null;
    }
}