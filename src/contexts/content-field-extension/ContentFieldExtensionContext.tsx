import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type AprimoImage = {
  id: string;
  title: string;
  rendition: { id: string; publicuri: string };
};

export type AprimoValue = {
  aprimoImage?: AprimoImage;
};

export type ContentFieldExtensionContextState = {
  sdk: ContentFieldExtension;
  initialAprimoValue?: AprimoValue;
  formValue: unknown;
  readOnly: boolean;
  aprimoValue?: AprimoValue;
  setAprimoImage: (aprimoImage: AprimoImage) => Promise<void>;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState | null>(null);
