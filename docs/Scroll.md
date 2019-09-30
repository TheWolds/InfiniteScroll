문서로 정리하지 않으면 안되겠다.

사용자가 scroll을 부르면 다음과 같은 형태로 부르게 된다. 


```js
scroll('.container', template, api);
```



내부에서는 요런식으로 된다.

```js
const scroll = (selector, template, api) => {
    const loader = new DataLoader(api);
    new Scroll(wrapper, container, template, loader);
}
```

Scroll은 다음과 같이 동작한다.

첫 렌더시

init ---> scrollEvent ---> setItems ---> render


업데이트시 

scrollEvent ---> setItems ---> render


render의 흐름은

append -> updateElement --> updateContainer

순이다.


```js
const firstGroupItem = this.firstGroup[this.firstGroup.length-1]; // 첫번째 그룹의 꽁지가 보이면 위쪽을불러오고

const lastGroupItem = this.lastGroup[0]; // 마지막 그룹의 가장 첫번째 녀석이 보이면 아래를 불러온다
```
