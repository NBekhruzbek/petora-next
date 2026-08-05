import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ApolloProvider } from "@apollo/client";
import { light } from "@/scss/MaterialTheme";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import { useApollo } from "@/apollo/client";
import { getJwtToken, updateUserInfo } from "@/libs/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { I18nextProvider } from "react-i18next";
import { getI18n } from "@/libs/i18n";
import { hydrateColorScheme } from "@/libs/theme";
import Head from "next/head";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "../scss/app.scss";
import "../scss/pc/main.scss";
import "../scss/mobile/main.scss";

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const [theme, setTheme] = useState(createTheme(light));
  const client = useApollo(pageProps.initialApolloState);
  const router = useRouter();

  // Pure lookup — swapping the provider's instance is what changes language,
  // so nothing mutates shared state during render.
  const i18n = getI18n(router.locale);

  useEffect(() => {
    updateUserInfo(getJwtToken());
    hydrateColorScheme();
  }, []);

  // Socket.io, Redux, MUI ...
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </I18nextProvider>
      </ApolloProvider>
    </GoogleOAuthProvider>
  );
}
