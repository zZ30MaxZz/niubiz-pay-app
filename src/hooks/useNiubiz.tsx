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


const useNiubiz = (
  userEmail: string,
  credentialEncoded: string,
  merchandId: string,
  purchasenumber: number,
  baseUrl: string,
  tokenService: string,
  sessionService: string,
  srcCustomScript: string,
  srcCustomCss: string,
  MDD: MerchantDefineData,
  channelSession: string,
  channelToken: string
): UseNiubizReturn => {
  const [showForm, setShowForm] = useState<boolean>(false);
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

  useEffect(() => {
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

  const triggerOpenForm = useCallback(() => {
    if (!scriptsLoaded) {
      return;
    }

    const handleGetTokenSecurity = async () => {
      const url = `${baseUrl}${tokenService}`;

      const response = await GetNiubizToken(url, credentialEncoded);

      setTokenSecurity(response.tokenSecurity);
    };

    handleGetTokenSecurity();
  }, [scriptsLoaded, baseUrl, tokenService, credentialEncoded]);

  useEffect(() => {
    if (tokenSecurity) {
      const handleGetTokenSession = async () => {
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
      };

      handleGetTokenSession();
    }
  }, [tokenSecurity, baseUrl, sessionService, merchandId, memoizedMDD]);

  useEffect(() => {
    if (tokenSession) {
      setShowForm(true);
    }
  }, [tokenSession, tokenSecurity]);

  const handleOnClose = () => {
    setShowForm(false);
  };

  const FormComponent = scriptsLoaded ? (
    <CustomForm
      showForm={showForm}
      srcCss={srcCustomCss}
      tokenSession={tokenSession?.sessionKey}
      merchandId={merchandId}
      purchasenumber={purchasenumber}
      onClose={handleOnClose}
      userEmail={userEmail}
      channelToken={channelToken}
    />
  ) : (
    <div>Cargando...</div>
  );

  const loadCustomTag = async () => {
    console.log('Librerias listas para usar');
  };

  return { FormComponent, triggerOpenForm };
};

export default useNiubiz;
