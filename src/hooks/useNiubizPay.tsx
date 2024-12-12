import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  DataResponse,
  MerchantDefineData,
  SessionRequest,
  TokenSessionReturn,
  UseNiubizPayReturn,
} from "../components/types";
import CustomForm from "../components/CustomForm/CustomForm";
import GetNiubizToken from "../helper/GetNiubizToken";
import GetNiubizTokenSession from "../helper/GetNiubizTokenSession";
import Loader from "../components/Loader/Loader";
import CustomPayForm from "components/CustomPayForm/CustomPayForm";


const useNiubizPay = (
  userEmail: string,
  documentType: string,
  documentUser: string,
  purchasenumber: number,
  baseUrl: string,
  tokenService: string,
  sessionService: string,
  authorizationService: string,
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
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);

  const [tokenSecurity, setTokenSecurity] = useState<string | null>();
  const [tokenSession, setTokenSession] = useState<TokenSessionReturn | null>();

  const memoizedMDD = useMemo(() => MDD, [MDD]);

  const customPayRef = useRef<{ resetForm: () => void, handleTransactionToken: () => void }>(null);
  const [formResponse, setFormResponse] = useState<DataResponse>({
    success: false,
    code: "000",
    data: null
  });

  const loadScript = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error loading script: ${src}`));
      document.body.appendChild(script);
    });
  };

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

    if (token && token !== '') {
      setShowLoader(false);
      setShowForm(true);
    }

    const handleGetTokenSecurity = async () => {
      if ((token && token !== '') || !credentialEncoded) return;

      const url = `${baseUrl}${tokenService}`;

      const response = await GetNiubizToken(url, credentialEncoded);

      if (response.success) {
        setTokenSecurity(response.data);
      }
      else {
        setFormResponse(response);
      }
    };

    handleGetTokenSecurity();

  }, [scriptsLoaded, baseUrl, tokenService, credentialEncoded]);

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

        if (response.success) {
          setTokenSession(response.data);
        }
        else {
          setFormResponse(response);
        }

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
    setScriptsLoaded(false);
    setTokenSession(null);
    setTokenSecurity(null);
  };

  const FormComponent =
    !showLoader && showForm ?
      <CustomPayForm
        documentType={documentType}
        documentUser={documentUser}
        ref={customPayRef}
        setFormResponse={setFormResponse}
        showForm={showForm}
        showBlocked={showForm}
        srcCss={srcCustomCss}
        tokenSession={sessionKey ?? tokenSession?.sessionKey}
        merchandId={merchandId ?? ""}
        purchasenumber={purchasenumber}
        onClose={handleOnClose}
        userEmail={userEmail}
        channelToken={channelToken}
        authorizationService={authorizationService}
        tokenSecurity={token ?? tokenSecurity}
        amount={amount}
        baseUrl={baseUrl}
      /> :
      <></>;

  const loadCustomTag = async () => {
    console.log('Librerias listas para usar');
  };

  const triggerSendForm = useCallback(() => {
    if (customPayRef.current) {
      customPayRef.current.handleTransactionToken();
    }
  }, [customPayRef]);

  const triggerResetForm = async () => {
    handleOnClose();
  };

  return { FormComponent, triggerOpenForm, triggerSendForm, formResponse, triggerResetForm };

};

export default useNiubizPay;
