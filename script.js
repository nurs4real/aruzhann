const button = document.getElementById("startButton");
const flames = document.querySelectorAll(".flame");
const message = document.getElementById("message");
const container = document.querySelector(".container");

let analyser;
let dataArray;
let listening = false;

button.addEventListener("click", async () => {

    button.innerHTML = "🎤 Үрлеңіз...";

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const microphone = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

        microphone.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        listening = true;

        detectBlow(stream);

    } catch (err) {

        alert("Микрофонға рұқсат беріңіз 😊");

    }

});

function detectBlow(stream){

    if(!listening) return;

    analyser.getByteFrequencyData(dataArray);

    let sum = 0;

    for(let i = 0; i < dataArray.length; i++){

        sum += dataArray[i];

    }

    let volume = sum / dataArray.length;

    if(volume > 35){

        listening = false;

        stream.getTracks().forEach(track => track.stop());

        extinguishCandles();

        return;

    }

    requestAnimationFrame(() => detectBlow(stream));

}

function extinguishCandles(){

    flames.forEach((flame,index)=>{

        setTimeout(()=>{

            flame.classList.add("off");

        },index*300);

    });

    setTimeout(showMessage,1500);

}

function showMessage(){

    container.style.display = "none";

    message.classList.remove("hidden");
    message.classList.add("show");

    typeWriter();

    createHearts();

}

function typeWriter(){

    const p = document.querySelector("#message p");

    const text = p.textContent;

    p.textContent = "";

    let i = 0;

    function write(){

        if(i < text.length){

            p.textContent += text.charAt(i);

            i++;

            setTimeout(write,15);

        }

    }

    write();

}

function createHearts(){

    for(let i=0;i<70;i++){

        const heart=document.createElement("div");

        heart.innerHTML="❤️";

        heart.style.position="fixed";
        heart.style.left=Math.random()*100+"vw";
        heart.style.top="110vh";
        heart.style.fontSize=(18+Math.random()*20)+"px";
        heart.style.pointerEvents="none";
        heart.style.transition="6s linear";
        heart.style.zIndex="9999";

        document.body.appendChild(heart);

        setTimeout(()=>{

            heart.style.top="-10vh";
            heart.style.transform=`translateX(${Math.random()*200-100}px)`;
            heart.style.opacity="0";

        },50);

        setTimeout(()=>{

            heart.remove();

        },6500);

    }

}
