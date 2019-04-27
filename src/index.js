import InfiniteScroll from "./scroll";
import './style.scss';

const itemHTML = (rowHeight, i, data) => {
    console.log(rowHeight, i, data)
    let top = i * rowHeight;
    return `<li class="item" style="position:absolute; top:${top}px;" data-index=${i}>
        ${data.title}
    </li>`
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://jsonplaceholder.typicode.com/posts").then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error("Error");
        }
    }).then(dataList => {
        InfiniteScroll.setScroll({
            component: '#component',
            parent: '#list-body',
            itemSelector: '.item',
        }, {
            dataList,
            rowHeight: 50,
            templateHTML: itemHTML
        });
    });
});