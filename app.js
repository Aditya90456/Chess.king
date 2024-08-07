const express= require('express'); 
const socket = require('socket.io');
const http = require('http');
const {Chess} = require('chess.js');
const app = express();
const server=http.createServer(app);
const io=socket(server);
const chess=new Chess()
const path=require('path')
let players={};
let cp='w'
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.render('index')
}) 
io.on('connection',(sck)=>{
    console.log('connected to server');
    if(!players.white){
        players.white=sck.id;
        sck.emit('playerRole','w');
 
}else if(!players.black){
    players.black=sck.id;
sck.emit('playerRole','b');   
}else{
    sck.emit('spectatorRole'); 
}
sck.on('disconnect',()=>{
    if(sck.id==players.white){

        delete players.white;
    }else if(sck.id==players.black){
        delete players.black;
    }
})

sck.on('move',(data)=>{
    try {
        
    if(chess.turn()=='w' && sck.id!==players.white){ return ; }
    if(chess.turn()=='b' && sck.id!==players.black){ return ; }
    const r=chess.move(data)
    if(r){
        cp=chess.turn();

        io.emit('move',data)
        io.emit('boardState',chess.fen());
    } else{
        console.log('Invalid Move')
        io.emit('move',data)   
    }
}
    catch (error) {
        console.log(error)
        sck.emit('invalid move',data)
    }
})

})
server.listen(3000)