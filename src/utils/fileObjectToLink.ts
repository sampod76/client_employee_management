/**
 * Note:
 * 1. If src is an object -->
 *     1. Look for cdn, if found merge with path to create url (fast fetching)
 *     2. If no cdn found, use the direct url
 *
 * 2. If src is string / anything other than object --> use the direct src
 *
 * 3. If no src found, use the default image
 *
 */

export default function fileObjectToLink(src: any) {
  // Backend baseurl
  const backendBaseUrl = 'http://localhost:5000';

  let imageSrc;
  if (src?.cdn) {
    // console.log("🚀 ~ sadfsadf", src);
    imageSrc = src.cdn + '/' + src.path;
  } else if (typeof src === 'object' && src.url) {
    // console.log("🚀 ~ fffasdfnk ~ src:", src);
    imageSrc = src.url;
  } else if (src?.server_url) {
    imageSrc = backendBaseUrl + '/' + src.server_url;
  } else if (src && typeof src === 'string') {
    imageSrc = src;
  } else if (src) {
    imageSrc = src;
  } else {
    imageSrc =
      'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1720180742~exp=1720184342~hmac=45367258d48f919941fdf6a910f0fbf3e86f0385c7ad53ec92ecc7b3e7e3c641&w=300';
  }

  return imageSrc;
}
