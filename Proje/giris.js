(()=>{
const KEY='ukd-gunluk', PIN='1234'; /* PIN'i değiştir */
const $=id=>document.getElementById(id);
const DEF={name:$('dName').textContent,price:+$('dPrice').textContent.replace(/\D/g,''),promo:$('promo').textContent,img:''};
const DEF_IMG=$('dImg').getAttribute('src');
let S={...DEF}, tmp=null;
try{const r=JSON.parse(localStorage.getItem(KEY)||'null');if(r)S={...DEF,...r}}catch(e){}
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){return false}};

function render(){
  $('dName').textContent=S.name; $('dPrice').textContent=S.price+'₺';
  const im=$('dImg'); im.src=S.img||DEF_IMG; im.alt=S.name;
  const p=$('promo'); p.textContent=S.promo; p.hidden=!S.promo.trim();
}
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;setTimeout(()=>e.style.opacity=0,2200)}

const adm=$('admDlg'), msg=$('admMsg');
adm.addEventListener('click',e=>{if(e.target===adm||e.target.closest('[data-close]'))adm.close()});

$('admBtn').onclick=e=>{
  e.preventDefault();
  $('lockV').hidden=false;$('formV').hidden=true;$('pin').value='';msg.textContent='';
  adm.showModal();
};
$('login').onclick=()=>{
  if($('pin').value!==PIN){msg.textContent='PIN yanlış. Tekrar dene.';return}
  tmp=null;msg.textContent='';$('lockV').hidden=true;$('formV').hidden=false;
  $('fN').value=S.name;$('fP').value=S.price;$('fC').value=S.promo;$('fT').src=S.img||DEF_IMG;
};
$('pick').onclick=()=>$('fF').click();
$('fF').onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  const r=new FileReader();
  r.onload=()=>{const i=new Image();i.onload=()=>{
    const k=Math.min(1,720/Math.max(i.width,i.height)),c=document.createElement('canvas');
    c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);
    c.getContext('2d').drawImage(i,0,0,c.width,c.height);
    tmp=c.toDataURL('image/jpeg',.82);$('fT').src=tmp};
    i.src=r.result};
  r.readAsDataURL(f);
};
$('save').onclick=()=>{
  const old={...S}, pr=parseInt($('fP').value,10);
  S.name=$('fN').value.trim()||DEF.name; S.price=isNaN(pr)?old.price:Math.max(0,pr);
  S.promo=$('fC').value.trim(); if(tmp)S.img=tmp;
  if(persist()){tmp=null;render();adm.close();toast('Kaydedildi')}
  else{S=old;msg.textContent='Kaydedilemedi. Fotoğraf çok büyük olabilir, başka bir fotoğraf dene.'}
};
$('reset').onclick=()=>{S={...DEF};tmp=null;try{localStorage.removeItem(KEY)}catch(e){}render();adm.close();toast('İlk haline döndü')};

render();
})();