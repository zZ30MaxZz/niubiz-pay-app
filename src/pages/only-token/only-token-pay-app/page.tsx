import Loader from 'components/Loader/Loader';
import { MerchantDefineData } from 'components/types';
import useNiubizTokenPayApp from 'hooks/useNiubizTokenPayApp';
import React, { useEffect, useMemo } from 'react'
import { MoonLoader } from 'react-spinners';

const OnlyTokenPayAppPage = () => {
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

            if (data.isSuccess) {
                setToken(data.data.authorization);
                setsessionKey(data.data.sessionKey);
                setMerchantId(data.data.merchantId);
            } else {
                console.error("Request failed with message:", data.message);
            }
        } catch (error) {
            console.error("Request failed:", (error as Error).message);
        }
    };

    const { FormComponent, triggerOpenForm, triggerSendForm, formResponse, triggerResetForm } = useNiubizTokenPayApp(
        "userniubiz@mail.com",
        "0",
        "44554444",
        Math.floor(Math.random() * 120000) + 1,
        "https://apisandbox.vnforappstest.com",
        "/api.security/v1/security",
        "/api.ecommerce/v2/ecommerce/token/session",
        "https://pocpaymentserve.s3.amazonaws.com/payform.min.js",
        "https://pocpaymentserve.s3.amazonaws.com/payform.min.css",
        MDD,
        "web",
        "web",
        amount,
        "Z2lhbmNhZ2FsbGFyZG9AZ21haWwuY29tOkF2MyR0cnV6",
        merchantId ?? "110777209",
        token,
        sessionKey,
        <Loader loader={MoonLoader} color='white' />
    );

    useEffect(() => {
        console.log('Respuesta del formulario PAY APP 😁', formResponse);

    }, [formResponse])

    return (
        <div>
            <div>
                <div>
                    <strong>Pay page</strong>
                </div>
                <button onClick={generateToken}>Generar Token y Session</button>
                <div>TOKEN: {token}</div>
                <div>SESSION: {sessionKey}</div>
                <div>Form</div>
                {FormComponent}
            </div>
            <button onClick={triggerOpenForm}>Open Form</button>
            <button onClick={triggerResetForm}>Reset Form</button>
            <button onClick={triggerSendForm}>Send Form</button>
        </div >
    )
}
export default OnlyTokenPayAppPage
