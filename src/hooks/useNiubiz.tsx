import { useState, useCallback, useEffect, useMemo } from "react";
import {
  MerchantDefineData,
  SessionRequest,
  TokenSessionReturn,
  UseNiubizReturn,
} from "../components/types";
import CustomForm from "../components/CustomForm/CustomForm";
import GetNiubizToken from "../helper/GetNiubizToken";
import GetNiubizTokenSession from "../helper/GetNiubizTokenSession";
import Loader from "../components/Loader/Loader";


const useNiubiz = (
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
  credentialEncoded?: string | null,
  merchandId?: string | null,
  token?: string | null,
  sessionKey?: string | null
): UseNiubizReturn => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);

  const [tokenSecurity, setTokenSecurity] = useState<string | null>();
  const [tokenSession, setTokenSession] = useState<TokenSessionReturn | null>();

  const memoizedMDD = useMemo(() => MDD, [MDD]);

  const loadScript = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error loading script: ${src}`));
      document.body.appendChild(script);
    });
  };

  const unloadScript = useCallback(() => {
    const scriptExists = document.querySelector(`script[src="${srcCustomScript}"]`);
    if (scriptExists) {
      // document.body.removeChild(scriptExists);
    }
    setScriptsLoaded(false);
  }, [srcCustomScript]);

  const triggerOpenForm = useCallback(() => {
    setShowLoader(true);
    const loadResources = async () => {
      try {
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

    if (token && token !== ''){
      setShowLoader(false);
      setShowForm(true);
    }

    const handleGetTokenSecurity = async () => {
      if ((token && token !== '') || !credentialEncoded) return;

      const url = `${baseUrl}${tokenService}`;

      const response = await GetNiubizToken(url, credentialEncoded);

      setTokenSecurity(response.tokenSecurity);

    };

    handleGetTokenSecurity();

  }, [scriptsLoaded, baseUrl, tokenService, credentialEncoded]);

  useEffect(() => {
    if (tokenSecurity) {
      const handleGetTokenSession = async () => {
        if (sessionKey && sessionKey !== '') return;

        const url = `${baseUrl}${sessionService}/${merchandId}`;

        let requestParams: SessionRequest = {
          amount: 1,
          antifraud: {
            merchantDefineData: memoizedMDD,
          },
          channel: channelSession,
        };

        const response = await GetNiubizTokenSession(url, tokenSecurity, requestParams);

        setTokenSession(response);

        setShowLoader(false);
      };

      handleGetTokenSession();
    }
  }, [tokenSecurity, baseUrl, sessionService, merchandId, memoizedMDD, channelSession]);

  useEffect(() => {
    if (tokenSession && tokenSecurity) {
      setShowForm(true);
    }
  }, [tokenSession, tokenSecurity]);

  const handleOnClose = () => {
    setShowForm(false);
    unloadScript();
    setTokenSession(null);
    setTokenSecurity(null);
  };

  const FormComponent =
    showLoader ?
      <Loader color="#fff" size={40} /> :
      showForm ?
        <CustomForm
          showForm={showForm}
          srcCss={srcCustomCss}
          tokenSession={sessionKey ?? tokenSession?.sessionKey}
          merchandId={merchandId ?? ""}
          purchasenumber={purchasenumber}
          onClose={handleOnClose}
          userEmail={userEmail}
          channelToken={channelToken}
          tokenizerService={tokenizerService}
          tokenSecurity={token ?? tokenSecurity}
          baseUrl={baseUrl}
        /> :
        <></>;

  const loadCustomTag = async () => {
    console.log('Librerias listas para usar');
  };

  return { FormComponent, triggerOpenForm };
};

export default useNiubiz;
