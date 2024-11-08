import { TokenReturn } from "../components/types";
import { fetcher } from "./fetcher";

const GetNiubizToken = async (
    url: string,
    credentialEncoded: string
): Promise<TokenReturn> => {
    let tokenSecurity = '';
    const authorization = "Basic " + credentialEncoded;
    const options = { method: "POST" };

    try {
        const response = await fetcher(url, options, null, authorization);

        tokenSecurity = typeof response === "string" ? response : '';

        return { tokenSecurity };
    } catch (error) {
        console.error("Error fetching Niubiz token:", error);
        return { tokenSecurity };
    }
};

export default GetNiubizToken;
