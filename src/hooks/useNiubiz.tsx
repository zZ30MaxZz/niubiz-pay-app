import { useState, useCallback, useEffect } from "react";
import {
  UseNiubizReturn,
} from "../components/types";
import CustomForm from "../components/CustomForm/CustomForm";
import useNiubizToken from "./useNiubizToken";
import { fetcher } from "../helper/fetcher";
import GetNiubizToken from "./useNiubizToken";

const useNiubiz = (
  credentialEncoded: string,
  baseUrl: string,
  tokenService: string,
  sessionService: string,
  srcCustomScript: string,
  srcCustomCss: string,
  MDD?: {}
): UseNiubizReturn => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);

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
  }, [srcCustomScript, srcCustomCss]);

  const triggerOpenForm = useCallback(() => {
    if (!scriptsLoaded) {
      return;
    }

    const handleGetTokenSecurity = async () => {
      const url = `${baseUrl}${tokenService}`;

      const response = await GetNiubizToken(url, credentialEncoded);

      setShowForm(true);
      console.log(response.tokenSecurity);
    }

    handleGetTokenSecurity();

  }, [scriptsLoaded, baseUrl, tokenService, credentialEncoded]);

  const handleOnClose = () => {
    setShowForm(false);
  };

  const FormComponent = scriptsLoaded ? (
    <CustomForm showForm={showForm} srcCss={srcCustomCss} onClose={handleOnClose} />
  ) : (
    <div>Cargando...</div>
  );

  const loadCustomTag = async () => {
    console.log('Librerias listas para usar');
  };

  return { FormComponent, triggerOpenForm };
};

export default useNiubiz;
