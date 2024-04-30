minimalValues;

function getAllSubstrings(str) {
    var i, j, result = [];
    size = 1;
    for (i = 0; i < str.length; i++) {
        for (j = str.length; j - i >= size; j--) {
            result.push(str.slice(i, j));
        }
    }
    return result.sort((x, y) => y.length - x.length);
}

function removeDuplicatesFromMap(map, min) {
    tempMap = new Map();

    map.forEach((v, k) => {
        v.forEach(val => {
            if (tempMap.has(val)) {
                tempMap.set(val, -1);
            }
            if (!tempMap.has(val)) {
                tempMap.set(val, k);
            }
        })
    })

    tempMap.forEach((v, k) => {
        v !== -1 && min.get(v).push(k);
    })

    min.forEach((_, k) => {
        min.get(k).sort((a, b) => a.length - b.length);
        min.set(k, min.get(k)[0]);
    })
}

function mapToTable(map) {
    ret = '<table><tr><th>Original</th><th>Minimal</th></tr>';
    map.forEach((v, k) => {
        ret += `<tr><td>${k}</td><td>${v}</td></tr>`;
    })
    return ret += '</table>';
}

function fun() {
    minimalValues = new Map();
    values = document.getElementById('strings').value.split(',').map(x => x.trim());

    originalValues = new Map();
    // create map with original values
    values.forEach(element => {
        originalValues.set(element, getAllSubstrings(element));
        minimalValues.set(element, []);
    });

    removeDuplicatesFromMap(originalValues, minimalValues);

    document.getElementById('result').innerHTML = mapToTable(minimalValues);

}