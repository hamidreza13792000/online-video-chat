import * as main from "./main.js";
import * as constance from "./constanse.js";
import * as store from "./store.js"
const socket=main.socket;

document.getElementById("btnchat").addEventListener("click",()=>{
    const inputsendsocketID=document.getElementById("inputsendsocketID").value;
    constance.settingsocekt.socketIDcaller=inputsendsocketID;
    const data={ perdonaliID:inputsendsocketID, Typecall:"chat-Call"};
    main.chatcall(data);
});

export const inputsocketID=()=>{
    document.getElementById("inputSocketID").value=socket.id;
}

export const prevewlocalstrim=(strim)=>{
    let video=document.getElementById("videouser1");
    video.srcObject=strim;
    video.addEventListener("loadedmetadata",()=>{
        video.play();
        video.muted=true;
    });
}

export const updateremotevideo=(strim)=>{
    let video2=document.getElementById("videouser2");
    video2.srcObject=strim;
    video2.addEventListener("loadedmetadata",()=>{
        video2.play();
        // video2.muted=true;
    });
}

const copytextclipbord=()=>{
    document.getElementById("iconcopy").addEventListener("click",()=>{
        let useridinput=document.getElementById("inputSocketID");
        useridinput.select();
        useridinput.setSelectionRange(0,99999);
        navigator.clipboard.writeText(useridinput.value);
    })
}
copytextclipbord();