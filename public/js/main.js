import * as ui from "./ui.js";
import * as store from "./store.js";
import * as constanse from "./constanse.js";

let peerconnection;


let configurepeerconnection={
    iceServers:[
        {
            urls : "stun:stun.l.google.com:13902",
        }
    ]
}
const createpeearconnection=()=>{

     peerconnection= new RTCPeerConnection(configurepeerconnection);

    peerconnection.onicecandidate=(event)=>{
        console.log("ice candedate run ing");
        if(event.candidate){
            //send track
            sendDataUsingWebRTCsignaling({
                connectedUserSocketID:constanse.settingsocekt.socketIDcaller,
                type : constanse.webrtcsignaling.ICE_CANDIDATE,
                candidate : event.candidate
            })
        }
    }


    const remotestrim=new MediaStream();
    store.setremotestrim(remotestrim);
    ui.updateremotevideo(remotestrim);
    peerconnection.ontrack=(event)=>{
        remotestrim.addTrack(event.track)
    }

    const localstrim=store.getlocalstrim();
    console.log("localsrtim is ....");
    console.log(localstrim);
    console.log("===============")
    localstrim.getTracks().forEach((value)=>{
        peerconnection.addTrack(value,localstrim);
    });


}

export const socket=io("/");
socket.on("connect",()=>{
    console.log("socket in runing client");   
    ui.inputsocketID();
});

    export const chatcall=(data)=>{
        socket.emit("chat-call",data);
        createpeearconnection();
        sendwebRTCOffer();
    }


    const sendDataUsingWebRTCsignaling=(data)=>{
        socket.emit("webRTC-signaling",data);
        console.log("send offer in server");
        }
    
    socket.on("webRTC-signaling",(data)=>{
        console.log("get info client in server ..")
        switch(data.type){
            case constanse.webrtcsignaling.OFFER:
                handelwebrtcoffer(data);
                break;
            case constanse.webrtcsignaling.ANSWER:
                handelwebrtcAnswer(data);
                break;
            case constanse.webrtcsignaling.ICE_CANDIDATE:
                handelwebrtccandidate(data);
                break;
            default:
                return;
        }
    })

    socket.on("response-server-chatcall",(data)=>{
        console.log(data);
        constanse.settingsocekt.socketIDremote=data.perdonaliID;
        createpeearconnection();
    });

    
            //////////////////// create offer for send remote ////////////////////

    const sendwebRTCOffer=async()=>{
        const offer = await peerconnection.createOffer()
        await peerconnection.setLocalDescription(offer);
        sendDataUsingWebRTCsignaling({
            connectedUserSocketID : constanse.settingsocekt.socketIDcaller ,
            type : constanse.webrtcsignaling.OFFER,
            offer : offer
        });


        console.log("run function create offer ..");
        console.log(constanse.settingsocekt.socketIDcaller);
    }
    const handelwebrtcoffer=async(data)=>{
        console.log(data)
      await peerconnection.setRemoteDescription(data.offer);
      const answer= await peerconnection.createAnswer();
      await peerconnection.setLocalDescription(answer);
      sendDataUsingWebRTCsignaling({
        connectedUserSocketID : constanse.settingsocekt.socketIDremote ,
        type : constanse.webrtcsignaling.ANSWER , 
        answer : answer
      });
    }
    const handelwebrtcAnswer=async(data)=>{
        await peerconnection.setRemoteDescription(data.answer);
        console.log(data)
    }
    
    const handelwebrtccandidate=async(data)=>{
        console.log("canditade ok");
        console.log(data)
        try{
            await peerconnection.addIceCandidate(data.candidate);
        }catch(e){
            console.log("error candidate handel");
            console.log(e)
        }
    }

 const getvideouser1=async()=>{
    try{
     await navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((strim)=>{
        store.setlocalstrim(strim);
        ui.prevewlocalstrim(strim);
     });
     
    }catch(e){console.log("error connect webcam ..!!!\n"+e)}
   }
   getvideouser1();

