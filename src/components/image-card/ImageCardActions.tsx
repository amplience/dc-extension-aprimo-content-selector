import styled from "@emotion/styled";
import CardActions from "@mui/material/CardActions";

export const ImageCardActions = styled(CardActions)`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  opacity: 0;
  background-color: rgba(26, 34, 45, 0.8);
  display: flex;
  justify-content: center;
  &:hover {
    opacity: 1;
  }
`;
