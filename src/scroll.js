import { qs, htmlStringToFragment, debounce } from './utils';

const InfiniteScroll = class {
    static setScroll = (obj) => {
        return new InfiniteScroll().setScroll(obj);
    }

    setScroll = obj => {
        const { componentSelector, parentSelector, rowSelector, rowHeight, templateHTML, dataList = [], options } = obj;
        this.component = qs(componentSelector);
        this.parent = qs(parentSelector);
        this.rowSelector = rowSelector;
        // this.isScrollDown = true;
        this.lastScrollTop = 0;
        this.lastRowIndex = -1;
        this.cachedItems = [];
        this.rowHeight = rowHeight;
        this.templateHTML = templateHTML;
        this.dataList = dataList;
        this.options = options;

        this.parent.style.position = "relative";
        this.component.scrollTop = 0;
        this.visibleRowCount = Math.ceil(this.component.clientHeight / this.rowHeight);

        let _preparedRowCount = Math.max(this.visibleRowCount, 20);
        this.preparedRowCount = _preparedRowCount + _preparedRowCount % 2;

        this.component.removeEventListener("scroll", this.handleScrollEvent);
        this.component.addEventListener("scroll", this.handleScrollEvent);
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
        const isScrollDown = (scrollTop > this.lastScrollTop);

        if (isScrollDown) {
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
            this.handleScroll(false);
        } else if (firstChildRect.top > componentRect.top - (5 * this.rowHeight)) {
            const endCount = parseInt(firstChild.dataset.index, 10);
            const startCount = endCount - this.preparedRowCount;
            this.render(startCount, endCount, false);
        }
    }

    handleScroll = (isScrollDown = true) => {
        const currentStartIndex = Math.floor((this.component.scrollTop) / this.rowHeight);
        const startIndex = currentStartIndex - this.preparedRowCount / 2;
        const endIndex = currentStartIndex + this.visibleRowCount + this.preparedRowCount / 2;

        this.render(startIndex, endIndex, isScrollDown);
    }

    getData = async (query) => {
        const response = await fetch(`https://swapi.co/api/people/?page=${query + 1}`);
        this.options.query = query + 1;
        const data = await response.json();
        return data.results;
    }

    render = (startIndex, endIndex, isScrollDown) => {
        const { query } = this.options;
        const dataLength = this.dataList.length;
        if (startIndex < 0) startIndex = 0;
        if (endIndex > dataLength){
            if(this.getData && !this.options.isPending){
                this.options.isPending = true;
                this.getData(query).then(data => {
                    this.dataList = [...this.dataList, ...data];
                    window.ddddataList = this.dataList;
                    this.render(endIndex, ddddataList.length, isScrollDown);
                    this.options.isPending = false;
                    return;
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
            this.parent.style.height = this.lastRowIndex * this.rowHeight + 'px';
        }
    }

    remove = (start, end) => {
        for (let i = start; i <= end; i++) {
            this.parent.removeChild(this.cachedItems[i]);
        }
    }

    append = (fragment, isScrollDown) => {
        if (isScrollDown) {
            console.log("내려감");
            this.parent.appendChild(fragment);
        } else {
            console.log("올라감");
            this.parent.insertBefore(fragment, this.parent.children[0]);
        }

        this.cachedItems = this.parent.querySelectorAll(this.rowSelector);
        this.update(isScrollDown);
    }

    update = (isScrollDown) => {
        let uselessRowCount;
        let invisibleRowCount;
        let invisibleRowHeight;

        if (isScrollDown) {
            let firstElem = this.cachedItems[0];
            invisibleRowHeight = (firstElem.getBoundingClientRect().top - this.component.getBoundingClientRect().top);
            if (invisibleRowHeight < 0) {
                invisibleRowCount = Math.floor(Math.abs(invisibleRowHeight) / this.rowHeight);
                uselessRowCount = (invisibleRowCount - this.preparedRowCount);
                if (uselessRowCount > 0) {
                    this.remove(0, uselessRowCount);
                    this.cachedItems = this.parent.querySelectorAll(this.rowSelector);
                }
            }
        } else {
            let lastElem = this.cachedItems[this.cachedItems.length - 1];
            invisibleRowHeight = (lastElem.getBoundingClientRect().bottom - this.component.getBoundingClientRect().bottom);
            if (invisibleRowHeight > 0) {
                invisibleRowCount = Math.floor(invisibleRowHeight / this.rowHeight);
                uselessRowCount = invisibleRowCount - this.preparedRowCount;
                if (uselessRowCount > 0) {
                    this.remove((this.cachedItems.length-1) - uselessRowCount, this.cachedItems.length-1);
                    this.cachedItems = this.parent.querySelectorAll(this.rowSelector);
                }
            }
        }
    }

    // utils로 빼기
    getListHTML = (startIndex, length) => {
        let html = '';
        for (let i = startIndex; i < startIndex + length; i++) {
            html += this.templateHTML(this.rowHeight, i, this.dataList[i]);
        }
        return html;
    }
}

export default InfiniteScroll;