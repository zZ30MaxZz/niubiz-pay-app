import { useCallback } from "react";

export function useScriptLoader() {
    const loadScript = useCallback((src: string): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Error loading script: ${src}`));
            document.body.appendChild(script);
        });
    }, []);

    return { loadScript };
}
