import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type AprimoValue = {
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
  aprimoConfig?: {
    tenantUrl: string;
  };
  amplienceConfig?: {
    endpoint: string;
    defaultHost: string;
    bucketId?: string;
    folderId?: string;
    uploadMode?: string;
  };
};

export type ContentFieldExtensionContextState = {
  sdk: ContentFieldExtension;
  initialAprimoValue?: AprimoValue;
  formValue: unknown;
  readOnly: boolean;
  params?: Params;
  title: string;
  description: string;
  aprimoValue?: AprimoValue;
  thumbUrl: string;
  addAprimoImage: (aprimoImage: AprimoData) => Promise<void>;
  removeAprimoImage: () => Promise<void>;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState | null>(null);
