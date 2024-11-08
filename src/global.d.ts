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
                channel: 'paycard',
                merchantid: string,
                purchasenumber: string,
                amount: "1.00",
                callbackurl: string,
                language: "es",
                font: "https://fonts.googleapis.com/css?family=Montserrat:400&display=swap"
            }
        ) => void,
        createElement: (type: string, configuration: any, tag: string) => Promise<void>,
    }
}