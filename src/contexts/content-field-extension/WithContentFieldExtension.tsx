import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { ReactNode, useEffect, useState } from "react";
import {
  AmplienceConfig,
  AprimoConfig,
  AprimoData,
  AprimoFieldValue,
  ContentFieldExtensionContext,
  Params,
} from "./ContentFieldExtensionContext";
import ContentHubService from "../../services/ContentHubService";
import isEmpty from "lodash.isempty";

function WithContentFieldExtension({ children }: { children: ReactNode }) {
  const [sdk, setSDK] = useState<ContentFieldExtension<AprimoFieldValue>>();
  const [initialAprimoFieldValue, setInitialAprimoFieldValue] =
    useState<AprimoFieldValue>();
  const [aprimoFieldValue, setAprimoFieldValue] = useState<AprimoFieldValue>();
  const [formValue, setFormValue] = useState({});
  const [readOnly, setReadOnly] = useState(false);
  const [params, setParams] = useState<Params>({});
  const [aprimoConfig, setAprimoConfig] = useState<AprimoConfig>();
  const [amplienceConfig, setAmplienceConfig] = useState<AmplienceConfig>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");

  useEffect(() => {
    const setupSdk = async () => {
      const sdk = await init<ContentFieldExtension<AprimoFieldValue>>();
      const params: Params = {
        ...sdk.params.installation,
        ...sdk.params.instance,
      };
      setParams(params);
      setAprimoConfig(params?.aprimoConfig);
      if (params?.amplienceConfig) {
        setAmplienceConfig({
          defaultHost: "cdn.media.amplience.net",
          uploadMode: "overwrite",
          ...params?.amplienceConfig,
        });
      }
      const initialValue = (await sdk.field.getValue()) as AprimoFieldValue;
      setInitialAprimoFieldValue(initialValue);
      setAprimoFieldValue(initialValue);

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
      if (sdk && aprimoFieldValue?.amplienceImage?.id) {
        const asset = await sdk.assets.getById(
          aprimoFieldValue?.amplienceImage?.id
        );
        setThumbUrl(asset?.thumbURL);
      }
    };

    populateThumbUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aprimoFieldValue]);

  const addAprimoImage = async (aprimoImage: AprimoData) => {
    const modifiedFieldValue = { ...aprimoFieldValue, aprimoData: aprimoImage };
    if (!isEmpty(aprimoImage) && !isEmpty(amplienceConfig)) {
      const amplienceImage = await createAmplienceImage(aprimoImage);
      modifiedFieldValue.amplienceImage = amplienceImage;
    }

    await sdk?.field.setValue(modifiedFieldValue);
    setAprimoFieldValue(await sdk?.field.getValue());
  };

  const removeAprimoImage = async () => {
    await sdk?.field.setValue({});
    await setAprimoFieldValue({ aprimoData: {}, amplienceImage: {} });
    setThumbUrl("");
  };

  const createAmplienceImage = async (aprimoImage: AprimoData) => {
    if (!sdk) {
      throw new Error("Unable to create image - sdk has not been initialised");
    }

    if (!amplienceConfig?.endpoint) {
      throw new Error("Unable to create image - missing endpoint");
    }

    if (!aprimoImage.rendition?.publicuri) {
      throw new Error("Unable to create image - Aprimo image url is missing");
    }

    const contentHubService = new ContentHubService(sdk, {
      bucketId: amplienceConfig?.bucketId,
      folderId: amplienceConfig?.folderId,
      mode: amplienceConfig?.uploadMode,
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
      endpoint: amplienceConfig.endpoint,
      defaultHost: amplienceConfig.defaultHost,
      mimeType: storedAsset.mimeType,
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
          initialAprimoFieldValue,
          aprimoFieldValue,
          thumbUrl,
          aprimoConfig,
          amplienceConfig,
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
