// Renderer는 지금 인덱스를 관리할 필요가 없어
// 그냥 데이터 인덱스 받아서 업데이트 붙이고 지우고 갈고 어쩌구
class Renderer {
  prepend = () => {};

  append = () => {};

  render = (startIndex, endIndex) => {
    const dataLength = this.dataList.length;
    if (startIndex < 0) startIndex = 0;
    if (endIndex > dataLength) {
      if (this.fetchData && !this.isPending) {
        this.isPending = true;
        this.handleLoading(this.isPending);
        this.fetchData(this.options)
          .then(data => {
            this.dataList = [...this.dataList, ...data];
            this.render(endIndex, this.dataList.length);
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
    let fragment = htmlStringToFragment(
      getHtmlString(startIndex, endIndex - startIndex, this.element, this.data)
    );
    this.append(fragment);

    let _lastRowIndex = parseInt(this.cachedItems[this.cachedItems.length - 1].dataset.index, 10);
    if (_lastRowIndex > this.lastRowIndex) {
      this.lastRowIndex = _lastRowIndex;

      requestAnimationFrame(_ => {
        this.parent.style.height = this.lastRowIndex * this.rowHeight + 'px';
      });
    }
  };

  remove = () => {};

  update = () => {};
}

export default Renderer;
