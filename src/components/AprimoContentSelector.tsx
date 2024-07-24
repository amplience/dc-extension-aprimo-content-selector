import { useContentFieldExtension } from "../contexts/content-field-extension/ContentFieldExtensionHook";

function AprimoContentSelector() {
  const { aprimoValue, setAprimoImage, params } = useContentFieldExtension();

  const openContentSelector = () => {
    const tenantUrl = params?.aprimoConfig?.tenantUrl;
    const encodedOptions = window.btoa(
      JSON.stringify({
        select: "singlerendition",
        limitingSearchExpression: 'ContentType = "Image"',
      })
    );
    const contentSelectorUrl = `${tenantUrl}/dam/selectcontent#options=${encodedOptions}`;
    const handleMessageEvent = async (event: MessageEvent) => {
      if (event.origin !== tenantUrl) {
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
