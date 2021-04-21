import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));

const msToHMSS = (ms) => {
  let seconds = ms / 1000;
  let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  seconds = seconds % 60;
  return +minutes + ":" + `${Math.floor(seconds)}`.padStart(2, "0");
};

const Main = () => {
  const max = 999;
  const path = window.location.pathname.replace("/", "");
  const lengthMins = isNumeric(path) ? Math.min(+path, max) : false;
  const [remaining, setRemaining] = useState();
  const [isComplete, setIsComplete] = useState(false);
  const startAt = new Date();
  const nowLabel = "Now";

  const GlobalStyle = createGlobalStyle`
    body, html {
      margin: 0;
      padding: 0;
    }
    * {
      font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
   font-weight: 300;
    }
  `;

  const calculateTimer = () => {
    if (isComplete || !lengthMins) return;
    const totalms = lengthMins * 60 * 1000;
    const elapsedms = new Date() - startAt;
    if (elapsedms > totalms - 1000) {
      document.title = `Back!`;
      return setIsComplete(true);
    }
    const remaining = msToHMSS(totalms - elapsedms);
    setRemaining(remaining);
    document.title = `Back in ${remaining || ""}`;
  };

  useEffect(() => {
    calculateTimer();
    const interval = setInterval(calculateTimer, 250);
    return () => clearInterval(interval);
  }, []);

  const buttons = [5, 10, 20, 30, 60];

  return (
    <Wrapper>
      <BrowserRouter>
        <div className="container">
          <GlobalStyle whiteColor />
          <BackIn>Back{isComplete ? " 🤟" : " in"}</BackIn>
          {lengthMins && !isComplete ? (
            <>
              <Remaining>{remaining}</Remaining>
              <Buttons>
                <span>
                  <Button onClick={() => setIsComplete(true)}>
                    Resume early
                  </Button>
                </span>
              </Buttons>
            </>
          ) : (
            <>
              <Buttons>
                {buttons.map((button) => (
                  <a href={`/${button}`}>
                    <Button>{button} mins</Button>
                  </a>
                ))}
              </Buttons>
              <Sponsored>
                <div>Sponsored by</div>
                <div>
                  <a
                    href="https://newco.ooo"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <img alt="NewCo" height={32} width={32} src="icon.png" />
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

const Buttons = styled.div`
  margin-top: 0.5rem;
  line-height: 2rem;
`;

const Button = styled.button`
  margin: 0 4px;
  font-size: 1.1rem;
`;

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
