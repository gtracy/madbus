
const TRANSIT_API_ENDPOINT = "https://api.smsmybus.com/v1";

export default class TransitAPI {
    constructor(devkey) {
        this.devkey = devkey;
    }

    getArrivals = async (stopid,routeid) => {
        let endpoint = TRANSIT_API_ENDPOINT + "/getarrivals?key=" + this.devkey + "&stopID=" + stopid;
        if( routeid ) {
            endpoint += "&routeID=" + routeid;
        }

        const raw = await fetch(endpoint);
        const result = await raw.json();

        if( result.status === "0" ) {
            return result.stop.route;
        } else {
            console.error('API is returning an error for '+stopid);
            console.dir(result);
            return [];
        }

    }

    getStopLocation = async(stopid) => {
        let endpoint = TRANSIT_API_ENDPOINT + "/getstoplocation?key=" + this.devkey + "&stopID=" + stopid;

        fetch(endpoint)
        .then(res => res.json())
        .then(
            (result) => {
                if( result.status === "0" ) {
                    return result.intersection;
                } else {
                    return undefined;
                }
            },
            (error) => {
                console.log('Failed to fetch stop location');
                console.dir(error);
                return undefined;
            }
        )
        .catch(console.log);
    }

    
}
