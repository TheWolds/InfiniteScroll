import infiniteScroll from '../index';

const template = data => {
  return `<div>${data.name}</div>`;
};
  
const api = () => {};
infiniteScroll('.container', template, api());