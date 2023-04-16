import { type AppType } from "next/dist/shared/lib/utils";
import "~/styles/globals.css";

import { withPRPC, createPrpcQueryClient } from "@prpc/react";

export const queryClient = createPrpcQueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withPRPC(queryClient, MyApp);
