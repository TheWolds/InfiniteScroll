class Scroll {
  static DOWN = 'scroll/DOWN';
  static UP = 'scroll/UP';

  static getItems = (template, data, groupId) => {
    console.log(groupId);
    const dummy = document.createElement('div');
    return data.map(d => {
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

  updateElements = (startIndex, lastIndex) => {
    let item, tmpScrollTop;
    for (let i = startIndex; i <= lastIndex; i++) {
      item = this.items[i];
      tmpScrollTop = items[i - 1].scrollTop + items[i - 1].height;
      item.el.top = tmpScrollTop;
      item.scrollTop = tmpScrollTop;
      item.height = item.el.offsetHeight;
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

  // on egjs의 on같은게 필요해 내가 fetchData해줬던거처럼.
  setItems(groupId, isScrollDown) {
    if (this.items.length === 0) {
      this.loader.supply(groupId).then(data => {
        console.log(groupId);
        const items = Scroll.getItems(this.template, data, groupId);
        this.items[groupId] = [...items];

        requestAnimationFrame(() => {
          this.render(this.items[groupId], isScrollDown);
        });
      });
    }

    if (this.items[groupId]) {
      requestAnimationFrame(() => {
        this.render(this.items[groupId], isScrollDown);
      });
    } else {
      this.loader.supply(groupId).then(data => {
        // 매번 다음거를 리턴해야할것인데, generator를 써야할듯.(로더가 캐시도 가지고 있어야할듯)
        const items = Scroll.getItems(this.template, data, groupId);
        this.items[groupId] = [...items];

        requestAnimationFrame(() => {
          this.render(this.items[groupId], isScrollDown);
        });
      });
    }
  }

  // ScrollItemType이 들어와야한다.
  render(items, isScrollDown) {
    const frag = items.reduce(
      (acc, item) => acc.appendChild(item.el),
      document.createDocumentFragment()
    );

    let startIndex, lastIndex;
    if (isScrollDown) {
      // 아래로 내려가는 중이라먄 이걸 아니라면
      this.container.appendChild(frag);
    } else {
      // 아니라면
      this.parent.insertBefore(fragment, this.container.children[0]);
    }

    this.updateElements(startIndex, lastIndex);
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

/*
const item = {
    scrollTop,
    el,
    groupID,
}

getScrollDirection = () => {
    // 위인지 아래인지 & 현재 스크롤 위치
    return {
        direction: Scroll.UP,
        scrollTop,
    }
}

handleScroll(){
    // 아래방향
    // 현재 스크롤 위치가 라스트트리거가 보이는 위치라면
    direction.scrollTop > lastItem.scrollTop
    // append합니다.
    // 끝나면 첫,마지막 아이템 갱신 this.update()

    // 위쪽방향
    // 현재 스크롤 위치가 첫번째 트리거가 보이는 위치라면
    direction.scrollTop > fistItem.scrollTop && fistItem.groupId !== 1
    // preppend 합니다.
    // 끝나면 첫,마지막 아이템 갱신 this.update();
}

update(){
    // 젤 위,아래 item 갱신
}

append = () => {
    // append할 데이터를 가져옵니다.
    // 우선 캐시에 있는지 확인합니다.(items.indexOf(groupId가 n인녀석)) lastIndexOF(n)
    // ---> (캐시를 배열형으로 하는거보다 객체형이 좋을거 같기도한데,,)
    // 있다면 그부분만 잘라다가 붙여주기
    // 없다면 로드합니다. await ---> 캐시데이터에 추가합니다.(아이템화 시킴) --> 캐시에 저장해야함
    // https://github.com/naver/egjs-infinitegrid/blob/master/src/Infinite.ts#L121
}

prepend = () => {
    // 캐시된 데이터를 가져옵니다.(groupId에 해당하는 데이터)
    // 위와 비슷합니다.
}
*/

/*
// 배열에 엘리먼트를 저장한뒤 해당 엘리먼트를 돔에서 지워도 배열에는 남아있다.

## 아이템화

아이템 안에 엘리먼트를 넣어두면 다시 돔을 만들 필요가 없다!
stringToHtml = string => {
    const range = document.createRange();
    range.selectNode(document.body);
    const fragment = range.createContextualFragment(string);
    return fragment.firstChild;
}

data -> item {
    srollTOP: 더미위치,
    el: stringToHtml(template(data)),

}

이걸 하려고 하는 이유는 absolute를 쓰기 위해서임. 그냥 아이템을 빼버리면 엄청난 리플로우가 일어남.
우선 배열에 들어간 아이템은 크기가 저장되지 않음.
그런데 egjs에서는 그것을 해내고있음 방법을 알아야겠음. 방법 모르겠음.

그냥 absolute로 다 박은다음에 그 위치를 이후에 변경해주는건가?
그럼 나도 먼저 append하고 위치를 바꿔주자.
*/
