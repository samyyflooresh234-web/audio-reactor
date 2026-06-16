const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

function resize(){

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

}

resize();

window.addEventListener(
"resize",
resize
);

const fileInput =
document.getElementById("audioFile");

const startBtn =
document.getElementById("startBtn");

const modeSelect =
document.getElementById("mode");

const themeSelect =
document.getElementById("theme");

const sensitivitySlider =
document.getElementById("sensitivity");

const particleSlider =
document.getElementById("particles");

const speedSlider =
document.getElementById("speed");

const glowSlider =
document.getElementById("glow");

const trailSlider =
document.getElementById("trail");

const bassBoostSlider =
document.getElementById("bassBoost");

const trebleBoostSlider =
document.getElementById("trebleBoost");

const centerSizeSlider =
document.getElementById(
"centerSize"
);

const bgImageInput =
document.getElementById("bgImage");

const hideUIButton =
document.getElementById("hideUI");

const fullscreenBtn =
document.getElementById("fullscreen");

const panel =
document.getElementById("panel");

const colorMode =
document.getElementById(
"colorMode"
);

const color1 =
document.getElementById(
"color1"
);

const color2 =
document.getElementById(
"color2"
);

const showPanel =
document.getElementById(
"showPanel"
);

let audioCtx;
let analyser;
let audio;
let sourceNode;

let bgImage = null;

let particles = [];

let fireworks = [];

let beatEnergy = 0;

let beatPulse = 0;

hideUIButton.addEventListener(
    "click",
    ()=>{

    panel.style.display=
    "none";

    showPanel.style.display=
    "block";

    }
    );

    showPanel.addEventListener(
    "click",
    ()=>{

    panel.style.display=
    "block";

    showPanel.style.display=
    "none";

    }
    );

fullscreenBtn.addEventListener(
"click",
()=>{

if(
document.fullscreenElement
){

document.exitFullscreen();

}else{

document.documentElement
.requestFullscreen();

}

}
);

bgImageInput.addEventListener(
"change",
e=>{

const file =
e.target.files[0];

if(!file) return;

const img =
new Image();

img.onload=()=>{

bgImage = img;

};

img.src =
URL.createObjectURL(file);

}
);

startBtn.addEventListener(
"click",
async()=>{

if(!audioCtx){

audioCtx =
new(
window.AudioContext||
window.webkitAudioContext
)();

}

await audioCtx.resume();

}
);

fileInput.addEventListener(
"change",
e=>{

const file =
e.target.files[0];

if(!file) return;

if(audio){

audio.pause();

}

audio =
new Audio(
URL.createObjectURL(file)
);

audio.loop = true;

if(!audioCtx){

audioCtx =
new(
window.AudioContext||
window.webkitAudioContext
)();

}

analyser =
audioCtx.createAnalyser();

analyser.fftSize = 1024;

sourceNode =
audioCtx.createMediaElementSource(
audio
);

sourceNode.connect(
analyser
);

analyser.connect(
audioCtx.destination
);

audio.play();

}
);

function getThemeColor(
    i,
    total
    ){

    if(
    colorMode.value==="single"
    ){

    return color1.value;

    }

    if(
    colorMode.value==="alternate"
    ){

    return
    i%2===0
    ?
    color1.value
    :
    color2.value;

    }

    const p=
    i/total;

    const r=
    Math.round(
    parseInt(
    color1.value.slice(1,3),
    16
    )*(1-p)+
    parseInt(
    color2.value.slice(1,3),
    16
    )*p
    );

    const g=
    Math.round(
    parseInt(
    color1.value.slice(3,5),
    16
    )*(1-p)+
    parseInt(
    color2.value.slice(3,5),
    16
    )*p
    );

    const b=
    Math.round(
    parseInt(
    color1.value.slice(5,7),
    16
    )*(1-p)+
    parseInt(
    color2.value.slice(5,7),
    16
    )*p
    );

    return
    `rgb(${r},${g},${b})`;

    }

function applyGlow(
color
){

ctx.shadowColor =
color;

ctx.shadowBlur =
Number(
glowSlider.value
);

}

function getAudioData(){

if(
!analyser
){

return null;

}

const data =
new Uint8Array(
analyser.frequencyBinCount
);

analyser.getByteFrequencyData(
data
);

return data;

}

function getBands(
data
){

let bass=0;
let mids=0;
let highs=0;

for(
let i=0;
i<20;
i++
){

bass+=data[i];

}

for(
let i=20;
i<120;
i++
){

mids+=data[i];

}

for(
let i=120;
i<data.length;
i++
){

highs+=data[i];

}

bass/=
20;

mids/=
100;

highs/=
(
data.length-
120
);

bass *=
Number(
bassBoostSlider.value
);

highs *=
Number(
trebleBoostSlider.value
);

return{

bass,
mids,
highs

};

}

function rebuildParticles(){

    particles=[];

    const count =
    Number(
    particleSlider.value
    );

    for(
    let i=0;
    i<count;
    i++
    ){

    particles.push({

    x:
    Math.random()*
    canvas.width,

    y:
    Math.random()*
    canvas.height,

    vx:
    (Math.random()-0.5)*2,

    vy:
    (Math.random()-0.5)*2,

    size:
    Math.random()*3+1,

    angle:
    Math.random()*
    Math.PI*
    2

    });

    }

    }

    rebuildParticles();

    particleSlider.addEventListener(
    "input",
    rebuildParticles
    );

    function drawGalaxy(
    bands
    ){

    const speed =
    Number(
    speedSlider.value
    );

    particles.forEach(
    (p,i)=>{

    p.angle +=
    0.002*
    speed;

    p.x +=
    Math.cos(
    p.angle
    )*
    speed*
    0.3;

    p.y +=
    Math.sin(
    p.angle
    )*
    speed*
    0.3;

    if(
    p.x<0
    )p.x=
    canvas.width;

    if(
    p.x>
    canvas.width
    )p.x=0;

    if(
    p.y<0
    )p.y=
    canvas.height;

    if(
    p.y>
    canvas.height
    )p.y=0;

    const size =

    p.size +

    bands.bass/
    40 +

    beatPulse/
    5;

    const color =
    getThemeColor(
    i,
    particles.length
    );

    applyGlow(
    color
    );

    ctx.fillStyle =
    color;

    ctx.beginPath();

    ctx.arc(

    p.x,
    p.y,

    size,

    0,
    Math.PI*2

    );

    ctx.fill();

    }
    );

    }

    function drawSpiral(
    bands
    ){

    const cx=
    canvas.width/2;

    const cy=
    canvas.height/2;

    const speed=
    Number(
    speedSlider.value
    );

    particles.forEach(
    (p,i)=>{

    const t=
    i*0.15;

    const r=

    Number(
    centerSizeSlider.value
    )

    +

    t*
    2

    +

    bands.bass;

    const x=
    cx+
    Math.cos(
    t+
    performance.now()/800
    )*
    r;

    const y=
    cy+
    Math.sin(
    t+
    performance.now()/800
    )*
    r;

    const color=
    getThemeColor(
    i,
    particles.length
    );

    applyGlow(
    color
    );

    ctx.fillStyle=
    color;

    ctx.beginPath();

    ctx.arc(

    x,
    y,

    2+
    bands.highs/
    50,

    0,
    Math.PI*2

    );

    ctx.fill();

    }
    );

    }

    function drawBlackHole(
    bands
    ){

    const cx=
    canvas.width/2;

    const cy=
    canvas.height/2;

    const speed=
    Number(
    speedSlider.value
    );

    particles.forEach(
    (p,i)=>{

    const dx=
    cx-p.x;

    const dy=
    cy-p.y;

    const dist=
    Math.sqrt(
    dx*dx+
    dy*dy
    )+1;

    p.x +=
    (dx/dist)*
    speed*
    0.4;

    p.y +=
    (dy/dist)*
    speed*
    0.4;

    if(
    dist<20
    ){

    p.x=
    Math.random()*
    canvas.width;

    p.y=
    Math.random()*
    canvas.height;

    }

    const color=
    getThemeColor(
    i,
    particles.length
    );

    applyGlow(
    color
    );

    ctx.fillStyle=
    color;

    ctx.beginPath();

    ctx.arc(

    p.x,
    p.y,

    p.size+
    bands.bass/
    30,

    0,
    Math.PI*2

    );

    ctx.fill();

    }
    );

    }

    function drawNetwork(
    bands
    ){

    for(
    let i=0;
    i<particles.length;
    i++
    ){

    const a=
    particles[i];

    for(
    let j=i+1;
    j<particles.length;
    j++
    ){

    const b=
    particles[j];

    const dx=
    a.x-b.x;

    const dy=
    a.y-b.y;

    const dist=
    Math.sqrt(
    dx*dx+
    dy*dy
    );

    if(
    dist<120
    ){

    ctx.strokeStyle=
    `rgba(
    255,
    255,
    255,
    ${
    1-
    dist/120
    }
    )`;

    ctx.lineWidth=
    1+
    bands.mids/
    80;

    ctx.beginPath();

    ctx.moveTo(
    a.x,
    a.y
    );

    ctx.lineTo(
    b.x,
    b.y
    );

    ctx.stroke();

    }

    }

    }

    drawGalaxy(
    bands
    );

    }

function drawRing(
    data,
    bands
    ){

    const cx=
    canvas.width/2;

    const cy=
    canvas.height/2;

const radius=

Number(
centerSizeSlider.value
)

+

beatPulse;

    const sensitivity=
    Number(
    sensitivitySlider.value
    );

    for(
    let i=0;
    i<data.length;
    i++
    ){

    const angle=
    (i/data.length)*
    Math.PI*
    2;

    const len=
    (
    data[i]/
    255
    )*
    120*
    sensitivity;

    const x1=
    cx+
    Math.cos(
    angle
    )*
    radius;

    const y1=
    cy+
    Math.sin(
    angle
    )*
    radius;

    const x2=
    cx+
    Math.cos(
    angle
    )*
    (
    radius+
    len
    );

    const y2=
    cy+
    Math.sin(
    angle
    )*
    (
    radius+
    len
    );

    const color=
    getThemeColor(
    i,
    data.length
    );

    applyGlow(
    color
    );

    ctx.strokeStyle=
    color;

    ctx.lineWidth=
    2+
    bands.bass/
    120;

    ctx.beginPath();

    ctx.moveTo(
    x1,
    y1
    );

    ctx.lineTo(
    x2,
    y2
    );

    ctx.stroke();

    }

    }

    function drawFireworks(
    bands
    ){

    if(
    bands.bass>
    350 &&
    Math.random()<0.25
    ){

    fireworks.push({

    x:
    Math.random()*
    canvas.width,

    y:
    Math.random()*
    canvas.height,

    radius:5,

    life:100

    });

    }

    fireworks.forEach(
    (f,i)=>{

    const color=
    getThemeColor(
    i,
    fireworks.length+1
    );

    applyGlow(
    color
    );

    ctx.strokeStyle=
    color;

    ctx.lineWidth=2;

    ctx.beginPath();

    ctx.arc(

    f.x,
    f.y,

    f.radius,

    0,
    Math.PI*2

    );

    ctx.stroke();

    f.radius+=4;

    f.life--;

    }
    );

    fireworks=
    fireworks.filter(
    f=>f.life>0
    );

    }

    function drawSpiral2(
        bands
        ){

        const cx=
        canvas.width/2;

        const cy=
        canvas.height/2;

        const centerSize=

        Number(
        centerSizeSlider.value
        );

        const speed=

        Number(
        speedSlider.value
        );

        const arms=4;

        const time=

        performance.now()*0.00025*
        speed;

        for(

        let i=0;

        i<particles.length;

        i++

        ){

        const arm=

        i%arms;

        const armOffset=

        (
        Math.PI*2
        /
        arms
        )
        *
        arm;

        const progress=

        i/
        particles.length;

        const radius=

        centerSize

        +

        progress*
        (
        350+
        bands.bass
        );

        const angle=

        armOffset

        +

        radius*
        0.03

        +

        time

        +

        bands.mids*
        0.0008;

        const x=

        cx+

        Math.cos(
        angle
        )

        *

        radius;

        const y=

        cy+

        Math.sin(
        angle
        )

        *

        radius;

        const color=

        getThemeColor(
        i,
        particles.length
        );

        applyGlow(
        color
        );

        ctx.fillStyle=
        color;

        ctx.beginPath();

        ctx.arc(

        x,
        y,

        2

        +

        bands.highs/
        70

        +

        beatPulse/
        10,

        0,
        Math.PI*2

        );

        ctx.fill();

        }

        ctx.shadowBlur=0;

        ctx.fillStyle=
        "black";

        ctx.beginPath();

        ctx.arc(

        cx,
        cy,

        centerSize,

        0,
        Math.PI*2

        );

        ctx.fill();

        }

    function detectBeat(
    bands
    ){

    const energy=

    bands.bass+
    bands.mids*0.5;

    beatEnergy=
    beatEnergy*
    0.95+
    energy*
    0.05;

    if(
    energy>
    beatEnergy*
    1.25
    ){

    beatPulse=
    30;

    }

    beatPulse*=
    0.92;

    }

    function animate(){

    requestAnimationFrame(
    animate
    );

    const trail=
    Number(
    trailSlider.value
    );

    ctx.fillStyle=
    `rgba(
    0,
    0,
    0,
    ${
    trail/300
    }
    )`;

    ctx.fillRect(

    0,
    0,
    canvas.width,
    canvas.height

    );

    if(
    bgImage
    ){

    ctx.drawImage(

    bgImage,

    0,
    0,

    canvas.width,
    canvas.height

    );

    }

    const data=
    getAudioData();

    if(
    !data
    ){

    return;

    }

    const bands=
    getBands(
    data
    );

    detectBeat(
    bands
    );

    switch(
    modeSelect.value
    ){

    case "ring":

    drawRing(
    data,
    bands
    );

    break;

    case "galaxy":

    drawGalaxy(
    bands
    );

    break;

    case "network":

    drawNetwork(
    bands
    );

    break;

    case "fireworks":

    drawFireworks(
    bands
    );

    break;

    case "spiral":

    drawSpiral(
    bands
    );

    break;

    case "spiral2":

        drawSpiral2(
        bands
        );

        break;

    case "blackhole":

    drawBlackHole(
    bands
    );

    break;

    }

    ctx.shadowBlur=0;

    }

    animate();

