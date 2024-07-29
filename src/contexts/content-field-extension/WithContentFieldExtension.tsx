import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { ReactNode, useEffect, useState } from "react";
import {
  AprimoData,
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
  const [thumbUrl, setThumbUrl] = useState("");

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

  useEffect(() => {
    const populateThumbUrl = async () => {
      if (sdk && aprimoValue?.nativeImage?.id) {
        const asset = await sdk.assets.getById(aprimoValue?.nativeImage?.id);
        setThumbUrl(asset?.thumbURL);
      }
    };

    populateThumbUrl();
  }, [aprimoValue]);

  const addAprimoImage = async (aprimoImage: AprimoData) => {
    const modifiedFieldValue = { ...aprimoValue, aprimoData: aprimoImage };

    if (!isEmpty(aprimoImage) && !isEmpty(params.amplienceConfig)) {
      const nativeImage = await createNativeImage(aprimoImage);
      modifiedFieldValue.nativeImage = nativeImage;
    }

    await sdk?.field.setValue(modifiedFieldValue);
    setAprimoValue(await sdk?.field.getValue());
  };

  const removeAprimoImage = async () => {
    await sdk?.field.setValue({});
    await setAprimoValue({ aprimoData: {}, nativeImage: {} });
    setThumbUrl("");
  };

  const createNativeImage = async (aprimoImage: AprimoData) => {
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

    const contentHubService = new ContentHubService(sdk, {
      bucketId: params?.amplienceConfig.bucketId,
      folderId: params?.amplienceConfig?.folderId,
    });

    const uploadedAsset = await contentHubService.uploadToAssetStore(
      aprimoImage.rendition?.publicuri,
      `${aprimoImage.title}-${aprimoImage.rendition?.id}`
    );

    const storedAsset = await contentHubService.getAssetById(uploadedAsset.id);

    return {
      _meta: {
        schema:
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
      },
      id: storedAsset.id,
      name: storedAsset.name,
      endpoint: params.amplienceConfig.endpoint,
      defaultHost: params.amplienceConfig.defaultHost,
    };
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
          thumbUrl,
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
