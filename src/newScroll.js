const Scroll = class {
  constructor(template, options) {
    this.observer = new IntersectionObserver(this.observerCallback, options);
  }

  observerCallback = () => {};
};

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

*/
