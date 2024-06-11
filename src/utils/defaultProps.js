/* eslint-disable no-underscore-dangle */
import { PlaceHolderImage } from "assets/base64Image/placeholderImage";
import Image from "next/image";
// import { IS_CLIENT } from "shared/hoc/constants";

const setStyle = (props = {}, style = {}) =>
  Array.isArray(props.style)
    ? [style, ...props.style]
    : {
        ...style,
        ...props.style,
      };

/* Text default props */
const _ImageRender = Image.render;
Image.render = (props, forwardedRef) => {
  return _ImageRender(
    {
      width: (props.src && props.src.width) || 0,
      height: (props.src && props.src.height) || 0,
      ...props,
      src: props.src || " ",
      blurDataURL: PlaceHolderImage,
      // loading: "lazy",
      onError: (e) => (e.target.src = PlaceHolderImage),
      placeholder: "blur",
      style: setStyle(props, {}),
    },
    forwardedRef
  );
};
