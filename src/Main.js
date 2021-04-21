import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));

const msToHMSS = (ms) => {
  let seconds = (ms / 1000) % 3600;
  let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  seconds = seconds % 60;
  return +minutes + ":" + `${Math.floor(seconds)}`.padStart(2, "0");
};

const Main = () => {
  const path = window.location.pathname.replace("/", "");
  const lengthMins = isNumeric(path) ? +path : false;
  const [remaining, setRemaining] = useState();
  const startAt = new Date();

  const calculateTimer = () => {
    const totalms = lengthMins * 60 * 1000;
    const elapsedms = new Date() - startAt;
    setRemaining(msToHMSS(totalms - elapsedms));
  };

  useEffect(() => {
    calculateTimer();
    const interval = setInterval(calculateTimer, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <main>
        <div className="container">
          <h2>Back in</h2>
          {lengthMins ? (
            <>
              <h1>{remaining}</h1>
              <a href="/">
                <button>reset</button>
              </a>
            </>
          ) : (
            <>
              <a href="/5">
                <button>5 mins</button>
              </a>
              <a href="/10">
                <button>10 mins</button>
              </a>
              <a href="/20">
                <button>20 mins</button>
              </a>
              <a href="/30">
                <button>30 mins</button>
              </a>
              <a href="/60">
                <button>1 hour</button>
              </a>
            </>
          )}
        </div>
      </main>
    </BrowserRouter>
  );
};

export default Main;
