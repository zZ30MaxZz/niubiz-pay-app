import { useState, useCallback, useRef } from "react";
import {
  DataResponse,
  TokenSessionReturn,
  UseNiubizPayReturn,
} from "../components/types";
import CustomTokenPayFormApp from "components/CustomPayForm/CustomTokenPayFormApp";
import { useScriptLoader } from "helper/loadScript";

const useNiubizTokenPayApp = (
  userEmail: string,
  purchasenumber: number,
  srcCustomScript: string,
  channelToken: string,
  amount: string,
  merchandId?: string | null,
  sessionKey?: string | null,
  loader?: JSX.Element
): UseNiubizPayReturn => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const [tokenSession, setTokenSession] = useState<TokenSessionReturn | null>();

  const customPayRef = useRef<{ resetForm: () => void, handleTransactionToken: () => void }>(null);
  const [formResponse, setFormResponse] = useState<DataResponse>({
    success: false,
    code: "000",
    data: null
  });

  const { loadScript } = useScriptLoader();

  const triggerOpenForm = useCallback(() => {
    setShowLoader(true);
    const loadResources = async () => {
      try {
        await Promise.all([loadScript(srcCustomScript)]);

        loadCustomTag();
      } catch (error) {
        console.error(error);
      }
    };

    loadResources();
  }, [srcCustomScript, loadScript]);

  const handleOnClose = () => {
    setShowForm(false);
    setTokenSession(null);
  };

  const FormComponent =
    !showLoader && showForm ?
      <CustomTokenPayFormApp
        ref={customPayRef}
        setFormResponse={setFormResponse}
        showForm={showForm}
        tokenSession={sessionKey ?? tokenSession?.sessionKey}
        merchandId={merchandId ?? ""}
        purchasenumber={purchasenumber}
        onClose={handleOnClose}
        userEmail={userEmail}
        channelToken={channelToken}
        amount={amount}
        loader={loader}
      /> :
      <></>;

  const loadCustomTag = async () => {
    setShowLoader(false);
    setShowForm(true);
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

export default useNiubizTokenPayApp;
