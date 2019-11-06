localStorage.setItem({t:'t'},{a:'a'})
// console.table(localStorage)
// console.log(localStorage)
console.log(new Date().toJSON().split('T')[0])

$(document).on('click','#submit',(e)=>{
    e.preventDefault();
    let text = $("#item").val();
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    $("#ul1").append(text)
})