'use strict';

const TRANSIT_API_ENDPOINT = "https://api.smsmybus.com";

class TransitAPI {
    constructor(devkey) {
        this.devkey = devkey;
    }

    getArrivals = async (stopid,routeid) => {
        const endpoint = TRANSIT_API_ENDPOINT + "/getarrivals?key=" + this.devkey + "&stopid=" + stopid;
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
                console.log('Failed to fetch stop location');
                console.dir(error);
            }  
        )
        .catch(console.log)

    }
    
}
