import { useState, useCallback, useEffect } from "react";
import {
  UseNiubizReturn,
} from "../components/types";
import CustomForm from "../components/CustomForm/CustomForm";

const useNiubiz = (
  credentialEncoded: string,
  baseUrl: string,
  tokenService: string,
  sessionService: string,
  srcScript: string,
  srcCss: string,
  MDD?: {}
): UseNiubizReturn => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);

  // Función para cargar un script
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
    // Cargar el CSS y el script
    const loadResources = async () => {
      try {
        await Promise.all([loadScript(srcScript)]);
        setScriptsLoaded(true); // Marcar los scripts como cargados
      } catch (error) {
        console.error(error);
      }
    };

    loadResources();
  }, [srcScript, srcCss]);

  const triggerOpenForm = useCallback(() => {
    if (!scriptsLoaded) {
      return;
    }

    setShowForm((prev) => !prev);
  }, [scriptsLoaded]);

  const handleOnClose = () => {
    setShowForm(false);
  };

  const FormComponent = (
    <CustomForm showForm={showForm} srcCss={srcCss} onClose={handleOnClose} />
  );

  return { FormComponent, triggerOpenForm };
};

export default useNiubiz;
