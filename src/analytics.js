import ReactGA from 'react-ga4';
ReactGA.initialize('G-NWLE29X95Q');

const buttonClick = (action) => ReactGA.event({
    category: "button click",
    action: action
})

const gaEvents = {
    buttonClick: buttonClick,
}

export { gaEvents }