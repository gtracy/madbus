import React, {useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import TransitAPI from './transit-api';

import './App.css';
import { TimerComponent } from './TimerComponent';

const transit = new TransitAPI('nomar');

function StopList(props) {
    return (
        <div >
            <Button class="mdc-button">
                <span class="mdc-button__ripple"></span>
                <span class="mdc-button__label">{props.value}</span>
            </Button>
        </div>
    )
}

function Destination(props) {
    return (
        <div >
            <p>{props.value}</p>
        </div>
    )
}

const Countdown = (props) => {
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setMinutes(minutes => minutes + 1);
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    return (
        <div>
        <div className="Timer">
            {minutes}
        </div>
        </div>
    );
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


    render() {

      const nextTimes = this.getNextTimes();
      const stopList = this.getStopList();

      return(
        <div>
        <div className="App">
            <StopList value={this.getStopList()}/>
            <Countdown 
              minutes={this.getNextArrival()}
              asof={this.refreshTime()}
            />
            <Destination value={this.getStopLocation()}/>
            <UpNext value={this.getNextTimes()}/>
            <TimerComponent/>
        </div>
        </div>
      )
  };
}

export default App;
