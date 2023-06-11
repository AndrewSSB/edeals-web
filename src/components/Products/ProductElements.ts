import styled from "@emotion/styled";
import { Card, CardMedia, Typography } from "@mui/material";

export const CardImage = styled.div`
  position: relative;
  padding-top: 70%;
  & img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardWrapper = styled(Card)`
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  box-shadow: none;
  max-height: 100%;
  overflow: hidden;
`;

export const ProductTypografy = styled(Typography)`
  white-space: pre-line;
  word-break: break-word;
`;

export const ProductDescription = styled(ProductTypografy)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
