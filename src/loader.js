const getQueryString = params =>
  Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

class DataLoader {
  constructor({url, params, callback}) {
    this.url = url;
    this.params = params;
    this.callback = callback;
    this.caches = []; // 프로미스 저장

    this.urlEndWithSlash();
  }

  urlEndWithSlash = () => {
    if (this.url[this.url.length - 1] !== '/') {
      this.url += '/';
    }
  };

  // 프로미스 반환
  fetchData = () => {
    const url = `${this.url}?${getQueryString(this.params)}`;
    return fetch(url)
      .then(res => {
        if (res.status === 200) {
          // this.params 업그레이드.
          this.params = this.callback(this.params);
          return res.json();
        } else {
          throw new Error('Error');
        }
      })
      .then(res => res.results);
  };

  supply = groupId => {
    if (!caches[groupId]) {
      const result = this.fetchData();
      caches[groupId] = result;
      return result;
    }

    return Promise.resolve(caches[groupId]);
  };
}

export default DataLoader;
