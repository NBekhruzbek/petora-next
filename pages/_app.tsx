import { useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { light } from "@/scss/MaterialTheme";
import { CssBaseline } from "@mui/material";
import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const [theme, setTheme] = useState(createTheme(light));

  // Socket.io, Redux, MUI ...
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
