import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import DarkModeToggle from "react-dark-mode-toggle";
import useDarkMode from "use-dark-mode";
import { Helmet } from "react-helmet";

const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));

const msToHMSS = (ms) => {
  let seconds = ms / 1000;
  let minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
  seconds = seconds % 60;
  return +minutes + ":" + `${Math.floor(seconds)}`.padStart(2, "0");
};

const Main = () => {
  const max = 999;
  const url = window.location.hostname;
  const path = window.location.pathname.replace("/", "");
  const [remaining, setRemaining] = useState();
  const [isComplete, setIsComplete] = useState(false);
  const lengthMins =
    isNumeric(path) && path >= 0.05
      ? Math.min(+path, max)
      : url.includes("10mins") && path !== "stop"
      ? 10
      : url.includes("3mins") && path !== "stop"
      ? 3
      : false;
  const startAt = new Date();

  const GlobalStyle = createGlobalStyle`
    body, html {
      margin: 0;
      padding: 0;
      max-height: -webkit-fill-available;
      overflow: hidden;
    }
    * {
      font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
   font-weight: 300;
    }
   button {
    background-color: #ddd;
    &:hover {
      background-color: #ccc
    }
   }
    
    .dark-mode {
      background: black;
   color: #fff;
   button {
   color: #fff;

    background-color: #333;
    &:hover {
      background-color: #222
    }
   }

    }
  `;

  const calculateTimer = () => {
    if (isComplete || !lengthMins) return;
    const totalms = lengthMins * 60 * 1000;
    const elapsedms = new Date() - startAt;
    if (elapsedms > totalms - 1000) {
      // document.title = `Back!`;
      return setIsComplete(true);
    }
    const remaining = msToHMSS(totalms - elapsedms);
    setRemaining(remaining);
    // document.title = `Back in ${remaining || ""}`;
  };

  useEffect(() => {
    calculateTimer();
    const interval = setInterval(calculateTimer, 250);
    return () => clearInterval(interval);
  }, []);

  const buttons = [3, 10, 15, 30, 60];
  const darkMode = useDarkMode(false);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Screen Break</title>
        <meta name="description" content="Take more screen breaks." />
        <link
          rel="canonical"
          href={
            url.includes("3mins")
              ? `https://3mins.org${lengthMins ? `/${lengthMins}` : ""}`
              : url.includes("10mins")
              ? `https://10mins.org${lengthMins ? `/${lengthMins}` : ""}`
              : `https://backin.in${lengthMins ? `/${lengthMins}` : ""}`
          }
        />
      </Helmet>
      <Header>
        <DarkModeToggle
          onChange={darkMode.toggle}
          checked={darkMode.value}
          size={60}
        />
      </Header>
      <Wrapper>
        <BrowserRouter>
          <>
            <div className="container">
              <GlobalStyle whiteColor />
              <BackIn>Back{isComplete ? " 🤟" : " in"}</BackIn>
              {lengthMins && !isComplete ? (
                <>
                  <Remaining>{remaining}</Remaining>
                  <Buttons>
                    <span>
                      <a href="/stop">
                        <Button>Stop timer</Button>
                      </a>
                    </span>
                  </Buttons>
                </>
              ) : (
                <>
                  <Buttons>
                    {buttons.map((button) => (
                      <a key={button} href={`/${button}`}>
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
                        <img
                          alt="NewCo"
                          height={28}
                          width={28}
                          src={`newco_${darkMode.value ? "light" : "dark"}.png`}
                        />
                      </a>
                    </div>
                  </Sponsored>
                </>
              )}
            </div>
          </>
        </BrowserRouter>
      </Wrapper>
    </>
  );
};

const Header = styled.div`
  position: fixed;
  top: 8px;
  right: 8px;
`;

const Buttons = styled.div`
  margin-top: 0.5rem;
  line-height: 3rem;
`;

const Button = styled.button`
  margin: 0 4px;
  font-size: 1.1rem;
  padding: 6px 18px;
  border-radius: 12px;
  border: none;
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
  min-height: 100vh;
  height: -webkit-fill-available;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
  background-size: cover;
  background-position: center center;
  overflow: none;
`;

const Remaining = styled.div`
  font-size: 7rem;
  font-weight: bold;
`;

export default Main;
