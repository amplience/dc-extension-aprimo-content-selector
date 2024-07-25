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
  setAprimoImage: (aprimoImage: AprimoValue) => Promise<void>;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState | null>(null);
