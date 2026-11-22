// Karakter programmer 3D (three.js): jaket hitam + logo EKRAF, kacamata minimalis, melambaikan tangan.
// Logo EKRAF: (1) ekraf-logo.png lokal -> (2) ekraf.go.id sebagai tekstur -> (3) overlay <img> yang mengikuti dada karakter
// (tidak butuh CORS) -> (4) lambang bawaan jika semua gagal.
(function(){
const box=document.getElementById('prog3d');if(!box)return;
if(!window.THREE){box.classList.add('nogl');return}
const T=THREE,still=matchMedia('(prefers-reduced-motion:reduce)').matches,LOGO_URL='https://ekraf.go.id/Primary_Logo_Black.png';
let renderer;
try{renderer=new T.WebGLRenderer({antialias:true,alpha:true})}catch(e){box.classList.add('nogl');return}
renderer.setClearColor(0x000000,0);renderer.outputEncoding=T.sRGBEncoding;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
box.appendChild(renderer.domElement);
const scene=new T.Scene(),cam=new T.PerspectiveCamera(32,1,.1,60),FOV=32;

// cahaya (tema oranye-merah)
scene.add(new T.HemisphereLight(0xffe9dd,0x2b0e09,.85));
const key=new T.DirectionalLight(0xffffff,1.25);key.position.set(-2.5,3,4);scene.add(key);
const rim=new T.DirectionalLight(0xff4a1c,2);rim.position.set(3,2,-3);scene.add(rim);
const rim2=new T.DirectionalLight(0xe9b23b,.8);rim2.position.set(-3,1,-2);scene.add(rim2);
const fill=new T.PointLight(0xff6a35,.9,12);fill.position.set(2.5,-.5,3);scene.add(fill);

const M=(c,r=.6,m=0)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const jacket=M(0x151515,.5,.12),jacket2=M(0x1d1d1d,.5,.1),skin=M(0xe3b08a,.65),hairM=M(0x0a0a0a,.45,.1),frameM=M(0x222222,.25,.7);
const accent=new T.MeshStandardMaterial({color:0xdc3f0c,roughness:.4,emissive:0x8a2200,emissiveIntensity:.6});

// latar: glow oranye + cincin neon
(function(){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),r=g.createRadialGradient(128,128,10,128,128,128);
 r.addColorStop(0,'rgba(255,90,40,.55)');r.addColorStop(.55,'rgba(220,63,12,.18)');r.addColorStop(1,'rgba(220,63,12,0)');g.fillStyle=r;g.fillRect(0,0,256,256);
 const m=new T.Mesh(new T.PlaneGeometry(5,5),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));m.position.set(0,1.4,-1.8);scene.add(m)})();
const ring=new T.Mesh(new T.TorusGeometry(1.95,.016,8,120),new T.MeshBasicMaterial({color:0xff4a1c,transparent:true,opacity:.7}));ring.position.set(0,1.4,-1.3);scene.add(ring);
const ring2=new T.Mesh(new T.TorusGeometry(1.55,.011,8,120),new T.MeshBasicMaterial({color:0xe9b23b,transparent:true,opacity:.55}));ring2.position.set(0,1.4,-1.2);ring2.rotation.x=1.1;scene.add(ring2);

const ch=new T.Group();scene.add(ch);

// badan jaket
const torso=new T.Mesh(new T.CapsuleGeometry(.68,.9,12,40),jacket);torso.scale.set(1.2,1,.78);torso.position.y=.1;ch.add(torso);
[-1,1].forEach(s=>{const p=new T.Mesh(new T.BoxGeometry(.34,.05,.04),jacket2);p.position.set(s*.42,-.02,.5);p.rotation.z=s*.18;ch.add(p)});
const collar=new T.Mesh(new T.CylinderGeometry(.3,.4,.34,36,1,true),new T.MeshStandardMaterial({color:0x151515,roughness:.5,metalness:.12,side:T.DoubleSide}));collar.position.y=1.2;ch.add(collar);
const cst=new T.Mesh(new T.TorusGeometry(.3,.022,10,40),accent);cst.rotation.x=Math.PI/2;cst.position.y=1.37;ch.add(cst);
const neck=new T.Mesh(new T.CylinderGeometry(.17,.19,.45,20),skin);neck.position.y=1.3;ch.add(neck);
[-1,1].forEach(s=>{const st=new T.Mesh(new T.CylinderGeometry(.013,.013,.32,8),M(0xcccccc,.5));st.position.set(s*.15,.84,.5);st.rotation.z=s*.05;ch.add(st)});

// logo EKRAF di tengah dada
const lc=document.createElement('canvas');lc.width=lc.height=512;const lg=lc.getContext('2d');
const lt=new T.CanvasTexture(lc);lt.encoding=T.sRGBEncoding;lt.anisotropy=4;
const logo=new T.Mesh(new T.PlaneGeometry(.62,.62),new T.MeshBasicMaterial({map:lt,transparent:true,color:0xe8e8e8}));
logo.position.set(0,.3,.552);ch.add(logo);
function fallbackLogo(){
 lg.clearRect(0,0,512,512);lg.strokeStyle='#fff';lg.lineWidth=28;lg.lineJoin='round';lg.beginPath();
 for(let i=0;i<=120;i++){const t=i/120*Math.PI*2,d=1+Math.sin(t)**2,x=256+190*Math.cos(t)/d,y=190+190*Math.sin(t)*Math.cos(t)/d;i?lg.lineTo(x,y):lg.moveTo(x,y)}
 lg.closePath();lg.stroke();lg.fillStyle='#fff';lg.font='700 120px Manrope,system-ui,sans-serif';lg.textAlign='center';lg.fillText('EKRAF',256,420);lt.needsUpdate=true}
function useImage(img){
 try{
  const s=Math.min(440/img.naturalWidth,440/img.naturalHeight),w=img.naturalWidth*s,h=img.naturalHeight*s;
  lg.clearRect(0,0,512,512);lg.drawImage(img,(512-w)/2,(512-h)/2,w,h);
  const d=lg.getImageData(0,0,512,512),p=d.data;
  for(let i=0;i<p.length;i+=4){const lum=(p[i]*.3+p[i+1]*.59+p[i+2]*.11)/255;p[i+3]=p[i+3]*(1-lum);p[i]=p[i+1]=p[i+2]=255}
  lg.putImageData(d,0,0);lt.needsUpdate=true;return true
 }catch(e){return false}}
// overlay <img> (tanpa CORS) yang ditempel ke dada lewat proyeksi 3D -> 2D
let ov=null,ovOn=false;
function startOverlay(){
 const im=new Image();im.referrerPolicy='no-referrer';im.alt='';im.setAttribute('aria-hidden','true');
 im.style.cssText='position:absolute;left:0;top:0;pointer-events:none;object-fit:contain;filter:brightness(0) invert(1);opacity:.93;display:none;will-change:transform';
 im.onload=()=>{ov=im;ovOn=true;logo.visible=false;box.appendChild(im);if(still)render(0)};
 im.src=LOGO_URL}
fallbackLogo();
(function load(srcs){
 if(!srcs.length){startOverlay();return}
 const src=srcs[0],img=new Image();
 if(/^https?:/.test(src))img.crossOrigin='anonymous';
 img.onload=()=>{if(!useImage(img)){fallbackLogo();load(srcs.slice(1))}};
 img.onerror=()=>load(srcs.slice(1));
 img.src=src})(['ekraf-logo.png',LOGO_URL]);
const anchor=new T.Object3D();anchor.position.set(0,.3,.56);ch.add(anchor);

// kepala (lebih besar, gaya toy 3D)
const head=new T.Group();head.position.y=1.92;head.scale.setScalar(1.1);ch.add(head);
const skull=new T.Mesh(new T.SphereGeometry(.55,48,36),skin);skull.scale.set(1,1.06,1);head.add(skull);
const hair=new T.Mesh(new T.SphereGeometry(.585,48,28,0,Math.PI*2,0,1.4),hairM);hair.scale.set(1,1.06,1);hair.rotation.x=-.28;head.add(hair);
const sw=new T.Mesh(new T.SphereGeometry(.2,24,16),hairM);sw.scale.set(1.5,.5,.8);sw.position.set(.12,.4,.48);sw.rotation.z=-.3;head.add(sw);
const sw2=new T.Mesh(new T.SphereGeometry(.16,24,16),hairM);sw2.scale.set(1.3,.5,.8);sw2.position.set(-.2,.38,.47);sw2.rotation.z=.25;head.add(sw2);
[-1,1].forEach(s=>{
 const e=new T.Mesh(new T.SphereGeometry(.11,16,12),skin);e.scale.set(.5,1,.8);e.position.set(s*.55,-.02,0);head.add(e);
 const ck=new T.Mesh(new T.SphereGeometry(.075,16,12),new T.MeshBasicMaterial({color:0xe8806a,transparent:true,opacity:.35}));ck.scale.set(1,.7,.2);ck.position.set(s*.3,-.12,.46);head.add(ck)});
const nose=new T.Mesh(new T.SphereGeometry(.058,16,12),M(0xd29b75,.7));nose.position.set(0,-.06,.53);head.add(nose);
const mouth=new T.Mesh(new T.TorusGeometry(.13,.014,8,28,Math.PI),M(0x7a2e22,.6));mouth.rotation.z=Math.PI;mouth.scale.y=.65;mouth.position.set(0,-.19,.515);head.add(mouth);
const eyes=[];
[-1,1].forEach(s=>{
 const eg=new T.Group();eg.position.set(s*.2,.05,.475);head.add(eg);eyes.push(eg);
 const sc=new T.Mesh(new T.SphereGeometry(.075,20,16),M(0xffffff,.3));sc.scale.z=.6;eg.add(sc);
 const ir=new T.Mesh(new T.SphereGeometry(.05,20,16),M(0x1a0f0a,.2));ir.position.set(0,0,.03);ir.scale.z=.5;eg.add(ir);
 const hl=new T.Mesh(new T.SphereGeometry(.014,8,8),new T.MeshBasicMaterial({color:0xffffff}));hl.position.set(.02,.025,.058);eg.add(hl);
 const brow=new T.Mesh(new T.CapsuleGeometry(.014,.15,4,8),hairM);brow.rotation.z=Math.PI/2-s*.1;brow.position.set(s*.2,.225,.49);head.add(brow);
 // kacamata minimalis
 const fr=new T.Mesh(new T.TorusGeometry(.16,.013,10,44),frameM);fr.scale.set(1.2,.86,1);fr.position.set(s*.2,.05,.545);head.add(fr);
 const ln=new T.Mesh(new T.CircleGeometry(.16,32),new T.MeshBasicMaterial({color:0xffb08a,transparent:true,opacity:.1}));ln.scale.set(1.2,.86,1);ln.position.set(s*.2,.05,.548);head.add(ln);
 const tp=new T.Mesh(new T.CylinderGeometry(.009,.009,.52,8),frameM);tp.rotation.x=Math.PI/2;tp.position.set(s*.4,.06,.29);head.add(tp)});
const br=new T.Mesh(new T.CylinderGeometry(.01,.01,.09,8),frameM);br.rotation.z=Math.PI/2;br.position.set(0,.08,.55);head.add(br);

// lengan: kiri santai, kanan melambai
function arm(s){
 const sh=new T.Group();sh.position.set(s*.86,.95,0);ch.add(sh);
 sh.add(new T.Mesh(new T.SphereGeometry(.22,20,16),jacket));
 const up=new T.Mesh(new T.CapsuleGeometry(.2,.35,10,24),jacket);up.position.y=-.38;sh.add(up);
 const bd=new T.Mesh(new T.TorusGeometry(.207,.016,8,28),accent);bd.rotation.x=Math.PI/2;bd.position.y=-.3;sh.add(bd);
 const el=new T.Group();el.position.y=-.72;sh.add(el);
 el.add(new T.Mesh(new T.SphereGeometry(.18,16,12),jacket));
 const fo=new T.Mesh(new T.CapsuleGeometry(.165,.3,10,24),jacket);fo.position.y=-.34;el.add(fo);
 const cf=new T.Mesh(new T.CylinderGeometry(.175,.175,.07,24),jacket2);cf.position.y=-.64;el.add(cf);
 const cr=new T.Mesh(new T.TorusGeometry(.178,.016,8,28),accent);cr.rotation.x=Math.PI/2;cr.position.y=-.58;el.add(cr);
 const hd=new T.Mesh(new T.SphereGeometry(.19,24,18),skin);hd.scale.set(1,1.05,.6);hd.position.y=-.8;el.add(hd);
 [-.1,-.033,.033,.1].forEach((x,i)=>{const f=new T.Mesh(new T.CapsuleGeometry(.032,.11,4,8),skin);f.position.set(x,-.99-(i===1||i===2?.025:0),0);f.rotation.z=x*1.6;el.add(f)});
 const th=new T.Mesh(new T.CapsuleGeometry(.036,.08,4,8),skin);th.position.set(-s*.2,-.76,.02);th.rotation.z=-s*.9;el.add(th);
 return{sh,el}}
const L=arm(-1),R=arm(1);
L.sh.rotation.z=-.1;L.el.rotation.z=-.12;L.el.rotation.x=-.3;

// panel kode holografik + simbol melayang
function codePanel(){
 const c=document.createElement('canvas');c.width=512;c.height=352;const g=c.getContext('2d');
 g.fillStyle='rgba(18,12,10,.88)';g.fillRect(0,0,512,352);g.strokeStyle='#ff6a35';g.lineWidth=5;g.strokeRect(3,3,506,346);
 g.fillStyle='rgba(255,106,53,.25)';g.fillRect(3,3,506,40);['#ff4a1c','#e9b23b','#7a706a'].forEach((k,i)=>{g.fillStyle=k;g.beginPath();g.arc(28+i*26,23,7,0,7);g.fill()});
 const ln=[['#ff6a35','function diagnosa(gejala){'],['#efe8e2','  const v = vektor(gejala);'],['#e9b23b','  return cosine(v, pola)'],['#efe8e2','    .sort((a,b)=>b-a);'],['#ff6a35','}'],['#7a706a','// BTS · cosine similarity'],['#e9b23b','status = "OK";'],['#efe8e2','kirim(hasil);']];
 g.font='700 25px "Courier New",monospace';g.textBaseline='middle';ln.forEach((l,i)=>{g.fillStyle=l[0];g.fillText(l[1],26,76+i*33)});
 const m=new T.Mesh(new T.PlaneGeometry(.95,.65),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,side:T.DoubleSide}));
 m.position.set(-1.05,2.2,-.3);m.rotation.y=.5;m.userData.y=2.2;scene.add(m);return m}
const panel=codePanel();
function sym(txt,col,x,y,z,sc){
 const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');
 g.font='700 84px "Courier New",monospace';g.textAlign='center';g.textBaseline='middle';g.shadowColor=col;g.shadowBlur=18;g.fillStyle=col;g.fillText(txt,128,64);
 const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));
 s.scale.set(sc*2,sc,1);s.position.set(x,y,z);s.userData.y=y;scene.add(s);return s}
const syms=[sym('</>','#ff6a35',-1.25,1.2,.4,.4),sym('{ }','#e9b23b',1.3,.85,.4,.38),sym('01','#ff4a1c',1.15,-.05,.5,.34)];

// interaksi pointer
const pt={x:0,y:0,tx:0,ty:0},host=box.parentElement||box;
host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect();pt.tx=((e.clientX-r.left)/r.width-.5)*2;pt.ty=((e.clientY-r.top)/r.height-.5)*2});
host.addEventListener('pointerleave',()=>{pt.tx=pt.ty=0});

let W=1,H=1;const v3=new T.Vector3();
function size(){
 W=box.clientWidth;H=box.clientHeight;if(!W||!H)return;
 renderer.setSize(W,H,false);cam.aspect=W/H;
 const d=Math.max(5.25,3.3/(2*Math.tan(FOV/2*Math.PI/180)*cam.aspect));
 cam.position.set(.12,1.4,d);cam.lookAt(.12,1.4,0);cam.updateProjectionMatrix();
 if(still)render(0)}
function render(t){
 pt.x+=(pt.tx-pt.x)*.06;pt.y+=(pt.ty-pt.y)*.06;
 const w=still?0:Math.sin(t/140);
 R.sh.rotation.z=2.65+w*.04;R.el.rotation.z=.49+w*.27;
 if(!still){
  ch.position.y=Math.sin(t/900)*.035;
  head.rotation.z=Math.sin(t/1300)*.035;
  const bl=(t%3600)<130?.1:1;eyes.forEach(e=>e.scale.y=bl);
  ring.rotation.z=t/6000;ring2.rotation.z=-t/5000;
  panel.position.y=panel.userData.y+Math.sin(t/900)*.05;
  syms.forEach((s,i)=>s.position.y=s.userData.y+Math.sin(t/800+i*1.7)*.08)}
 ch.rotation.y=.2+pt.x*.35+(still?0:Math.sin(t/2600)*.06);
 head.rotation.y=pt.x*.25;head.rotation.x=pt.y*.12;
 renderer.render(scene,cam);
 if(ovOn){ // tempel logo ke dada
  ch.updateMatrixWorld(true);anchor.getWorldPosition(v3);const dist=cam.position.distanceTo(v3);v3.project(cam);
  const px=H/(2*Math.tan(FOV/2*Math.PI/180)*dist)*.66,f=Math.cos(ch.rotation.y);
  ov.style.width=ov.style.height=px+'px';
  ov.style.transform=`translate(${(v3.x*.5+.5)*W}px,${(-v3.y*.5+.5)*H}px) translate(-50%,-50%) scaleX(${f})`;
  ov.style.display=f>.25?'block':'none'}}
function loop(t){render(t);requestAnimationFrame(loop)}
addEventListener('resize',size);size();
if('ResizeObserver' in window)new ResizeObserver(size).observe(box);
if(!still)requestAnimationFrame(loop)
})();
