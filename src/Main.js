import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

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

  const GlobalStyle = createGlobalStyle`
    body, html {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      min-height: -webkit-fill-available;
    }
  `;

  const calculateTimer = () => {
    const totalms = lengthMins * 60 * 1000;
    const elapsedms = new Date() - startAt;
    setRemaining(msToHMSS(totalms - elapsedms));
  };

  useEffect(() => {
    calculateTimer();
    const interval = setInterval(calculateTimer, 250);
    document.title = `Back in ${lengthMins || ""}`;
    return () => clearInterval(interval);
  }, []);

  const buttons = [5, 10, 20, 30, 60];

  return (
    <Wrapper>
      <BrowserRouter>
        <div className="container">
          <GlobalStyle whiteColor />
          <BackIn>Back in</BackIn>
          {lengthMins ? (
            <>
              <Remaining>{remaining}</Remaining>
              <a href="/">
                <button>reset</button>
              </a>
            </>
          ) : (
            <>
              {buttons.map((button) => (
                <a href={`/${button}`}>
                  <button>{button} mins</button>
                </a>
              ))}
              <Sponsored>
                <div>Sponsored by</div>
                <div>
                  <a href="https://newco.ooo" target="_blank">
                    <img height={32} width={32} src="icon.png" />
                  </a>
                </div>
              </Sponsored>
            </>
          )}
        </div>
      </BrowserRouter>
    </Wrapper>
  );
};

const Sponsored = styled.div`
  margin-top: 4rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  img {
    margin-left: 8px;
  }
`;
const BackIn = styled.div`
  font-size: 4rem;
`;

const Wrapper = styled.div`
  text-align: center;
  padding: 0em;
  margin: 0;
  height: 100vh;
  min-height: 100vh;
  min-height: -webkit-fill-available; /* mobile viewport bug fix */
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
  background-size: cover;
  background-position: center center;
`;

const Remaining = styled.div`
  font-size: 7rem;
  font-weight: bold;
`;

export default Main;
