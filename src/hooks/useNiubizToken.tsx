import { useCallback } from "react";
import { UseTokenReturn } from "../components/types";
import { fetcher } from "../helper/fetcher";

const useNiubizToken = (
    url: string,
    credentialEncoded: string,
): UseTokenReturn => {

    const triggerToken = useCallback(async () => {
        const authorization = "Basic " + credentialEncoded;
        const options = { method: "GET" };

        try {
            const response = await fetcher(url, options, null, authorization);
            
            return typeof response === "string" ? response : '';
        } catch (error) {
            return '';
        }
    }, [credentialEncoded, url]);

    return { triggerToken };
};

export default useNiubizToken;
