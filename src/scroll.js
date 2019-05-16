import {qs, htmlStringToFragment} from './utils';

const InfiniteScroll = class {
  static setScroll = obj => {
    return new InfiniteScroll().setScroll(obj);
  };

  static defaultProps = {
    fetchData: false,
    loading: false,
    isPending: false
  };

  setScroll = obj => {
    const {
      componentSelector,
      parentSelector,
      rowSelector,
      rowHeight,
      templateHTML,
      dataList = []
    } = obj;
    this.component = qs(componentSelector);
    this.parent = qs(parentSelector);
    this.rowSelector = rowSelector;
    this.componentBCR = this.component.getBoundingClientRect();
    this.lastScrollTop = 0;
    this.lastRowIndex = -1;
    this.cachedItems = [];
    this.rowHeight = rowHeight;
    this.templateHTML = templateHTML;
    this.dataList = dataList;

    this.parent.style.position = 'relative';
    this.component.scrollTop = 0;

    this.visibleRowCount = Math.ceil(this.component.clientHeight / this.rowHeight);
    let _preparedRowCount = Math.max(this.visibleRowCount, 20);
    this.preparedRowCount = _preparedRowCount + (_preparedRowCount % 2);

    this.component.removeEventListener('scroll', this.handleScrollEvent);
    this.component.addEventListener('scroll', this.handleScrollEvent);
    return this;
  };

  /**
   * 인피니티 스크롤을 실행하는 메소드. props로 optional 메소드를 받는다.
   * @param {*} props optional 메소드
   *
   * - `fetchData` : 스크롤시에 비동기적으로 데이터를 불러온다. 프로미스 객체 리턴
   * - `loading` : 로딩중에 보여줄 요소(예를들어 로딩 인디케이터)
   * - `option` : fetchData에 넘겨줄 옵션객체. 데이터를 불러올 쿼리를 저장
   */
  on = (props = defaultProps) => {
    if (props.fetchData) {
      this.fetchData = props.fetchData.bind(this);
      this.isPending = props.isPending;

      if (props.loading) {
        this.loading = props.loading;
      }

      if (props.options) {
        this.options = props.options;
      }
    }
    this.handleScroll();
  };

  handleScrollEvent = () => {
    requestAnimationFrame(() => {
      this._handleScrollEvent();
    });
  };

  _handleScrollEvent = () => {
    let scrollFunc;
    const scrollTop = this.component.scrollTop;
    const isScrollDown = scrollTop > this.lastScrollTop;

    if (isScrollDown) {
      scrollFunc = this.handleScrollDown;
    } else {
      scrollFunc = this.handleScrollUp;
    }
    this.lastScrollTop = scrollTop;
    scrollFunc();
  };

  handleScrollDown = () => {
    const lastChild = this.cachedItems[this.cachedItems.length - 1];
    const lastChildRect = lastChild.getBoundingClientRect();

    if (lastChildRect.bottom < 0) {
      const lastIndex = parseInt(lastChild.dataset.index, 10);
      if (lastIndex + 1 < this.dataList.length) {
        this.handleScroll();
      }
    } else if (lastChildRect.bottom < this.componentBCR.bottom + 5 * this.rowHeight) {
      const startIndex = parseInt(lastChild.dataset.index, 10) + 1;
      const endIndex = startIndex + this.preparedRowCount;
      requestAnimationFrame(_ => {
        this.render(startIndex, endIndex, true);
      });
    }
  };

  handleScrollUp = () => {
    const firstChild = this.cachedItems[0];
    const firstChildRect = firstChild.getBoundingClientRect();
    if (firstChildRect.top > this.componentBCR.bottom) {
      this.handleScroll(false);
    } else if (firstChildRect.top > this.componentBCR.top - 5 * this.rowHeight) {
      const endCount = parseInt(firstChild.dataset.index, 10);
      const startCount = endCount - this.preparedRowCount;
      requestAnimationFrame(_ => {
        this.render(startCount, endCount, false);
      });
    }
  };

  handleLoading = isloading => {
    const prefix = !isloading ? 'set' : 'remove';
    this.loading[prefix + 'Attribute']('aria-hidden', 'true');
  };

  handleScroll = (isScrollDown = true) => {
    const currentStartIndex = Math.floor(this.component.scrollTop / this.rowHeight);
    const startIndex = currentStartIndex - this.preparedRowCount / 2;
    const endIndex = currentStartIndex + this.visibleRowCount + this.preparedRowCount / 2;

    requestAnimationFrame(_ => {
      this.render(startIndex, endIndex, isScrollDown);
    });
  };

  render = (startIndex, endIndex, isScrollDown) => {
    const dataLength = this.dataList.length;
    if (startIndex < 0) startIndex = 0;
    if (endIndex > dataLength) {
      if (this.fetchData && !this.isPending) {
        this.isPending = true;
        this.handleLoading(this.isPending);
        this.fetchData(this.options)
          .then(data => {
            this.dataList = [...this.dataList, ...data];
            this.render(endIndex, this.dataList.length, isScrollDown);
            this.isPending = false;
            this.handleLoading(this.isPending);
            return;
          })
          .catch(e => {
            this.handleLoading(false);
            console.log(e);
          });
      }
      endIndex = dataLength;
    }

    if (startIndex >= dataLength || dataLength === 0 || endIndex <= 0) return;
    let _html = this.getListHTML(startIndex, endIndex - startIndex);
    let _fragement = htmlStringToFragment(_html);
    this.append(_fragement, isScrollDown);

    let _lastRowIndex = parseInt(this.cachedItems[this.cachedItems.length - 1].dataset.index, 10);
    if (_lastRowIndex > this.lastRowIndex) {
      this.lastRowIndex = _lastRowIndex;

      requestAnimationFrame(_ => {
        this.parent.style.height = this.lastRowIndex * this.rowHeight + 'px';
      });
    }
  };

  remove = (start, end) => {
    for (let i = start; i <= end; i++) {
      this.parent.removeChild(this.cachedItems[i]);
    }
  };

  append = (fragment, isScrollDown) => {
    if (isScrollDown) {
      console.log('내려감');
      this.parent.appendChild(fragment);
    } else {
      console.log('올라감');
      this.parent.insertBefore(fragment, this.parent.children[0]);
    }

    this.cachedItems = this.parent.querySelectorAll(this.rowSelector);
    this.update(isScrollDown);
  };

  update = isScrollDown => {
    let uselessRowCount;
    let invisibleRowCount;
    let invisibleRowHeight;

    if (isScrollDown) {
      let firstElem = this.cachedItems[0];
      invisibleRowHeight = firstElem.getBoundingClientRect().top - this.componentBCR.top;
      if (invisibleRowHeight < 0) {
        invisibleRowCount = Math.floor(Math.abs(invisibleRowHeight) / this.rowHeight);
        uselessRowCount = invisibleRowCount - this.preparedRowCount;
        if (uselessRowCount > 0) {
          requestAnimationFrame(_ => {
            this.remove(0, uselessRowCount);
            this.cachedItems = this.parent.querySelectorAll(this.rowSelector);
          });
        }
      }
    } else {
      let lastElem = this.cachedItems[this.cachedItems.length - 1];
      invisibleRowHeight = lastElem.getBoundingClientRect().bottom - this.componentBCR.bottom;
      if (invisibleRowHeight > 0) {
        invisibleRowCount = Math.floor(invisibleRowHeight / this.rowHeight);
        uselessRowCount = invisibleRowCount - this.preparedRowCount;
        if (uselessRowCount > 0) {
          requestAnimationFrame(_ => {
            this.remove(this.cachedItems.length - 1 - uselessRowCount, this.cachedItems.length - 1);
            this.cachedItems = this.parent.querySelectorAll(this.rowSelector);
          });
        }
      }
    }
  };

  getListHTML = (startIndex, length) => {
    let html = '';
    for (let i = startIndex; i < startIndex + length; i++) {
      html += this.templateHTML(this.rowHeight, i, this.dataList[i]);
    }
    return html;
  };
};

export default InfiniteScroll;
