import Loader from 'components/Loader/Loader';
import { usePaymentSessionToken } from 'helper/generateTokenSession';
import { CHANEL_WEB } from 'helper/variables';
import useNiubizTokenPay from 'hooks/useNiubizTokenPay';
import React, { useEffect } from 'react'
import { MoonLoader } from 'react-spinners';

const OnlyTokenPayPage = () => {
    const amount = "199.9";
    const email = "test@mail.com";
    const storeId = "321";
    const purchasenumber = Math.floor(Math.random() * 120000) + 1;

    const {
        sessionKey,
        authorization,
        merchantId,
        loading,
        error,
        fetchToken,
    } = usePaymentSessionToken(CHANEL_WEB, email, amount, storeId);

    const generateToken = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetchToken();
    };

    const { FormComponent, triggerOpenForm, triggerSendForm, formResponse, triggerResetForm } = useNiubizTokenPay(
        email,
        purchasenumber,
        "https://pocpaymentserve.s3.amazonaws.com/payform.min.js",
        CHANEL_WEB,
        amount,
        merchantId,
        sessionKey,
        <Loader loader={MoonLoader} color='white' />
    );

    useEffect(() => {
        if (!loading && !error && sessionKey && authorization && merchantId) {
            console.log('Token generado: ', sessionKey, authorization, merchantId);
            triggerOpenForm()
        }

    }, [loading, error, sessionKey, authorization, merchantId, triggerOpenForm]);

    useEffect(() => {
        console.log('Respuesta del formulario PAY 😁', formResponse);

    }, [formResponse])

    return (
        <div>
            <div>
                <div>
                    <strong>Pay page</strong>
                </div>
                <button onClick={generateToken}>Generar Token y Session</button>
                <div>TOKEN: {authorization}</div>
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
export default OnlyTokenPayPage
