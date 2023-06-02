import ReactGA from 'react-ga4';
ReactGA.initialize('G-NWLE29X95Q');

const buttonClick = (action) => ReactGA.event({
    category: "button click",
    action: action
})

const eventOccurred = (event) => ReactGA.event({
    category: "event occurred",
    action: event
})

const gaEvents = {
    buttonClick: buttonClick,
    eventOccurred: eventOccurred
}

export { gaEvents }