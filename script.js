const button = document.getElementById("startButton");
const flames = document.querySelectorAll(".flame");
const message = document.getElementById("message");

button.addEventListener("click", async () => {

    button.innerText = "Үрлеңіз...";

    try{

        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true
        });

        const audioContext = new AudioContext();

        const source = audioContext.createMediaStreamSource(stream);

        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;

        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        function listen(){

            analyser.getByteFrequencyData(data);

            let volume = 0;

            for(let i=0;i<data.length;i++){

                volume += data[i];

            }

            volume /= data.length;

            if(volume>35){

                blowOut();

                stream.getTracks().forEach(track=>track.stop());

                return;

            }

            requestAnimationFrame(listen);

        }

        listen();

    }catch(e){

        alert("Микрофонға рұқсат беріңіз 😊");

    }

});

function blowOut(){

    flames.forEach((flame,index)=>{

        setTimeout(()=>{

            flame.classList.add("off");

        },index*250);

    });

    setTimeout(()=>{

        showConfetti();

    },1200);

}

function showConfetti(){

    createHearts();

    document.querySelector(".container").style.display="none";

    message.classList.remove("hidden");

    typeWriter();

}

function typeWriter(){

    const p=document.querySelector("#message p");

    const text=p.innerText;

    p.innerText="";

    let i=0;

    function write(){

        if(i<text.length){

            p.innerHTML+=text.charAt(i);

            i++;

            setTimeout(write,35);

        }

    }

    write();

}

function createHearts(){

    for(let i=0;i<80;i++){

        let heart=document.createElement("div");

        heart.innerHTML="❤️";

        heart.style.position="fixed";
        heart.style.left=Math.random()*100+"vw";
        heart.style.top="110vh";
        heart.style.fontSize=(18+Math.random()*25)+"px";
        heart.style.transition="6s linear";

        document.body.appendChild(heart);

        setTimeout(()=>{

            heart.style.top="-10vh";
            heart.style.transform=`translateX(${Math.random()*200-100}px)`;

        },50);

        setTimeout(()=>{

            heart.remove();

        },7000);

    }

}