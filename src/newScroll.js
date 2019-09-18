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
    this.lastTop = 0;

    this.container.scrollTop = 0;
    this.container.style.position = 'relative';

    // this.container.removeEventListener('scroll', this.scrollEvent);
    // this.container.addEventListener('scroll', this.scrollEvent);
    this.init();
  }

  init = () => {
    this.setItems(1, true);
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
    this.container.style.height = this.lastEl.scrollTop + this.lastEl.height + 'px';
    // 지워야하는 컨텐츠 확인.
  };

  updateElements = (items, isScrollDown) => {
    let groupId, lastScrollTop;
    const itemGroupId = parseInt(items[0].el.getAttribute('groupId'));
    if (isScrollDown) {
      groupId = itemGroupId - 1;
      if (groupId < 1) groupId = 1;
      lastScrollTop = this.items[groupId][this.items[groupId].length - 1].scrollTop;

      if (!lastScrollTop) lastScrollTop = 0;
      items.forEach(item => {
        item.scrollTop = lastScrollTop;
        item.height = item.el.offsetHeight;
        item.el.style.top = lastScrollTop + 'px';
        lastScrollTop = lastScrollTop + item.height;
      });
    } else {
      // 0을 업데이트해야한다면 1을 기준으로
      groupId = itemGroupId + 1;
      lastScrollTop = this.items[groupId][0].scrollTop;

      // 반대순서로.
      for (let i = items.length - 1; i >= 0; i--) {
        item.height = item.el.offsetHeight;
        item.scrollTop = lastScrollTop - item.height;
        item.el.style.top = item.scrollTop + 'px';
        lastScrollTop = item.scrollTop;
      }
    }
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
        const items = Scroll.getItems(this.template, data, groupId);
        this.items[groupId] = items;
        requestAnimationFrame(() => {
          this.render(items, isScrollDown);
        });
      });
    } else {
      if (this.items[groupId]) {
        requestAnimationFrame(() => {
          this.render(this.items[groupId], isScrollDown);
        });
      } else {
        this.loader.supply(groupId).then(data => {
          // 매번 다음거를 리턴해야할것인데, generator를 써야할듯.(로더가 캐시도 가지고 있어야할듯)
          const items = Scroll.getItems(this.template, data, groupId);
          this.items[groupId] = items;

          requestAnimationFrame(() => {
            this.render(items, isScrollDown);
          });
        });
      }
    }
  }

  // 캐시에 있으면 그냥 갖다 붙이면 되는건데...이걸 또 어케 분기를...완전스파게티 제데로 볶았네
  // ScrollItemType이 들어와야한다.
  render(items, isScrollDown) {
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

    this.updateElements(items, isScrollDown);
    // this.remove(isScrollDown);
    // this.updateContainer();
  }

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
