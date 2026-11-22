// Data prototype: sama dengan data.py. Di Flask, bagian ini diganti data dari cbr.py / Jinja.
const GEJALA=["Sinyal telepon mati","BTS bad performance","Sinyal tidak ke antena sektoral","Block call pelanggan","Sambungan komunikasi terputus","Transmisi down","Error rangkaian digital","Sinyal telepon tidak stabil","Service link pihak ketiga down","Sinyal salah satu service hilang","Sinyal internet tidak stabil","BTS terdeteksi di monitor NOC","Alarm muncul pada hub site","Suhu shelter di ambang batas","Suhu recty tinggi","BTS down","Alarm muncul pada modul","Power modul atau PSU mati","PSU tidak beraturan","Lampu indikator daya mati","Sinyal tidak ke board","Board tidak terdeteksi","Board tetap tidak terdeteksi saat pindah slot","RTWP −105 dBm tanpa muatan"];
const DIAGNOSIS=[["VSWR",[0,1,2,3]],["Bad RSL",[4,5,6,7]],["Link 3rd party down",[8,9,10,11]],["Hub site down",[0,5,12]],["High temperature",[0,13,14,15]],["Modul power faulty",[16,17,18]],["Power off",[0,7,15,19]],["Board faulty",[20,21,22]],["RTWP",[0,1,3,20,23]]].map(([nama,idx],i)=>({kode:"D"+(i+1),nama,idx}));
function cosine(a,b){let d=0,x=0,y=0;for(let i=0;i<a.length;i++){d+=a[i]*b[i];x+=a[i]**2;y+=b[i]**2}const p=Math.sqrt(x)*Math.sqrt(y);return p?d/p*100:0}
function rekomendasi(kasus){
  const hasil=DIAGNOSIS.map(d=>{const v=GEJALA.map((_,i)=>d.idx.includes(i)?1:0);return{...d,skor:Math.round(cosine(kasus,v)*100)/100,cocok:d.idx.filter(i=>kasus[i])}});
  hasil.sort((a,b)=>b.skor-a.skor);hasil.forEach((h,i)=>h.peringkat=i+1);return hasil}
const fmt=n=>n.toFixed(2).replace('.',',');
