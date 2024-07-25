import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { ReactNode, useEffect, useState } from "react";
import {
  AprimoValue,
  ContentFieldExtensionContext,
} from "./ContentFieldExtensionContext";

function WithContentFieldExtension({ children }: { children: ReactNode }) {
  const [sdk, setSDK] = useState<ContentFieldExtension<AprimoValue>>();
  const [initialAprimoValue, setInitialAprimoValue] = useState<AprimoValue>();
  const [aprimoValue, setAprimoValue] = useState<AprimoValue>();
  const [formValue, setFormValue] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  const [params, setParams] = useState({});

  useEffect(() => {
    const setupSdk = async () => {
      const sdk = await init<ContentFieldExtension<AprimoValue>>();
      const initialValue = (await sdk.field.getValue()) as AprimoValue;
      setInitialAprimoValue(initialValue);
      setAprimoValue(initialValue);
      setParams({
        ...sdk.params.installation,
        ...sdk.params.instance,
      });
      sdk.frame.startAutoResizer();
      sdk.form.onReadOnlyChange(setReadOnly);
      sdk.form.onFormValueChange(setFormValue);
      setSDK(sdk);
    };

    setupSdk();

    return () => {};
  }, []);

  const setAprimoImage = async (aprimoImage: AprimoValue) => {
    await sdk?.field.setValue(aprimoImage);
    const updatedAprimoValue = await sdk?.field.getValue();
    setAprimoValue(updatedAprimoValue);
  };

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider
        value={{
          sdk,
          readOnly,
          params,
          formValue,
          initialAprimoValue,
          aprimoValue,
          setAprimoImage,
        }}
      >
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
}

export default WithContentFieldExtension;
