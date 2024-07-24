import { useContentFieldExtension } from "../contexts/content-field-extension/ContentFieldExtensionHook";

function AprimoContentSelector() {
  const { initialValue, formValue } = useContentFieldExtension();

  return (
    <>
      <div className="card">
        <p>initialValue: {JSON.stringify(initialValue, null, 2)}</p>
        <p>formValue: {JSON.stringify(formValue, null, 2)}</p>
      </div>
    </>
  );
}

export default AprimoContentSelector;
