import { Divider, Stack, Typography } from "@mui/material";

export type FieldDetailsProps = {
  title?: string;
  description?: string;
};

export function FieldDetails({ title, description }: FieldDetailsProps) {
  return (
    <Stack>
      {title && (
        <Typography variant="body1" color={"#333333"}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="caption" color={"#808080"}>
          {description}
        </Typography>
      )}
      {(title || description) && (
        <Divider
          sx={{ marginTop: 1, marginBottom: 1 }}
          variant="fullWidth"
        ></Divider>
      )}
    </Stack>
  );
}
