interface Window {
    VisanetCheckout: {
        configure: (config: {
            action: string,
            sessiontoken: string,
            channel: string,
            merchantid: string,
            purchasenumber: string,
            amount: string,
            cardholdername: string,
            cardholderlastname: string,
            cardholderemail: string,
            usertoken: string,
            expirationminutes: '20',
            timeouturl: string,
            merchantlogo: string,
            merchantname: string,
            formbuttoncolor: string,
            formbuttontext: string,
            showamount: string,
            complete: (params: any) => void
        }) => void,

        open: () => void,
    },
    payform:
    {
        setConfiguration: (
            configuration: {
                sessionkey: string,
                channel: string,
                merchantid: string,
                purchasenumber: number,
                amount: string,
                callbackurl: string,
                language: "es",
                font: string
            }
        ) => void,
        createElement: (type: string, configuration: any, tag: string) => Promise<any>,
        resetData: ([createElement]) => void;
        createToken: (params: any, data:
            {
                name: string,
                lastName: string,
                email: string,
                alias: string,
                userBlockId: string,
                currencyConversion: boolean,

            }) => Promise<any>
    }
}