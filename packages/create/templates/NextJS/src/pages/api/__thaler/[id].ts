import { type NextApiResponse, type NextApiRequest } from "next";
import { handleRequest } from "thaler/server";
import { nextApiRequestToNodeRequest } from "@prpc/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await handleRequest(nextApiRequestToNodeRequest(req));
  if (result) {
    if (result instanceof Response) {
      result.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
    }
    return res
      .status(result instanceof Response ? result.status : 200)
      .send(result instanceof Response ? await result.text() : result);
  }
  return res.status(404).send({
    error: "Not found",
  });
}
