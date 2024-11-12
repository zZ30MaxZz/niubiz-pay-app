import { TokenSessionReturn } from "../components/types";
import { fetcher } from "./fetcher";

const GetNiubizTokenizerCard = async (
    url: string,
    authorization: string,
): Promise<TokenSessionReturn> => {
    let tokenSession: TokenSessionReturn;

    const options = { method: "GET" };

    try {
        const response = await fetcher(url, options, null, authorization);

        tokenSession = response;

        return tokenSession;

    } catch (error) {
        console.error("Error fetching Niubiz token:", error);
        return tokenSession = { sessionKey: "", expirationTime: 0 };
    }
};

export default GetNiubizTokenizerCard;
