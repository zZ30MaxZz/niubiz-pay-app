import Loader from 'components/Loader/Loader';
import { usePaymentSessionToken } from 'helper/generateTokenSession';
import { CHANEL_PAYCARD } from 'helper/variables';
import useNiubizTokenApp from 'hooks/useNiubizTokenApp';
import React, { useEffect } from 'react'
import { MoonLoader } from 'react-spinners';

const OnlyTokenAppPage = () => {
  const amount = "1";
  const email = "test@mail.com";
  const customTxtBtn = "Tokenizar Btn";

  const {
    sessionKey,
    authorization,
    merchantId,
    loading,
    error,
    fetchToken,
  } = usePaymentSessionToken(CHANEL_PAYCARD, email);

  const generateToken = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetchToken();
  };

  const { FormComponent, triggerOpenForm, formResponse } = useNiubizTokenApp(
    "userniubiz@mail.com",
    Math.floor(Math.random() * 120000) + 1,
    "https://pocpaymentserve.s3.amazonaws.com/payform.min.js",
    "paycard",
    amount,
    merchantId ?? "110777209",
    sessionKey,
    false,
    true,
    customTxtBtn,
    <Loader loader={MoonLoader} color='white' />
  );

  useEffect(() => {
    if (!loading && !error && sessionKey && authorization && merchantId) {
      console.log('Token generado: ', sessionKey, authorization, merchantId);
      triggerOpenForm()
    }

  }, [loading, error, sessionKey, authorization, merchantId, triggerOpenForm]);


  useEffect(() => {
    console.log('Respuesta del formulario TOKENIZER APP 😁', formResponse);

  }, [formResponse])

  return (
    <div>
      <div>
        <button onClick={generateToken}>Generar Token y Session</button>
        <div>TOKEN: {authorization}</div>
        <div>SESSION: {sessionKey}</div>
      </div>
      <button onClick={triggerOpenForm}>Open Form</button>
      {FormComponent}
    </div >
  )
}
export default OnlyTokenAppPage
