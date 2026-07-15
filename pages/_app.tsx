import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import { light } from "@/scss/MaterialTheme";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import client from "@/apollo/client";
import { useState } from "react";
import Head from "next/head";
import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const [theme, setTheme] = useState(createTheme(light));

  // Socket.io, Redux, MUI ...
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
