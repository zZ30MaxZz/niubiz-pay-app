export const fetcher = (
    url: string,
    options: any,
    params: any,
    authorization: string
) => {
    if (options.method === "GET" && params !== null) {
        url += "?" + new URLSearchParams(params).toString();
    } else if (options.method === "POST" && params !== null) {
        options.body = JSON.stringify(params);
    }

    if (options.method === "GET") {
        fetch(url, {
            headers: {
                Authorization: authorization,
            },
        })
            .then((response) => {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then((response) => {
                return response;
            });
    }

    if (options.method === "POST") {
        fetch(url, {
            method: "POST",
            body: options.body,
            headers: {
                Authorization: authorization,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then((response) => response);
    }
};