class DataLoader {
  constructor(api) {
    this.api = api;
    this.query = 0;
    this.caches = [];
  }

  fetchData = () => {
    this.query++;
    return fetch(`https://swapi.co/api/people/?page=${this.query}`)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Error');
        }
      })
      .then(res => res.results);
  };

  supply = groupId => {
    if (!caches[groupId]) {
      return this.fetchData();
    }

    return new Promise(resolve => {
      resolve(caches[groupId]);
    });
  };
}

export default DataLoader;
