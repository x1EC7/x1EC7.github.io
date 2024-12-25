async function getData() {
    const response = await fetch('https://salesforcecommercecloud.github.io/b2c-dev-doc/search.json');
    const data = await response.json();
    return data;
}

const data = getData();
let ret;
data.then(result => ret = result);

function spliceAtFirstNonDW(array) {
    array.shift();
    const idx = array.findIndex(x => x.indexOf('dw') !== 0);
    idx && array.splice(idx);
}

function objectPath(content) {
    let values = content.substring(content.search(/(dw(\.\w{1,30}){2,}\s)+/), content.search(/\s(Properties|Constants|Constructor Summary)\s/)).replaceAll(/dw(\.\w+)+\s/g, '');
    values = content.match(/dw\..{2,20}\..+\s/);

    let includes;
    try {
        let valuesArr = values[0].split(/\s?dw\./);
        includes = valuesArr.join(' dw.').split(' ');
        spliceAtFirstNonDW(includes);
    } catch (error) {
        console.log('error: ' + error);
        includes = '';
    }
    return includes;
}

/**
 * 
 * @param {*} page search.json data
 * @returns formatted html
 */
function formatPage(page) {
    let { url, title, content } = page;
    if (page.title.indexOf('Class ') === 0) {
        const className = page.title.split('Class ')[1];
        content = content.substring(content.search(/(dw(\.\w{1,30}){2,}\s)+/), content.search(/\s(Properties|Constants|Constructor Summary)\s/)).replaceAll(/dw(\.\w+)+\s/g, '');
        const splitPoint = 'Class ' + className + ' Object ' + className + ' ';
        const classObject = 'Class ' + className + ' ' + className;
        if (content.length && content.indexOf(splitPoint) !== -1) {
            content = content.split(splitPoint)[1];
        } else if (content.length && content.indexOf(classObject) !== -1) {
            content = content.split(classObject)[1];
        }
    }
    let html = '<div id="resultBlock"><a href="https://salesforcecommercecloud.github.io' + url + '" target="_blank"><span style="link-font">' + title + '</span></a>' +
        '<br><p>' + content + '</p><br></div>';
    return html;
}

function searchTermSubPhrases(sval) {
    const wordArr = sval.split(' ');
    const wordCount = wordArr.length;
    const allSearchTerms = [sval];
    for (i = 2; i < wordCount; i++) {
        for (j = 0; j < wordCount - i + 1; j++) {
            let newstr = [];
            for (k = j; k < j + i; k++) {
                newstr.push(wordArr[k]);
            }
            allSearchTerms.push(newstr.join(' '));
        }
    }
    allSearchTerms.push(...wordArr);
    return [...new Set(allSearchTerms)];
}

function calculateWeightedWordFrequency(page, allSearchTerms) {
    return allSearchTerms.map(searchTerm => {
        let weight = 0;
        if (page.content.toLowerCase().indexOf(searchTerm) !== -1) {
            weight += 1000 ** searchTerm.split(' ').length;
        }
        if (page.title.toLowerCase().indexOf(searchTerm) !== -1) {
            weight += 1000000000 ** searchTerm.split(' ').length;
        }
        return weight;
    }).reduce((e, a) => e + a, 0);
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
        let theOne = null, hits = [], children = [];

        results.some(x => {
            if (x.title.toLowerCase() === searchTerm
                // || x.title.toLowerCase() === 'class ' + sval.replace(/\s/g, '')
            ) {
                theOne = x;
            }
        });

        let searchObjectPath = [];
        if (theOne) {
            const objectPathArray = objectPath(theOne.content);
            if (objectPathArray.length > 0) {
                searchObjectPath = objectPathArray.pop();
            }
        }

        results.forEach(x => {
            if (x.title.toLowerCase() === searchTerm
                // || x.title.toLowerCase() === 'class ' + sval.replace(/\s/g, '')
            ) {
                return;
            }

            const objectPaths = objectPath(x.content);
            if (objectPaths.length > 0 && objectPaths.indexOf(searchObjectPath) !== -1) {
                children.push(x);
                return;
            }

            if (x.title.toLowerCase().indexOf(searchTerm) !== -1) {
                hits.push(x);
            }
        })

        if (theOne !== null) {
            sortedResults = [theOne];
        }
        sortedResults = [...sortedResults, ...children, ...hits];

        if (sortedResults.length === 0) {
            const allSearchTerms = searchTermSubPhrases(sval);
            sortedResults = ret.filter(page =>
                Object.keys(page).length &&
                page.url?.indexOf('/upcoming/') !== -1 &&
                page.title?.indexOf('Server-side javascript') === -1 &&
                page.title?.indexOf('Quotas') === -1 &&
                page.title?.indexOf('Deprecated') === -1)
                .map(page => {
                    return {
                        page: page,
                        wordFrequency: calculateWeightedWordFrequency(page, allSearchTerms)
                    }
                })
                .filter(obj => obj.wordFrequency > 0)
                .sort((a, b) => b.wordFrequency - a.wordFrequency)
                .map(obj => obj.page)
        }
    } else {
        results.unshift(results.splice(results.findIndex(x => x.title.toLowerCase() === searchTerm), 1)[0]);
        sortedResults = results;
    }
    results = sortedResults.map(page => formatPage(page)).join('');

    document.getElementById('searchResult').innerHTML = results;
}