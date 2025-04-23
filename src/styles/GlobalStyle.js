import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'HB';
    src: url('../assets/fonts/HB.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'HM';
    src: url('../assets/fonts/HM.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'HR';
    src: url('../assets/fonts/HR.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'HSB';
    src: url('../assets/fonts/HSB.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'LR';
    src: url('../assets/fonts/LR.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'LR';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    letter-spacing: -0.3px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'LR';
    font-weight: bold;
  }

  button {
    font-family: 'LR';
  }
`; 