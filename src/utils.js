export const err = v => {
    if (process.env.NODE_ENV === "development") {
        throw v;
    } else {
        console.log(v);
    }
}

export const qs = (selector, parent) => {
    if (!selector) err("선택자를 넣어주세요");
    if (typeof selector !== "string") err("선택자가 문자열이 아닙니다.");
    if (!parent) parent = document;
    if (selector[0] === "#") {
        if (parent !== document) {
            err("해당 parent는 getElementById를 사용할 수 없습니다.");
        }
        return document.getElementById(selector.slice(1));
    }
    return parent.querySelector(selector);
}

export const htmlStringToFragment = html => {
    if (typeof html !== "string") err("html 문자열이 아닙니다.");
    return document.createRange().createContextualFragment(html);
}
