
const TRANSIT_API_ENDPOINT = "https://oup73vr3s1.execute-api.us-east-2.amazonaws.com/prod";
const TRANSIT_API_KEY = process.env.REACT_APP_TRANSIT_API_KEY;
const MOCK_ON_ERROR = false;
const mock_route_data = [
    {routeID:'02',minutes:8,destination:'WEST TRANSFER VIA SHERMAN'},
    {routeID:'08',minutes:10,destination:'SPRING HARBOR'},
    {routeID:'04',minutes:12,destination:'SOUTH TRANSFER'},
    {routeID:'28',minutes:25,destination:'WEST TRANSFER'},
    {routeID:'15',minutes:46,destination:'HIGH POINT: VIA OLD MIDDLETON'}
];
const mock_stop_data = [
    {stopID:'0100',intersection:'Universy & N. Park',lat:43.073399,lon:-89.401365,direction:'westbound'},
    {stopID:'1100',intersection:'Miffling & Pinckney',lat:43.076028,lon:-89.384661,direction:'westbound'},
    {stopID:'1505',intersection:'Jennifer & Ingersoll',lat:43.081151,lon:-89.365311,direction:'eastbound'},
    {stopID:'1878',intersection:'Jennifer & Ingersoll',lat:43.081482,lon:-89.365249,direction:'westbound'},
]


export default class TransitAPI {
    constructor() {
        this.devkey = TRANSIT_API_KEY;
        this.stop_details = undefined;
    }

    getArrivals = async (stopid,routeid) => {
        let endpoint = TRANSIT_API_ENDPOINT + "/v1/getarrivals?key=" + this.devkey + "&stopID=" + stopid;
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
                console.log('API call threw an error. Is the API down?');
                return [];
            }
        }

    }

    getStops = async () => {
        if (this.stop_details) {
            return this.stop_details;
        } else {
            try {
                const response = await fetch('stops.json');
    
                if (!response.ok) {
                    console.log('ERROR: unable to load stop data');
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
    
                if (Array.isArray(result)) { 
                    this.stop_details = result;
                    return result;
                } else {
                    console.error('JSON data is invalid. Expected an array.');
                    console.dir(result);
                    return [];
                }
            } catch (e) {
                if (MOCK_ON_ERROR) {
                    return mock_stop_data;
                } else {
                    console.error('Error fetching or parsing JSON:', e);
                    return [];
                }
            }
        }
    };

    getStopLocation = (stopid) => {
        return {};
    }

    
}
