import InfiniteScroll from "./scroll";
import './style.scss';

const itemHTML = (rowHeight, index, data) => {
    let top = index * rowHeight;
    return `<li class="item" style="position:absolute; top:${top}px;" data-index=${index}>
        ${data.email}
    </li>`
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("https://jsonplaceholder.typicode.com/comments").then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error("Error");
        }
    }).then(data => {
        InfiniteScroll.setScroll({
            componentSelector: '#component',
            parentSelector: '#list',
            rowSelector: '.item',
            dataList: data,
            rowHeight: 50,
            templateHTML: itemHTML
        });
    });
});