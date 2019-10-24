export const getQueryString = params =>
  Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

export const urlEndWithSlash = url => {
  if (url[url.length - 1] !== '/') {
    url += '/';
  }

  return url;
};
