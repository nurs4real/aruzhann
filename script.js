const button = document.getElementById("startButton");
const flames = document.querySelectorAll(".flame");
const message = document.getElementById("message");
const container = document.querySelector(".container");

let audioContext;
let analyser;
let microphone;
let dataArray;
let listening = false;

button.addEventListener("click", async () => {

    button.innerHTML = "🎤 Үрлеңіз...";

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        microphone = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;

        microphone.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        listening = true;

        detectBlow(stream);

    } catch (e) {

        alert("Микрофонға рұқсат беріңіз 😊");

    }

});

function detectBlow(stream){

    if(!listening) return;

    analyser.getByteFrequencyData(dataArray);

    let total = 0;

    for(let i=0;i<dataArray.length;i++){

        total += dataArray[i];

    }

    let volume = total / dataArray.length;

    if(volume > 35){

        listening = false;

        stream.getTracks().forEach(track => track.stop());

        extinguishCandles();

        return;

    }

    requestAnimationFrame(()=>detectBlow(stream));

}

function extinguishCandles(){

    flames.forEach((flame,index)=>{

        setTimeout(()=>{

            flame.classList.add("off");

        },index*350);

    });

    setTimeout(showMessage,1800);

}

function showMessage(){

    container.style.display = "none";

    message.classList.remove("hidden");

    message.classList.add("show");

    typeWriter();

    createHearts();

}

function showText(){

    const p = document.querySelector("#message p");

    p.style.opacity = "0";
    p.style.transform = "translateY(20px)";
    p.style.transition = "all 1.5s ease";

    setTimeout(() => {
        p.style.opacity = "1";
        p.style.transform = "translateY(0)";
    }, 200);

}

function createHearts(){

    for(let i=0;i<70;i++){

        const heart=document.createElement("div");

        heart.innerHTML="❤️";

        heart.style.position="fixed";
        heart.style.left=Math.random()*100+"vw";
        heart.style.top="105vh";
        heart.style.fontSize=(18+Math.random()*20)+"px";
        heart.style.pointerEvents="none";
        heart.style.transition="all 6s linear";
        heart.style.zIndex="9999";

        document.body.appendChild(heart);

        setTimeout(()=>{

            heart.style.top="-10vh";
            heart.style.transform=`translateX(${Math.random()*200-100}px) rotate(${Math.random()*360}deg)`;
            heart.style.opacity="0";

        },50);

        setTimeout(()=>{

            heart.remove();

        },6500);

    }

}
