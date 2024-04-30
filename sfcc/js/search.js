async function getData() {
    const response = await fetch('https://salesforcecommercecloud.github.io/b2c-dev-doc/search.json');
    const data = await response.json();
    return data;
}

const data = getData();
let ret;
data.then(result => ret = result)

function spliceAtFirstNonDW(array) {
    array.shift();
    const idx = array.findIndex(x => x.indexOf('dw') !== 0);
    idx && array.splice(idx);
}

function objectPath(content) {
    let values = content.substring(content.search(/(dw(\.\w{1,30}){2,}\s)+/), content.search(/\s(Properties|Constants)\s/)).replaceAll(/dw(\.\w+)+\s/g, '');
    values = content.match(/dw\..{2,20}\..+\s/);

    let includes;
    try {
        let valuesArr = values[0].split(/\s?dw\./);
        includes = valuesArr.join(' dw.').split(' ');
        if (content.indexOf('dw.order.ProductLineItem') !== -1) {
            var dbg = 1;
        }
        spliceAtFirstNonDW(includes);
        console.log('i: ' + includes);
    } catch (error) {
        console.log('e: ' + error)
        includes = ''
    }
    return includes;
}

/**
 * 
 * @param {*} page search.json data
 * @param {*} val search term
 * @returns 
 */
function formatPage(page, val) {
    let { url, title, content } = page;
    if (page.title.indexOf('Class ') === 0) {
        content = content.substring(content.search(/(dw(\.\w{1,30}){2,}\s)+/), content.search(/\s(Properties|Constants)\s/)).replaceAll(/dw(\.\w+)+\s/g, '');
    }
    let html = '<div id="resultBlock"><a href="https://salesforcecommercecloud.github.io' + url + '" target="_blank"><span style="link-font">' + title + '</span></a>' +
        '<br><p>' + content.substring(0, 350) + (content.length >= 350 ? '...' : '') + '</p><br></div>';
    return html;
}

function searchList() {
    const val = document.getElementById('searchTerm').value;
    const sval = document.getElementById('searchTerm').value.toLowerCase();
    if (val.length === 0) return;
    let results =
        ret.filter(page => Object.keys(page).length &&
            (page.content?.toLowerCase().indexOf(sval) !== -1 || page.title?.toLowerCase().indexOf(sval) !== -1) &&
            page.url?.indexOf('/upcoming/') !== -1 &&
            page.title?.indexOf('Server-side javascript') === -1);
    let sortedResults = [];
    if (sval.indexOf('class') === -1) {
        const searchTerm = 'class ' + sval;
        let theOne = null, hits = [], misses = [], children = [];

        results.some(x => {
            if (x.title.toLowerCase() === searchTerm) {
                theOne = x;
            }
        });

        let searchObjectPath = [];
        if (theOne) {
            searchObjectPath = objectPath(theOne.content).pop();
        }

        results.forEach(x => {
            if (x.title.toLowerCase() === searchTerm) {
                return;
            }

            const objectPaths = objectPath(x.content);
            if (objectPaths.length > 0 && objectPaths.indexOf(searchObjectPath) !== -1) {
                children.push(x);
                return;
            }

            if (x.title.toLowerCase().indexOf(searchTerm) !== -1) {
                hits.push(x);
            } else {
                misses.push(x);
            }
        })

        if (theOne !== null) {
            sortedResults = [theOne];
        }
        sortedResults = [...sortedResults, ...children, ...hits, ...misses];

    } else {
        results.unshift(results.splice(results.findIndex(x => x.title.toLowerCase() === searchTerm), 1)[0]);
        sortedResults = results;
    }
    results = sortedResults.map(page => formatPage(page, val)).join('');

    document.getElementById('searchResult').innerHTML = results;
}