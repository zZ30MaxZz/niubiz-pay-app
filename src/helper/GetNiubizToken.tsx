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
                code: "002",
                data: response
            }

            return dataResponse
        }
    } catch (error) {
        const dataResponse = {
            success: false,
            code: "003",
            data: error
        }

        return dataResponse;
    }
};

export default GetNiubizToken;
