export const fetcher = async (
    url: string,
    options: any,
    params: any,
    authorization: string
): Promise<any> => {
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error("Error in fetcher:", error);
        throw error; 
    }
};
