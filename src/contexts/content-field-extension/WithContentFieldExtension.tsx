import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { ReactNode, useEffect, useState } from "react";
import { ContentFieldExtensionContext } from "./ContentFieldExtensionContext";

function WithContentFieldExtension({ children }: { children: ReactNode }) {
  const [sdk, setSDK] = useState<ContentFieldExtension>();
  const [initialValue, setInitialValue] = useState<unknown>();
  const [formValue, setFormValue] = useState({});
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const setupSdk = async () => {
      const sdk = await init<ContentFieldExtension>();
      const initialValue = await sdk.field.getValue();
      setInitialValue(initialValue);
      setSDK(sdk);
      sdk.frame.startAutoResizer();
      sdk.form.onReadOnlyChange(setReadOnly);
      sdk.form.onFormValueChange(setFormValue);
    };

    setupSdk();

    return () => {};
  }, []);

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider
        value={{
          sdk,
          initialValue,
          readOnly,
          formValue,
        }}
      >
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
}

export default WithContentFieldExtension;
