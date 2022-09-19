/* WARNING: This is all temporary code. Code quality was not considered */

function $(x) { return document.querySelector(x); }
function $all(x) { return document.querySelectorAll(x); }

export { 
    $,
    $all
};