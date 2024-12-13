import { messageCode } from "components/messages";
import { DataResponse } from "components/types";

export const fetcher = async (
    url: string,
    options: any,
    params: any,
    authorization: string
): Promise<DataResponse> => {
    if (options.method === "GET" && params !== null) {
        url += "?" + new URLSearchParams(params).toString();
    } else if (options.method === "POST" && params !== null) {
        options.body = JSON.stringify(params);
    }

    const headers = {
        Authorization: authorization,
        ...(options.method === "POST" && { "Content-Type": "application/json" }),
    };

    try {
        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            throw await response.json();
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            const dataResponse = {
                success: true,
                code: "000",
                data: data
            }

            return dataResponse;
        } else {
            const data = await response.text();

            const dataResponse = {
                success: true,
                code: "000",
                data: data
            }

            return dataResponse;
        }
    } catch (error) {
        throw error;
    }
};
