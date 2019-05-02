import InfiniteScroll from "./scroll";
import './style.scss';

const itemHTML = (rowHeight, index, data) => {
    let top = index * rowHeight;
    return `<li class="item" style="position:absolute; top:${top}px;" data-index=${index}>
        ${data.name}
    </li>`
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(`https://swapi.co/api/people/?page=1`).then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error("Error");
        }
    }).then(data => {
        console.log(data);
        InfiniteScroll.setScroll({
            componentSelector: '#component',
            parentSelector: '#list',
            rowSelector: '.item',
            dataList: data.results,
            rowHeight: 50,
            templateHTML: itemHTML,
            options:{
                query: 1,
                isPending: false
            }
        });
    });
});