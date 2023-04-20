
const TRANSIT_API_ENDPOINT = "https://api.smsmybus.com";

export default class TransitAPI {
    constructor(devkey) {
        this.devkey = devkey;
    }

    getArrivals = async (stopid,routeid) => {
        let endpoint = TRANSIT_API_ENDPOINT + "/getarrivals?key=" + this.devkey + "&stopid=" + stopid;
        if( routeid ) {
            endpoint += "&routeid=" + routeid;
        }

        fetch(endpoint)
        .then(res => res.json())
        .then(
            (result) => {
                if( result.status === "0" ) {
                    return result.stop.route;
                } else {
                    console.log('API is returning an error for '+stopid);
                }
            },
            (error) => {
                this.setState({
                    timeLoaded : false,
                });
                console.log('Failed to fetch arrival details');
                console.dir(error);
            }  
        )
        .catch(console.log)

    }

    getStopLocation = async(stopid) => {
        let endpoint = TRANSIT_API_ENDPOINT + "/getstoplocation?key=" + this.devkey + "&stopid=" + stopid;

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
