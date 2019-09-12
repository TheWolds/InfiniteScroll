// 오브젝트라는 책을 읽어버렸다.
// 도저히 책임할당을 고려하지 않을수 없었다.
// renderer
// scroll
//

const element = {
  containerEl: '', // String
  listEl: '', // String
  itemEl: '', // String
  itemHeight: 0, // Number
  template: ''
};

const data = [];
const options = {};

// 높이가 무조건 고정이라고 가정하고 !

const scroll = ({element, data, options}) => {
  const {
    containerEl, // -> 이거하나만 주면 할수있게
    listEl,
    itemEl,
    itemHeight,
    template
  } = element;
  // TODO: checkFormat
  // 사실 DOM말고 다른건 랜더하지 않는다.
  // 그렇지만 이렇게 하는것 만으로도 결합도가 낮아진다.
  return new Scroll(element, new Renderer(data, options, element));
};

export default scroll;
