
const TRANSIT_API_ENDPOINT = "https://api.smsmybus.com/v1";
const MOCK_ON_ERROR = true;
const mock_route_data = [
    {routeID:'XX',minutes:5,destination:'WEST TRANSFER VIA SHERMAN'},
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
    constructor(devkey) {
        this.devkey = devkey;
        this.stop_details = undefined;//mock_stop_data;
    }

    getArrivals = async (stopid,routeid) => {
        let endpoint = TRANSIT_API_ENDPOINT + "/getarrivals?key=" + this.devkey + "&stopID=" + stopid;
        if( routeid ) {
            endpoint += "&routeID=" + routeid;
        }

        try {
            const raw = await fetch(endpoint);
            const result = await raw.json();
            console.dir(result);

            if( result.status === "0" ) {
                return result.stop.route;
            } else {
                console.error('API is returning an error for '+stopid);
                console.dir(result);    
                return [];
            }
        } catch(e) {
            if( MOCK_ON_ERROR ) {
                console.log('*********** mocking data ************');
                return mock_route_data;
            } else {
                console.log(e);
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
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
    
                if (Array.isArray(result)) { 
                    this.stop_details = result;
                    console.dir(this.stop_details);
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
