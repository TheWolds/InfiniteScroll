import infiniteScroll from '../index';

const template = data => {
  return `<div>${data.name}</div>`;
};

let params = {
  page: 1
};

const callback = params => ({ page: params.page + 1 });
infiniteScroll('.container', template, {
  url: `https://swapi.co/api/people`,
  callback,
  params,
});