import { useState, useCallback } from "react";
import {
  DataResponse,
  TokenSessionReturn,
  UseNiubizReturn,
} from "../components/types";
import CustomTokenFormApp from "components/CustomForm/CustomTokenFormApp";
import Loader from "../components/Loader/Loader";
import { useScriptLoader } from "helper/loadScript";

const useNiubizTokenApp = (
  userEmail: string,
  purchasenumber: number,
  srcCustomScript: string,
  channelToken: string,
  amount: string,
  merchandId?: string | null,
  sessionKey?: string | null,
  showAliasCard?: boolean,
  showCheckSaveCard?: boolean,
  buttonText?: string,
  loader?: JSX.Element
): UseNiubizReturn => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const [tokenSession, setTokenSession] = useState<TokenSessionReturn | null>();

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
        const dataResponse = {
          success: false,
          code: "001",
          data: error
        }

        setFormResponse(dataResponse);
      }
    };

    loadResources();
  }, [srcCustomScript, loadScript]);


  const handleOnClose = () => {
    setShowForm(false);
    setTokenSession(null);
  };

  const FormComponent =
    showLoader ?
      loader ?? <Loader color="#fff" size={40} /> :
      showForm ?
        <CustomTokenFormApp
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
          showAliasCard={showAliasCard}
          showCheckSaveCard={showCheckSaveCard}
          buttonText={buttonText}
        /> :
        <></>;

  const loadCustomTag = async () => {
    setShowLoader(false);
    setShowForm(true);
  };

  return { FormComponent, triggerOpenForm, formResponse };
};

export default useNiubizTokenApp;
