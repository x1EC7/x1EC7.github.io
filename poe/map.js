let obj = {
    'Clear Oil' : '1',
    'Sepia Oil' : '2',
    'Amber Oil' : '3',
    'Verdant Oil' : '4',
    'Teal Oil' : '5',
    'Azure Oil' : '6',
    'Violet Oil' : '7',
    'Crimson Oil' : '8',
    'Black Oil' : '9',
    'Opalescent Oil' : '10',
    'Silver Oil' : '11',
    'Golden Oil' : '12',
};

let valKey = {
    1 : 'Clear Oil',
    2 : 'Sepia Oil',
    3 : 'Amber Oil',
    4 : 'Verdant Oil',
    5 : 'Teal Oil',
    6 : 'Azure Oil',
    7 : 'Violet Oil',
    8 : 'Crimson Oil',
    9 : 'Black Oil',
    10 : 'Opalescent Oil',
    11 : 'Silver Oil',
    12 : 'Golden Oil',
};

sort = (a,b,c) => {
    let abc = [obj[a], obj[b], obj[c]];
    let k = abc.sort();

    k.forEach(e => console.log(valKey[e]));
};

getAllPassives = (arr) => {
    let first,second,third;

    let pval = $("#oils").html();
    let lines = pval.split('\n');
    let ret = {};

    for(let i = 0; i < 13; i++){
        if(arr[i] == 0)
            continue;
        let first = i;
        arr[i]--;
        for(let j = i; j < 13; j++){
            if(arr[j] == 0)
                continue;
            let second = j;
            arr[j]--;
            for(let k = j; k < 13; k++){
                if(arr[k] == 0)
                    continue;
                let third = k;
                let lineStart = valKey[i]+','+valKey[j]+','+valKey[k]+',';
                lines.forEach(line => {
                    if(line.trim().startsWith(lineStart)){
                        ret[line.trim().split(lineStart)[1]] = lineStart;
                    }
                })
            }
            arr[j]++;
        } 
        arr[i]++   
    }
    // console.table(ret);
    return ret;
}