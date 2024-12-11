import React, { useEffect, useMemo } from 'react'
import { MerchantDefineData } from 'components/types';
import useNiubizPayment from 'hooks/useNiubizPayment';

const PaymentPage = () => {
    const [sessionKey, setsessionKey] = React.useState<string | null>(null);
    const [token, setToken] = React.useState<string | null>(null);
    const [merchantId, setMerchantId] = React.useState<string | null>(null);

    const amount = "199.9";

    const MDD: MerchantDefineData = useMemo(() => ({
        MDD4: 'mail@mail.com',
        MDD32: '12345789',
        MDD75: 'Registrado',
        MDD77: '0',
    }), []);

    const generateToken = async (e: React.FormEvent) => {
        e.preventDefault();

        
        const bodyData = {
            Channel: "web",
            Amount: amount,
            Currency: "PEN",
        };

        try {
            const response = await fetch("https://6s5x6zwwg3.execute-api.us-east-1.amazonaws.com/dev/api.payments/v1/payment/tokenize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data: {
                data: {
                    sessionKey: string;
                    expirationTime: number;
                    authorization: string;
                    merchantId: string;
                };
                isSuccess: boolean;
                message: string;
            } = await response.json();

            console.log("Response data:", data);

            if (data.isSuccess) {
                console.log("Session Key:", data.data.sessionKey);
                console.log("Authorization Token:", data.data.authorization);
                console.log("Expiration Time:", new Date(data.data.expirationTime));

                setToken(data.data.authorization);
                setsessionKey(data.data.sessionKey);
                setMerchantId(data.data.merchantId);
                
                await triggerResetForm();
            } else {
                console.error("Request failed with message:", data.message);
            }
        } catch (error) {
            console.error("Request failed:", (error as Error).message);
        }
    };

    const { FormComponent, triggerSendForm, formResponse, triggerResetForm } = useNiubizPayment(
        "userniubiz@mail.com",
        // "aW50ZWdyYWNpb25lcy52aXNhbmV0QG5lY29tcGx1cy5jb206ZDVlN25rJE0=",
        // "Z2lhbmNhZ2FsbGFyZG9AZ21haWwuY29tOkF2MyR0cnV6",
        // "341198210",
        Math.floor(Math.random() * 120000) + 1,
        "https://apisandbox.vnforappstest.com",
        "/api.security/v1/security",
        "/api.ecommerce/v2/ecommerce/token/session",
        "/api.ecommerce/v2/ecommerce/token/card",
        "https://pocpaymentserve.s3.amazonaws.com/payform.min.js",
        "https://pocpaymentserve.s3.amazonaws.com/payform.min.css",
        MDD,
        "web",
        "web",
        amount,
        "Z2lhbmNhZ2FsbGFyZG9AZ21haWwuY29tOkF2MyR0cnV6",
        // null,
        merchantId ?? "110777209",
        token,
        sessionKey
    );

    useEffect(() => {
        console.log('Respuesta del formulario 😁', formResponse);

    }, [formResponse])

    return (
        <div>

            <div>
                <header>Payment</header>
                <button onClick={generateToken}>Generar Token y Session</button>
                <div>TOKEN: {token}</div>
                <div>SESSION: {sessionKey}</div>
            </div>
            <div>
                <title>Form Section</title>
                {FormComponent}
                <button onClick={triggerSendForm}>Send Form</button>
            </div>
        </div >
    )
}
export default PaymentPage
