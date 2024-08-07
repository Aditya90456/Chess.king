const sck=io()
const chess=new Chess()
const cb=document.querySelector('#chb');
let dp=null;
let ss=null;    
let pr=null;
const b=()=>{
    const board=chess.board();
    cb.innerHTML="";
    board.forEach((r,ri) => {
        r.forEach((c,ci) =>{
            const squre=document.createElement('div');
        squre.classList.add('pieces',(ri+ci)%2==0?'light':'dark');
        squre.dataset.row=ri;
        squre.dataset.col=ci;
        
        if(c){
            const piece=document.createElement('div');
            piece.classList.add('piece',(c.color==='w' ? 'white' : 'black'))
                piece.innerText=ugp(c) 

                piece.draggable=pr===c.color;
    
            piece.addEventListener('dragstart',(e)=>{
                if(piece.draggable){
                    dp=piece;
                    ss={row:ri,col:ci}
                    e.dataTransfer.setData("text/plain","")
                }
            })
            piece.addEventListener('dragend',(e)=>{
                dp=null;

                ss=null;
            })
           
        squre.appendChild(piece);
        }
      squre.addEventListener('dragover',(e)=>{
                e.preventDefault();
            })
            squre.addEventListener('drop',(e)=>{
                e.preventDefault(); 
                    if(dp){
                       const ts={
                        row:parseInt(squre.dataset.row),
                        col:parseInt(squre.dataset.col),
                        
            
                       };
            
                       hm(ss,ts);
                    }
    
            })
        cb.appendChild(squre);
        })
    });
    if(pr==='b'){
        cb.classList.add('flipped');
    }else{
        cb.classList.remove('flipped');
    } 
}
const hm=(sse,ts)=>{
     
    const move={
        from: `${String.fromCharCode(97+sse.col)}${8 - sse.row}`,
        to: `${String.fromCharCode(97+ts.col)}${8-ts.row}`,
        promotion: 'q'
    }
    sck.emit('move',move)
}
const ugp=(p)=>{
    const chessPieces = {
  k: '♔',
  q:  '♕',
  r: '♖',
  b: '♗',

  n: '♘' 
,
  p: '♙',
  K:'♚',
  Q:'♛',
  R:'♜',
  B:'♝',
  N:'♞',
  P:'♟'

};

        return chessPieces[p.type] || "";
} 
sck.on('playerRole',function(role) {
    pr=role;
    b()
})
sck.on('spectatorRole',function(){
    pr=null
    b()

})
sck.on('boardState',function(fen){
    chess.load(fen);
    b()
})

sck.on('move',function(move){
    chess.move(data)
    b()
})

b()