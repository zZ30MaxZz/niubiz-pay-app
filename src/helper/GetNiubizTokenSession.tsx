import { messageCode } from "components/messages";
import { DataResponse } from "../components/types";
import { fetcher } from "./fetcher";

const GetNiubizTokenSession = async (
    url: string,
    authorization: string,
    params: any
): Promise<DataResponse> => {
    const options = { method: "POST" };

    try {
        const response = await fetcher(url, options, params, authorization);

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
                data: response,
                message: messageCode["002"]
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

export default GetNiubizTokenSession;
