import { CardContent, Container, Fab, Typography } from "@mui/material";
import { useContentFieldExtension } from "../contexts/content-field-extension/ContentFieldExtensionHook";
import { ImageCard } from "./image-card/ImageCard";
import { ImageCardMedia } from "./image-card/ImageCardMedia";
import { ImageCardBox } from "./image-card/ImageCardBox";
import { ImageCardActions } from "./image-card/ImageCardActions";
import { DeleteIcon } from "./icons/DeleteIcon";
import { AddIcon } from "./icons/AddIcon";
import { ImageCardSkeleton } from "./image-card/ImageCardSkeleton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { FieldDetails } from "./field-details/FieldDetails";
import isEmpty from "lodash.isempty";

function AprimoContentSelector() {
  const {
    aprimoFieldValue,
    addAprimoImage,
    removeAprimoImage,
    aprimoConfig,
    title,
    description,
    thumbUrl,
  } = useContentFieldExtension();
  const tenantUrl = aprimoConfig?.tenantUrl;

  const openContentSelector = () => {
    const encodedOptions = window.btoa(
      JSON.stringify({
        select: "singlerendition",
        limitingSearchExpression: 'ContentType = "Image"',
        accept: "Save to Amplience",
        ...aprimoConfig?.options,
      })
    );
    const handleMessageEvent = async (event: MessageEvent) => {
      if (event.origin !== tenantUrl) {
        return; // exit if origin is not Aprimo
      }
      if (event.data.result === "cancel") {
        return;
      }
      const aprimoImage = event.data.selection[0] || {};

      await addAprimoImage(aprimoImage);
    };

    window.addEventListener("message", handleMessageEvent, false);
    window.open(
      `${tenantUrl}/dam/selectcontent#options=${encodedOptions}`,
      "selector"
    );
  };

  const openInAprimo = () => {
    window.open(
      `${tenantUrl}/dam/contentitems/${aprimoFieldValue?.aprimoData?.id}`
    );
  };

  const removeImage = async () => {
    await removeAprimoImage();
  };

  return (
    <>
      <div>
        <FieldDetails title={title} description={description} />
        {!isEmpty(aprimoFieldValue?.aprimoData) && (
          <Container maxWidth={false}>
            <ImageCardBox my={4}>
              <ImageCard>
                <CardContent>
                  <Typography variant="subtitle1" component="h2">
                    {aprimoFieldValue?.aprimoData?.title}
                  </Typography>
                  <Typography variant="subtitle2" component="h3">
                    {aprimoFieldValue?.aprimoData?.id}
                  </Typography>
                </CardContent>
                <ImageCardMedia
                  image={
                    thumbUrl ||
                    aprimoFieldValue?.aprimoData?.rendition?.publicuri
                  }
                  title={aprimoFieldValue?.aprimoData?.title}
                />
                <ImageCardActions>
                  <Fab color="secondary" onClick={openInAprimo}>
                    <OpenInNewIcon />
                  </Fab>
                  <Fab color="secondary" onClick={removeImage}>
                    <DeleteIcon />
                  </Fab>
                </ImageCardActions>
              </ImageCard>
            </ImageCardBox>
          </Container>
        )}
        {isEmpty(aprimoFieldValue?.aprimoData) && (
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
