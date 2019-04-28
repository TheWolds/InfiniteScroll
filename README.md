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
InfiniteScroll.setScroll({
    componentSelector: '#component',
    parentSelector: '#list',
    rowSelector: '.item'
    rowHeight,
    templateHTML,
    dataList,
});

// or
new InfiniteScroll().setScroll({
    componentSelector: '#component',
    parentSelector: '#list',
    rowSelector: '.item'
    rowHeight,
    templateHTML,
    dataList,
});
```

| name | type | description |
|---|---|---|
| `componentSelector` | string |The selector that specifies the element around the scroll with a fixed height|
| `parentSelector` | string | The selector that specifies scrolling with dynamic height |
| `rowSelector` | string | The selector that specifies the elements in the scroll |
| `rowHeight` | number | Height of row |
| `templateHTML` | function | A function that returns a template string. It accepts `rowHeight`,` index`, and `data` as parameters. |
| `dataList` | array | Data for scroll |


## 🔑 License

[![CC 4.0][license-image]][license-url]

[license-url]: http://www.wtfpl.net
[license-image]: https://img.shields.io/badge/License-WTFPL%202.0-lightgrey.svg?style=flat-square