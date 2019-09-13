class DataLoader {
  constructor(api, query) {
    this.api = api;
    this.query = query;
  }

  fetchData = () => {
    return this.api(this.query);
  };

  supply = groupId => {
    if (!caches[groupId]) {
      return fetchData();
    }

    return new Promise(resolve => {
      resolve(caches[groupId]);
    });
  };
}
