import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";

import { QueryProvider } from "@prpc/react";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryProvider queryClient={queryClient}>
      <Component {...pageProps} />
    </QueryProvider>
  );
};

export default MyApp;
