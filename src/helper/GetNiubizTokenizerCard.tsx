import { messageCode } from "components/messages";
import { DataResponse } from "../components/types";
import { fetcher } from "./fetcher";

const GetNiubizTokenizerCard = async (
    url: string,
    authorization: string,
): Promise<DataResponse> => {
    const options = { method: "GET" };

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
                code: "003",
                data: response,
                message: messageCode["003"]
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

export default GetNiubizTokenizerCard;
