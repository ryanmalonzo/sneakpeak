export const imageUrlToBase64 = async (url: string) => {
  const data = await fetch(url);
  const buffer = await data.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const contentType = data.headers.get('content-type');
  return `data:${contentType};base64,${base64}`;
};
