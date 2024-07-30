import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type AprimoFieldValue = {
  aprimoData?: AprimoData;
  amplienceImage?: {
    _meta?: {
      schema: string;
    };
    id?: string;
    name?: string;
    endpoint?: string;
    defaultHost?: string;
  };
};

export type AprimoData = {
  id?: string;
  title?: string;
  rendition?: { id: string; publicuri: string };
};

export type Params = {
  aprimoConfig?: AprimoConfig;
  amplienceConfig?: AmplienceConfig;
};

export type AprimoConfig = {
  tenantUrl: string;
  options: Record<string, unknown>;
};

export type AmplienceConfig = {
  endpoint: string;
  defaultHost?: string;
  bucketId?: string;
  folderId?: string;
  uploadMode?: string;
};

export type ContentFieldExtensionContextState = {
  sdk: ContentFieldExtension;
  initialAprimoFieldValue?: AprimoFieldValue;
  formValue: unknown;
  readOnly: boolean;
  params?: Params;
  title: string;
  description: string;
  aprimoFieldValue?: AprimoFieldValue;
  thumbUrl: string;
  aprimoConfig?: AprimoConfig;
  amplienceConfig?: AmplienceConfig;
  addAprimoImage: (aprimoImage: AprimoData) => Promise<void>;
  removeAprimoImage: () => Promise<void>;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState | null>(null);
