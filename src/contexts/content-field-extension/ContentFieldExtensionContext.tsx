import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type AprimoValue = {
  id?: string;
  title?: string;
  rendition?: { id: string; publicuri: string };
};

export type Params = {
  aprimoConfig?: {
    tenantUrl: string;
  };
  amplienceConfig?: {
    bucketId: string;
    folderId?: string;
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
  addAprimoImage: (aprimoImage: AprimoValue) => Promise<void>;
  removeAprimoImage: () => Promise<void>;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState | null>(null);
