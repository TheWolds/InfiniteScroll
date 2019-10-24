import {urlEndWithSlash, getQueryString} from './libs/url';

class DataLoader {
  constructor({url, params, callback}) {
    this.url = urlEndWithSlash(url);
    this.params = params;
    this.callback = callback;
    this.caches = []; // 프로미스 저장
  }

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
