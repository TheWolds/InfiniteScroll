import { qs, htmlStringToFragment } from './utils';

const InfiniteScroll = class {
    static setScroll = (target, obj) => {
        return new InfiniteScroll(target).setScroll(obj);
    }

    constructor(target) {
        const { component, parent, itemSelector } = target;
        this.component = qs(component);
        this.parent = qs(parent);
        this.itemSelector = itemSelector;
    }

    setScroll = obj => {
        const { rowHeight, templateHTML, dataList = [] } = obj;
        this.isScrollDown = true;
        this.lastScrollTop = 0;
        this.lastRowIndex = -1;
        this.cachedItems = [];
        this.rowHeight = rowHeight;
        this.templateHTML = templateHTML;
        this.dataList = dataList;

        this.parent.style.position = "relative";
        this.component.scrollTop = 0;
        this.visibleRowCount = Math.ceil(this.component.clientHeight / this.rowHeight);

        let _preparedRowCount = Math.max(this.visibleRowCount, 20);
        this.preparedRowCount = _preparedRowCount + _preparedRowCount % 2;

        component.removeEventListener("scroll", this.handleScrollEvent);
        component.addEventListener("scroll", this.handleScrollEvent);
        this.handleScroll();
    }

    handleScrollEvent = () => {
        requestAnimationFrame(() => {
            this._handleScrollEvent();
        });
    }

    _handleScrollEvent = () => {
        let scrollFunc;
        const scrollTop = this.component.scrollTop;
        this.isScrollDown = (scrollTop > this.lastScrollTop);

        if (this.isScrollDown) {
            scrollFunc = this.handleScrollDown;
        } else {
            scrollFunc = this.handleScrollUp;
        }
        this.lastScrollTop = scrollTop;
        scrollFunc();
    }

    handleScrollDown = () => {
        const lastChild = this.cachedItems[this.cachedItems.length - 1];
        const lastChildRect = lastChild.getBoundingClientRect();
        const componentRect = this.component.getBoundingClientRect();

        if (lastChildRect.bottom < 0) {
            const lastIndex = parseInt(lastChild.dataset.index, 10);
            if (lastIndex + 1 < this.dataList.length) {
                this.handleScroll();
            }
        } else if (lastChildRect.bottom < componentRect.bottom + (5 * this.rowHeight)) {
            const startIndex = parseInt(lastChild.dataset.index, 10) + 1;
            const endIndex = startIndex + this.preparedRowCount;
            this.render(startIndex, endIndex, true);
        }
    }

    handleScrollUp = () => {
        const firstChild = this.cachedItems[0];
        const firstChildRect = firstChild.getBoundingClientRect();
        const componentRect = this.component.getBoundingClientRect();
        if (firstChildRect.top > componentRect.bottom) {
            this.handleScroll();
        } else if (firstChildRect.top > componentRect.top - (5 * this.rowHeight)) {
            const endCount = parseInt(firstChild.dataset.index, 10);
            const startCount = endCount - this.preparedRowCount;
            this.render(startCount, endCount);
        }
    }

    handleScroll = () => {
        const currentStartIndex = Math.floor((this.component.scrollTop) / this.rowHeight);
        const startIndex = currentStartIndex - this.preparedRowCount / 2;
        const endIndex = currentStartIndex + this.visibleRowCount + this.preparedRowCount / 2;

        this.render(startIndex, endIndex);
    }

    render = (startIndex, endIndex) => {
        const dataLength = this.dataList.length;
        if (startIndex < 0) startIndex = 0;
        if (endIndex > dataLength) endIndex = dataLength;
        if (startIndex >= dataLength || dataLength === 0 || endIndex <= 0) return;

        let _html = this.getListHTML(startIndex, endIndex - startIndex);
        let _fragement = htmlStringToFragment(_html);
        this.append(_fragement);

        let _lastRowIndex = this.cachedItems[this.cachedItems.length - 1].dataset.index;
        if (_lastRowIndex > this.lastRowIndex) {
            console.log(_lastRowIndex, this.lastRowIndex);
            this.lastRowIndex = _lastRowIndex
            this.parent.style.height = this.lastRowIndex * this.cachedItems[this.cachedItems.length - 1].offsetHeight + 'px';
        }
    }

    remove = (start, end) => {
        for (let i = start; i <= end; i++) {
            this.parent.removeChild(this.cachedItems[i]);
        }
    }

    append = fragment => {
        if (this.isScrollDown) {
            this.parent.appendChild(fragment);
        } else {
            this.parent.insertBefore(fragment, this.parent.children[0]);
        }

        this.cachedItems = this.parent.querySelectorAll(this.itemSelector);
        this.update();
    }

    update = () => {
        let extraChildCount;
        let invisibleRowCount;
        let invisibleRowHeight;

        if (this.isScrollDown) {
            let firstElem = this.cachedItems[0];
            invisibleRowHeight = (firstElem.getBoundingClientRect().top - this.component.getBoundingClientRect().top);
            if (invisibleRowHeight < 0) {
                invisibleRowCount = Math.floor(Math.abs(invisibleRowHeight) / this.rowHeight);
                extraChildCount = (invisibleRowCount - this.preparedRowCount);
                if (extraChildCount > 0) {
                    this.remove(0, extraChildCount);
                    this.cachedItems = this.parent.querySelectorAll(this.itemSelector);
                }
            }
        } else {
            let lastElem = this.cachedItems[this.cachedItems.length - 1];
            invisibleRowHeight = (lastElem.getBoundingClientRect().bottom - this.component.getBoundingClientRect().bottom);
            if (invisibleRowHeight > 0) {
                invisibleRowCount = Math.floor(invisibleRowHeight / this.rowHeight);
                extraChildCount = invisibleRowCount - this.preparedRowCount;
                if (extraChildCount > 0) {
                    this.remove((this.cachedItems.length-1) - extraChildCount, this.cachedItems.length-1);
                    this.cachedItems = this.parent.querySelectorAll(this.itemSelector);
                }
            }
        }
    }

    // utils로 빼기
    getListHTML = (startIndex, length) => {
        console.log(startIndex)
        let html = '';
        for (let i = startIndex; i < startIndex + length; i++) {
            html += this.templateHTML(this.rowHeight, i, this.dataList[i]);
        }
        return html;
    }
}

export default InfiniteScroll;