class Scroll {
  static DOWN = 'scroll/DOWN';
  static UP = 'scroll/UP';

  static getItems = (template, data, groupId) => {
    return data.map(d => {
      const dummy = document.createElement('div');
      dummy.innerHTML = template(d);
      const el = dummy.childNodes[0];
      el.style.position = 'absolute';
      el.setAttribute('inert', '');
      el.setAttribute('groupId', groupId);
      return {el};
    });
  };

  constructor(wrapper, container, template, loader) {
    this.container = container;
    this.wrapper = wrapper;
    this.wrapperBCR = this.wrapper.getBoundingClientRect();
    this.template = template;
    this.loader = loader;

    this.items = [];
    this.firstGroup = [];
    this.lastGroup = [];
    this.lastScrollTop = 0; // 아씨 이거 뭐지? 문서를 만들어둬야겠다 뭐가뭔지 모르겠네 시벌

    this.container.scrollTop = 0;
    this.container.style.position = 'relative';

    this.wrapper.removeEventListener('scroll', this.scrollEvent);
    this.wrapper.addEventListener('scroll', this.scrollEvent);
    this.init();
    // 렌더 동시성 문제 해결해야함.
    // this.isRendering
    this.isPending = false;

    window.ScrollInstance = this;
  }

  init = () => {
    this.setItems(1, true);
    // this.scrollEvent(); 원래 이게 와야 함 그러므로 seItems의 default가 존재해야한다.
  };

  isScrollDown = () => {
    const currentTop = this.wrapper.scrollTop;
    const backupLastTop = this.lastScrollTop;
    this.lastScrollTop = currentTop;
    if (currentTop > backupLastTop) {
      return true;
    }

    return false;
  };

  getGroupId = item => {
    const {el} = item;
    const groupId = parseInt(el.getAttribute('groupId'), 10);
    return groupId;
  };

  updateContainer = () => {
    // 높이 변경
    const lastItem = this.lastGroup[this.lastGroup.length - 1];
    this.container.style.height = lastItem.scrollTop + lastItem.height + 'px';
    // 지워야하는 컨텐츠 확인.
  };

  isOverFlow = () => {
    // 넘치지 않았다면 setItem이나 질러야하지.
    //     domBCR = $0.getBoundingClientRect()
    // DOMRect {x: 0, y: 0, width: 619, height: 306, top: 0, …}
    // contBCR = ScrollInstance.container.getBoundingClientRect()
    // DOMRect {x: 0, y: -226, width: 619, height: 361, top: -226, …}
    // .container는 overflow-y=auto;랑 height 100%주던가 고정값이 있던가 해야함.
  };

  // 이미렏더된 아이템의 위치를 조정함.
  updateElements = (currentGroupId, isScrollDown) => {
    let groupId, lastScrollTop;

    const currentItems = this.items[currentGroupId];
    if (isScrollDown) {
      // 스크롤이 정방향인 경우
      groupId = currentGroupId - 1;
      if (groupId < 1) groupId = 1;
      lastScrollTop =
        this.items[groupId][this.items[groupId].length - 1].scrollTop +
        currentItems[0].el.offsetHeight;

      if (!lastScrollTop) lastScrollTop = 0;
      currentItems.forEach(item => {
        item.scrollTop = lastScrollTop;
        item.height = item.el.offsetHeight;
        item.el.style.top = lastScrollTop + 'px';
        lastScrollTop = lastScrollTop + item.height;
      });

      this.lastGroup = this.items[currentGroupId];
      if (!this.firstGroup.length) this.firstGroup = this.items[groupId];
    } else {
      // 스크롤이 역방향인 경우
      // 0을 업데이트 해야한다면 1을 기준으로
      groupId = currentGroupId + 1;
      lastScrollTop = this.items[groupId][0].scrollTop;

      // 반대순서로.
      for (let i = currentItems.length - 1; i >= 0; i--) {
        currentItems[i].height = currentItems[i].el.offsetHeight;
        currentItems[i].scrollTop = lastScrollTop - currentItems[i].height;
        currentItems[i].el.style.top = currentItems[i].scrollTop + 'px';
        lastScrollTop = currentItems[i].scrollTop;
      }

      this.firstGroup = this.items[currentGroupId];
      if (!this.lastGroup.length) this.lastGroup = this.items[groupId];
    }

    console.log(this);
  };

  scrollEvent = () => {
    const isScrollDown = this.isScrollDown();
    if (isScrollDown) {
      // 아래방향
      // 현재 스크롤 위치가 라스트트리거가 보이는 위치라면
      const lastGroupItem = this.lastGroup[0];
      const lastGroupId = this.getGroupId(lastGroupItem);
      if (this.wrapper.scrollTop > lastGroupItem.scrollTop) {
        // append합니다.
        // console.log(lastGroupItem);
        this.setItems(lastGroupId + 1, isScrollDown);
      }
      // 끝나면 첫,마지막 아이템 갱신 this.update()
    } else {
      // 위쪽방향
      // 현재 스크롤 위치가 첫번째 트리거가 보이는 위치라면
      const firstGroupItem = this.firstGroup[this.firstGroup.length - 1]; // 마지막 자식
      const firstGroupId = this.getGroupId(firstGroupItem);
      if (this.wrapper.scrollTop < firstGroupItem.scrollTop && firstGroupId !== 1) {
        // preppend 합니다.
        this.setItems(firstGroupId - 1, isScrollDown);
      }
      // 끝나면 첫,마지막 아이템 갱신 this.update();
    }
  };

  // TODO 리팩토링
  // on egjs의 on같은게 필요해 내가 fetchData해줬던거처럼.
  setItems(groupId = 1, isScrollDown = true) {
    if (this.items.length === 0) {
      // console.log('길이가 0인경우');
      this.loader.supply(groupId).then(data => {
        let items = Scroll.getItems(this.template, data, groupId);
        this.items[groupId] = items; // groupId로 id저장
        items = null;
        requestAnimationFrame(() => {
          this.render(groupId, isScrollDown);
        });
      });
    } else {
      if (this.items[groupId]) {
        // console.log('아이템이 있는경우', groupId);
        requestAnimationFrame(() => {
          this.render(groupId, isScrollDown);
        });
      } else {
        // console.log('아이템이 없는경우', groupId);
        if (!this.pending) {
          this.pending = true;
          this.loader.supply(groupId).then(data => {
            // 매번 다음거를 리턴해야할것인데, generator를 써야할듯.(로더가 캐시도 가지고 있어야할듯)
            let items = Scroll.getItems(this.template, data, groupId);
            this.items[groupId] = items;
            items = null;

            requestAnimationFrame(() => {
              this.render(groupId, isScrollDown);
              this.pending = false;
            });
          });
        }
      }
    }
  }

  // 캐시에 있으면 그냥 갖다 붙이면 되는건데...이걸 또 어케 분기를...완전스파게티 제데로 볶았네
  // ScrollItemType이 들어와야한다.
  render(groupId, isScrollDown) {
    const items = this.items[groupId];
    const frag = items.reduce((acc, item) => {
      acc.appendChild(item.el);
      return acc;
    }, document.createDocumentFragment());

    if (isScrollDown) {
      // 아래로 내려가는 중이라먄 이걸 아니라면
      this.container.appendChild(frag);
    } else {
      // 아니라면
      this.container.insertBefore(frag, this.container.children[0]);
    }

    this.updateElements(groupId, isScrollDown);
    this.updateContainer();
    this.removeElements(isScrollDown);
  }

  // 보이지 않아도 되는 영역 제거
  // 유지하는 범위는 this.wrapperBCR.height * 3
  removeElements = isScrollDown => {
    // firstGroup의 마지막 요소가(el)
    console.log(isScrollDown);
    const firstGroupLastItem = this.firstGroup[this.firstGroup.length - 1];
    const lastGroupFirstItem = this.lastGroup[0];
    const firstGroupId = this.getGroupId(firstGroupLastItem);
    const lastGroupId = this.getGroupId(lastGroupFirstItem);

    if (isScrollDown) {
      if (
        firstGroupLastItem.scrollTop <
        lastGroupFirstItem.scrollTop - this.wrapperBCR.height * 3
      ) {
        this.firstGroup.forEach(item => {
          this.container.removeChild(item.el);
        });

        this.firstGroup = this.items[firstGroupId + 1];
      }
    } else {
      if (
        firstGroupLastItem.scrollTop + firstGroupLastItem.height + this.wrapperBCR.height * 3 <
        lastGroupFirstItem.scrollTop
      ) {
        this.lastGroup.forEach(item => {
          this.container.removeChild(item.el);
        });
        this.lastGroup = this.items[lastGroupId - 1];
      }
    }
  };
}

export default Scroll;
