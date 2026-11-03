const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

const getItemImageUrl = (imagePath) => {
  if (!imagePath) {
    return null;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return apiBaseUrl ? new URL(normalizedPath, apiBaseUrl).toString() : normalizedPath;
};

export default getItemImageUrl;
