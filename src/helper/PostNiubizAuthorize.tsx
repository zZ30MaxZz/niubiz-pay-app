import { TokenSessionReturn } from "../components/types";
import { fetcher } from "./fetcher";

const PostNiubizAuthorize = async (
  url: string,
  authorization: string,
  params: any
): Promise<TokenSessionReturn> => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };

  try {
    const response = await fetcher(url, options, null, authorization);
    return response as TokenSessionReturn;
  } catch (error) {
    console.error("Error post Niubiz token:", error);
    return { sessionKey: "", expirationTime: 0 };
  }
};

export default PostNiubizAuthorize;