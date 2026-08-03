const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

export async function prepareImage(file, { maxEdge = 1200, quality = 0.8 } = {}) {
  if (!file?.type.startsWith("image/") || file.size > MAX_SOURCE_BYTES) {
    throw new Error("Choose an image no larger than 12 MB.");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const dataUrl = canvas.toDataURL("image/webp", quality);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));

  if (!blob) throw new Error("This image could not be processed.");

  return {
    blob,
    width,
    height,
    sourceBytes: file.size,
    outputBytes: blob.size,
    dataUrl,
    previewUrl: dataUrl,
  };
}

export function formatBytes(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
