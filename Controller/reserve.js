
document.addEventListener('DOMContentLoaded', function () {
    var getSeat = document.getElementsByClassName('seat');
    var submit = document.getElementById("submit");
    var remove = document.getElementById("remove");
    var date = document.getElementById("reservation").innerHTML;
    var seatSelected = 0;

   getSeatIndex(getSeat, submit, seatSelected, date);
   console.log(date);
   removeSeat(getSeat, remove, seatSelected);

});

function getSeatIndex(getSeat, submit, seatSelected, date){

   
        for (let i = 0; i < getSeat.length; i++) {
            
            getSeat[i].addEventListener('click', function(e) {
            if(seatSelected === 0){
                if(getSeat[i].className === "seat"){
                    getSeat[i].style.backgroundColor = "lightgreen";
                    getSeat[i].style.transform = "scale(1.2)";
                    
                } if(date === ""){
                    alert("INPUT A DATE");
                   
            }else{
                submit.addEventListener('click', function(){
                    getSeat[i].style.backgroundColor = "#fc9898";
                    getSeat[i].style.transform = "scale(1)";
                    $(getSeat[i]).replaceWith( "<div class='seat taken'>Reserved by" +" "+"</div>");
                    seatSelected = 0;
                });
                seatSelected = 1;
            }
            } else{
                alert("YOU CAN ONLY RESERVE 1 SEAT");
            }
            });
        }     
}


function removeSeat(getSeat, remove){
    const div = document.createElement("div");
    for (let i = 0; i < getSeat.length; i++) {
        getSeat[i].addEventListener('click', function(e) {
            if(getSeat[i].className === "seat taken"){
                getSeat[i].style.backgroundColor = "blue";
                getSeat[i].style.transform = "scale(1.2)";
            }
                remove.addEventListener('click', function(){
                    getSeat[i].style.backgroundColor = "aliceblue";
                    getSeat[i].style.transform = "scale(1)";
                    $(getSeat[i]).replaceWith( "<div class='seat'></div>" );
                });
        });
    }
}
