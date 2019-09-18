import Scroll from './newScroll';
import DataLoader from './scroll/loader';

const template = data => {
  return `<div>${data.name}</div>`;
};

const app = (selector, template, api) => {
  const container = document.querySelector(selector);
  const wrapper = document.createElement('div');
  container.appendChild(wrapper);
  const loader = new DataLoader(api);
  new Scroll(wrapper, template, loader);
};

const api = () => {};
app('.container', template, api());
// export default app;
