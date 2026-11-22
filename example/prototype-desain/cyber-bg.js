// Latar animasi bergaya cybersecurity: hujan kode + garis pindai. Dipakai di halaman diagnosa dan hasil.
(function(){
const op=document.currentScript.dataset.opacity||.35,still=matchMedia('(prefers-reduced-motion:reduce)').matches;
const c=document.createElement('canvas');c.setAttribute('aria-hidden','true');
c.style.cssText=`position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:${op}`;
document.body.prepend(c);
if(!still){const s=document.createElement('div');s.className='scan';s.setAttribute('aria-hidden','true');document.body.prepend(s)}
const x=c.getContext('2d'),FS=16,CH='01ABCDEF<>/{}#$%';let W,H,cols,drops,last=0;
function size(){const d=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);cols=Math.ceil(W/FS);drops=Array.from({length:cols},()=>Math.random()*H/FS)}
function step(){x.globalCompositeOperation='destination-out';x.fillStyle='rgba(0,0,0,.14)';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';x.font=FS+'px monospace';
 for(let i=0;i<cols;i++){const y=drops[i]*FS;x.fillStyle=Math.random()<.05?'#ffd9a0':'#e5481b';x.fillText(CH[Math.random()*CH.length|0],i*FS,y);if(y>H&&Math.random()>.975)drops[i]=0;drops[i]++}}
function frame(t){if(t-last>70){last=t;step()}requestAnimationFrame(frame)}
size();addEventListener('resize',size);
if(still){for(let i=0;i<40;i++)step()}else requestAnimationFrame(frame);
})();
