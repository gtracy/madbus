import { useState, useEffect } from 'react'

function TimerComponent() {

    useEffect(() => {
        setInterval(() => {
            console.log('10 sec.');
        }, 10000);
    }, []);

    return (
        <div>
            Hello World
        </div>
    )
}

export { TimerComponent }