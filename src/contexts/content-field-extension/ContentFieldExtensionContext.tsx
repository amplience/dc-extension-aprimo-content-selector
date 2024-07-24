import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type ContentFieldExtensionContextState = {
  sdk: ContentFieldExtension;
  initialValue: unknown;
  formValue: unknown;
  readOnly: boolean;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState | null>(null);
