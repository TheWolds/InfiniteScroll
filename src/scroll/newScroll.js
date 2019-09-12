// 스크롤은 지금 내가 올라가는지 내려가는지
// 어디까지 올라갔고 얼만큼 보여야하는지
// 불필요한 부분은 어디까진지
class Scroll {
  // 이런거도 enum으로 쓰고!
  static DOWN = 'scroll/DOWN';
  static UP = 'scroll/UP';

  // TODO : typescript로 해결해야함
  // 어떤 타입인지 체크해줘야한다.
  static checkParams = element => {};

  constructor(container, data, renderer) {
    this.container = container;
    this.renderer = renderer;
    this.component.scrollTop = 0;
    this.visibleRowCount = Math.ceil(this.component.clientHeight / this.rowHeight);
    let preparedRowCount = Math.max(this.visibleRowCount, 20);
    this.preparedRowCount = toUpperEven(preparedRowCount); // preparedRowCount + (preparedRowCount % 2);
    preparedRowCount = null;
    this.renderer.render();
  }

  getDirection = () => {
    const currentTop = this.container.scrollTop;
    const backupLastTop = this.lastTop;
    this.lastTop = currentTop;

    if (currentTop > backupLastTop) {
      return Scroll.DOWN;
    }

    return Scroll.UP;
  };

  isOverflow = () => {};

  handleScroll = () => {
    let range;
    if (this.getDirection() === Scroll.UP) {
      range = this.getUpperPrepareRange();
    } else {
      range = this.getLowerPrepareRange();
    }
    if (range) {
      this.renderer.render(range);
    }
  };

  getcurrentStartIndex = () => {
    const {containerEl, itemHeight} = this.element;
    return Math.floor(containerEl.scrollTop / itemHeight);
  };

  getHalfpreparedRowCount = () => {
    return this.preparedRowCount / 2;
  };

  // 일정 이상으로 이동하면
  getUpperPrepareRange = () => {
    const {itemHeight} = this.element;
    const firstChild = this.cachedItems[0];
    const firstChildRect = firstChild.getBoundingClientRect();
    const hpr = getHalfpreparedRowCount(); // 이것의 정체를 정확히 알아야한다.

    if (this.containerElBCR.bottom < firstChildRect.top) {
      const currentStartIndex = getcurrentStartIndex();
      return {
        startIndex: currentStartIndex - hpr,
        endIndex: currentStartIndex + this.visibleRowCount + hpr
      };
    } else if (this.containerElBCR.top - 5 * itemHeight < firstChildRect.top) {
      const endIndex = parseInt(firstChild.dataset.index, 10);
      return {
        startIndex: endIndex - this.preparedRowCount,
        endIndex
      };
    }
  };

  getLowerPrepareRange = () => {
    const {itemHeight} = this.element;
    const lastChild = this.cachedItems[this.cachedItems.length - 1];
    const lastChildRect = lastChild.getBoundingClientRect();
    const hpr = getHalfpreparedRowCount(); // 이것의 정체를 정확히 알아야한다.

    if (lastChildRect.bottom < 0) {
      const lastIndex = parseInt(lastChild.dataset.index, 10);
      if (lastIndex + 1 < this.dataList.length) {
        const currentStartIndex = getcurrentStartIndex();
        return {
          startIndex: currentStartIndex - hpr,
          endIndex: currentStartIndex + this.visibleRowCount + hpr
        };
      }
    } else if (lastChildRect.bottom < this.containerElBCR.bottom + 5 * itemHeight) {
      const startIndex = parseInt(lastChild.dataset.index, 10) + 1;
      return {
        startIndex,
        endIndex: startIndex + this.preparedRowCount
      };
    }
  };
}

export default Scroll;
