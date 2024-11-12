import React, { useMemo } from 'react';
import './App.css';
import useNotification from './hooks/useNotification';
import useNiubiz from './hooks/useNiubiz';
import { MerchantDefineData } from './components/types';

function App() {
  const MDD: MerchantDefineData = useMemo(() => ({
    MDD4: 'mail@mail.com',
    MDD32: '12345789',
    MDD75: 'Registrado',
    MDD77: '0',
  }), []);

  const { NotificationComponent, triggerNotification } = useNotification("bottom-left");
  const { FormComponent, triggerOpenForm } = useNiubiz(
    "userniubiz@mail.com",
    // "aW50ZWdyYWNpb25lcy52aXNhbmV0QG5lY29tcGx1cy5jb206ZDVlN25rJE0=",
    "Z2lhbmNhZ2FsbGFyZG9AZ21haWwuY29tOkF2MyR0cnV6",
    // "400000042",
    "341198210",
    Math.floor(Math.random() * 120000) + 1,
    "https://apitestenv.vnforapps.com",
    "/api.security/v1/security",
    "/api.ecommerce/v2/ecommerce/token/session",
    "/api.ecommerce/v2/ecommerce/token/card",
    "https://pocpaymentserve.s3.amazonaws.com/payform.min.js",
    "https://pocpaymentserve.s3.amazonaws.com/payform.min.css",
    MDD,
    "web",
    "web"
  );

  return (
    <div className="App">
      <header className="App-header">
        {NotificationComponent}
        {FormComponent}
        <button onClick={() => triggerNotification({
          type: "success",
          message: "This is a success message!",
          duration: 3000,
          onClose: () => console.log("Success message closed")
        })}>Open Toast</button>

        <button onClick={triggerOpenForm}>Open Form</button>
      </header>
    </div >
  );
}

export default App;
