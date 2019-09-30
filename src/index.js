import Scroll from './newScroll';
import DataLoader from './scroll/loader';

const template = data => {
  return `<div>${data.name}</div>`;
};

const app = (selector, template, api) => {
  const wrapper = document.querySelector(selector);
  const container = document.createElement('div');
  wrapper.appendChild(container);
  const loader = new DataLoader(api);
  new Scroll(wrapper, container, template, loader);
};

const api = () => {};
app('.container', template, api());
// export default app;
