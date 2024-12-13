import { messageCode } from "components/messages";
import { DataResponse } from "../components/types";
import { fetcher } from "./fetcher";

const PostNiubizAuthorize = async (
  url: string,
  authorization: string,
  params: any
): Promise<DataResponse> => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };

  try {
    const response = await fetcher(url, options, null, authorization);

    if (response.success) {
      const dataResponse = {
        success: true,
        code: "000",
        data: response.data
      }

      return dataResponse;
    }
    else {
      const dataResponse = {
        success: false,
        code: "002",
        data: response
      }

      return dataResponse
    }

  } catch (error) {
    const dataResponse = {
      success: false,
      code: "005",
      data: error,
      message: messageCode["005"],
      url: url
    }

    return dataResponse;
  }
};

export default PostNiubizAuthorize;