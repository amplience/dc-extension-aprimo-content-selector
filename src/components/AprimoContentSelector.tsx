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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { FieldDetails } from "./field-details/FieldDetails";

function AprimoContentSelector() {
  const {
    aprimoValue,
    addAprimoImage,
    removeAprimoImage,
    params,
    title,
    description,
  } = useContentFieldExtension();
  const TENANT_URL = params?.aprimoConfig?.tenantUrl;

  const openContentSelector = () => {
    const encodedOptions = window.btoa(
      JSON.stringify({
        select: "singlerendition",
        limitingSearchExpression: 'ContentType = "Image"',
      })
    );
    const handleMessageEvent = async (event: MessageEvent) => {
      if (event.origin !== TENANT_URL) {
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
      `${TENANT_URL}/dam/selectcontent#options=${encodedOptions}`,
      "selector"
    );
  };

  const openInAprimo = () => {
    window.open(`${TENANT_URL}/dam/contentitems/${aprimoValue?.id}`);
  };

  const removeImage = async () => {
    await removeAprimoImage();
  };

  return (
    <>
      <div>
        <FieldDetails title={title} description={description} />
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
