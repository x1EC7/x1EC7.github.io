// function gen(){
//     let rf = new XMLHttpRequest();
//     rf.open('GET','oils.csv', true);
//     rf.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
//     rf.setRequestHeader('Access-Control-Allow-Credentials', 'true');
//     rf.onreadystatechange = () => {
//         let arr = [];
//         if(rf.readyState === 4) {
//             if(rf.status === 200 || rf. status === 0){
//                 let allText = rf.responseText;
//                 // console.log(allText);   
//                 let lines = allText.split('\n');
//                 lines.forEach(line => {
//                     let values = line.split(';');
//                     arr.push(values);
//                 })
//             }
//         }
//         return arr;
//     }
//     rf.send('');
// }

// let obj = {
//     'Clear Oil' : '1',
//     'Sepia Oil' : '2',
//     'Amber Oil' : '3',
//     'Verdant Oil' : '4',
//     'Teal Oil' : '5',
//     'Azure Oil' : '6',
//     'Violet Oil' : '7',
//     'Crimson Oil' : '8',
//     'Black Oil' : '9',
//     'Opalescent Oil' : '10',
//     'Silver Oil' : '11',
//     'Golden Oil' : '12',
// }

// let valKey = {
//     1 : 'Clear Oil',
//     2 : 'Sepia Oil',
//     3 : 'Amber Oil',
//     4 : 'Verdant Oil',
//     5 : 'Teal Oil',
//     6 : 'Azure Oil',
//     7 : 'Violet Oil',
//     8 : 'Crimson Oil',
//     9 : 'Black Oil',
//     10 : 'Opalescent Oil',
//     11 : 'Silver Oil',
//     12 : 'Golden Oil',
// }

$(document).ready(() => {
    let opt = '';

    // let pval = $("#oils").html();
    // let lines = pval.split('\n');
    
    for(let i = 1; i < 13; i++) {
        // opt+='<option value="'+i+'">'+valKey[i]+'</option>';
        $("#tbody").append('<tr>'
        +'<td><input type="checkbox" id="first'+i+'" class="cb" value="'+i+'">' + valKey[i] + '</td>'
        +'<td><input type="checkbox" id="second'+i+'" class="cb" value="'+i+'">' + valKey[i] + '</td>'
        +'<td><input type="checkbox" id="third'+i+'" class="cb" value="'+i+'">' + valKey[i] + '</td>'
        +'</tr>')
    }
    // $("#oil1").html(opt);
    // $("#oil2").html(opt);
    // $("#oil3").html(opt);
})

let matrix = [[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0]]

$(document).on('change',':checkbox',(e) => {
    // $("#"+id).toggle(this.checked);
    let l0 = 0;
    ['first','second','third'].forEach( ee => {
        for(let i = 1; i < 13; i++) {
            if($("#"+ee+i).is(':checked')){
                matrix[l0][i] = 1;
            } else {
                matrix[l0][i] = 0;
            }
        }
        l0++;
    })
    // console.table(matrix);
});

$(document).on('click','#button', e => {
    let newmatrix = [[],[],[]];
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 13; j++){
            if(matrix[i][j] != 0){
                newmatrix[i].push(j);
            }
        }
    }
    // console.log(newmatrix);
    let appearances = [0,0,0,0,0,0,0,0,0,0,0,0,0];

    newmatrix.forEach(slot => {
        slot.forEach(oil => {
            appearances[oil]++;
        })
    })
    console.log(appearances);
    let sum = appearances.reduce((_, $) => { return _ + $;});
    if(sum < 3){
        alert('NO!');
        return;
    }

    let passives = getAllPassives(appearances);

})