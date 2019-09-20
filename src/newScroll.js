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

  constructor(container, template, loader) {
    this.container = container;
    this.containerBCR = this.container.getBoundingClientRect();
    this.template = template;
    this.loader = loader;

    this.items = [];
    this.firstGroup = [];
    this.lastGroup = [];
    // this.lastTop = 0;

    this.container.scrollTop = 0;
    this.container.style.position = 'relative';

    this.container.removeEventListener('scroll', this.scrollEvent);
    this.container.addEventListener('scroll', this.scrollEvent);
    this.init();
    // 렌더 동시성 문제 해결해야함.
    // this.isRendering
    // this.isPending

    window.ScrollInstance = this;
  }

  init = async () => {
    await this.setItems(1, true);
    await this.setItems(2, true);
    await this.setItems(3, true);
  };

  getDirection = () => {
    const currentTop = this.container.scrollTop;
    const backupLastTop = this.lastScrollTop;
    this.lastScrollTop = currentTop;

    if (currentTop > backupLastTop) {
      return Scroll.DOWN;
    }

    return Scroll.UP;
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
      lastScrollTop = this.items[groupId][this.items[groupId].length - 1].scrollTop;

      if (!lastScrollTop) lastScrollTop = 0;
      currentItems.forEach(item => {
        item.scrollTop = lastScrollTop;
        item.height = item.el.offsetHeight;
        item.el.style.top = lastScrollTop + 'px';
        lastScrollTop = lastScrollTop + item.height;
      });

      this.lastGroup = this.items[groupId];
      if (!this.firstGroup.length) this.firstGroup = this.items[groupId];
    } else {
      // 스크롤이 역방향인 경우
      // 0을 업데이트 해야한다면 1을 기준으로
      groupId = currentGroupId + 1;
      lastScrollTop = this.items[groupId][0].scrollTop;

      // 반대순서로.
      for (let i = currentItems.length - 1; i >= 0; i--) {
        item.height = item.el.offsetHeight;
        item.scrollTop = lastScrollTop - item.height;
        item.el.style.top = item.scrollTop + 'px';
        lastScrollTop = item.scrollTop;
      }

      this.firstGroup = this.items[groupId];
      if (!this.lastGroup.length) this.lastGroup = this.items[groupId];
    }

    console.log(this);
  };

  scrollEvent = () => {
    const isScrollDown = Scroll.DOWN === this.getDirection();
    if (Scroll.DOWN === this.getDirection()) {
      // 아래방향
      // 현재 스크롤 위치가 라스트트리거가 보이는 위치라면
      const lastGroupItem = this.lastGroup[0];
      if (this.lastScrollTop.scrollTop > lastGroupItem.scrollTop) {
        // append합니다.
        setItems(lastGroupItem.groupId + 1, isScrollDown);
      }
      // 끝나면 첫,마지막 아이템 갱신 this.update()
    } else {
      // 위쪽방향
      // 현재 스크롤 위치가 첫번째 트리거가 보이는 위치라면
      const firstGroupItem = this.firstGroup[0];
      if (this.lastScrollTop.scrollTop > firstGroupItem.scrollTop && firstGroupItem.groupId !== 1) {
        // preppend 합니다.
        setItems(firstGroupItem.groupId - 1, isScrollDown);
      }
      // 끝나면 첫,마지막 아이템 갱신 this.update();
    }
  };

  // TODO 리팩토링
  // on egjs의 on같은게 필요해 내가 fetchData해줬던거처럼.
  setItems(groupId, isScrollDown) {
    if (this.items.length === 0) {
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
        requestAnimationFrame(() => {
          this.render(groupId, isScrollDown);
        });
      } else {
        this.loader.supply(groupId).then(data => {
          // 매번 다음거를 리턴해야할것인데, generator를 써야할듯.(로더가 캐시도 가지고 있어야할듯)
          let items = Scroll.getItems(this.template, data, groupId);
          this.items[groupId] = items;
          items = null;

          requestAnimationFrame(() => {
            this.render(groupId, isScrollDown);
          });
        });
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
      this.parent.insertBefore(fragment, this.container.children[0]);
    }

    this.updateElements(groupId, isScrollDown);
    // this.remove(isScrollDown);
    this.updateContainer();
  }

  // 보이지 않아도 되는 영역 제거
  // 유지하는 범위는 this.containerBCR.height * 3
  remove = isScrollDown => {
    // firstGroup의 마지막 녀석
    if (isScrollDown) {
      if (
        this.firstGroup[this.firstGroup.length - 1].scrollTop <
        this.lastGroup[0].scrollTop - this.containerBCR.height * 3
      ) {
        this.firstGroup.forEach(item => {
          this.container.removeChild(item.el);
        });
      }
    } else {
      if (
        this.firstGroup[firstGroup.length - 1].scrollTop +
          this.firstGroup[firstGroup.length - 1].height +
          this.containerBCR.height * 3 <
        this.lastGroup[0].scrollTop
      ) {
        this.lastGroup.forEach(item => {
          this.container.removeChild(item.el);
        });
      }
    }
  };
}

export default Scroll;
