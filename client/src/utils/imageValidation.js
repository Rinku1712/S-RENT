const supportedImageExtensions = new Set([
  'jpg',
  'jpeg',
  'jpe',
  'jfif',
  'png',
  'webp',
  'gif',
  'bmp',
  'dib',
  'tif',
  'tiff',
  'ico',
  'avif',
  'heic',
  'heics',
  'heif',
  'heifs',
  'jxl',
  'svg',
]);

export const isSupportedImage = (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return Boolean(extension && supportedImageExtensions.has(extension) && file.type.toLowerCase().startsWith('image/'));
};

export const isImageWithinSizeLimit = (file) => file.size <= 5 * 1024 * 1024;

export const supportedImageFormats =
  'JPEG, PNG, WEBP, GIF, BMP, TIFF, ICO, AVIF, HEIC, HEIF, JXL, or SVG';
