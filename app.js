const canvas =
document.getElementById("canvas");

const ctx =
canvas.getContext("2d");

function resize(){

canvas.width=
window.innerWidth;

canvas.height=
window.innerHeight;

}

resize();

window.addEventListener(
"resize",
resize
);

let audioCtx;
let analyser;
let audio;

const fileInput =
document.getElementById("audioFile");

const startBtn =
document.getElementById("startBtn");

const modeSelect =
document.getElementById("mode");

startBtn.addEventListener(
"click",
async()=>{

if(!audioCtx){

audioCtx=
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

const file=
e.target.files[0];

if(!file) return;

audio=
new Audio(
URL.createObjectURL(file)
);

audio.loop=true;

if(!audioCtx){

audioCtx=
new(
window.AudioContext||
window.webkitAudioContext
)();

}

const source=
audioCtx.createMediaElementSource(
audio
);

analyser=
audioCtx.createAnalyser();

analyser.fftSize=512;

source.connect(analyser);

analyser.connect(
audioCtx.destination
);

audio.play();

}
);

function drawRing(data){

const cx=
canvas.width/2;

const cy=
canvas.height/2;

const radius=150;

for(
let i=0;
i<data.length;
i++
){

const angle=
(i/data.length)*
Math.PI*2;

const length=
data[i];

const x1=
cx+
Math.cos(angle)*radius;

const y1=
cy+
Math.sin(angle)*radius;

const x2=
cx+
Math.cos(angle)*
(radius+length);

const y2=
cy+
Math.sin(angle)*
(radius+length);

ctx.strokeStyle=
`hsl(${
(i/data.length)*360
},100%,60%)`;

ctx.lineWidth=3;

ctx.beginPath();

ctx.moveTo(x1,y1);

ctx.lineTo(x2,y2);

ctx.stroke();

}

}

let particles=[];

for(let i=0;i<300;i++){

particles.push({

x:
Math.random()*
window.innerWidth,

y:
Math.random()*
window.innerHeight,

size:
Math.random()*3

});

}

function drawGalaxy(data){

let bass=
data[5]||0;

for(
const p of particles
){

const dx=
canvas.width/2-p.x;

const dy=
canvas.height/2-p.y;

const dist=
Math.sqrt(
dx*dx+
dy*dy
)+1;

p.x+=
(dy/dist)*0.8;

p.y-=
(dx/dist)*0.8;

ctx.beginPath();

ctx.arc(
p.x,
p.y,
p.size+
bass/60,
0,
Math.PI*2
);

ctx.fillStyle=
`hsl(${bass*2},
100%,70%)`;

ctx.fill();

}

}

let fireworks=[];

function drawFireworks(data){

if(
Math.random()<0.08
){

fireworks.push({

x:
Math.random()*
canvas.width,

y:
Math.random()*
canvas.height,

r:
10,

life:
100

});

}

for(
const f of fireworks
){

ctx.beginPath();

ctx.arc(
f.x,
f.y,
f.r,
0,
Math.PI*2
);

ctx.strokeStyle=
`hsl(${f.life*3},
100%,60%)`;

ctx.stroke();

f.r+=2;

f.life--;

}

fireworks=
fireworks.filter(
f=>f.life>0
);

}

function animate(){

requestAnimationFrame(
animate
);

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

if(!analyser)
return;

const data=
new Uint8Array(
analyser.frequencyBinCount
);

analyser.getByteFrequencyData(
data
);

switch(
modeSelect.value
){

case "ring":

drawRing(data);

break;

case "galaxy":

drawGalaxy(data);

break;

case "fireworks":

drawFireworks(data);

break;

}

}

animate();