type ProductImageProps = {
  image: {
    previewImg: string;
    previewImg2x: string;
    previewImgWebp: string;
    previewImgWebp2x: string;
    name: string;
  };
  size?: {
    width: number;
    height: number;
  };
};

enum DefaultImageSize {
  Width = 140,
  Height = 120,
}

function ProductImage({ image, size }: ProductImageProps): JSX.Element {
  const { previewImg, previewImg2x, previewImgWebp, previewImgWebp2x, name } =
    image;

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`/${previewImgWebp}, /${previewImgWebp2x} 2x`}
      />
      <img
        src={`/${previewImg}`}
        srcSet={`/${previewImg2x} 2x`}
        width={size?.width ?? DefaultImageSize.Width}
        height={size?.height ?? DefaultImageSize.Height}
        alt={name}
      />
    </picture>
  );
}

export default ProductImage;
