import { Button, CardContent, Container, Typography } from "@mui/material";
import { useContentFieldExtension } from "../contexts/content-field-extension/ContentFieldExtensionHook";
import { ImageCard } from "./image-card/ImageCard";
import { ImageCardMedia } from "./image-card/ImageCardMedia";
import { ImageCardBox } from "./image-card/ImageCardBox";

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
      <div>
        <Button onClick={openContentSelector} autoFocus>
          Select Asset from Aprimo
        </Button>
        {aprimoValue && (
          <Container maxWidth={false}>
            <ImageCardBox my={4}>
              <ImageCard>
                <CardContent>
                  <Typography variant="subtitle1" component="h2">
                    {aprimoValue.title}
                  </Typography>
                  <Typography variant="subtitle2" component="h3">
                    {aprimoValue?.id}
                  </Typography>
                </CardContent>
                <ImageCardMedia
                  image={aprimoValue.rendition.publicuri}
                  title={aprimoValue.title}
                />
              </ImageCard>
            </ImageCardBox>
          </Container>
        )}
      </div>
    </>
  );
}

export default AprimoContentSelector;
