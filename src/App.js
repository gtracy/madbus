import React from 'react';
import Button from '@material-ui/core/Button';
import './App.css';

function StopList(props) {
    return (
        <div >
            <Button variant="contained" color="primary">
                {props.value}
            </Button>
        </div>
    )
}

function Timer(props) {
    return (
        <div>
        <div className="Timer">
            {props.minutes}
        </div>
        <p>{props.asof}</p>
        </div>
    );
}

function Destination(props) {
    return (
        <div >
            <p>{props.value}</p>
        </div>
    )
}

function UpNext(props) {
    return (
        <ul>
            {props.value}
        </ul>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLoaded : false,
            locationLoaded : false,
            display : {
                stop : undefined,
                location : undefined,
                results : undefined,
                refreshTime : undefined
            },
            bookmarks : ["0100"]
        };

    }

    fetchStopLocation() {
        fetch("https://api.smsmybus.com/v1/getstoplocation?key=nomar&stopID=100")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
                locationLoaded : true,
                display : {
                    location : result.intersection
                }
            });
          },
          (error) => {
              this.setState({
                  locationLoaded : false
              });
              console.log('Failed to fetch stop location');
              console.dir(error);
          }
        )
        .catch(console.log)

    }

    fetchTimes() {
        fetch("https://api.smsmybus.com/v1/getarrivals?key=nomar&stopID=100")
        .then(res => res.json())
        .then(
            (result) => {
              if( result.status === "0" &&
                  result.stop.route.length > 0 ) {

                    this.setState({
                        timeLoaded : true,
                        display : {
                            stop : result.stop.stopID,
                            results : result.stop.route,
                            refreshTime : result.timestamp
                        }
                    });
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

    getNextTimes() {
        let times = this.state.display.results;
        let list_times = <li/>;
        if( times && times.length > 0 ) {
            list_times = times.map((time,key) => {
                return <li key={time.destinaton}>{time.minutes} via {time.destination}</li>
            });
        }
        console.dir(list_times);
        return list_times;
    }

    getStopList() {
        let stops = this.state.bookmarks;
        let list_stops = stops.map((stop,key) => {
            return <li key={stop}>{stop}</li>
        });
        return list_stops;
    }

    getStopLocation() {
        if( this.state.locationLoaded ) {
            return this.state.display.location;
        } else {
            return "loading";
        }
    }

    refreshTime() {
        if( this.state.timeLoaded ) {
            return this.state.display.refreshTime;
        } else {
            return "...";
        }
    }

    getNextArrival() {
        if( this.state.timeLoaded && this.state.display.results.length > 0 ) {
            return this.state.display.results[0].minutes;
        } else {
            return "?";
        }
    }

    componentDidMount() {
        this.fetchTimes();
        this.fetchStopLocation();
    }

    render() {

      const nextTimes = this.getNextTimes();
      const stopList = this.getStopList();

      return(
        <div>
        <div className="App">
            <StopList value={this.getStopList()}/>
            <Timer 
              minutes={this.getNextArrival()}
              asof={this.refreshTime()}
            />
            <Destination value={this.getStopLocation()}/>
            <UpNext value={this.getNextTimes()}/>

        </div>
        </div>
      )
  };
}

export default App;
