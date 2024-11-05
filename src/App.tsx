import React from 'react';
import './App.css';
import useNotification from './hooks/useNotification';
import useNiubiz from './hooks/useNiubiz';

function App() {

  const { NotificationComponent, triggerNotification } = useNotification("bottom-left");
  const { FormComponent, triggerOpenForm } = useNiubiz(
    "aW50ZWdyYWNpb25lcy52aXNhbmV0QG5lY29tcGx1cy5jb206ZDVlN25rJE0=",
    "https://apitestenv.vnforapps.com",
    "/api.security/v1/security",
    "/api.ecommerce/v2/ecommerce/token/session",
    "https://pocpaymentserve.s3.amazonaws.com/payform.min.js",
    "https://pocpaymentserve.s3.amazonaws.com/payform.min.css",
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
