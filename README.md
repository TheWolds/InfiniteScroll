# ♾ 📜

⚠️ This is an infinite scroll *made for practice*. You can use it, but *it does not guarantee stability or performance*.


![dd](infi.gif)

[example](https://project42da.github.io/InfiniteScroll/examples)

<!-- ## Install

```
npm install llorcs
``` -->

## Usage

```js
const scroll = InfiniteScroll.setScroll({
    componentSelector: '#component',
    parentSelector: '#list',
    rowSelector: '.item'
    rowHeight,
    templateHTML,
    dataList,
});

// or
const scroll = new InfiniteScroll().setScroll({
    componentSelector: '#component',
    parentSelector: '#list',
    rowSelector: '.item'
    rowHeight,
    templateHTML,
    dataList,
});

// run
scroll.on();
```

### `setScroll(object)`

The method to initialize the scroll.

| name | type | description |
|---|---|---|
| `componentSelector` | string |The selector that specifies the element around the scroll with a fixed height|
| `parentSelector` | string | The selector that specifies scrolling with dynamic height |
| `rowSelector` | string | The selector that specifies the elements in the scroll |
| `rowHeight` | number | Height of row |
| `templateHTML` | function | A function that returns a template string. It accepts `rowHeight`,` index`, and `data` as parameters. |
| `dataList` | array | Data for scroll |


### `.on(object)`

The method to activates the scroll.

| name | type | description |
|---|---|---|
|`fetchData`| Promise|boolean | Data is loaded asynchronously at the time of scrolling |
|`loading`| HTMLElement | Selector to show during loading (eg loading indicator) |
|`isPending`| boolean | Flags for checking whether data is being loaded. |
|`options`| object | `fetchData` object (eg. query) |



### Fetch API

```js
async function fetchData(options) {
  const currentQuery = options.query;
  const response = await fetch(`https://swapi.co/api/people/?page=${currentQuery + 1}`);
  if (!response.ok) {
    throw Error('더 불러올 데이터가 없습니다.');
  }
  options.query = currentQuery + 1;
  const data = await response.json();
  return data.results;
}

scroll.on({
  fetchData,
  loading: document.getElementById('loading'),
  options: {
    query: 1
  }
});
```

## 🔑 License

[![CC 4.0][license-image]][license-url]

[license-url]: http://www.wtfpl.net
[license-image]: https://img.shields.io/badge/License-WTFPL%202.0-lightgrey.svg?style=flat-square