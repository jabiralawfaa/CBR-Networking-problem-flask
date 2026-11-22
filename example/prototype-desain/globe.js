// Globe 3D neon (canvas, tanpa library). Pulau digambar sederhana; titik BTS di bawah hanyalah data contoh.
(function(){
const cv=document.getElementById('globe');if(!cv)return;
const ctx=cv.getContext('2d'),rad=Math.PI/180,anim=!matchMedia('(prefers-reduced-motion:reduce)').matches;
const ISL=[
[[95.3,5.6],[97.6,5.2],[100.4,3],[101.8,2],[103.8,1],[104.8,-1.2],[106,-3.2],[105.8,-5.8],[103.5,-4.6],[101.5,-2.8],[100.3,-0.8],[98.7,1.7],[96.5,3.5]],
[[105.2,-6.8],[106.5,-6],[108.5,-6.3],[110.5,-6.9],[112.6,-6.9],[114.4,-7.8],[114.5,-8.7],[112,-8.4],[109,-7.8],[106.5,-7.4]],
[[109,1.8],[111,1.5],[113.5,3.2],[115.5,4.8],[117.5,6.9],[119,5],[117.7,2.5],[118,0.8],[116.5,-1.8],[116.2,-3.8],[114.5,-4],[112,-3.4],[110.3,-2.9],[109.8,-1.2],[108.9,0.5]],
[[119.4,-3.5],[119.6,-1],[120.9,1],[121.5,1.3],[123.3,0.9],[125,1.6],[124.3,0.3],[122.8,-0.7],[122,-2.5],[123.2,-4],[122.2,-5],[121.2,-4.5],[120.4,-5.6],[119.5,-5.5]],
[[131,-0.8],[134,-0.7],[135.5,-3.4],[138,-1.8],[141,-2.6],[141,-9],[138.5,-8.3],[137.8,-5.5],[135,-4],[133.5,-4.2],[132.5,-2.8],[131,-1.5]],
[[115,-8.2],[119,-8.4],[122.8,-8.3],[122,-8.9],[119,-9],[115,-8.8]]];
// [nama, lon, lat, status] a=aktif, n=nonaktif, g=gangguan
const N=[["Banda Aceh",95.35,5.55,'n'],["Medan",98.67,3.6,'a'],["Padang",100.35,-0.95,'g'],["Palembang",104.75,-2.98,'a'],["Lampung",105.26,-5.4,'a'],
["Jakarta",106.85,-6.2,'a'],["Bandung",107.6,-6.9,'a'],["Semarang",110.4,-7,'a'],["Surabaya",112.75,-7.25,'a'],["Banyuwangi",114.3,-8.2,'a'],
["Denpasar",115.2,-8.65,'a'],["Mataram",116.1,-8.6,'a'],["Labuan Bajo",120.4,-8.6,'n'],["Pontianak",109.33,-0.03,'a'],["Banjarmasin",114.6,-3.3,'g'],
["Samarinda",117.15,-0.5,'a'],["Makassar",119.43,-5.15,'a'],["Palu",119.87,-0.9,'a'],["Manado",124.8,1.45,'a'],["Jayapura",140.7,-2.55,'a'],["Manokwari",134.07,-0.87,'n']];
const L=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[5,7],[7,8],[8,9],[9,10],[10,11],[11,12],[8,14],[14,15],[13,5],[8,16],[16,17],[17,18],[18,19],[19,20],[15,16]];
const COL={a:'#ff4a1c',n:'#7a706a',g:'#ffe14d'};
let W,H,R,CX;
function size(){const d=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);const m=W<700;R=W*(m?1.05:.78);CX=m?.5:.645;if(!anim)draw(0)}
function P(lo,la,l0,p0){const l=(lo-l0)*rad,p=la*rad,q=p0*rad;return[Math.cos(p)*Math.sin(l),Math.cos(q)*Math.sin(p)-Math.sin(q)*Math.cos(p)*Math.cos(l),Math.sin(q)*Math.sin(p)+Math.cos(q)*Math.cos(p)*Math.cos(l)]}
function draw(t){
 const l0=118+Math.sin(t/7000)*3,p0=-2.5+Math.sin(t/9000)*1.5,cx=W*CX,cy=H*.5;
 const pr=(lo,la)=>{const v=P(lo,la,l0,p0);return[cx+R*v[0],cy-R*v[1],v[2]]};
 ctx.clearRect(0,0,W,H);
 const g=ctx.createRadialGradient(cx-R*.35,cy-R*.4,R*.1,cx,cy,R);g.addColorStop(0,'#2b0e09');g.addColorStop(1,'#0c0706');
 ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.clip();
 const path=pts=>{ctx.beginPath();let on=false;pts.forEach(p=>{if(p[2]>0){on?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);on=true}else on=false});ctx.stroke()};
 ctx.strokeStyle='rgba(255,70,35,.17)';ctx.lineWidth=1;
 for(let la=-30;la<=30;la+=5){const a=[];for(let lo=60;lo<=180;lo+=3)a.push(pr(lo,la));path(a)}
 for(let lo=60;lo<=180;lo+=5){const a=[];for(let la=-40;la<=40;la+=3)a.push(pr(lo,la));path(a)}
 ctx.shadowColor='#ff2a10';ctx.shadowBlur=10;ctx.strokeStyle='#ff3b1f';ctx.fillStyle='rgba(255,50,25,.1)';ctx.lineWidth=1.3;
 ISL.forEach(poly=>{ctx.beginPath();poly.forEach((q,i)=>{const p=pr(q[0],q[1]);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.closePath();ctx.fill();ctx.stroke()});
 ctx.shadowBlur=0;
 const pts=N.map(n=>pr(n[1],n[2]));
 ctx.setLineDash([4,7]);ctx.lineDashOffset=-t/45;ctx.lineWidth=1.1;
 L.forEach(([a,b])=>{const A=pts[a],B=pts[b],d=Math.hypot(A[0]-B[0],A[1]-B[1]),bad=N[a][3]==='g'||N[b][3]==='g';
  ctx.strokeStyle=bad?'rgba(255,225,77,.6)':'rgba(255,90,50,.5)';ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2-d*.22,B[0],B[1]);ctx.stroke()});
 ctx.setLineDash([]);
 N.forEach((n,i)=>{const p=pts[i],s=n[3];let a=1;
  if(s==='g'){a=anim?.3+.7*Math.abs(Math.sin(t/220)):1;const k=anim?(t%1400)/1400:0;ctx.strokeStyle=`rgba(255,225,77,${1-k})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(p[0],p[1],4+k*16,0,7);ctx.stroke()}
  ctx.globalAlpha=a;ctx.fillStyle=COL[s];ctx.shadowColor=COL[s];ctx.shadowBlur=s==='n'?0:12;ctx.beginPath();ctx.arc(p[0],p[1],3.4,0,7);ctx.fill();ctx.globalAlpha=1;ctx.shadowBlur=0;
  if(s==='g'){ctx.fillStyle='#ffe9a0';ctx.font='11px Manrope,sans-serif';ctx.fillText(n[0],p[0]+9,p[1]+4)}});
 ctx.restore();
 ctx.strokeStyle='rgba(255,70,35,.55)';ctx.lineWidth=1.5;ctx.shadowColor='#ff2a10';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();ctx.shadowBlur=0}
function loop(t){draw(t);requestAnimationFrame(loop)}
addEventListener('resize',size);size();if(anim)requestAnimationFrame(loop);
})();
