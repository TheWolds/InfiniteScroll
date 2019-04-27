# 📜 ↩️

> ⚠️ This is an infinite scroll *made for practice*. You can use it, but *it does not guarantee stability or performance*.

## Install

```
npm install llorcs
```

## Initialize

```js
const scroll = new InfiniteScroll({
    component: '#component',
    list: '#list',
    item: '.item'
});
scroll.setScroll({
    rowHeight,
    templateHTML,
    dataList,
});

// or
InfiniteScroll.setScroll({
    component: '#component',
    list: '#list',
    item: '.item'
},{
    rowHeight,
    templateHTML,
    dataList,
});
```

## 🔑 License

[![CC 4.0][license-image]][license-url]

[license-url]: http://www.wtfpl.net
[license-image]: https://img.shields.io/badge/License-WTFPL%202.0-lightgrey.svg?style=flat-square