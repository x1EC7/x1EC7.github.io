// there's more around here than meets the eye 

let t = true;
document.addEventListener("keydown", function(e) {
     if (e.which == 123) {
        if(t){
            console.log("looking for something?");
            t = !t;
        }     
    }   
  })
  