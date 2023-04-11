import { type NextApiResponse, type NextApiRequest } from "next";
import { handleRequest } from "thaler/server";
import { nextApiRequestToNodeRequest } from "@prpc/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await handleRequest(nextApiRequestToNodeRequest(req));
  if (result) {
    const asJson = await result.clone().json();
    if (asJson instanceof Response) {
      console.log("here");
    }
    return res.status(result.status).send(await result.text());
  }
  return res.status(404).send({
    error: "Not found",
  });
}
