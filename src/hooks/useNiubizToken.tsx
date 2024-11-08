import { UseTokenReturn } from "../components/types";
import { fetcher } from "../helper/fetcher";

const GetNiubizToken = async (
    url: string,
    credentialEncoded: string
): Promise<UseTokenReturn> => {
    let tokenSecurity = '';
    const authorization = "Basic " + credentialEncoded;
    const options = { method: "POST" };

    try {
        const response = await fetcher(url, options, null, authorization);

        tokenSecurity = typeof response === "string" ? response : '';
    } catch (error) {
        console.error("Error fetching Niubiz token:", error);
        return { tokenSecurity };
    }

    return { tokenSecurity };
};

export default GetNiubizToken;
