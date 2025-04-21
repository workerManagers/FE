import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'SBL';
    src: url('../assets/fonts/SBL.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'SBM';
    src: url('../assets/fonts/SBM.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'SBB';
    src: url('../assets/fonts/SBB.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'SBL';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    letter-spacing: -0.3px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'SBL';
    font-weight: bold;
  }

  button {
    font-family: 'SBL';
  }
`; 