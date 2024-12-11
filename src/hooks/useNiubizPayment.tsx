import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  MerchantDefineData,
  SessionRequest,
  TokenSessionReturn,
  UseNiubizPayReturn
} from "../components/types";
import GetNiubizToken from "../helper/GetNiubizToken";
import GetNiubizTokenSession from "../helper/GetNiubizTokenSession";
import CustomPayForm from "components/CustomPayForm/CustomPayForm";


const useNiubizPayment = (
  userEmail: string,
  purchasenumber: number,
  baseUrl: string,
  tokenService: string,
  sessionService: string,
  tokenizerService: string,
  srcCustomScript: string,
  srcCustomCss: string,
  MDD: MerchantDefineData,
  channelSession: string,
  channelToken: string,
  amount: string,
  credentialEncoded?: string | null,
  merchandId?: string | null,
  token?: string | null,
  sessionKey?: string | null
): UseNiubizPayReturn => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showBlocked, setShowBlocked] = useState<boolean>(false);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);

  const [tokenSecurity, setTokenSecurity] = useState<string | null>();
  const [tokenSession, setTokenSession] = useState<TokenSessionReturn | null>();

  const memoizedMDD = useMemo(() => MDD, [MDD]);

  const customPayRef = useRef<{ resetForm: () => void, handleTransactionToken: () => void }>(null);
  const [formResponse, setFormResponse] = useState();

  const loadScript = (src: string) => {
    console.log('Cargando script', src);
    return new Promise<void>((resolve, reject) => {
      const scriptExists = document.querySelector(`script[src="${srcCustomScript}"]`);
      if (scriptExists) {
        console.log('Script ya cargado');
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error loading script: ${src}`));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    setShowBlocked(true);
    const loadResources = async () => {
      try {
        if (scriptsLoaded) return;

        await Promise.all([loadScript(srcCustomScript)]);
        setScriptsLoaded(true);

        loadCustomTag();
      } catch (error) {
        console.error(error);
      }
    };

    loadResources();
  }, [srcCustomScript]);

  useEffect(() => {
    if (!scriptsLoaded) {
      return;
    }

    if (token && token !== '') {
      setShowBlocked(false);
      setShowForm(true);
    }

    const handleGetTokenSecurity = async () => {
      if ((token && token !== '') || !credentialEncoded) return;

      const url = `${baseUrl}${tokenService}`;

      const response = await GetNiubizToken(url, credentialEncoded);

      setTokenSecurity(response.tokenSecurity);

    };

    handleGetTokenSecurity();

  }, [scriptsLoaded, baseUrl, tokenService, credentialEncoded, token]);

  useEffect(() => {
    if (tokenSecurity) {
      const handleGetTokenSession = async () => {
        if (sessionKey && sessionKey !== '') return;

        const url = `${baseUrl}${sessionService}/${merchandId}`;

        let requestParams: SessionRequest = {
          amount: amount,
          antifraud: {
            merchantDefineData: memoizedMDD,
          },
          channel: channelSession,
        };

        const response = await GetNiubizTokenSession(url, tokenSecurity, requestParams);

        setTokenSession(response);

        setShowBlocked(false);
      };

      handleGetTokenSession();
    }
  }, [tokenSecurity, baseUrl, sessionService, merchandId, memoizedMDD, channelSession, amount, sessionKey]);

  useEffect(() => {
    if (tokenSession && tokenSecurity) {
      setShowForm(true);
    }
  }, [tokenSession, tokenSecurity]);

  useEffect(() => {
    if (token && sessionKey){
      setShowForm(true);
      setScriptsLoaded(true);
    }

  }, [token, sessionKey])

  const FormComponent =
    <CustomPayForm
      ref={customPayRef}
      setFormResponse={setFormResponse}
      showForm={showForm}
      showBlocked={showBlocked}
      srcCss={srcCustomCss}
      tokenSession={sessionKey ?? tokenSession?.sessionKey}
      merchandId={merchandId ?? ""}
      purchasenumber={purchasenumber}
      userEmail={userEmail}
      channelToken={channelToken}
      tokenizerService={tokenizerService}
      tokenSecurity={token ?? tokenSecurity}
      amount={amount}
      baseUrl={baseUrl}
    />;

  const loadCustomTag = async () => {
    console.log('Librerias listas para usar');
  };

  const triggerSendForm = useCallback(() => {
    console.log('triggerSendForm');

    if (customPayRef.current) {
      customPayRef.current.handleTransactionToken();
    }
  }, [customPayRef]);

  // Reset Form
  const triggerResetForm = async () => {
    setShowForm(false);
    setTokenSession(null);
    setTokenSecurity(null);
    setScriptsLoaded(false);
  };

  return { FormComponent, triggerSendForm, formResponse, triggerResetForm };
};

export default useNiubizPayment;
