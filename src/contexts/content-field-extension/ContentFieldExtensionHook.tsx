import { useContext } from "react";
import {
  ContentFieldExtensionContext,
  ContentFieldExtensionContextState,
} from "./ContentFieldExtensionContext";

export function useContentFieldExtension(): ContentFieldExtensionContextState {
  const context = useContext(ContentFieldExtensionContext);

  if (!context) {
    throw new Error(
      "useContentFieldExtension can only be with WithContentFieldExtension provider"
    );
  }

  return context;
}
