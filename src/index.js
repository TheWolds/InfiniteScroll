import InfiniteScroll from "./scroll";
import './style.scss';

const itemHTML = (rowHeight, index, data) => {
    let top = index * rowHeight;
    return `<li class="item" style="position:absolute; top:${top}px;" data-index=${index}>
        ${data.name}
    </li>`
}

async function fetchData(query) {
    const response = await fetch(`https://swapi.co/api/people/?page=${query + 1}`);
    this.options.query = query + 1;
    const data = await response.json();
    return data.results;
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(`https://swapi.co/api/people/?page=1`).then(res => {
    // fetch(`https://jsonplaceholder.typicode.com/comments`).then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error("Error");
        }
    }).then(data => {
        const scroll = InfiniteScroll.setScroll({
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

        scroll.on({
            fetchData
        });
    });
});