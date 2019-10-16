import Scroll from './src/scroll';
import DataLoader from './src/loader';

export default (selector, template, options) => {
  const wrapper = document.querySelector(selector);
  const container = document.createElement('div');
  wrapper.appendChild(container);

  const loader = new DataLoader(options);
  new Scroll(wrapper, container, template, loader);
};

