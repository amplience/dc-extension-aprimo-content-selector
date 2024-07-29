import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { ReactNode, useEffect, useState } from "react";
import {
  AprimoValue,
  ContentFieldExtensionContext,
  Params,
} from "./ContentFieldExtensionContext";
import ContentHubService from "../../services/ContentHubService";
import { isEmpty } from "../../utils/isEmpty";

function WithContentFieldExtension({ children }: { children: ReactNode }) {
  const [sdk, setSDK] = useState<ContentFieldExtension<AprimoValue>>();
  const [initialAprimoValue, setInitialAprimoValue] = useState<AprimoValue>();
  const [aprimoValue, setAprimoValue] = useState<AprimoValue>();
  const [formValue, setFormValue] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  const [params, setParams] = useState<Params>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
      setTitle(sdk.field.schema?.title || "");
      setDescription(sdk.field.schema?.description || "");
      sdk.frame.startAutoResizer();
      sdk.form.onReadOnlyChange(setReadOnly);
      sdk.form.onFormValueChange(setFormValue);
      setSDK(sdk);
    };

    setupSdk();

    return () => {};
  }, []);

  const addAprimoImage = async (aprimoImage: AprimoValue) => {
    await sdk?.field.setValue(aprimoImage);
    const updatedAprimoValue = await sdk?.field.getValue();
    setAprimoValue(updatedAprimoValue);

    if (!isEmpty(aprimoImage) && params?.amplienceConfig?.bucketId) {
      await saveToNativeImage(aprimoImage);
    }
  };

  const removeAprimoImage = async () => {
    await sdk?.field.setValue({});
    await setAprimoValue({});
  };

  const saveToNativeImage = async (aprimoImage: AprimoValue) => {
    if (!sdk) {
      throw new Error("Unable to save image - sdk has not been initialised");
    }

    if (!params?.amplienceConfig?.bucketId) {
      throw new Error(
        "Unable to save to Content Hub - Bucket has not been configured"
      );
    }

    if (!aprimoImage.rendition?.publicuri) {
      throw new Error(
        "Unable to save to Content Hub - Aprimo image url is missing"
      );
    }

    const assetUploadService = new ContentHubService(sdk, {
      bucketId: params?.amplienceConfig.bucketId,
      folderId: params?.amplienceConfig?.folderId,
    });

    const uploadedAsset = await assetUploadService.uploadToAssetStore(
      aprimoImage.rendition?.publicuri,
      `${aprimoImage.title}-${aprimoImage.rendition?.id}` // TODO: change to rendition id
    );

    const storedAsset = await assetUploadService.getAssetById(uploadedAsset.id);
    console.log(JSON.stringify(storedAsset, null, 2));
  };

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider
        value={{
          sdk,
          readOnly,
          params,
          title,
          description,
          formValue,
          initialAprimoValue,
          aprimoValue,
          addAprimoImage,
          removeAprimoImage,
        }}
      >
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
}

export default WithContentFieldExtension;
