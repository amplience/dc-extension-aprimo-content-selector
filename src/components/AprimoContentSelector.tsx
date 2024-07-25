import { CardContent, Container, Fab, Typography } from "@mui/material";
import { useContentFieldExtension } from "../contexts/content-field-extension/ContentFieldExtensionHook";
import { ImageCard } from "./image-card/ImageCard";
import { ImageCardMedia } from "./image-card/ImageCardMedia";
import { ImageCardBox } from "./image-card/ImageCardBox";
import { ImageCardActions } from "./image-card/ImageCardActions";
import { DeleteIcon } from "./icons/DeleteIcon";
import { AddIcon } from "./icons/AddIcon";
import { isEmpty } from "../utils/isEmpty";
import { ImageCardSkeleton } from "./image-card/ImageCardSkeleton";

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

  const removeImage = async () => {
    await setAprimoImage({});
  };

  return (
    <>
      <div>
        {!isEmpty(aprimoValue) && (
          <Container maxWidth={false}>
            <ImageCardBox my={4}>
              <ImageCard>
                <CardContent>
                  <Typography variant="subtitle1" component="h2">
                    {aprimoValue?.title}
                  </Typography>
                  <Typography variant="subtitle2" component="h3">
                    {aprimoValue?.id}
                  </Typography>
                </CardContent>
                <ImageCardMedia
                  image={aprimoValue?.rendition?.publicuri}
                  title={aprimoValue?.title}
                />
                <ImageCardActions>
                  <Fab color="secondary" onClick={removeImage}>
                    <DeleteIcon />
                  </Fab>
                </ImageCardActions>
              </ImageCard>
            </ImageCardBox>
          </Container>
        )}
        {isEmpty(aprimoValue) && (
          <Container maxWidth={false}>
            <ImageCardBox my={4}>
              <ImageCardSkeleton>
                <Fab
                  onClick={openContentSelector}
                  sx={{ backgroundColor: "#fff", fill: "#ccc" }}
                >
                  <AddIcon />
                </Fab>
              </ImageCardSkeleton>
            </ImageCardBox>
          </Container>
        )}
      </div>
    </>
  );
}

export default AprimoContentSelector;
