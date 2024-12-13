import { messageCode } from "components/messages";
import { DataResponse } from "../components/types";
import { fetcher } from "./fetcher";

const GetNiubizToken = async (
    url: string,
    credentialEncoded: string
): Promise<DataResponse> => {
    let tokenSecurity = '';
    const authorization = "Basic " + credentialEncoded;
    const options = { method: "POST" };

    try {
        const response = await fetcher(url, options, null, authorization);

        if (response.success) {
            tokenSecurity = typeof response.data === "string" ? response.data : '';

            const dataResponse = {
                success: true,
                code: "000",
                data: tokenSecurity
            }

            return dataResponse;
        }
        else {
            const dataResponse = {
                success: false,
                code: "001",
                data: response,
                message: messageCode["001"]
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

export default GetNiubizToken;
