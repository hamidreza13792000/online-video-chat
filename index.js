const express=require("express");
const app =express();
const http= require("http");
const server1=http.createServer(app);
const {Server}=require("socket.io");
const io =new Server(server1);


app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

let Allsocketid=[];
io.on("connection",(socket)=>{

    Allsocketid.push(socket.id);
    console.log(Allsocketid);


    socket.on("chat-call",(data)=>{
        console.log(data);
        const {perdonaliID , Typecall}=data;
        const findID=Allsocketid.find((value)=>{return perdonaliID===value});
        if(findID){
            const dataservert={ perdonaliID:socket.id,Typecall:Typecall};
            io.to(perdonaliID).emit("response-server-chatcall",dataservert);
        }
        else {
            console.log("connect socket id faild ... !!")
        }
    });

    socket.on("webRTC-signaling",(data)=>{
        console.log(data);
        const {connectedUserSocketID}=data;
        const findID=Allsocketid.find((value)=>{return connectedUserSocketID===value});
        if(findID){
            io.to(connectedUserSocketID).emit("webRTC-signaling",data);
        }
        console.log("send info server to client");
    });


    socket.on("disconnect",()=>{
       const filtersocket=Allsocketid.filter((socketid)=>{
            return socketid !== socket.id;
       });
       Allsocketid=filtersocket;
   
    });



})


server1.listen(4000,()=>{console.log("server is rining in port 4000 ...!")});