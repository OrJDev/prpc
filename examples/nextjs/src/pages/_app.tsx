import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";

import { withPRPC } from "@prpc/react";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withPRPC(queryClient, MyApp);
