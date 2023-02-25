import { QueryClient, QueryClientProvider } from "@adeora/solid-query";
import type { ParentComponent } from "solid-js";

export const QueryProvider: ParentComponent = (props) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};
