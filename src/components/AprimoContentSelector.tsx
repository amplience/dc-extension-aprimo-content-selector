import { useContentFieldExtension } from "../contexts/content-field-extension/ContentFieldExtensionHook";

const TENANT_URL = "https://partnerdemo114.dam.aprimo.com";

function AprimoContentSelector() {
  const { aprimoValue, setAprimoImage } = useContentFieldExtension();

  const openContentSelector = () => {
    const selectorOptions = {
      select: "singlerendition",
    };
    const encodedOptions = window.btoa(JSON.stringify(selectorOptions));
    const contentSelectorUrl = `${TENANT_URL}/dam/selectcontent#options=${encodedOptions}`;
    const handleMessageEvent = async (event: MessageEvent) => {
      if (event.origin !== TENANT_URL) {
        return; // exit if origin is not Aprimo
      }
      if (event.data.result === "cancel") {
        return;
      }
      const aprimoImage = event.data.selection[0] || {};
      await setAprimoImage(aprimoImage);
    };

    window.addEventListener("message", handleMessageEvent, false);
    window.open(contentSelectorUrl, "selector");
  };

  return (
    <>
      <div className="card">
        <button onClick={openContentSelector}>
          Open Aprimo Content Selector
        </button>
        <div>
          <code>{JSON.stringify(aprimoValue, null, 2)}</code>
        </div>
      </div>
    </>
  );
}

export default AprimoContentSelector;
