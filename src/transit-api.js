
const TRANSIT_API_ENDPOINT = "https://api.smsmybus.com/v1";
const MOCK_ON_ERROR = true;
const mock_route_data = [
    {routeID:'XX',minutes:5,destination:'WEST TRANSFER VIA SHERMAN'},
    {routeID:'02',minutes:8,destination:'WEST TRANSFER VIA SHERMAN'},
    {routeID:'08',minutes:8,destination:'SPRING HARBOR'},
    {routeID:'04',minutes:8,destination:'SOUTH TRANSFER'},
    {routeID:'28',minutes:8,destination:'WEST TRANSFER'},
    {routeID:'15',minutes:8,destination:'HIGH POINT: VIA OLD MIDDLETON'}
]


export default class TransitAPI {
    constructor(devkey) {
        this.devkey = devkey;
    }

    getArrivals = async (stopid,routeid) => {
        let endpoint = TRANSIT_API_ENDPOINT + "/getarrivals?key=" + this.devkey + "&stopID=" + stopid;
        if( routeid ) {
            endpoint += "&routeID=" + routeid;
        }

        try {
            const raw = await fetch(endpoint);
            const result = await raw.json();

            if( result.status === "0" ) {
                return result.stop.route;
            } else {
                console.error('API is returning an error for '+stopid);
                console.dir(result);    
                return [];
            }
        } catch(e) {
            if( MOCK_ON_ERROR ) {
                return mock_route_data;
            } else {
                console.log(e);
            }
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
