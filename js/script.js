let pieces = document.getElementsByClassName("piece");
let start = document.getElementById("start");
let rounds = document.getElementsByClassName("col");
let modal = document.getElementById("modal");
let menu = document.getElementById("menu");
let hanomboka = document.getElementById("hanomboka");
let restart = document.getElementById("restart");

let n = [];
let t = 0;
let l = 0;
let last, lastX, lastY, lastIndex = 0;
let lst = 8;
let release = NaN
let player = 0;
let canMove = false;
let board = [
    "","","",
    "","","",
    "","",""
]

let allPosition = [
    {
        x:-45,
        y:30
    }, {
        x:65,
        y:30
    }, {
        x:175,
        y:30
    }, 
    
    {
        x:-45,
        y:145
    }, {
        x:65,
        y:145
    }, {
        x:175,
        y:145
    }, 
    
    {
        x:-45,
        y:260
    }, {
        x:65,
        y:260
    }, {
        x:175,
        y:260
    }, 
]

let authorised = [
    [1, 3, 4],
    [0, 2, 4],
    [1, 4, 5],
    [0, 4, 6],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [2, 4, 8],
    [3, 4, 7],
    [4, 6, 8],
    [4, 7, 5]
]

function init(){
    for(let i = 0; i<pieces.length; i++){
        let drag = pieces[i];
        drag.style.top = "0px";
        drag.style.left = (i*56) +"px";
    }
}

function getPx(style){
    return parseInt(style.slice(0, style.length-2));
}

function collide(a, b, j){
    if(
        (((getPx(a.style.left) >= b.x)) && ((getPx(a.style.left) <= b.x + 150))) && 
        (((getPx(a.style.top) >= b.y)) && ((getPx(a.style.top) <= b.y + 150))) 
        ){
            return true
    }
}

function nextPlayer(n){
    if(n%2==0){
        for(let i = 0; i < pieces.length; i++){
            if(pieces[i].classList.contains("deux")){
                pieces[i].disabled = true
            }else{
                pieces[i].disabled = false
            }
            pieces[i].classList.toggle("now");
        }
        
    }else{
        for(let i = 0; i < pieces.length; i++){
            if(pieces[i].classList.contains("un")){
                pieces[i].disabled = true
            }else{
                pieces[i].disabled = false
            }
            pieces[i].classList.toggle("now");
        }
    }
    n++
}

function removeBrd(piece){
    player = piece.classList.contains("un")? "1" : "2";
    board = board.map((e) => {
        if(e == player+piece.id){
            return ""
        }else{
            return e
        }
    })
}

function fullBoard(){
    c = 0;
    board.map((e) => {
        if(e !== ""){
            c++;
        }
    })
    return c == 6;
}

function find(piece){
    let index = piece.classList.contains("un")? "1" + piece.id : "2" + piece.id;
    for(let i = 0; i < board.length; i++){
        if(board[i] == index){
            return i
        }
    }
    return false
}

function gagne(){
    if(
        (((board[0][0] == board[1][0])&&(board[0][0] == board[2][0])) &&  (board[0] != "")) ||
        (((board[3][0] == board[4][0])&&(board[3][0] == board[5][0])) &&  (board[3] != "")) ||
        (((board[6][0] == board[7][0])&&(board[6][0] == board[8][0])) &&  (board[6] != "")) ||
        (((board[0][0] == board[3][0])&&(board[0][0] == board[6][0])) &&  (board[0] != "")) ||
        (((board[1][0] == board[4][0])&&(board[1][0] == board[7][0])) &&  (board[1] != "")) ||
        (((board[2][0] == board[5][0])&&(board[2][0] == board[8][0])) &&  (board[2] != "")) ||
        (((board[0][0] == board[4][0])&&(board[0][0] == board[8][0])) &&  (board[0] != "")) ||
        (((board[6][0] == board[4][0])&&(board[6][0] == board[2][0])) &&  (board[6] != ""))
        ){
        win.innerText =  "Mandresy ny Mpilalao " + (((player%2)-2)*-1) + "!";
        modal.style.display = "flex";
           
    }
}

restart.addEventListener("click", (e) => {
    init();
    modal.style.display = "none";
    board = [
        "","","",
        "","","",
        "","",""
    ]
})

hanomboka.addEventListener("click", (e) => {
    menu.style.display = "none";
})

    for(let i = 0; i<pieces.length; i++){
        let drag = pieces[i];
        let round = rounds[i];
        drag.style.top = "0px";
        drag.style.left = (i*56) +"px";

        drag.addEventListener("mousedown", (e)=>{
            n[i] = true;
            t = e.clientY - getPx(drag.style.top);
            l = e.clientX - getPx(drag.style.left);
            last = e.target;
            lst++;
            last.style.zIndex = lst;
            e.target.style.zIndex = lst;
            lst++;
            e.target.parentNode.style.position = "none";
            drag.classList.remove("transition");
            lastX = e.target.style.left; lastY = e.target.style.top
        })

        drag.addEventListener("mouseenter", (e) => {
            if(!fullBoard() && n[i]==false){
                if(getPx(e.target.style.top) >= 20){
                    e.target.disabled = true;
                }
            }else{
                lastIndex = find(e.target);
            }

            if(fullBoard()){
                canMove = true;
            }
        })

        drag.addEventListener("mouseup", (e)=>{
            n[i] = false;
            if(e.target){
                if(canMove==true){
                    if(board[release] == "" && authorised[lastIndex].includes(release)){
                        removeBrd(e.target)
                        if(last.classList.contains("un")){
                            board[release] = "1" + last.id;
                        }else{
                            board[release] = "2" + last.id;
                        }
                        last.style.left =  allPosition[release].x+75 +"px";
                        last.style.top =  allPosition[release].y+75 +"px";
                        if(release != lastIndex){
                            nextPlayer(player);
                        }
    
                    }else{
                            e.target.style.left = lastX
                            e.target.style.top = lastY
                    }
                }else{
                    if(board[release] == "" ){
                        removeBrd(e.target)
                        if(last.classList.contains("un")){
                            board[release] = "1" + last.id;
                        }else{
                            board[release] = "2" + last.id;
                        }
                        last.style.left =  allPosition[release].x+75 +"px";
                        last.style.top =  allPosition[release].y+75 +"px";
                        nextPlayer(player);
    
                    }else{
                            e.target.style.left = lastX
                            e.target.style.top = lastY
                    }
                }
                
                gagne();
            }
            
            drag.classList.add("transition");

        })

        window.addEventListener("mousemove", (e)=>{
            if(n[i]){
                for(let j = 0; j < allPosition.length; j++){
                    if(collide(drag, allPosition[j], j)){
                        release = j;
                    }
                }
                drag.style.top = (e.clientY-t) +"px";
                drag.style.left = (e.clientX-l) +"px";
                last.style.zIndex = lst;
            }
        })

        round.addEventListener("focus", (e) => {

        })
    }

