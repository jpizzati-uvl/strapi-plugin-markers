import { Box, Grid } from "@strapi/design-system";
import styled from "styled-components";

const InputWrapper = styled(Grid.Item)`
  > div {
    width: 100%;
  }
`;

const CategoryPointerPreview = styled(Box)`
  max-width: 30px;
  max-height: 30px;
`;

const CategoryPointer = styled(Box)`
  font-size: 0 !important;
  height: auto !important;

  * {
    font-size: 0 !important;
    height: auto !important;
  }

  svg {
    margin-bottom: 0 !important;
  }

  img, svg {
    max-width: 80px !important;
    max-height: 80px !important;
  }
  
  section + * {
    display: none !important;
  }

  section > div:last-child {
    bottom: 0 !important;
  }
`;

const ResortMap = styled(Box)`
  position: relative;
`;

const MapMarkerWrapper = styled.div`
  position: absolute;
  min-height: 12px;
  min-width: 12px;
`;

const MapMarkerDot = styled.div<{ selected: boolean; }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 12px;
  height: 12px;
  border: 1px solid #000;
  border-radius: 100%;
  background-color: #000;
  background-clip: padding-box;
  cursor: pointer;
  box-shadow:
    1px 1px #fff,
    -1px 1px #fff,
    1px -1px #fff,
    -1px -1px #fff;

  ${({ selected }) =>
    selected &&
    `
    outline: 2px dashed #ff0;
  `}
`;

const MapMarkerPointer = styled.img<{ selected: boolean; }>`
  position: absolute;
  left: 0;
  top: 0;
  max-height: 30px;
  max-width: 30px;
  height: 20px;
  width: auto;
  cursor: pointer;

  ${({ selected }) =>
    selected &&
    `
    outline: 2px dashed #ff0;
  `}
`;

export { InputWrapper, CategoryPointerPreview, CategoryPointer, ResortMap, MapMarkerWrapper, MapMarkerDot, MapMarkerPointer };