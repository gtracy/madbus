import React from 'react';
import { useState, useEffect } from 'react';


export default function RefreshTimer() {
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
