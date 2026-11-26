(function(){
"use strict";
/* ===== EDIT HERE: brand name + prices (placeholders, SAR) ===== */
var CONFIG={
  brand:"Replay",
  brandShort:"RP",
  currency:"ريال",
  /* prices come from the server (_worker.js PRICES); these are only the first paint */
  price:{pack3:"29",proMonth:"69",proFirst:"39",proYear:"399",yearSave:"وفّر 52%",yearMonthly:"33",fairM:"30"},
  plans:[
    {id:"pack",name:"3 مباريات",price:"@pack3",per:"دفعة واحدة",note:"بدون اشتراك ولا تجديد",items:["3 تحليلات مباريات كاملة","مقارنة جزئية لأرقامك","تقييم RP لمستواك","أسئلة للمدرّب عن كل تقرير"],buy:[{label:"اشترِ الباقة (@pack3 ريال)",product:"pack3"}]},
    {id:"month",name:"شهري",price:"@proFirst",was:"@proMonth",per:"أول شهر",note:"ثم @proMonth ريال شهريًا • إلغاء بأي وقت",items:["تحليلات المباريات مشمولة (استخدام عادل)","رحلة التحسن كاملة: المستويات وسلسلة الأسابيع","قائمة المتصدرين","أسئلة للمدرّب عن كل تقرير"],buy:[{label:"ابدأ بـ@proFirst ريال",product:"pro_month"}]},
    {id:"year",name:"سنوي",best:"الأوفر",price:"@proYear",per:"سنويًا",note:"أي نحو @yearMonthly ريال في الشهر (@yearSave)",items:["تحليلات المباريات مشمولة (استخدام عادل)","كل مزايا الشهري","سنة كاملة بدفعة واحدة"],buy:[{label:"اشترك سنويًا (@proYear ريال)",product:"pro_year"}]}
  ],
  compareHead:["","3 مباريات","شهري / سنوي"],
  compare:[["تحليلات المباريات","3","مشمولة (استخدام عادل)"],["مقارنة أرقامك بين المباريات","جزئي","✓"],["تقييم RP","✓","✓"],["المستويات وسلسلة الأسابيع","—","✓"],["قائمة المتصدرين","—","✓"],["أسئلة المدرّب","✓","✓"]]
};
function PX(s){return String(s).replace(/@(\w+)/g,function(_,k){return CONFIG.price[k]!=null?CONFIG.price[k]:_})}
var $=function(s){return document.querySelector(s)}, $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
var st={mode:"match",file:null,tactics:null,live:null,pending:null};
var PAYMARKS="<div class=\"pay-marks\" role=\"img\" aria-label=\"مدى · Apple Pay · فيزا · ماستركارد\"><span class=\"pm pm-mada\" title=\"مدى\" aria-label=\"مدى\"><svg viewBox=\"0 0 52 32\" width=\"52\" height=\"32\" aria-hidden=\"true\"><rect width=\"52\" height=\"32\" rx=\"5\" fill=\"#fff\"/><rect x=\"6\" y=\"10\" width=\"13\" height=\"5\" fill=\"#259BD6\"/><rect x=\"6\" y=\"17\" width=\"13\" height=\"5\" fill=\"#84B740\"/><text x=\"34.5\" y=\"21\" text-anchor=\"middle\" font-family=\"Arial,Helvetica,sans-serif\" font-size=\"11.5\" font-weight=\"700\" fill=\"#1D1D1B\">mada</text></svg></span><span class=\"pm pm-ap\" title=\"Apple Pay\" aria-label=\"Apple Pay\"><svg viewBox=\"0 0 52 32\" width=\"52\" height=\"32\" aria-hidden=\"true\"><rect width=\"52\" height=\"32\" rx=\"5\" fill=\"#000\"/><g transform=\"translate(7.5 8) scale(.78)\"><path fill=\"#fff\" d=\"M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.8-1-2.8-4zM11.6 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5z\"/></g><text x=\"34\" y=\"21.2\" text-anchor=\"middle\" font-family=\"-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">Pay</text></svg></span><span class=\"pm pm-visa\" title=\"Visa\" aria-label=\"Visa\"><svg viewBox=\"0 0 52 32\" width=\"52\" height=\"32\" aria-hidden=\"true\"><rect width=\"52\" height=\"32\" rx=\"5\" fill=\"#fff\"/><text x=\"26\" y=\"21.5\" text-anchor=\"middle\" font-family=\"Arial Black,Arial,Helvetica,sans-serif\" font-size=\"14\" font-weight=\"900\" font-style=\"italic\" fill=\"#1A1F71\" letter-spacing=\".5\">VISA</text></svg></span><span class=\"pm pm-mc\" title=\"Mastercard\" aria-label=\"Mastercard\"><svg viewBox=\"0 0 52 32\" width=\"52\" height=\"32\" aria-hidden=\"true\"><rect width=\"52\" height=\"32\" rx=\"5\" fill=\"#fff\"/><circle cx=\"21\" cy=\"16\" r=\"9\" fill=\"#EB001B\"/><circle cx=\"31\" cy=\"16\" r=\"9\" fill=\"#F79E1B\"/><path d=\"M26 8.5a9 9 0 0 1 0 15 9 9 0 0 1 0-15z\" fill=\"#FF5F00\"/></svg></span></div>";
function payMarks(cls){var d=document.createElement("div");d.innerHTML=PAYMARKS;var m=d.firstChild;if(cls)m.className+=" "+cls;return m}
var EN=function(n){return String(n).replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)})};
var AR=function(n){return String(n).replace(/\d/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[d]})};
/* v39: Arabic number-noun agreement — 1 «دقيقة واحدة», 2 «دقيقتان», 3–10 «دقائق», 11+ «دقيقة» */
var arCount=function(n,one,two,few,many){n=+n||0;var r=n%100;return n===1?one:n===2?two:(n===0||(r>=3&&r<=10))?AR(n)+" "+few:AR(n)+" "+many};

/* v20: every screen and every upload step is a history entry, so the phone's back button steps back one step.
   state = {s:screen, u:upload step, d:depth inside the site}; depth 0 is the first page of the visit. */
function hDepth(){return (history.state&&history.state.d)||0}
function hSet(how,state,url){if(how===false)return;try{if(how==="replace"){state.d=hDepth();history.replaceState(state,"",url)}else{state.d=hDepth()+1;history.pushState(state,"",url)}}catch(e){}}
function cur(){var a=document.querySelector(".screen.active");return a?a.id:"home"}
function show(id,push){
  if(id==="processing"&&!watching)st.starting=st.starting||Date.now();
  if(id==="upload")return goStep(1,push);
  $$(".screen").forEach(function(s){s.classList.toggle("active",s.id===id)});document.body.dataset.scr=id;
  window.scrollTo(0,0);
  hSet(push===undefined||push===true?"push":push,{s:id},"#"+id);
  if(id==="history"&&typeof renderHist==="function")renderHist();
  if(id==="journey"&&typeof loadJourney==="function")loadJourney();
  if(id==="leaders"&&typeof loadLeaders==="function")loadLeaders();
  if(id==="checkout"&&typeof COK!=="undefined"&&!COK)return show("pricing","replace");
}
st.ustep=1;
function goStep(n,how){n=Math.max(1,Math.min(3,n||1));st.ustep=n;
  var was=cur()==="upload";
  $$(".screen").forEach(function(s){s.classList.toggle("active",s.id==="upload")});document.body.dataset.scr="upload";
  document.body.classList.remove("ws-1","ws-2","ws-3");document.body.classList.add("ws-"+n);
  $$(".wiz li").forEach(function(l){var w=+l.dataset.w;l.classList.toggle("on",w===n);l.classList.toggle("done",w<n)});
  if(n===3&&typeof paintSum==="function")paintSum();
  if(typeof updGo==="function")updGo();
  window.scrollTo(0,0);
  hSet(how===undefined||how===true?"push":how,{s:"upload",u:n},"#upload");
}
// «رجوع»: one step back inside the site; never leaves the site
function goBack(){
  if(hDepth()>0){history.back();return}
  var s=cur();
  if(s==="upload"&&st.ustep>1)return goStep(st.ustep-1,"replace");
  if(s!=="home")show("home","replace");
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-back]");if(!b)return;e.preventDefault();goBack()});
window.addEventListener("popstate",function(e){var x=e.state||{},s=x.s||"home";
  if(s==="processing"){if(watching)return history.go(1);s="upload";x.u=3}
  if(s==="upload")return goStep(x.u||1,false);
  if(s==="history"&&typeof renderHist==="function")renderHist();
  show(s,false)});
function setMode(m){m="match";/* v38: goal-clip analysis removed — full matches only */st.mode=m;document.body.classList.remove("m-match","m-goal");document.body.classList.add("m-"+m);
  $$(".seg button").forEach(function(b){b.classList.toggle("on",b.dataset.mode===m)});
  $("#go").textContent="حلّل مباراتي";
  if(typeof ACC!=="undefined"&&ACC){paintGoalBuy();updGo()}}
setMode("match");

function count(){return parseInt(localStorage.getItem("fc_count")||"0",10)}
function start(m){
  m="match";setMode(m);st.pending=m||st.mode;
  if(ACC.owner){show("upload");return}
  if(!ACC.user&&freeOn()){ev("free_open");show("upload");paintGoalBuy();if(typeof updGo==="function")updGo();paintFree();return}   // v49: first analysis without an account
  if(!ACC.user){openAuth(hadAcct()?"login":"signup",freeUsed()?"استخدمت تحليلك المجاني. أنشئ حسابك لتحلل مباراتك الجاية.":"أنشئ حسابك لتبدأ تحليل مباراتك.");return}
  // v53: an account with nothing left to pay with may still upload: a match analysed before opens its report free; a new one asks for a pack after the upload
  show("upload");paintGoalBuy();if(typeof updGo==="function")updGo();
}
$("#mb-pack").addEventListener("click",function(){buy("pack3",this)});
$("#mb-sub").addEventListener("click",function(){openPricing(null,"month")});
$("#fair-pack").addEventListener("click",function(){buy("pack3",this)});
$$("[data-start]").forEach(function(b){b.addEventListener("click",function(){ev("cta");start(b.dataset.start)})});
$$("[data-go]").forEach(function(b){b.addEventListener("click",function(){show(b.dataset.go)})});
$$(".seg button[data-mode]").forEach(function(b){b.addEventListener("click",function(){setMode(b.dataset.mode)})});

fetch("/api/status").then(function(r){return r.json()}).then(function(j){st.live=!!j.live;st.free=!!j.free;paintFree()}).catch(function(){});
// v49: the free first analysis (no account): told on the home page and the upload step while this device has not used it
function freeOn(){return !!st.free&&!ACC.user&&!ACC.token&&!ACC.owner&&!freeUsed()}
function paintFree(){var on=freeOn();$$("[data-free]").forEach(function(e){e.hidden=!on});$$("[data-nofree]").forEach(function(e){e.hidden=on})}

$("#video").addEventListener("change",function(e){
  var f=e.target.files&&e.target.files[0]; if(!f)return;
  st.file=f; var mb=f.size/1048576;
  $("#drop").classList.add("has");var di=$("#drop .drop-ic");if(di)di.textContent="✅";
  $("#drop-t").textContent=f.name.length>32?f.name.slice(0,30)+"…":f.name;
  $("#drop-s").textContent=mbTxt(mb);st.fileDur=0;
  // v33: the clip itself is not shown; a detached element only reads its length
  var p=document.createElement("video");p.preload="metadata";p.muted=true;if(st.pvUrl){try{URL.revokeObjectURL(st.pvUrl)}catch(e){}}st.pvUrl=URL.createObjectURL(f);p.src=st.pvUrl;
  p.onloadedmetadata=function(){var d=p.duration;if(isFinite(d)){st.fileDur=d;$("#drop-s").textContent+=" • "+fmt(d);var b=$("#dur-b");b.hidden=false;b.textContent=arT((Math.floor(d/60)+":"+String(Math.round(d%60)).padStart(2,"0")));if(typeof updGo==="function")updGo()}};
  $("#chg").hidden=false;$("#cta-hint").textContent="نرفع الفيديو كاملًا ثم نشاهده ونكتب التقرير";
  $("#go").disabled=false; $("#err").hidden=true;
});
function fmt(d){d=Math.round(d);var m=Math.floor(d/60),s=d%60;return m?AR(m)+" د "+AR(s)+" ث":AR(s)+" "+secW(s)}
// v30: Arabic number agreement: ١ ثانية، ٢ ثانيتان، ٣–١٠ ثوانٍ، ١١+ ثانية
function secW(n){return n===2?"ثانيتان":n>=3&&n<=10?"ثوانٍ":"ثانية"}
// v30: file size with one decimal under 10 MB, never «٠ ميجا»
function mbTxt(mb){if(mb>=1024)return AR((mb/1024).toFixed(1)).replace(".","٫")+" جيجا";if(mb<10)return AR(Math.max(0.1,mb).toFixed(1)).replace(".","٫")+" ميجا";return AR(Math.round(mb))+" ميجا"}
$("#tactics").addEventListener("change",function(e){
  var f=e.target.files&&e.target.files[0]; if(!f)return;
  var img=new Image();img.onload=function(){
    var sc=Math.min(1,1280/Math.max(img.width,img.height)),c=document.createElement("canvas");
    c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    st.tactics=c.toDataURL("image/jpeg",.8);$("#tactics-t").textContent="✓ أُضيفت";
  };img.src=URL.createObjectURL(f);
});

function once(el,ev,ms){return new Promise(function(res){var t=setTimeout(function(){el.removeEventListener(ev,h);res(false)},ms||8000);
  function h(){clearTimeout(t);el.removeEventListener(ev,h);res(true)} el.addEventListener(ev,h)})}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
/* v50 (Nov 17): uploads survive a weak mobile line. Each piece is tried up to 9 times with growing pauses; while the phone is
   offline or the page is in the background we wait for it to come back instead of failing; the screen is kept awake while uploading. */
var UPMSG="انقطع رفع الفيديو. تأكد من الإنترنت وأبقِ الشاشة مفتوحة أثناء الرفع، ثم حاول مرة أخرى. لم يُحتسب عليك شيء.";
var _wl=null;function wakeOn(){try{if(navigator.wakeLock&&!_wl)navigator.wakeLock.request("screen").then(function(l){_wl=l;l.addEventListener&&l.addEventListener("release",function(){_wl=null})}).catch(function(){})}catch(e){}}
function wakeOff(){try{_wl&&_wl.release()}catch(e){}_wl=null}
document.addEventListener("visibilitychange",function(){if(!document.hidden&&st&&st.uploading)wakeOn()});
function backOn(max){return new Promise(function(res){var t0=Date.now();(function chk(){if((navigator.onLine!==false&&!document.hidden)||Date.now()-t0>max)return res();setTimeout(chk,1000)})()})}
async function putPiece(id,off,blob,last,onp,note){var r=null,P=[1500,3000,5000,8000,12000,20000,30000,45000];
  for(var tr=0;tr<9;tr++){
    if(tr){note&&note(true);await wait(P[tr-1]);await backOn(600000)}
    try{r=await xhrPut("/api/video/chunk?id="+id+"&offset="+off+(last?"&final=1":""),blob,onp)}catch(e){r=null;continue}
    if(r.ok){note&&note(false);return r}
    if(r.status<500&&r.status!==408&&r.status!==429)return r;   // refused (expired, bad piece): trying again will not help
  }
  return r}

async function extract(file,mode,prog){
  var v=document.createElement("video");v.muted=true;v.playsInline=true;v.setAttribute("playsinline","");v.preload="auto";
  v.src=URL.createObjectURL(file);
  var ok=await once(v,"loadedmetadata",20000); if(!ok)throw new Error("meta");
  var D=v.duration;
  if(!isFinite(D)||!D){v.currentTime=1e7;await once(v,"seeked",8000);D=v.duration}
  if(!isFinite(D)||!D)throw new Error("dur");
  try{await v.play();v.pause()}catch(e){}
  var times=[];
  {var n=D<=120?Math.min(30,Math.max(8,Math.round(D/2))):Math.min(40,Math.max(20,Math.round(D/4)));
    var a=Math.min(1,D*0.02),b=Math.max(a,D-0.3);for(var i=0;i<n;i++)times.push(a+(b-a)*i/(n-1))}
  var c=document.createElement("canvas"),g=c.getContext("2d",{willReadFrequently:true}),out=[],tt=[];
  for(var k=0;k<times.length;k++){
    v.currentTime=times[k]; var sk=await once(v,"seeked",7000); if(!sk)continue;
    if(v.requestVideoFrameCallback){await Promise.race([new Promise(function(r){v.requestVideoFrameCallback(function(){r()})}),wait(250)])}else await wait(80);
    var W=v.videoWidth,H=v.videoHeight; if(!W||!H)continue;
    var sc=Math.min(1,640/Math.max(W,H)); c.width=Math.round(W*sc);c.height=Math.round(H*sc);
    g.drawImage(v,0,0,c.width,c.height);
    var px=g.getImageData(0,0,c.width,c.height).data,sum=0;for(var q=0;q<px.length;q+=400)sum+=px[q]+px[q+1]+px[q+2];
    if(sum/(px.length/400)/3<3)continue; // black frame
    out.push(c.toDataURL("image/jpeg",.72));tt.push(times[k]);
    prog(out.length,times.length);
  }
  URL.revokeObjectURL(v.src);
  return {frames:out,times:tt,duration:D};
}

function step(n){["#s1","#s2","#s3"].forEach(function(s,i){var el=$(s);el.className=i+1<n?"done":i+1===n?"now":""})}
function bar(p){$("#bar").style.width=Math.round(p)+"%"}

function xhrPut(url,blob,onp){return new Promise(function(res,rej){var x=new XMLHttpRequest();x.open("PUT",url);
  x.upload.onprogress=function(e){if(e.lengthComputable)onp(e.loaded)};
  x.onload=function(){var j={};try{j=JSON.parse(x.responseText)}catch(e){}res({ok:x.status>=200&&x.status<300,status:x.status,j:j})};
  x.onerror=function(){rej(new Error("net"))};x.onabort=function(){rej(new Error("abort"))};x.ontimeout=function(){rej(new Error("timeout"))};x.timeout=600000;x.send(blob)})}
function stepTxt(a,b,c){$("#s1").firstChild.nodeValue=a+" ";$("#s2").textContent=b;$("#s3").textContent=c}
function videoDur(file){return new Promise(function(res){var v=document.createElement("video");v.preload="metadata";v.muted=true;
  var t=setTimeout(function(){res(0)},15000);v.onloadedmetadata=function(){clearTimeout(t);res(isFinite(v.duration)?v.duration:0);URL.revokeObjectURL(v.src)};
  v.onerror=function(){clearTimeout(t);res(0)};v.src=URL.createObjectURL(file)})}
// Whole-video path: the file goes in pieces to our server, which passes it on; nothing else is stored.
async function runVideo(file){
  var f=file,dur=await videoDur(f);
  stepTxt("نرفع الفيديو","نجهّز الفيديو","نشاهد المباراة ونكتب الملاحظات");$("#s1n").textContent="";
  var s=await fetch("/api/video/start",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({size:f.size,mime:f.type||"video/mp4"})});
  var sj=await s.json().catch(function(){return {}});
  if(s.status===409||s.status===404)return "frames"; // server cannot take the whole video: use frames
  if(!s.ok||!sj.id)return fail(sj.message||"تعذّر رفع الفيديو، حاول مرة أخرى",sj.code||"E-"+s.status);
  var C=sj.chunk||8388608;
  for(var off=0;off<f.size;off+=C){
    var end=Math.min(f.size,off+C),last=end===f.size,r=null;
    st.uploading=true;wakeOn();
    r=await putPiece(sj.id,off,f.slice(off,end),last,function(l){var p=(off+l)/f.size;bar(2+48*p);$("#s1n").textContent="("+AR(Math.round(100*p))+"٪)"},function(on){if(on)$("#s1n").textContent="(نعيد المحاولة…)"});
    if(!r||!r.ok){st.uploading=false;wakeOff()}
    if(!r)return fail(UPMSG,"E-CONN");
    if(!r.ok)return fail(r.j.message||UPMSG,r.j.code||"E-"+r.status);
  }
  st.uploading=false;wakeOff();
  $("#s1n").textContent="";step(2);bar(52);
  for(var i=0;i<100;i++){
    var q=await fetch("/api/video/state?id="+sj.id).then(function(x){return x.json()}).catch(function(){return {}});
    if(q.state==="ACTIVE")break;
    if(q.state==="FAILED")return fail("لم نتمكن من قراءة الفيديو. جرّب ملف MP4 آخر.","E-VID");
    if(q.error==="expired")return fail(q.message,q.code);
    bar(Math.min(60,52+i*0.5));await wait(3000);
  }
  step(3);bar(62);
  // v12: the analysis is a job on our server; the page only follows it (and can pick it up again after the screen locks)
  var body={video:sj.id,duration:dur,team:$("#team").value.trim(),tactics:st.tactics};
  var id;
  try{id=await openRunner("/api/job/start",body)}catch(e){return fail("انقطع الاتصال. تأكد من الإنترنت وحاول مرة أخرى.","E-CONN")}
  if(id&&id.error)return fail(id.message||"حدث خلل، حاول مرة أخرى.",id.code||"E-JOB");
  saveJob(id);st.jobFile=id;
  return watchJob(id);
}
var JK="fc_job_v12";
function saveJob(id){try{localStorage.setItem(JK,JSON.stringify({id:id,t:Date.now()}))}catch(e){}addDevJob(id)
  if(!ACC.user&&!ACC.owner){try{localStorage.setItem("r2w_free_job",id);localStorage.setItem("r2w_free_used","1")}catch(e){}paintFree()}}   // v49: the free analysis of this device
// v49: after sign-up or login, the device's free analysis joins the account and its full report opens
function claimFree(show_){var id=freeJob();if(!id||!ACC.token)return Promise.resolve(false);
  return fetch("/api/free/claim",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({job:id})}).then(function(r){return r.json().then(function(j){return {r:r,j:j}})})
  .then(function(x){if(x.r.ok||x.r.status===403||x.r.status===409||x.r.status===400){try{localStorage.removeItem("r2w_free_job")}catch(e){}}
    if(!x.r.ok||!show_)return x.r.ok;
    if(x.j.state!=="done"){if(typeof goHist==="function")goHist();return true}
    return fetch("/api/job?id="+encodeURIComponent(id),{cache:"no-store"}).then(function(r){return r.json()}).then(function(q){if(q&&q.state==="done"&&q.result){markSeen(id);render(q)}return true})})
  .catch(function(){return false})}
/* v21: every analysis this device started is remembered (the server keeps the report in the account too), so «سجلّي» and the
   «تحليلك جاهز» banner work after the page was closed. */
var DJ="fc_jobs_v21",SEEN="fc_seen_v21";
function devJobs(){try{return JSON.parse(localStorage.getItem(DJ)||"[]")}catch(e){return []}}
function addDevJob(id){var a=devJobs().filter(function(x){return x.id!==id});a.unshift({id:id,t:Date.now()});a=a.slice(0,30);try{localStorage.setItem(DJ,JSON.stringify(a))}catch(e){}}
function seenSet(){try{return JSON.parse(localStorage.getItem(SEEN)||"[]")}catch(e){return []}}
function markSeen(id){if(!id)return;var s=seenSet();if(s.indexOf(id)<0){s.unshift(id);try{localStorage.setItem(SEEN,JSON.stringify(s.slice(0,60)))}catch(e){}}hideReady(id)}
var UPFINE="لا تغلق الصفحة حتى يكتمل الرفع.";
var WAITFINE="يستغرق التحليل عادةً من ٥ إلى ١٢ دقيقة حسب طول المباراة. بعد اكتمال الرفع يمكنك إغلاق الصفحة، وسيكون التقرير في «سجلّي».";
function dropJob(){try{localStorage.removeItem(JK)}catch(e){}}
// Opens a runner request: the first line carries the job id; the rest of the answer is left to run on its own.
async function openRunner(path,body){
  var r=await fetch(path,{method:"POST",headers:{"content-type":"application/json"},body:body?JSON.stringify(body):"{}"});
  if(!r.ok||!r.body||!r.body.getReader){var j=await r.json().catch(function(){return {}});return r.ok&&j.job?j.job:{error:true,message:j.message,code:j.code||"E-"+r.status}}
  var rd=r.body.getReader(),dec=new TextDecoder(),buf="";
  while(buf.indexOf("\n")<0){var x=await rd.read();if(x.done)break;buf+=dec.decode(x.value,{stream:true})}
  var first={};try{first=JSON.parse(buf.split("\n")[0])}catch(e){}
  (function drain(){rd.read().then(function(x){if(!x.done)drain()}).catch(function(){})})();
  if(!first.job)return {error:true,message:first.message,code:first.code||"E-JOB"};
  return first.job;
}
var watching=null;
function watchJob(id){
  if(watching===id)return;watching=id;st.starting=null;st.watchDone=false;st.watchAt=Date.now();
  show("processing");$("#p-title").textContent="نحلل مباراتك…";
  stepTxt("رفعنا الفيديو","نشاهد المباراة ونكتب الملاحظات…","نكتب التقرير");$("#s1n").textContent="";step(2);bar(Math.max(parseFloat($("#bar").style.width)||0,62));
  $("#p-fine").textContent=WAITFINE;$("#p-done").hidden=false;$("#processing").classList.add("up-done");pushOffer(id);
  var lastKick=0,deadSince=0,t0=Date.now(),busy=false;
  return new Promise(function(resolve){
    async function tick(){
      if(busy||watching!==id)return;busy=true;
      try{
        var q=await fetch("/api/job?id="+id,{cache:"no-store"}).then(function(x){return x.json()}).catch(function(){return null});
        if(q&&q.state==="done"&&q.result){end();bar(100);step(4);localStorage.setItem("fc_count",String(count()+1));markSeen(id);render(q);return}
        if(q&&(q.state==="error"||q.error==="no_job")){end();fail(q.message||"لم يكتمل التحليل هذه المرة، حاول مرة أخرى",q.code||"E-JOB");return}
        if(q&&q.state==="running"){
          var pc=q.parts?q.done/q.parts:0;
          if(q.phase==="write"){step(3);bar(92)}else{step(2);bar(Math.max(parseFloat($("#bar").style.width)||62,62+28*pc))}
          if(q.alive)deadSince=0;else if(!deadSince)deadSince=Date.now();
          if(!q.alive&&deadSince&&Date.now()-deadSince>40000&&Date.now()-lastKick>60000){lastKick=Date.now();openRunner("/api/job/run?id="+id).catch(function(){})}
        }
        if(Date.now()-t0>25*60000){end();goHist();return}   // still running on the server: it will be waiting in «سجلّي»
      }finally{busy=false}
    }
    var iv=setInterval(tick,5000),vis=function(){if(document.visibilityState==="visible")tick()};
    document.addEventListener("visibilitychange",vis);
    function end(){clearInterval(iv);document.removeEventListener("visibilitychange",vis);dropJob();watching=null;$("#p-done").hidden=true;$("#p-push").hidden=true;$("#processing").classList.remove("up-done");resolve()}
    setTimeout(tick,1500);
  });
}
// a job left running (screen locked, page closed) is picked up again when the page opens
// v21: reopening the site shows a banner instead (see readyCheck): «تحليلك جاهز» or the one still running
(function(){try{var j=JSON.parse(localStorage.getItem(JK)||"null");if(j&&j.id)addDevJob(j.id);if(j)dropJob()}catch(e){}})();

$("#go").addEventListener("click",async function(){
  if(st.ustep<3){$("#err").hidden=true;return goStep(st.ustep+1)}   // v53: credit is checked by the server after the upload (a report that exists opens free)
  if(st.src==="link")return runLink();
  if(st.src==="clips")return runClips();
  if(!st.file)return;
  var mode=st.mode;
  $("#p-title").textContent="نحلل مباراتك…";
  show("processing");step(1);bar(3);$("#s1n").textContent="";$("#p-fine").textContent=UPFINE;
  stepTxt("نأخذ لقطات من الفيديو","نقرأ اللعب لقطةً لقطة","نستخرج الأخطاء والحلول");
  if(mode==="match"&&st.live!==false){
    var how;try{how=await runVideo(st.file)}catch(e){return fail("انقطع رفع الفيديو. تأكد من الإنترنت وحاول مرة أخرى.","E-CONN")}
    if(how!=="frames")return;
    stepTxt("نأخذ لقطات من الفيديو","نقرأ اللعب لقطةً لقطة","نستخرج الأخطاء والحلول");step(1);bar(3);
  }
  var ex;
  try{ex=await extract(st.file,mode,function(i,n){$("#s1n").textContent="("+AR(i)+"/"+AR(n)+")";bar(3+37*i/n)})}
  catch(e){return fail("لم نتمكن من قراءة الفيديو. جرّب ملف MP4 من البلايستيشن أو سجّله من جديد.")}
  if(ex.frames.length<3)return fail("لم نتمكن من أخذ لقطات كافية من الفيديو. جرّب ملفًا آخر (MP4).");
  // v33: the frames go to the analysis only; none is kept on the page for display
  step(2);bar(45);
  // v21: the pictures go to a job on our server, so the analysis finishes even if the page is closed after sending
  var jb;try{jb=await openRunner("/api/job/start",{mode:mode,frames:ex.frames,times:ex.times,duration:ex.duration,team:$("#team").value.trim(),tactics:st.tactics})}catch(e){jb={error:true,code:"E-CONN"}}
  if(jb&&!jb.error){saveJob(jb);st.jobFile=jb;return watchJob(jb)}   // v33: the clip is no longer kept on this device (the report shows no video)
  if(jb.code!=="E-KEY"&&jb.code!=="E-503")return fail(jb.message||"انقطع الاتصال. تأكد من الإنترنت وحاول مرة أخرى.",jb.code||"E-JOB");
  var p=45,tick=setInterval(function(){p=Math.min(95,p+(95-p)*0.04);bar(p);if(p>70)step(3)},700);
  var ctl=window.AbortController?new AbortController():null,to=setTimeout(function(){ctl&&ctl.abort()},240000);
  try{
    var r=await fetch("/api/analyze",{method:"POST",headers:{"content-type":"application/json"},signal:ctl&&ctl.signal,
      body:JSON.stringify({mode:mode,frames:ex.frames,times:ex.times,duration:ex.duration,team:$("#team").value.trim(),tactics:st.tactics})});
    var j=await r.json().catch(function(){return {}});
    clearInterval(tick);clearTimeout(to);
    if(!r.ok||!j.result)return fail(j.message||"حدث خلل، حاول مرة أخرى.",j.code||(j.error?String(j.error):"E-"+r.status));
    bar(100);step(4);
    localStorage.setItem("fc_count",String(count()+1));
    render(j);
  }catch(e){clearInterval(tick);clearTimeout(to);fail("انقطع الاتصال أو استغرق التحليل وقتًا طويلًا. تأكد من الإنترنت وحاول مرة أخرى.",e&&e.name==="AbortError"?"E-TIMEOUT":"E-CONN")}
});
// v49: a free analysis before sign-up shows the rating and the top 3 points; the rest opens with an account
function paintLock(j){var lk=!!j.locked,b=$("#r-lock");if(b)b.hidden=!lk;
  var tg=$("#r-dtl-tg");if(tg)tg.hidden=lk;
  if(lk){["#r-dtl","#r-nd","#chat","#fb","#share","#r-shape","#conf"].forEach(function(s){var e=$(s);if(e)e.hidden=true});
    st.lockJob=j.job||freeJob();if(st.lockJob){try{if(!freeJob())localStorage.setItem("r2w_free_job",st.lockJob)}catch(e){}}ev("free_view")}}
$("#r-unlock").addEventListener("click",function(){ev("unlock_open");var id=st.lockJob||freeJob();if(id){try{localStorage.setItem("r2w_free_job",id)}catch(e){}}
  if(ACC.user){claimFree(true);return}
  st.afterAuth=function(){claimFree(true)};openAuth(hadAcct()?"login":"signup","سجّل ببريدك وافتح تقريرك الكامل، بدون أي دفع.")});
function fail(m,code){st.starting=null;st.watchDone=true;
  // v49: no account and the free analysis is not available (used on this device / this network today): ask for the sign-up
  if(code==="E-AUTH"&&!ACC.token){try{localStorage.setItem("r2w_free_used","1")}catch(e){}paintFree();openAuth(hadAcct()?"login":"signup",m);return}
  if(code==="E-AUTH"){ACC.user=null;paintAcct();openAuth("login",m);return}if(code==="E-FAIR"){var fm=effMode();refreshMe();openFair(fm,m);return}if(code==="E-PAY"||code==="E-PAYG"){refreshMe();openPricing(m);return}goStep(3,cur()==="processing"?"replace":false);var el=$("#err");el.textContent=m;if(code){var c=document.createElement("small");c.className="errcode";c.dir="ltr";c.textContent=code;el.appendChild(document.createElement("br"));el.appendChild(c)}el.hidden=false}

// v30: formations and scores (4-3-1-2, 5-4) keep their left-to-right order inside Arabic text. Arabic-Indic digits around a
// hyphen still flip inside an LTR box (the hyphen takes the digits' direction), so each hyphen gets a left-to-right mark on both sides.
var LTR_RE=/([0-9\u0660-\u0669]+(?:\s*[-–]\s*[0-9\u0660-\u0669]+)+)/;
function ltrText(node,s){s=String(s==null?"":s);node.textContent="";s.split(LTR_RE).forEach(function(part,i){if(!part)return;if(i%2){var b=document.createElement("bdi");b.dir="ltr";b.className="ltr";b.textContent=part.replace(/([-–])/g,"\u200E$1\u200E");node.appendChild(b)}else node.appendChild(document.createTextNode(part))});return node}
/* v43: «تشكيلتك في المقطع ← الخطة المقترحة»: two small pitches drawn from the formation numbers the coach read and chose */
function fmNums(s){s=String(s||"").replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)});var m=s.match(/\d(?:\s*[-–]\s*\d){2,4}/);if(!m)return null;var a=m[0].split(/\s*[-–]\s*/).map(Number);var t=a.reduce(function(x,y){return x+y},0);return t===10?a:null}
function shapeSvg(a){var W=120,H=150,o='<svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true"><rect x="2" y="2" width="'+(W-4)+'" height="'+(H-4)+'" rx="8" class="sh-p"/><line x1="2" y1="'+H/2+'" x2="'+(W-2)+'" y2="'+H/2+'" class="sh-l"/><circle cx="'+W/2+'" cy="'+H/2+'" r="14" class="sh-l"/><rect x="'+(W/2-22)+'" y="'+(H-24)+'" width="44" height="22" class="sh-l"/>';
  o+='<circle cx="'+W/2+'" cy="'+(H-12)+'" r="5" class="sh-g"/>';var n=a.length;a.forEach(function(k,i){var y=H-34-(i*(H-52)/Math.max(1,n-1));for(var j=0;j<k;j++){var x=W*(j+1)/(k+1);o+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="5.5" class="sh-d"/>'}});return o+'</svg>'}
function paintShape(r){var box=$("#r-shape");if(!box)return;var pr=r.play_read||{},t=r.pre_match||{},cur=fmNums(pr.current_formation),rec=fmNums(t.formation);box.hidden=!(cur||rec);if(box.hidden)return;
  function card(lbl,a,txt){return '<figure class="sh-c"><figcaption>'+lbl+'</figcaption>'+(a?shapeSvg(a):'<div class="sh-na">غير واضحة</div>')+'<b dir="ltr">'+(a?a.join("-"):"")+'</b></figure>'}
  var same=cur&&rec&&cur.join("-")===rec.join("-");
  box.innerHTML='<h3>📐 '+(same?"تشكيلتك تناسب لعبك — نعدّل الأدوار":"من تشكيلتك إلى خطتك")+'</h3><div class="sh-row">'+card("تشكيلتك في المقطع",cur)+'<span class="sh-ar" aria-hidden="true">←</span>'+card("المقترحة لك",rec)+'</div>'}
function list(sel,arr){var el=$(sel);el.innerHTML="";(arr||[]).forEach(function(x){var li=document.createElement("li");ltrText(li,x);el.appendChild(li)})}
function dlist(sel,pairs){var dl=$(sel);dl.innerHTML="";pairs.forEach(function(p){if(!p[1])return;
  var dt=document.createElement("dt");dt.textContent=p[0]||"";var dd=document.createElement("dd");ltrText(dd,p[1]);dl.appendChild(dt);dl.appendChild(dd)})}
/* v26: wrong football words in older reports are fixed on the page too (the server fixes new ones) */
var TERM_FIX=[
  /* v39: L1/LB is never shown as the way to switch player (pros switch with the right stick) */
  [/(العصا اليمنى(?:\s*\(القير اليمين\))?)\s*(?:أو|او|\/|،)\s*(?:بـ\s*|ب)?(?:زر\s*|الزر\s*)?(?:[(\[]\s*)?(?:L1|LB)(?:\s*[\/(،,]\s*(?:L1|LB)\s*\)?)?(?:\s*[)\]])?/g,"$1"],
  [/(?:بـ\s*|ب)?(?:زر\s*|الزر\s*)?(?:[(\[]\s*)?(?:L1|LB)(?:\s*[\/(،,]\s*(?:L1|LB)\s*\)?)?(?:\s*[)\]])?\s*(?:أو|او|\/)\s*(?=(?:بـ?\s*)?ال?عصا اليمنى|بالعصا اليمنى)/g,""],
  [/((?:ال)?تبديل[^.،؛\n]{0,30}?)(?:بزر|بالزر|باستخدام زر|باستخدام|بـ\s*|ب)\s*(?:[(\[]\s*)?(?:L1|LB)(?:\s*[\/(،,]\s*(?:L1|LB)\s*\)?)?(?:\s*[)\]])?/g,"$1بالعصا اليمنى"],
  [/(?:اضغط(?:\s+على)?|استخدم)\s*(?:زر\s*)?(?:[(\[]\s*)?(?:L1|LB)(?:\s*[\/(،,]\s*(?:L1|LB)\s*\)?)?(?:\s*[)\]])?(?=\s*(?:لل|ل)?تبديل)/g,"حرّك العصا اليمنى"],
  [/تسر[\u064B-\u0652]*ي[\u064B-\u0652]*ح/g,"تمرير"],[/عرضان[\u064B-\u0652]*ي/g,"عرضي"],[/(هجم(?:ة|ات|ه)\s+)(ال)?مضاد/g,"$1$2مرتد"],
  [/ال[\u064B-\u0652]*ذ[\u064B-\u0652]*كاء\s+ال[\u064B-\u0652]*اصطناعي/g,"الكمبيوتر"],[/ذكاء\s+اصطناعي/g,"الكمبيوتر"],[/(مهاجم(?:و|ي)?|مدافع(?:و|ي)?|لاعب(?:و|ي)?|حارس|جناح|ظهير|وسط|هجوم|دفاع|ضغط|هجمات|هجمة|فريق|تمريرات|تسديدات|مرمى)\s+(?:ال)?كمبيوتر/g,"$1 الخصم"],[/(ال|بال|ب)?عتلة اليمنى(?:\s*\(\s*(?:ال)?عصا اليمنى\s*\))?/g,"$1عصا اليمنى"],[/العصا اليمنى(?!\s*\(القير)/g,"العصا اليمنى (القير اليمين)"]];
function fixTerms(s){s=String(s);TERM_FIX.forEach(function(p){s=s.replace(p[0],p[1])});return s}
function deepFix(o){if(typeof o==="string")return fixTerms(o);if(Array.isArray(o))return o.map(deepFix);if(o&&typeof o==="object"){Object.keys(o).forEach(function(k){o[k]=deepFix(o[k])});return o}return o}
function oppFix(r){if(!r||typeof r!=="object")return r;var cpu=r.match_mode==="squad_battles"||r.match_mode==="vs_cpu";if(cpu)return r;
  var keep={drills:1,practice:1,next_drill:1,match_mode:1,yt:1};
  function w(o){if(typeof o==="string")return o.replace(/(^|[^\u0621-\u064A])(?:ال)?كمبيوتر/g,"$1الخصم");if(Array.isArray(o))return o.map(w);if(o&&typeof o==="object"){Object.keys(o).forEach(function(k){if(!keep[k])o[k]=w(o[k])});return o}return o}
  return w(r)}
function render(j){
  if(!j._hist&&!j._sample){st.starting=null;st.watchDone=true}
  if(j.result)j.result=oppFix(deepFix(j.result));
  var r=j.result||{},goal=j.mode!=="match";
  st.last=j;
  $("#demo").hidden=!j.demo;
  /* v38: goal-clip analysis removed — an old saved report of that kind shows a short notice instead */
  var okr=!!r.valid_clip&&!goal;
  $("#r-match").hidden=!okr;
  $("#invalid").hidden=okr;
  if(goal)$("#invalid").textContent="هذا التقرير من نوع لم يعد متاحًا. التحليل الآن للمباريات الكاملة فقط.";
  else if(!r.valid_clip)$("#invalid").textContent="🤔 "+(r.invalid_reason||"لا يظهر في المقطع لعب واضح من FC. جرّب مقطعًا بكاميرا اللعب العادية.")+(r.refunded||j.refunded?" لم يُحسب هذا التحليل من رصيدك.":"");
  $("#share").hidden=goal;
  if(goal){$("#chat").hidden=true;$("#fb").hidden=true;$("#note").textContent="";$("#conf").hidden=true;$("#sample-b").hidden=true;var jr0=$("#r-jr");if(jr0)jr0.hidden=true;show("result");return}
  if(r.valid_clip){
    list("#m-style",bullets(r.style,2,15));$("#m-style-sec").hidden=!r.style;
    $("#m-score").hidden=!r.score;ltrText($("#m-score"),r.score?"النتيجة: "+r.score:"");
    setupClips(j);try{goalsList(r)}catch(e){}
    list("#m-mis",(r.recurring_mistakes||[]).map(function(x){return wcut(x,18)}));$("#m-mis-sec").hidden=!(r.recurring_mistakes||[]).length;
    list("#m-ig",(r.in_game||[]).map(function(x){return wcut(x,18)}));$("#m-ig-sec").hidden=!(r.in_game||[]).length;list("#m-pr",(r.practice||[]).slice(0,3).map(function(x){return wcut(x,15)}));
    var t=r.pre_match||r.tactic||{};
    dlist("#m-tac",[["التشكيلة",t.formation],["أسلوب الدفاع",t.defensive_style],["العرض والعمق",t.width_depth||t.depth],["البناء والهجوم",t.build_up],["ملاحظة",t.notes]].map(function(p){return [p[0],p[1]&&wcut(p[1],14)]}));
    paintShape(r);
    /* v43: how the coach read THIS player's play, and why the plan fits it (reports before v43 have neither, and the blocks stay hidden) */
    var pr=r.play_read||{};dlist("#m-read",[["تشكيلتك في المقطع",pr.current_formation],["البناء",pr.build_up],["الهجوم",pr.attack],["الضغط",pr.press],["التقدّم للأمام",pr.forward],["تفقد الكرة",pr.loses_ball],["الخطورة عليك",pr.danger]].map(function(p){return [p[0],p[1]&&wcut(p[1],18)]}));
    $("#m-read-sec").hidden=!(pr.current_formation||pr.build_up||pr.attack||pr.press||pr.forward||pr.loses_ball||pr.danger);
    list("#m-why",(Array.isArray(t.why)?t.why:[]).slice(0,3).map(function(x){return wcut(x,20)}));$("#m-why-sec").hidden=!(Array.isArray(t.why)&&t.why.length);
    $("#m-tac-ex").hidden=!j._sample;
    var gp=r.game_plans||{};dlist("#m-gp",[["عند التأخر",gp.behind],["عند التقدم",gp.ahead],["متى تنتقل",gp.when]].map(function(p){return [p[0],p[1]&&wcut(p[1],20)]}));$("#m-gp-sec").hidden=!(gp.behind||gp.ahead||gp.when);
    var pis=(r.player_instructions||[]);dlist("#m-pi",pis.map(function(p){return typeof p==="string"?["",wcut(p,18)]:[p.pos,wcut(p.ins||"",18)]}));$("#m-pi-sec").hidden=!pis.length;
  }
  resetExtras(j);
  $("#note").textContent=(r.same_video?"✓ هذا الفيديو حللناه من قبل، فهذا نفس تقريره ونفس تقييمه، ولم يُحتسب عليك تحليل جديد. ":"")+"ملاحظة: "+(r.note||(j.video?"التحليل مبني على فيديو المباراة، ولا نرى أزرارك أو تكتيكك.":"التحليل مبني على اللقطات فقط، ولا نرى أزرارك أو تكتيكك."));
  $("#conf").hidden=!r.confidence||j.demo;$("#conf").textContent="درجة الثقة بالتحليل: "+(r.confidence||"");
  $("#sample-b").hidden=!j._sample;$("#chat").hidden=!!j._sample||!!j.demo||!j.job||!r.valid_clip;$("#fb").hidden=!!j._sample;if(j._sample)$("#demo").hidden=true;chatSync(j);
  enhance(j);paintLock(j);
  if(!j.demo&&!j._sample&&!j._hist&&r.valid_clip)saveHist(j);
  show("result");
  maybeRadar(j);
}
// v33: the stop point as a drawn card (pitch + stop icon + the report's own label); no frame of the clip is shown
function drawKey(j){
  var r=j.result||{},fig=$("#km");if(!fig)return;fig.innerHTML="";
  var a=moArt("stop",null,null);a.classList.add("km-art","bad");var lab=String(r.focus_label||"").trim();if(lab)a.appendChild(el("span","km-lab",lab));fig.appendChild(a);
  var ks=r.stop&&r.stop.t!=null&&r.stop.t!==""&&isFinite(+r.stop.t)?" (ث "+AR(Math.round(+r.stop.t))+")":"";
  var cap=el("figcaption",null,j.demo?"مثال: هنا كان يجب إيقافها":"هنا كان يجب إيقافها"+ks);cap.id="kmcap";fig.appendChild(cap);
  fig.hidden=false;
}
function roundRect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}

$("#again").addEventListener("click",function(){st.file=null;$("#video").value="";$("#drop").classList.remove("has");var di0=$("#drop .drop-ic");if(di0)di0.textContent="⬆️";
  $("#drop-t").textContent="اختر الفيديو";$("#drop-s").textContent="من الصور أو الملفات";$("#go").disabled=true;start(st.mode)});
$("#share").addEventListener("click",function(){
  var j=st.last;if(!j)return;var r=j.result,t;
  var goal=j.mode!=="match",S=summaryOf(r||{},goal),pts=S.top3.map(function(x){return (x.type==="strength"?"🟢 ":x.type==="fix"?"💡 ":"🔴 ")+x.text}).join("\n");
  if(!goal){var rv=st.r2w!=null?st.r2w:(isFinite(+r.r2w)&&+r.r2w>0?Math.round(+r.r2w):null);
    t="تحليل مباراتي من "+CONFIG.brand+" ⚽"+(r.score?"\nالنتيجة: "+r.score:"")+(rv!=null?"\nتقييم RP: "+AR(rv):"")+"\n\nأهم ٣ نقاط:\n"+pts+(S.drill?"\n\nتمريني للمباراة القادمة: "+[S.drill.name,S.drill.how].filter(Boolean).join(": "):"")}
  else t=CONFIG.brand+" ⚽\n"+wcut(r.summary||"",18)+"\n\nأهم ٣ نقاط:\n"+pts+(S.drill?"\n\nتمريني: "+[S.drill.name,S.drill.how].filter(Boolean).join(": "):"");
  t+="\n\n"+location.origin;
  if(navigator.share)navigator.share({title:CONFIG.brand,text:t}).catch(function(){});
  else if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){$("#share").textContent="✓ نُسخ"});
});

/* feedback + follow-up chat */
var chatH=[];
function resetExtras(j){
  $$(".fbb").forEach(function(b){b.classList.remove("on");b.disabled=false});$("#fb-more").hidden=true;$("#fb-ok").hidden=true;$("#fb-c").value="";st.vote=null;
  chatH=[];$("#msgs").innerHTML="";$("#q").value="";leftTxt();
  var secs=$$("#result .sumcard, #result .dtl-tg, #result .g-up, #result .fb, #result .chat, #result .row");
  secs.forEach(function(el,i){el.classList.remove("rise");void el.offsetWidth;el.style.animationDelay=(i*70)+"ms";el.classList.add("rise")});
}
function sendFb(){var j=st.last||{};fetch("/api/feedback",{method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify({vote:st.vote,mode:j.mode,demo:!!j.demo,comment:$("#fb-c").value.trim()})}).catch(function(){})}
$$(".fbb").forEach(function(b){b.addEventListener("click",function(){
  st.vote=b.getAttribute("data-v");$$(".fbb").forEach(function(x){x.classList.toggle("on",x===b)});
  sendFb();$("#fb-more").hidden=false;$("#fb-ok").hidden=false;})});
$("#fb-send").addEventListener("click",function(){if(!st.vote)return;sendFb();$("#fb-more").hidden=true;$("#fb-ok").textContent="وصلنا رأيك، شكرًا 🙏";});
function userQs(){return chatH.filter(function(m){return m.role==="user"}).length}
// v30: the 8 questions per report are counted on the server; the page shows the server's count when it has it
function qLeft(){return st.chatLeft!=null?st.chatLeft:8-userQs()}
function qWord(n){return n===1?"سؤال واحد":n===2?"سؤالان":(n>=3&&n<=10)?AR(n)+" أسئلة":AR(n)+" سؤالًا"}
function leftTxt(){var n=qLeft();$("#chat-left").textContent=!ACC.token&&!ACC.owner?"سجّل دخولك لتسأل المدرّب عن تقريرك (٨ أسئلة لكل تقرير).":n>0?"بقي لك "+qWord(n)+" على هذا التقرير":(ACC.owner&&!ACC.user?"انتهت أسئلة هذا التقرير (وضع المالك: تقدر تكمل)":"انتهت أسئلة هذا التقرير");$("#ask-b").disabled=!!ACC.token&&!ACC.owner&&n<=0}
function chatSync(j){st.chatLeft=null;if(!j||!j.job||(!ACC.token&&!ACC.owner))return leftTxt();var id=j.job;
  fetch("/api/chat/left?job="+id,{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(d){if(d&&st.last&&st.last.job===id&&d.left!=null){st.chatLeft=d.left;leftTxt()}}).catch(function(){})}
function bubble(role,text){var d=document.createElement("div");d.className="msg "+role;d.textContent=text;$("#msgs").appendChild(d);d.scrollIntoView({behavior:"smooth",block:"nearest"});return d}
function ask(q){
  q=(q||"").trim();var j=st.last;if(!q||!j||st.asking)return;
  if(!ACC.token&&!ACC.owner){var back=j;st.afterAuth=function(){var o=JSON.parse(JSON.stringify(back));o._hist=true;render(o);setTimeout(function(){$("#q").value=q},60)};openAuth("login","سجّل دخولك لتسأل المدرّب عن تقريرك.");return}
  if(qLeft()<=0&&!ACC.owner)return;
  st.asking=true;if(st.chatLeft!=null)st.chatLeft=Math.max(0,st.chatLeft-1);   // v47: the counter goes down the moment the question is sent
  var lb=st.chatLeft;bubble("user",q);var typing=bubble("coach typing","…");$("#q").value="";
  var hist=chatH.slice();chatH.push({role:"user",text:q});leftTxt();
  var got="",fin=false;
  function put(t){typing.classList.remove("typing");typing.textContent=t}
  function ok(t){if(fin)return;fin=true;put(t);chatH.push({role:"coach",text:t});leftTxt()}
  function bad(t){if(fin)return;fin=true;if(got){ok(fixTerms(got));return}put(t);chatH.pop();if(st.chatLeft!=null&&st.chatLeft===lb)st.chatLeft=Math.min(8,st.chatLeft+1);leftTxt()}
  // v26: the answer arrives word by word (event stream); an older server's single JSON answer still works
  fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json","accept":"text/event-stream"},body:JSON.stringify({question:q,history:hist,job:j.job,mode:j.mode,stream:true})})
  .then(function(r){
    var ct=r.headers.get("content-type")||"";
    if(ct.indexOf("text/event-stream")<0||!r.body||!r.body.getReader)return r.json().catch(function(){return {}}).then(function(d){if(d.left!=null)st.chatLeft=d.left;
      if(d.answer)ok(d.answer);else{if(d.code==="E-AUTH"){setToken(null);ACC.user=null;paintAcct()}bad(d.message||"لم أتمكن من الرد الآن، حاول مرة أخرى.")}});
    var rd=r.body.getReader(),dec=new TextDecoder(),buf="";
    function line(l){if(l.indexOf("data:")!==0)return;var d;try{d=JSON.parse(l.slice(5).trim())}catch(e){return}
      if(d.t){got+=d.t;put(fixTerms(got));if(!line.sc){line.sc=1;typing.scrollIntoView({behavior:"smooth",block:"nearest"})}}
      else if(d.done){if(d.left!=null)st.chatLeft=d.left;ok(d.answer||fixTerms(got))}
      else if(d.error)bad(d.message||"لم أتمكن من الرد الآن، حاول مرة أخرى.")}
    function pump(){return rd.read().then(function(x){if(x.value){buf+=dec.decode(x.value,{stream:true});var i;while((i=buf.indexOf("\n"))>=0){var l=buf.slice(0,i).trim();buf=buf.slice(i+1);if(l)line(l)}}
      if(x.done){if(buf.trim())line(buf.trim());if(!fin)bad("انقطع الاتصال، حاول مرة أخرى.");return}return pump()})}
    return pump();
  }).catch(function(){bad("انقطع الاتصال، حاول مرة أخرى.")})
  .then(function(){st.asking=false});
}
$("#ask").addEventListener("submit",function(e){e.preventDefault();ask($("#q").value)});
$$(".chips button").forEach(function(b){b.addEventListener("click",function(){ask(b.textContent)})});


/* ===== report extras (grade, assignment, ratings, strengths, drills) ===== */
var SAMPLE={"demo": false, "mode": "match", "video": true, "_sample": true, "_reel": [7, 21, 35, 49, 63], "result": {"valid_clip": true, "style": "تعتمد على أسلوب هجومي سريع ومباشر في التحولات، مستغلًا دقة التمرير البيني والإنهاء الحاسم أمام المرمى. في المقابل، يغلب على أسلوبك الدفاعي الاندفاع الفردي باللاعبين لقطع الكرة مما يترك مساحات في عمق منطقتك.", "recurring_mistakes": ["الاندفاع بقلب الدفاع أو لاعب الارتكاز نحو حامل الكرة وترك مساحات شاغرة في عمق منطقة الجزاء.", "ضعف الرقابة على العرضيات والتغطية العكسية مما سمح للخصم بالتعادل في الدقائق الأخيرة.", "التسرع في التمرير بمنتصف الملعب تحت ضغط الخصم وارتكاب تدخلات خشنة نلت عليها بطاقات."], "pre_match": {"formation": "٤-٣-١-٢ أو ٤-١-٢-١-٢ ضيقة لتعزيز الكثافة في الوسط والاعتماد على ثنائية هجومية سريعة.", "defensive_style": "دفاع متوازن (Balanced) وتجنب الضغط المستمر حتى لا تتفكك خطوطك الخلفية.", "width_depth": "أنزل خط الدفاع قليلًا لتفادي الكرات البينية، وضيّق العرض لحماية عمق الملعب.", "build_up": "بناء لعب متوازن مع تمرير مباشر وسريع نحو ثنائي الهجوم لاستغلال المساحات.", "notes": "اضبط هذه الخيارات مسبقًا في خطتك الأساسية من قائمة التكتيكات لضمان ثبات الدفاع.", "why": ["لعبك من العمق بتمريرات بينية، فالتشكيلة الضيقة تضع لاعبين أكثر قرب حامل الكرة.", "تستقبل من عمق منطقتك بعد اندفاع المدافع، فارتكاز إضافي يغطي هذه المساحة.", "مرتداتك السريعة تحتاج مهاجمَين متقاربين بدل جناحين بعيدين."]}, "player_instructions": [{"pos": "قلبا الدفاع", "ins": "البقاء في الخلف أثناء الهجوم وعدم الخروج من الخط للحفاظ على عمق الدفاع وتفادي الانفرادات."}, {"pos": "الظهيران", "ins": "البقاء في الخلف أثناء الهجوم لمنع الاختراقات السريعة وتأمين العرضيات العكسية."}, {"pos": "الارتكاز", "ins": "تغطية المنتصف والبقاء في الخلف أثناء الهجوم لحماية المساحة أمام قلبي الدفاع."}, {"pos": "الوسط", "ins": "التوازن الدفاعي وتغطية الأطراف لمساعدة الظهيرين عند تقدم الخصم."}, {"pos": "المهاجم", "ins": "البقاء في العمق والاختراق خلف المدافعين لاستغلال سرعة وإنهاء مالين المميز."}], "in_game": ["دافع بوضعية الاحتواء (L2) بدل الاندفاع المباشر بطلب الكرة بالتدخل الخشن.", "استخدم ضغط الزميل (R1) فقط لتضييق زاوية التمرير، وتحكّم يدويًا بلاعب التغطية لإغلاق مسار التسديد.", "بدّل إلى لاعب الارتكاز وليس إلى قلبي الدفاع عندما يبني الخصم هجمته على حدود منطقة الجزاء.", "أنزل خطوط فريقك قليلًا عندما يتقدم الخصم بكثافة على الأطراف لمنع العرضيات الخطيرة."], "game_plans": {"behind": "اضبط خطة هجومية على سهم الهجوم: خط دفاع أعلى قليلًا، اندفاع أكثر للأمام، وضغط قوي بعد فقدان الكرة للتعويض السريع.", "ahead": "اضبط خطة دفاعية على سهم الدفاع: إنزال خط الدفاع، بقاء كامل الرباعي الخلفي ولاعب الارتكاز في الخلف لحماية النتيجة.", "when": "اضبطها قبل المباراة على الأسهم من قائمة التكتيكات؛ انتقل للدفاعية بعد الدقيقة ٧٥ عند تقدمك، واستخدم الهجومية فور التأخر."}, "practice": ["التدريب على الدفاع الفردي بـL2 وضبط المسافة مع المهاجم دون الضغط على زر التدخل سريعًا.", "التمرن على التغطية العكسية للكرات العرضية والتبديل السريع بالعصا اليمنى (القير اليمين) للمدافع البعيد.", "التمرير الهادئ والخروج الآمن بالكرة تحت الضغط في الثلث الأخير دون تسرع."], "grade": 7.5, "headline": "اضبط اندفاع دفاعك بالعمق، فالهجوم لديك رائع وحاسم.", "assignment": {"title": "الانضباط الدفاعي وعدم سحب قلبي الدفاع", "how": "في مباراتك القادمة، لا تتحكم أبدًا بقلب الدفاع لقطع الكرة خارج منطقة الجزاء. استخدم لاعب الوسط الدفاعي فقط لتعطيل الهجمة بالاحتواء L2 حتى يعود الفريق لمراكزه."}, "ratings": [{"area": "الدفاع", "score": 6.5, "note": "تلقيت أهدافًا سهلة بسبب الاندفاع الفردي وترك مساحات في التغطية العكسية."}, {"area": "الهجوم واستغلال الفرص", "score": 9, "note": "فعالية استثنائية أمام المرمى وإنهاء متقن لمعظم الفرص المتاحة عبر مالين."}, {"area": "التمرير وبناء اللعب", "score": 7.5, "note": "تمريرات بينية حاسمة في الهجوم، ولكن حدث تسرع وفقدان غير مبرر في الوسط أحيانًا."}, {"area": "التمركز وشكل الفريق", "score": 6.5, "note": "فراغات واضحة بين خط الوسط والدفاع استغلها الخصم في صناعة الخطورة."}, {"area": "القرارات تحت الضغط", "score": 7, "note": "ردة فعل ذهنية قوية في الأشواط الإضافية، رغم بعض التراخي واستقبال أهداف متأخرة."}], "strengths": ["حسم هجومي مذهل وترجمة شبه تامة للفرص داخل منطقة الجزاء.", "سرعة استعادة التوازن والرد الفوري بتسجيل الأهداف بعد تلقي الشباك لأي هدف.", "رؤية ممتازة في الثلث الهجومي الأخير عبر التمرير البيني الأرضي الدقيق."], "drills": [{"name": "تحدي الدفاع الفردي (Jockey)", "minutes": 15, "how": "في وضع التدريب، واجه المهاجم باستخدام زر L2 فقط دون الضغط على زر التدخل O. حافظ على مسافة مترين لمنع المراوغة وغلق زاوية التسديد.", "fixes": "يعالج الاندفاع العشوائي لقلبي الدفاع الذي تسبب في استقبال أول هدفين."}, {"name": "الدفاع ضد العرضيات والكرات الساقطة", "minutes": 10, "how": "العب مباراة ودية ضد الكمبيوتر مع التركيز على التبديل بالعصا اليمنى (القير اليمين) للمدافع في القائم البعيد. قم بتشتيت العرضيات دون سحب الحارس مبكرًا.", "fixes": "يصلح خطأ استقبال هدف التعادل الثالث في الدقيقة ٨٢ الناتج عن غياب التغطية العكسية."}, {"name": "الخروج بالكرة تحت الضغط", "minutes": 10, "how": "تمرن في سيناريو تدريبي على تدوير الكرة بين رباعي الدفاع ومحور الارتكاز بلمستين كحد أقصى. مرر دائمًا للاعب الخالي من الرقابة دون استعجال الهجوم المباشر.", "fixes": "يعالج فقدان الكرة في خط الوسط ونيل البطاقات الصفراء بسبب الاحتكاكات المتسرعة."}], "score": "KMI ٥ - ٤ BOC (بعد أشواط إضافية)", "key_moments": [{"t": "04:28", "kind": "bad", "what": "اندفاع متهور في العمق الدفاعي سمح لمهاجم الخصم بالمراوغة وإحراز هدف التعادل.", "lesson": "تمهل في التدخل واستعمل وضعية الاحتواء الدفاعي L2 لتأخير المهاجم."}, {"t": "05:00", "kind": "good", "what": "رد هجومي سريع ومباشر بانفراد لمالين أنهاه بتسديدة متقنة في الشباك.", "lesson": "استمرار التركيز المباشر بعد تلقي الأهداف يصدم الخصم ويعيدك للمقدمة."}, {"t": "12:24", "kind": "bad", "what": "استقبال هدف التعادل الثالث في اللحظات الأخيرة من كرة عرضية دون رقابة عكسية.", "lesson": "تغطية القائم البعيد وتشتيت العرضيات بتركيز يمنعان عودة الخصم في الأوقات القاتلة."}, {"t": "15:19", "kind": "good", "what": "تمريرة بينية رائعة يترجمها مالين لهدف التقدم الرابع في مستهل الشوط الإضافي.", "lesson": "التمرير الأرضي السريع في عمق دفاع الخصم يضمن الفعالية وصناعة الفرص المحققة."}, {"t": "19:53", "kind": "bad", "what": "استقبال هدف متأخر قلص الفارق نتيجة التراخي الدفاعي في الدقيقة الأخيرة.", "lesson": "اليقظة الدفاعية واجبة حتى إطلاق صافرة النهاية لتجنب أي مفاجآت."}], "play_read": {"current_formation": "4-4-2", "build_up": "تمرير مباشر وسريع نحو المهاجمين بعد استعادة الكرة، وتمريرات بينية كثيرة.", "attack": "يهاجم من العمق غالبًا بتمريرة بينية، وعرضياته قليلة.", "press": "يندفع فرديًا بقلب الدفاع أو الارتكاز لقطع الكرة.", "forward": "يتقدم بأربعة لاعبين في المرتدة، ولعبه سريع جدًا.", "loses_ball": "في منتصف الملعب عند التسرع بالتمرير تحت الضغط.", "danger": "من عمق المنطقة بعد اندفاع المدافع، ومن العرضيات المتأخرة."}}};
function ARd(x){return AR(String(x).replace(".","٫"))}
function word(g){return g>=8.5?"ممتاز":g>=7?"جيد جدًا":g>=5.5?"جيد":g>=4?"مقبول":"يحتاج عملًا"}
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function enhance(j){
  var r=j.result||{};if(j.mode!=="match")return;
  var g=+r.grade;var has=isFinite(g)&&g>0;
  st.r2w=null;paintRing(j);
  var sc=!!r.score;$("#r-headline").hidden=sc;if(sc){var ms=$("#m-score");ms.innerHTML="";var sm=String(r.score).match(/^([^\u0600-\u06FF(]*)([\s\S]*)$/);var bd=document.createElement("bdi");bd.dir="ltr";bd.textContent=sm[1].trim();ms.appendChild(bd);if(sm[2].trim())ms.appendChild(document.createTextNode(" "+sm[2].trim()))}$("#r-headline").textContent=wcut(r.headline||"تحليل مباراتك",10);
  var d=j._ts?new Date(j._ts):new Date();try{$("#r-date").textContent=d.toLocaleDateString("ar-SA-u-ca-gregory",{day:"numeric",month:"long"})}catch(e){$("#r-date").textContent=""}
  var S=summaryOf(r,false);paintTop3("#r-top3",S.top3,false);paintDrill("r-nd",S.drill);
  var as=r.assignment||{};$("#r-assign").hidden=!as.title;$("#r-as-t").textContent=wcut(as.title||"",8);$("#r-as-h").textContent=wcut(as.how||"",22);
  var rt=$("#r-rat");rt.innerHTML="";(r.ratings||[]).forEach(function(x){var s=Math.max(0,Math.min(10,+x.score||0));
    var row=el("div","rat"+(s<5?" lo":""));var top=el("div","rt");top.appendChild(el("b",null,x.area||""));top.appendChild(el("span",null,ARd(Math.round(s*10)/10)+"/١٠"));
    var bar=el("div","rb");var f=el("i");f.style.width=(s*10)+"%";bar.appendChild(f);row.appendChild(top);row.appendChild(bar);if(x.note)row.appendChild(el("small",null,wcut(x.note,14)));rt.appendChild(row)});
  $("#r-rat-sec").hidden=!(r.ratings||[]).length;
  var su=$("#r-str");su.innerHTML="";(r.strengths||[]).forEach(function(x){su.appendChild(el("li",null,wcut(x,15)))});$("#r-str-sec").hidden=!(r.strengths||[]).length;
  var drs=(r.drills||[]).filter(function(x,i){return !(S.drill&&S.drill.from===i)});
  var dr=$("#r-dr");dr.innerHTML="";drs.forEach(function(x){var c=el("div","drill");var h=el("div","dh");h.appendChild(el("b",null,wcut(x.name||"",6)));
    if(x.minutes)h.appendChild(el("span","min",arCount(x.minutes,"دقيقة واحدة","دقيقتان","دقائق","دقيقة")));c.appendChild(h);if(x.how)c.appendChild(el("p",null,wcut(x.how,28)));if(x.moment){var mo=String(x.moment).replace(/^\s*(?:من مباراتك|اللحظة)\s*[:：\-–]\s*/,"");var dm=el("small","dm","من مباراتك: ");timeLinks(dm,wcut(mo,14));c.appendChild(dm)}
    if(x.fixes)c.appendChild(el("small",null,"يعالج: "+wcut(unLabel(x.fixes),12)));dr.appendChild(c)});
  var hasDr=!!drs.length;$("#r-dr-sec").hidden=!hasDr;$("#m-pr-sec").hidden=hasDr||!(r.practice||[]).length;
  // v35: the tab leads with things to apply in the next normal match; practice-mode drills sit behind «أبي تمارين إضافية»
  var nm=nmTasks(r),nl=$("#r-nm");nl.innerHTML="";nm.forEach(function(x){var li=el("li","nm");
    if(x.when)li.appendChild(el("small","nw",wcut(x.when,12)));li.appendChild(el("b",null,wcut(x.do,16)));
    if(x.moment){var dm=el("small","dm","من مباراتك: ");timeLinks(dm,wcut(String(x.moment).replace(/^\s*(?:من مباراتك|اللحظة)\s*[:：\-–]\s*/,""),14));li.appendChild(dm)}nl.appendChild(li)});
  $("#r-nm-sec").hidden=!nm.length;
  var hasX=hasDr||!!(r.practice||[]).length,xb=$("#r-xbtn"),xo=hasX&&!nm.length&&!as.title;$("#r-xtra").hidden=!hasX;
  $("#r-xbody").hidden=!xo;xb.setAttribute("aria-expanded",xo?"true":"false");xb.hidden=xo;
  $$("#m-km li").forEach(function(li,i){var m=(r.key_moments||[])[i]||{};li.classList.remove("good","bad");if(m.kind==="good"||m.kind==="bad")li.classList.add(m.kind)});
  var t=r.pre_match||r.tactic||{},gp=r.game_plans||{};
  paneOn("r-dtl","km",(r.key_moments||[]).length);
  paneOn("r-dtl","style",r.style||(r.recurring_mistakes||[]).length||(r.strengths||[]).length);paneOn("r-dtl","rat",(r.ratings||[]).length);
  paneOn("r-dtl","tac",(r.play_read&&r.play_read.build_up)||t.formation||t.defensive_style||t.width_depth||t.build_up||t.notes||gp.behind||gp.ahead);
  paneOn("r-dtl","pi",(r.player_instructions||[]).length||(r.in_game||[]).length);
  paneOn("r-dtl","dr",hasX||nm.length||as.title);paneOn("r-dtl","jr",!$("#r-jr").hidden);
  dtlReset("r-dtl");
}
/* ===== v27: the short summary card + the detail cards (tabs you can swipe) ===== */
var WEAK=/^(?:و|أو|ثم|في|من|إلى|على|عن|مع|عند|بعد|قبل|لأن|حتى|التي|الذي|الذين|لكن|بل|أن|إن|ما|لا|كي|لكي|بين|خلف|أمام|ب|ل|ك)$/;
// at most n words, cut at a word boundary (at a clause end when one is close)
function wcut(s,n){s=String(s==null?"":s).replace(/\s+/g," ").trim();if(!s)return s;var w=s.split(" ");if(w.length<=n)return s;var c=n;
  for(var i=n;i>=Math.ceil(n*.6);i--){if(/[.،؛!؟:]$/.test(w[i-1])){c=i;break}}
  var o=w.slice(0,c);while(o.length>1&&WEAK.test(o[o.length-1].replace(/[.،؛!؟:,]+$/,"")))o.pop();
  var t=o.join(" ").replace(/[،؛:,\-–\s]+$/,"");if(!/[.!؟…]$/.test(t))t+="…";return t}
// a paragraph as a few short bullets
function bullets(s,max,n){s=String(s||"").replace(/\s+/g," ").trim();if(!s)return [];var p=s.replace(/([.!؟؛])\s+/g,"$1\n").split(/\n+/).map(function(x){return x.replace(/^[•\-–\s]+/,"").trim()}).filter(Boolean);
  return p.slice(0,max||3).map(function(x){return wcut(x,n||15)})}
function toLat(s){return String(s||"").replace(/[٠-٩]/g,function(d){return "٠١٢٣٤٥٦٧٨٩".indexOf(d)})}
function firstT(s){var m=toLat(s).match(/(\d{1,3}):([0-5]\d)/);return m?m[0]:""}
// the time is on its own button, so the words drop every «عند ١٢:٤٠» in them
function stripT(s){return String(s||"").replace(/(^|\s)و?(?:عند|في|بعد|قبل)?\s*(?:الدقيقة\s*)?[(\[]?\s*[0-9٠-٩]{1,3}:[0-5٠-٥][0-9٠-٩]\s*[)\]]?[،,:\-–]?(?=\s|$|[.،])/g," ").replace(/\s+/g," ").replace(/^[\s،,:\-–و]+(?=\S)/,function(m){return /و\s*$/.test(m)&&m.trim()==="و"?"":m.replace(/[\s،,:\-–]/g,"")}).trim()}
// top3 = two mistakes + one strength; a report from before v27 (or a short answer) gets its card from the other fields
function summaryOf(r,goal){
  var given=(Array.isArray(r.top3)?r.top3:[]).filter(function(x){return x&&String(x.text||"").trim()});
  var mis=[],str=[],seen={};
  function add(arr,type,text,t,lim){text=String(text||"").trim();if(!text)return;var k=text.slice(0,24);if(seen[k])return;seen[k]=1;arr.push({type:type,text:wcut(text,12),t:t==null?"":t})}
  given.forEach(function(x){if(x.type==="strength"){if(str.length<1)add(str,"strength",x.text,x.t)}else if(mis.length<2)add(mis,"mistake",x.text,x.t)});
  if(goal){
    (r.buildup||[]).forEach(function(m){if(mis.length<2&&m.wrong)add(mis,"mistake",m.wrong,m.t)});
    var sp=r.stop||{};if(mis.length<2&&sp.where)add(mis,"mistake",sp.where,sp.t);
    if(!str.length&&(sp.you||sp.how))add(str,"fix",sp.you||sp.how,sp.t);
  }else{
    var km=r.key_moments||[],rm=r.recurring_mistakes||[],ss=r.strengths||[];
    rm.forEach(function(x){var t=firstT(x);if(mis.length<2&&t)add(mis,"mistake",stripT(x),t)});
    km.forEach(function(m){if(mis.length<2&&m.kind==="bad"&&tsec(m.t)!=null)add(mis,"mistake",m.what,m.t)});
    rm.forEach(function(x){if(mis.length<2)add(mis,"mistake",stripT(x),firstT(x))});
    ss.forEach(function(x){var t=firstT(x);if(!str.length&&t)add(str,"strength",stripT(x),t)});
    km.forEach(function(m){if(!str.length&&m.kind==="good"&&tsec(m.t)!=null)add(str,"strength",m.what,m.t)});
    if(!str.length&&ss[0])add(str,"strength",stripT(ss[0]),"");
  }
  var dr=null,nd=r.next_drill,nm0=!goal&&nmTasks(r,true)[0];
  if(nm0)dr={name:"",how:wcut((nm0.when?nm0.when+"، ":"")+nm0.do,24),nm:1};
  else if(nd&&typeof nd==="object"&&(nd.name||nd.how))dr={name:wcut(nd.name||"",6),how:wcut(nd.how||"",22)};
  else if(typeof nd==="string"&&nd.trim())dr={name:"",how:wcut(nd,22)};
  else if(goal){var g0=(r.drills||[])[0];if(g0)dr={name:"",how:wcut(typeof g0==="string"?g0:(g0.how||g0.name||""),22),from:0}}
  else{var d0=(r.drills||[])[0],as=r.assignment||{};
    if(d0&&(d0.name||d0.how))dr={name:wcut(d0.name||"",6),how:wcut(bullets(d0.how,1,22)[0]||"",22),from:0};
    else if(as.title)dr={name:wcut(as.title,6),how:wcut(as.how||"",22)};
    else if((r.practice||[])[0])dr={name:"",how:wcut(r.practice[0],22)}}
  return {top3:mis.concat(str),drill:dr};
}
function paintTop3(sel,items,goal){var ul=$(sel);ul.innerHTML="";
  items.forEach(function(x){var li=el("li","t3 "+(x.type==="strength"?"good":x.type==="fix"?"fix":"bad"));
    li.appendChild(el("i","t3-i",x.type==="strength"?"🟢":x.type==="fix"?"💡":"🔴"));li.appendChild(el("span","t3-x",x.text));
    if(goal){if(x.t!==""&&x.t!=null&&isFinite(+x.t))li.appendChild(gtbtn(Math.round(+x.t)))}
    else{var s=tsec(toLat(x.t));if(s!=null){var b=tbtn(s,arT(mmssC(s)));b.classList.add("t3-t");li.appendChild(b)}}
    ul.appendChild(li)});
  ul.hidden=!items.length;ul.previousElementSibling&&(ul.previousElementSibling.hidden=!items.length)}
function paintDrill(id,d){var b=$("#"+id);b.hidden=!d||!(d.name||d.how);if(b.hidden)return;var lb=$("#"+id+"-l");if(lb)lb.textContent=d.nm?"🎯 طبّقها في مباراتك الجاية":"🏋️ تمرينك للمباراة القادمة";$("#"+id+"-n").textContent=d.name||"";$("#"+id+"-n").hidden=!d.name;$("#"+id+"-h").textContent=d.how||""}
// v35 «طبّقها في مباراتك الجاية»: the report's next_match_tasks; older reports get them from their own mistakes (bad moments' lesson, else in-match habits)
function nmTasks(r,own){var t=(r.next_match_tasks||[]).filter(function(x){return x&&String(x.do||"").trim()}).slice(0,4).map(function(x){return {when:String(x.when||"").trim(),do:String(x.do).trim(),moment:x.moment||""}});
  if(t.length||own)return t;
  var km=(r.key_moments||[]).filter(function(m){return m&&m.kind==="bad"&&String(m.lesson||"").trim()});
  km.slice(0,3).forEach(function(m){var s=tsec(toLat(m.t));t.push({when:"",do:String(m.lesson).trim(),moment:(s!=null?mmssC(s)+" ":"")+wcut(m.what||"",12)})});
  if(!t.length)(r.in_game||[]).slice(0,3).forEach(function(x){if(String(x||"").trim())t.push({when:"",do:String(x).trim(),moment:""})});
  return t}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#r-xbtn");if(!b)return;var bd=$("#r-xbody"),o=bd.hidden;bd.hidden=!o;b.setAttribute("aria-expanded",o?"true":"false");b.classList.toggle("on",o)});
// the ring: «تقييم RP» (the journey's number when it has this match, else this match alone); a report without one shows the match grade out of 10
function paintRing(j){var r=j.result||{},g=+r.grade,hasG=isFinite(g)&&g>0,v=st.r2w!=null?st.r2w:(isFinite(+r.r2w)&&+r.r2w>0?Math.round(+r.r2w):null),ring=$("#r-ring");
  if(v!=null){$("#r-grade").textContent=AR(v);$("#r-of").textContent="/٩٩";ring.style.setProperty("--v",Math.min(100,v));ring.classList.toggle("lo",v<50);$("#r-rk").textContent="تقييم RP";
    $("#r-word").textContent=hasG?"المباراة "+ARd(Math.round(g*10)/10)+"/١٠ • "+word(g):""}
  else{$("#r-grade").textContent=hasG?ARd(Math.round(g*10)/10):"–";$("#r-of").textContent="/١٠";ring.style.setProperty("--v",hasG?Math.round(g*10):0);ring.classList.toggle("lo",hasG&&g<5);$("#r-rk").textContent="تقييم المباراة";$("#r-word").textContent=hasG?word(g):""}}
function paneOn(id,k,on){var p=document.querySelector("#"+id+" .pane[data-k='"+k+"']");if(p)p.dataset.on=on?"1":""}
function dPanes(id){return [].slice.call(document.querySelectorAll("#"+id+" .pane")).filter(function(p){return p.dataset.on==="1"})}
function dtlReset(id){var d=$("#"+id),tg=$("#"+id+"-tg");d.hidden=true;tg.setAttribute("aria-expanded","false");tg.classList.remove("open");tabsBuild(id,null)}
function dtlOpen(id,k){var d=$("#"+id),tg=$("#"+id+"-tg");if(d.hidden){d.hidden=false;tg.setAttribute("aria-expanded","true");tg.classList.add("open")}if(k)tabGo(id,k,false)}
function tabsBuild(id,keep){var d=$("#"+id),tb=d.querySelector(".tabs"),dots=d.querySelector(".dots"),ps=dPanes(id);tb.innerHTML="";dots.innerHTML="";
  ps.forEach(function(p){var b=el("button","tab",p.dataset.label);b.type="button";b.setAttribute("role","tab");b.dataset.k=p.dataset.k;b.addEventListener("click",function(){tabGo(id,p.dataset.k,false)});tb.appendChild(b);dots.appendChild(el("i"))});
  var k=keep&&ps.some(function(p){return p.dataset.k===keep})?keep:(ps[0]&&ps[0].dataset.k);$("#"+id+"-tg").hidden=!ps.length;dots.hidden=ps.length<2;
  $$("#"+id+" .pane").forEach(function(p){p.classList.remove("act")});if(k)tabGo(id,k,true)}
function tabGo(id,k,quiet){var d=$("#"+id),ps=dPanes(id),i=-1,prev=d.dataset.cur,pi=-1;ps.forEach(function(p,n){if(p.dataset.k===k)i=n;if(p.dataset.k===prev)pi=n});if(i<0)return;
  $$("#"+id+" .pane").forEach(function(p){var a=p.dataset.k===k;p.classList.toggle("act",a);p.classList.remove("in-n","in-p");if(a&&!quiet&&pi>=0&&pi!==i){void p.offsetWidth;p.classList.add(i>pi?"in-n":"in-p")}});
  $$("#"+id+" .tab").forEach(function(b){var a=b.dataset.k===k;b.classList.toggle("on",a);b.setAttribute("aria-selected",a?"true":"false");if(a&&!quiet){var tb=b.parentNode;var bl=b.offsetLeft,bw=b.offsetWidth;tb.scrollTo({left:bl-(tb.clientWidth-bw)/2,behavior:"smooth"})}});
  $$("#"+id+" .dots i").forEach(function(x,n){x.classList.toggle("on",n===i)});d.dataset.cur=k}
function tabStep(id,dl){var ps=dPanes(id),i=-1,c=$("#"+id).dataset.cur;ps.forEach(function(p,n){if(p.dataset.k===c)i=n});var n=i+dl;if(n>=0&&n<ps.length)tabGo(id,ps[n].dataset.k,false)}
["r-dtl","g-dtl"].forEach(function(id){var tg=$("#"+id+"-tg"),d=$("#"+id);if(!tg||!d)return;
  tg.addEventListener("click",function(){var open=d.hidden;d.hidden=!open;tg.setAttribute("aria-expanded",open?"true":"false");tg.classList.toggle("open",open);
    if(open){ev("details");setTimeout(function(){var R=tg.getBoundingClientRect();if(R.top>innerHeight*0.45)window.scrollBy({top:R.top-70,behavior:"smooth"})},30)}});
  // swipe between cards; right-to-left page: the next card comes in from the left, so a swipe to the right goes forward
  var pn=d.querySelector(".panes"),x0=null,y0=0,skip=false;
  pn.addEventListener("touchstart",function(e){var t=e.touches[0];x0=t.clientX;y0=t.clientY;var n=e.target;skip=false;
    while(n&&n!==pn){if(n.scrollWidth>n.clientWidth+4&&/(auto|scroll)/.test(getComputedStyle(n).overflowX)||n.tagName==="VIDEO"||n.classList&&n.classList.contains("cp-tl")){skip=true;break}n=n.parentNode}},{passive:true});
  pn.addEventListener("touchend",function(e){if(x0==null||skip){x0=null;return}var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
    if(Math.abs(dx)>50&&Math.abs(dx)>1.6*Math.abs(dy))tabStep(id,dx>0?1:-1)},{passive:true});
});
$$("[data-sample]").forEach(function(b){b.addEventListener("click",function(){render(JSON.parse(JSON.stringify(SAMPLE)))})});


/* ===== v18: accounts, paywall, checkout, counters ===== */
var ACC={user:null,owner:false,token:null,pay:false};
try{ACC.token=localStorage.getItem("fc_tok")||null}catch(e){}
function ownerCode(){try{return localStorage.getItem("fc_owner")||""}catch(e){return ""}}
ACC.owner=!!ownerCode();
/* v49: a random id for this device (no personal data): the free first analysis is one per device */
function devId(){try{var d=localStorage.getItem("r2w_dev");if(!/^[a-f0-9]{32}$/.test(d||"")){var a=new Uint8Array(16);crypto.getRandomValues(a);d=[].map.call(a,function(x){return("0"+x.toString(16)).slice(-2)}).join("");localStorage.setItem("r2w_dev",d)}return d}catch(e){return ""}}
function freeUsed(){try{return !!localStorage.getItem("r2w_free_used")}catch(e){return false}}
function freeJob(){try{return localStorage.getItem("r2w_free_job")||""}catch(e){return ""}}
(function(){var of=window.fetch;window.fetch=function(u,o){o=o||{};var s=String(u&&u.url||u);
  if(/^\/api\//.test(s)||s.indexOf(location.origin+"/api/")===0){var h=new Headers(o.headers||{});
    if(ACC.token&&!h.has("authorization"))h.set("authorization","Bearer "+ACC.token);var oc=ownerCode();if(oc)h.set("x-owner-code",oc);var dv=devId();if(dv)h.set("x-r2w-dev",dv);o.headers=h}
  return of.call(window,u,o)}})();
// v49: through fetch (keepalive) so the account and device go with the event (owner/test traffic is left out of the stats)
function ev(e){try{var b=JSON.stringify({e:e});fetch("/api/ev",{method:"POST",headers:{"content-type":"application/json"},body:b,keepalive:true}).catch(function(){})}catch(x){try{navigator.sendBeacon("/api/ev",new Blob([b],{type:"application/json"}))}catch(y){}}}
// v23: a full match needs a match credit (3-match pack); a goal clip needs a goal credit (bought one at a time). v24: subscribers within fair use (30 matches + 60 goals per 30 days).
// v24: a subscriber is entitled while under the fair-use limit for this mode; at the limit, his own paid credits still work
function fairOf(m){var u=ACC.user;if(!u||u.plan!=="pro"||!u.fair)return null;return u.fair.match||null}
function fairHit(m){var f=fairOf(m);return !!f&&f.used>=f.limit}
function arDay(ts){var d=new Date((ts+3*3600)*1000);return AR(d.getUTCDate())+" "+["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"][d.getUTCMonth()]}
function fairText(m){var f=fairOf("match")||{limit:30,reset:0};
  return "وصلت حدّ الاستخدام العادل في آخر ٣٠ يومًا ("+AR(f.limit)+" مباراة)."+(f.reset?" يتجدد في "+arDay(f.reset)+".":"")+" يمكنك شراء باقة 3 مباريات إذا احتجت الآن."}
function openFair(m,msg){ev("paywall");$("#fair-msg").textContent=msg||fairText(m);$("#fair-pack").className="btn primary";show("fair")}
function entitled(m){var u=ACC.user;if(!u)return false;if(u.plan==="pro"&&!fairHit(m||st.mode))return true;return u.credits>0}
function effMode(){return "match"}
// v30: "goal" or "match" when the signed-in account has nothing that pays for this analysis (fair-use limit aside: that one opens its own screen)
function needBuy(){if(typeof ACC==="undefined"||!ACC||ACC.owner||!ACC.user)return null;var m=effMode();if(entitled(m)||fairHit(m))return null;return "match"}
function needGoalBuy(){return false}
function paintGoalBuy(){var nb=needBuy(),c=$("#matchbuy");if(c)c.hidden=nb!=="match";
  var h=$("#u-h1");if(h)h.textContent="كيف تريد رفع مباراتك؟"}
function setToken(t){ACC.token=t;try{t?localStorage.setItem("fc_tok",t):localStorage.removeItem("fc_tok");if(t)localStorage.setItem("fc_had","1")}catch(e){}}
function fmtDate(s){try{return new Date(s*1000).toLocaleDateString("ar-SA-u-ca-gregory-nu-arab",{year:"numeric",month:"long",day:"numeric"})}catch(e){return ""}}
function paintAcct(){
  paintFree();
  var u=ACC.user;$("#acct-t").textContent=u?"حسابي":(ACC.owner?"المالك":"دخول");
  $("#ac-email").textContent=u?u.email:(ACC.owner?"وضع المالك (بدون حساب)":"—");
  var gc=0;/* v38: goal credits are no longer shown or used */
  var none=!!u&&u.plan!=="pro"&&!(u.credits>0)&&!gc,pr=$("#ac-plan"),row=$("#ac-plan-row");
  pr.textContent=ACC.owner&&!u?"المالك":!u?"—":u.plan==="pro"?"مشترك حتى "+fmtDate(u.pro_until):u.credits>0?"باقة المباريات":"لا توجد باقة • اختر باقة ‹";
  row.classList.toggle("go",none);if(none){row.setAttribute("role","button");row.tabIndex=0}else{row.removeAttribute("role");row.removeAttribute("tabindex")}
  // a zero in Arabic digits (٠) reads like a dot, so 0 is said in words
  // v23: match credits and goal credits are two separate balances, shown side by side
  var few=function(n){return n>=3&&n<=10},bal=[];if(u&&u.credits>0)bal.push(arCount(u.credits,"مباراة واحدة","مباراتان","مباريات","مباراة"));
  $("#ac-left").textContent=!u?"—":bal.length?bal.join(" • "):"لا يوجد";$("#ac-left-row").hidden=!!u&&u.plan==="pro"&&!bal.length;
  // v24: subscribers see their fair-use count for the last 30 days
  var fu=u&&u.plan==="pro"&&u.fair,ur=$("#ac-use-row");ur.hidden=!fu;
  if(fu){$("#ac-use").textContent=AR(fu.match.used)+" / "+AR(fu.match.limit)+" مباراة";
    var hit=fu.match.used>=fu.match.limit?fu.match:null;$("#ac-use-note").hidden=!hit;
    if(hit)$("#ac-use-note").textContent="وصلت حدّ الاستخدام العادل"+(hit.reset?"، يتجدد في "+arDay(hit.reset):"")+". يمكنك شراء باقة إذا احتجت."}else $("#ac-use-note").hidden=true;
  var as=$("#ac-start");if(as){as.dataset.start="match";as.textContent="حلّل مباراتك"}
  $("#ac-sub").hidden=!none;$("#ac-start").hidden=none;$("#ac-buy").hidden=none;
  $("#ac-buy").textContent=u&&u.plan==="pro"?"الأسعار والاشتراك":"اشترك أو اشترِ باقة";
  var tc=$("#top-cta");if(tc)tc.textContent=u||ACC.owner?"حلّل مباراة":"ابدأ الآن";
  $("#owner-box").hidden=!ACC.owner;$("#ac-out").hidden=!u;if($("#ac-del")){$("#ac-del").hidden=!u;if(!u)$("#del-acct").hidden=true}
  paintSub();paintGoalBuy();if(typeof updGo==="function"&&cur()==="upload")updGo();if(st.last&&cur()==="result")paintGoalUp(st.last);
}
function refreshMe(){if(!ACC.token){paintAcct();return Promise.resolve()}
  return fetch("/api/me",{cache:"no-store"}).then(function(r){if(r.status===401){setToken(null);ACC.user=null;return null}return r.json()}).then(function(j){if(j){ACC.user=j.user}paintAcct()}).catch(function(){paintAcct()})}
var authMode="signup";
// v49: the shortest sign-up: email + password, one big button. Sign-up is the default; login is one tap below it.
function setAuthMode(m){authMode=m;
  $("#auth-h").textContent=m==="signup"?"أنشئ حسابك مجانًا":"سجّل دخولك";$("#auth-go").textContent=m==="signup"?"أنشئ حسابي":"دخول";
  $("#f-name").hidden=true;$("#pw-hint").hidden=m!=="signup";$("#auth-forgot").hidden=m!=="login";
  $("#auth-sw-t").textContent=m==="signup"?"عندك حساب؟":"ما عندك حساب؟";$("#auth-sw-b").textContent=m==="signup"?"سجّل دخولك":"أنشئ حسابًا جديدًا";
  $("#a-pw").setAttribute("autocomplete",m==="signup"?"new-password":"current-password");$("#auth-err").hidden=true}
function openAuth(m,why){setAuthMode(m||"signup");$("#auth-why").textContent=why||"بالبريد وكلمة مرور فقط. حسابك يحفظ تقاريرك واشتراكك.";ev("auth_open");show("auth")}
$("#auth-sw-b").addEventListener("click",function(){setAuthMode(authMode==="signup"?"login":"signup")});
$("#a-pw-eye").addEventListener("click",function(){var p=$("#a-pw"),on=p.type==="password";p.type=on?"text":"password";this.textContent=on?"إخفاء":"إظهار";this.setAttribute("aria-pressed",on?"true":"false")});
function authDone(j){setToken(j.token);ACC.user=j.user;$("#a-pw").value="";paintAcct();
  if(st.afterAuth){var f=st.afterAuth;st.afterAuth=null;f();return}
  if(freeJob()){claimFree(true);return}   // v49: the free analysis of this device opens in full
  if(entitled("match")||ACC.owner)start("match");else openPricing()}
$("#auth-f").addEventListener("submit",function(e){e.preventDefault();var btn=$("#auth-go"),er=$("#auth-err");er.hidden=true;
  var em=$("#a-email").value.trim(),pw=$("#a-pw").value,mode=authMode;
  if(mode==="signup")ev("signup_submit");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){er.textContent="اكتب بريدًا إلكترونيًا صحيحًا";er.hidden=false;if(mode==="signup")ev("signup_error:client_email");return}
  if(pw.length<8){er.textContent="كلمة المرور 8 أحرف على الأقل";er.hidden=false;if(mode==="signup")ev("signup_error:client_pw");return}
  var lbl=btn.textContent;btn.disabled=true;btn.textContent="لحظة…";
  var post=function(path){return fetch("/api/auth/"+path,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:em,password:pw})}).then(function(r){return r.json().then(function(j){return {r:r,j:j}})})};
  post(mode).then(function(x){
    // v49: an email that already has an account: try the same password as a login before asking anything
    if(mode==="signup"&&x.j.error==="exists")return post("login").then(function(y){if(y.r.ok&&y.j.token)return y;setAuthMode("login");$("#a-pw").value="";y.j={message:"هذا البريد مسجّل عندنا. اكتب كلمة المرور حقّته وادخل."};return y});
    return x}).then(function(x){btn.disabled=false;btn.textContent=authMode==="signup"?"أنشئ حسابي":"دخول";
    if(!x.r.ok||!x.j.token){er.textContent=x.j.message||"حدث خلل، حاول مرة أخرى";er.hidden=false;return}
    authDone(x.j)})
  .catch(function(){btn.disabled=false;btn.textContent=lbl;er.textContent="تعذّر الاتصال، تأكد من الإنترنت";er.hidden=false;ev(mode==="signup"?"signup_error:network":"login_error:network")})});
function openPricing(msg,focus){ev("pricing_open");var m=$("#paymsg-gate");if(msg){m.textContent=msg;m.hidden=false}else m.hidden=true;show("pricing");
  $$("#plans-gate .plan").forEach(function(c){c.classList.remove("focus")});
  if(focus){var c=$("#plans-gate .p-"+focus);if(c){c.classList.add("focus");setTimeout(function(){try{c.scrollIntoView({block:"center",behavior:"smooth"})}catch(e){}},120)}}}
function paintGoalUp(){/* v38: goal reports removed */}
function payMsg(t){["#paymsg-gate","#paymsg-land"].forEach(function(s){var e=$(s);if(e){e.textContent=t;e.hidden=!t}})}
function hadAcct(){try{return !!localStorage.getItem("fc_had")}catch(e){return false}}
// v47: a signed-in player goes straight to payment. The account may still be loading (the page asked /api/me a moment ago),
// so a saved session is checked first instead of showing «أنشئ حسابك». Only a device with no account at all sees the sign-up.
function buy(product,btn,prepaid,direct,_chk){
  if(!ACC.user&&ACC.token&&!_chk){if(btn){btn.disabled=true}refreshMe().then(function(){if(btn)btn.disabled=false;buy(product,btn,prepaid,direct,1)});return}
  if(!ACC.user){st.afterAuth=function(){buy(product,null,prepaid,direct)};
    if(ACC.owner)openAuth("login","أنت في وضع المالك بدون حساب (التحليل مجاني لك). للدفع سجّل دخولك بحساب، وننقلك للدفع مباشرة.");
    else if(hadAcct())openAuth("login","سجّل دخولك، وننقلك للدفع مباشرة.");
    else openAuth("signup","أنشئ حسابك أولًا، ثم ننقلك للدفع.");return}
  // v47: one-time purchases (3-match pack, yearly) open the payment-method screen first, Apple Pay first
  if(!direct&&(product==="pack3"||product==="pro_year")){openOneTime(product);return}
  var lbl=btn&&btn.textContent;if(btn){btn.disabled=true;btn.textContent="لحظة…"}
  coMsg("");
  fetch("/api/pay/create",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({product:product,prepaid:!!prepaid})})
  .then(function(r){return r.json()}).then(function(j){if(btn){btn.disabled=false;btn.textContent=lbl}
    if(j.url){location.href=j.url;return}
    if(j.card){openCheckout(j.card);return}
    if(j.error==="auth"){setToken(null);ACC.user=null;paintAcct();st.afterAuth=function(){buy(product,null,prepaid,direct)};openAuth("login","انتهت جلستك، سجّل دخولك وننقلك للدفع مباشرة.");return}
    var m=j.message||"تعذّر فتح صفحة الدفع، حاول بعد قليل";
    if($("#checkout").classList.contains("active")){coMsg(m);return}
    payMsg(m);if(!$("#pricing").classList.contains("active")&&!$("#home").classList.contains("active"))openPricing(j.message)})
  .catch(function(){if(btn){btn.disabled=false;btn.textContent=lbl}var m="تعذّر الاتصال، تأكد من الإنترنت";if($("#checkout").classList.contains("active"))coMsg(m);else payMsg(m)})}
function coMsg(t){var e=$("#co-msg");if(e){e.textContent=t;e.hidden=!t}}
function openAccount(){ev("account_open");$("#ac-msg").hidden=true;show("account");refreshMe()}
$("#acct-btn").addEventListener("click",function(){if(ACC.user||ACC.owner)openAccount();else openAuth(hadAcct()?"login":"signup")});
$("#ac-buy").addEventListener("click",function(){openPricing()});
$("#ac-sub").addEventListener("click",function(){openPricing()});
$("#ac-plan-row").addEventListener("click",function(){if(this.classList.contains("go"))openPricing()});
$("#ac-plan-row").addEventListener("keydown",function(e){if((e.key==="Enter"||e.key===" ")&&this.classList.contains("go")){e.preventDefault();openPricing()}});
$("#ac-out").addEventListener("click",function(){fetch("/api/auth/logout",{method:"POST"}).catch(function(){});setToken(null);ACC.user=null;paintAcct();show("home")});
/* v41: delete the whole account from «حسابي» (App Store / Google Play require it inside the app) */
(function(){var box=$("#del-acct"),btn=$("#ac-del");if(!box||!btn)return;
  btn.addEventListener("click",function(){box.hidden=false;btn.hidden=true;$("#del-err").hidden=true;$("#del-pw").value="";setTimeout(function(){try{$("#del-pw").focus()}catch(e){}},60)});
  $("#del-x").addEventListener("click",function(){box.hidden=true;btn.hidden=!ACC.user});
  $("#del-go").addEventListener("click",function(){var pw=$("#del-pw").value,er=$("#del-err"),go=$("#del-go");
    if(!pw){er.textContent="اكتب كلمة المرور للتأكيد.";er.hidden=false;return}
    go.disabled=true;var l=go.textContent;go.textContent="لحظة…";er.hidden=true;
    fetch("/api/auth/delete-account",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({password:pw})})
    .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok,j:j}})})
    .then(function(x){go.disabled=false;go.textContent=l;
      if(!x.ok||!x.j.ok){er.textContent=x.j.message||"تعذّر حذف الحساب، حاول مرة أخرى.";er.hidden=false;return}
      try{for(var k=localStorage.length-1;k>=0;k--){var key=localStorage.key(k);if(/^fc_/.test(key)&&key!=="fc_owner")localStorage.removeItem(key)}}catch(e){}
      setToken(null);ACC.user=null;box.hidden=true;$("#del-pw").value="";paintAcct();show("home");
      setTimeout(function(){alert("تم حذف حسابك وكل تحليلاتك نهائيًا.")},300)})
    .catch(function(){go.disabled=false;go.textContent=l;er.textContent="تعذّر الاتصال، تأكد من الإنترنت";er.hidden=false})});
})();
$$("[data-grant]").forEach(function(b){b.addEventListener("click",function(){
  if(!ACC.user){openAuth("login","سجّل دخولك بالحساب الذي تريد إضافة الباقة له.");return}
  fetch("/api/pay/owner-grant",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({product:b.dataset.grant})}).then(function(r){return r.json()})
  .then(function(j){if(j.user){ACC.user=j.user;paintAcct();var m=$("#ac-msg");m.textContent="✓ أُضيف للحساب";m.hidden=false}else{var m2=$("#ac-msg");m2.textContent=j.error==="wrong_code"?"رمز المالك غير صحيح":j.message||"حدث خلل، حاول مرة أخرى";m2.hidden=false}})})});
// back from the payment page: ?paid=<id>
(function(){var q=new URLSearchParams(location.search),pid=q.get("paid");if(!pid)return;
  try{history.replaceState({s:"home",d:0},"",location.pathname)}catch(e){}
  var tries=0;function chk(){fetch("/api/pay/verify",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({pid:pid})}).then(function(r){return r.json()}).then(function(j){
    var m=$("#ac-msg");if(j.user){ACC.user=j.user;paintAcct()}
    if(j.ok){m.className="paymsg ok";m.textContent="✓ تم الدفع بنجاح. باقتك مفعّلة الآن.";m.hidden=false}
    else if(++tries<6&&j.status!=="failed"&&j.status!=="canceled"&&j.status!=="amount_mismatch"){m.className="paymsg";m.textContent="نتأكد من الدفع…";m.hidden=false;setTimeout(chk,2500)}
    else{m.className="paymsg";m.textContent="لم يكتمل الدفع. لم يُخصم منك شيء، أو تواصل معنا إذا خُصم المبلغ.";m.hidden=false}}).catch(function(){})}
  setTimeout(function(){show("account");chk()},200)})();
// prices come from the server (one place: _worker.js PRICES)
function applyPrices(p,fu){if(!p||!p.pack3)return;PRAW=p;if(fu&&fu.match){CONFIG.price.fairM=EN(fu.match)}CONFIG.price.pack3=EN(p.pack3);CONFIG.price.proMonth=EN(p.pro_month);CONFIG.price.proFirst=EN(p.pro_month_first);CONFIG.price.proYear=EN(p.pro_year);
  var save=Math.round(100*(1-p.pro_year/(12*p.pro_month)));CONFIG.price.yearSave="وفّر "+EN(save)+"%";CONFIG.price.yearMonthly=EN(Math.round(p.pro_year/12));
  renderPlans("#plans-land");renderPlans("#plans-gate");renderCmp();$$("[data-px]").forEach(function(e){e.textContent=PX(e.getAttribute("data-px"))})}
fetch("/api/status").then(function(r){return r.json()}).then(function(j){ACC.pay=!!j.pay;ACC.cards=!!j.cards;applyPrices(j.prices,j.fair)}).catch(function(){});
paintAcct();refreshMe();ev("view");
var _render0=render;render=function(j){_render0(j);if(ACC.user&&j&&!j._sample&&!j.demo)setTimeout(refreshMe,800)};
if(location.hash==="#account"&&!location.search)setTimeout(function(){if(ACC.user||ACC.owner)openAccount()},300);
// v22: deep links to the pricing page, «رحلتي» and the leaderboard
// v30: «رحلتي» and the leaderboard need an account: a logged-out visitor gets the login with a short reason, then lands where he was going
(function(){var h0=location.hash.slice(1);if(["pricing","journey","leaders"].indexOf(h0)<0||location.search)return;refreshMe().then(function(){
  if(h0!=="pricing"&&!ACC.user&&!ACC.owner){st.afterAuth=function(){show(h0)};show("home","replace");openAuth("login",h0==="journey"?"سجّل دخولك لترى «رحلتي» وتقدّمك من مباراة لأخرى.":"سجّل دخولك لترى قائمة المتصدرين.");return}
  show(h0,"replace")})})();


/* ===== v19: full match from a YouTube link or from several clips ===== */
st.src="one";st.clips=[];
var MAXC=8,MAXS=25*60,MINS=120,SHORTMSG="الفيديو أقصر من دقيقتين. ارفع المباراة كاملة (من ٢ إلى ٢٥ دقيقة).";
function setSrc(s){st.src=s;document.body.classList.remove("src-one","src-link","src-clips");document.body.classList.add("src-"+s);
  $$(".srcseg button").forEach(function(b){b.classList.toggle("on",b.dataset.src===s)});if(s!=="one")setMode("match");updGo();$("#err").hidden=true}
$$(".srcseg button").forEach(function(b){b.addEventListener("click",function(){setSrc(b.dataset.src);if(st.ustep===1&&!needBuy())goStep(2)})});
function ytOk(u){return /^(https?:\/\/)?((www|m|music)\.)?(youtube\.com\/(watch\?.*v=|live\/|shorts\/)|youtu\.be\/)[\w-]{11}/i.test(String(u||"").trim())}
function srcState(){
  if(st.src==="link"){var u0=$("#yt").value.trim(),ok=ytOk(u0),y=st.yc&&st.yc.u===u0?st.yc:null;
    if(ok&&(!y||y.state==="pending"))return {ok:false,go:"حلّل المباراة",hint:"نتحقق من الرابط…"};
    if(ok&&y.state==="bad")return {ok:false,go:"حلّل المباراة",hint:y.msg};
    return {ok:ok,go:"حلّل المباراة",hint:ok?"":(u0?"يجب أن يكون الرابط من يوتيوب":"الصق رابط البث أولًا")}}
  if(st.src==="clips"){var n=st.clips.length,tot=st.clips.reduce(function(a,c){return a+(c.dur||0)},0);
    var known=n&&st.clips.every(function(c){return c.dur>0}),short=known&&tot<MINS;
    return {ok:!!n&&n<=MAXC&&tot<=MAXS+60&&!short,go:"حلّل المباراة",hint:!n?"اختر مقاطع المباراة أولًا":n>MAXC?"الحد ٨ مقاطع":tot>MAXS+60?"المجموع أطول من ٢٥ دقيقة":short?SHORTMSG:""}}
  var fd=st.fileDur||0,m=st.mode==="match",sh=m&&fd>0&&fd<MINS,lg=m&&fd>MAXS+30;
  return {ok:!!st.file&&!sh&&!lg,go:"حلّل مباراتي",hint:!st.file?"اختر الفيديو أولًا":sh?SHORTMSG:lg?"المباراة أطول من ٢٥ دقيقة. ارفع مباراة أقصر أو قصّها أولًا.":""}}
function updGo(){var g=$("#go"),h=$("#cta-hint"),x=srcState(),n=st.ustep||1,nb=needBuy();paintGoalBuy();
  $("#u-back").hidden=n===1;
  // v30: an account with nothing to pay this analysis with is told before the upload step, on any method
  // v53: no credit no longer blocks the upload: a match analysed before opens free; a new one asks for a pack after the upload
  var nbh=nb?"مباراة حُللت قبل؟ تقريرها يفتح بدون رصيد.":"";
  if(n===1){g.disabled=false;g.textContent="التالي ←";h.textContent=nbh;return}
  if(n===2){g.disabled=!x.ok;g.textContent="التالي ←";h.textContent=x.hint||nbh;return}
  g.disabled=!x.ok;g.textContent=x.go;h.textContent=x.ok?nbh:x.hint}
// step 3 summary: what will be analysed
function paintSum(){var s=$("#us-src"),v=$("#us-vid");if(!s)return;
  if(st.src==="link"){s.textContent="مباراة كاملة من رابط";var u=$("#yt").value.trim();v.textContent=u?u.replace(/^https?:\/\/(www\.)?/,""):"—";v.dir="ltr";return}
  v.dir="rtl";
  if(st.src==="clips"){var tot=st.clips.reduce(function(a,c){return a+(c.dur||0)},0);s.textContent="مباراة كاملة من عدة مقاطع";v.textContent=st.clips.length?arCount(st.clips.length,"مقطع واحد","مقطعان","مقاطع","مقطعًا")+" • المجموع "+fmt(tot):"—";return}
  s.textContent="مقطع واحد: مباراة كاملة";
  v.textContent=st.file?st.file.name+($("#dur-b")&&!$("#dur-b").hidden&&$("#dur-b").textContent?" • "+$("#dur-b").textContent:""):"—"}
$("#yt").addEventListener("input",function(){updGo();ycRun()});
$("#yt").addEventListener("change",function(){updGo();ycRun()});
$("#yt").addEventListener("paste",function(){setTimeout(function(){updGo();ycRun()},30)});
function natCmp(a,b){return a.localeCompare(b,undefined,{numeric:true,sensitivity:"base"})}
$("#clips").addEventListener("change",function(e){var fs=[].slice.call(e.target.files||[]);if(!fs.length)return;
  fs.sort(function(a,b){return natCmp(a.name,b.name)||(a.lastModified-b.lastModified)});
  var add=fs.map(function(f){return {f:f,url:URL.createObjectURL(f),dur:0}});st.clips=st.clips.concat(add);
  if(st.clips.length>MAXC){$("#err").textContent="الحد ٨ مقاطع للمباراة الواحدة. احذف الزائد.";$("#err").hidden=false}
  add.forEach(function(c){videoDur(c.f).then(function(d){c.dur=d;paintClips()})});e.target.value="";paintClips()});
function moveClip(i,j){if(j<0||j>=st.clips.length)return;var c=st.clips.splice(i,1)[0];st.clips.splice(j,0,c);paintClips()}
function paintClips(){var ol=$("#cliplist");ol.innerHTML="";
  st.clips.forEach(function(c,i){var li=el("li");li.draggable=true;li.dataset.i=i;
    li.appendChild(el("span","n",AR(i+1)));li.appendChild(el("span","cl-ic","🎞"));   // v33: an icon, not a frame of the clip
    var m=el("div","meta");m.appendChild(el("b",null,c.f.name));m.appendChild(el("small",null,(c.dur?fmt(c.dur)+" • ":"")+mbTxt(c.f.size/1048576)));li.appendChild(m);
    var o=el("div","ord"),up=el("button",null,"▲"),dn=el("button",null,"▼"),x=el("button",null,"✕");up.type=dn.type=x.type="button";
    up.setAttribute("aria-label","تقديم");dn.setAttribute("aria-label","تأخير");x.setAttribute("aria-label","حذف");up.disabled=!i;dn.disabled=i===st.clips.length-1;
    up.onclick=function(){moveClip(i,i-1)};dn.onclick=function(){moveClip(i,i+1)};x.onclick=function(){URL.revokeObjectURL(c.url);st.clips.splice(i,1);paintClips()};
    o.appendChild(up);o.appendChild(dn);o.appendChild(x);li.appendChild(o);
    li.addEventListener("dragstart",function(e){li.classList.add("drag");e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",String(i))});
    li.addEventListener("dragend",function(){li.classList.remove("drag")});
    li.addEventListener("dragover",function(e){e.preventDefault();li.classList.add("over")});li.addEventListener("dragleave",function(){li.classList.remove("over")});
    li.addEventListener("drop",function(e){e.preventDefault();li.classList.remove("over");var from=+e.dataTransfer.getData("text/plain");moveClip(from,i)});
    ol.appendChild(li)});
  var tot=st.clips.reduce(function(a,c){return a+(c.dur||0)},0),s=$("#clip-sum");s.hidden=!st.clips.length;s.textContent=st.clips.length?arCount(st.clips.length,"مقطع واحد","مقطعان","مقاطع","مقطعًا")+" • المجموع "+fmt(tot)+(tot>MAXS+60?" (أطول من ٢٥ دقيقة)":""):"";updGo()}
// one file to the server in pieces; resolves with the upload id once the video service has it ready
async function uploadOne(f,onp){
  var s=await fetch("/api/video/start",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({size:f.size,mime:f.type||"video/mp4"})});
  var sj=await s.json().catch(function(){return {}});
  if(!s.ok||!sj.id)throw {m:sj.message||"تعذّر رفع الفيديو، حاول مرة أخرى",c:sj.code||"E-"+s.status};
  var C=sj.chunk||8388608;
  for(var off=0;off<f.size;off+=C){var end=Math.min(f.size,off+C),last=end===f.size,r=null;
    st.uploading=true;wakeOn();
    r=await putPiece(sj.id,off,f.slice(off,end),last,function(l){onp((off+l)/f.size)});
    if(!r||!r.ok){st.uploading=false;wakeOff()}
    if(!r)throw {m:UPMSG,c:"E-CONN"};if(!r.ok)throw {m:r.j.message||UPMSG,c:r.j.code||"E-"+r.status}}
  st.uploading=false;
  for(var i=0;i<100;i++){var q=await fetch("/api/video/state?id="+sj.id).then(function(x){return x.json()}).catch(function(){return {}});
    if(q.state==="ACTIVE")return sj.id;if(q.state==="FAILED")throw {m:"لم نتمكن من قراءة أحد المقاطع. جرّب ملف MP4 آخر.",c:"E-VID"};if(q.error==="expired")throw {m:q.message,c:q.code};await wait(3000)}
  throw {m:"تجهيز الفيديو أخذ وقتًا طويلًا، حاول مرة أخرى بعد قليل.",c:"E-VSLOW"}}
async function startJob(body){var id;
  try{id=await openRunner("/api/job/start",body)}catch(e){return fail("انقطع الاتصال. تأكد من الإنترنت وحاول مرة أخرى.","E-CONN")}
  if(id&&id.error)return fail(id.message||"حدث خلل، حاول مرة أخرى.",id.code||"E-JOB");
  saveJob(id);return watchJob(id)}
async function runLink(){var u=$("#yt").value.trim();if(!ytOk(u))return;
  setMode("match");$("#p-title").textContent="نحلل مباراتك…";show("processing");step(1);bar(8);$("#s1n").textContent="";$("#p-fine").textContent="لحظات ونستلم الرابط…";
  stepTxt("نقرأ رابط البث","نشاهد المباراة ونكتب الملاحظات","نكتب التقرير");
  // v25: the YouTube player tells the length, so the server splits the match into parts like an uploaded file
  var known=st.yc&&st.yc.u===u&&st.yc.len>0?Promise.resolve(st.yc.len):ytLen(u);
  return known.then(function(d){return startJob({youtube:u,yt_duration:d||0,team:$("#team").value.trim(),tactics:st.tactics})})}
function ytVid(u){var m=String(u||"").match(/(?:[?&]v=|youtu\.be\/|live\/|shorts\/|embed\/)([\w-]{11})/);return m?m[1]:null}
function ytLen(u){return new Promise(function(res){var id=ytVid(u);if(!id)return res(0);var done=false,box=null,pl=null,to=null;
  function fin(v){if(done)return;done=true;clearTimeout(to);try{pl&&pl.destroy&&pl.destroy()}catch(e){}if(box&&box.parentNode)box.parentNode.removeChild(box);res(Math.round(+v||0))}
  to=setTimeout(function(){fin(0)},8000);
  function make(){try{box=document.createElement("div");box.setAttribute("aria-hidden","true");box.style.cssText="position:fixed;left:-9999px;top:0;width:200px;height:120px;opacity:0;pointer-events:none";var d=document.createElement("div");box.appendChild(d);document.body.appendChild(box);
    pl=new YT.Player(d,{width:200,height:120,videoId:id,playerVars:{autoplay:0,controls:0,mute:1,playsinline:1},events:{onReady:function(){var n=0;(function poll(){var v=0;try{v=pl.getDuration()}catch(e){}if(v>0)return fin(v);if(++n>24)return fin(0);setTimeout(poll,250)})()},onError:function(){fin(0)}}})}catch(e){fin(0)}}
  if(window.YT&&window.YT.Player)return make();
  var prev=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=function(){if(prev)try{prev()}catch(e){}make()};
  if(!document.getElementById("yt-api")){var s=document.createElement("script");s.id="yt-api";s.src="https://www.youtube.com/iframe_api";s.onerror=function(){fin(0)};document.head.appendChild(s)}})}
// v47: the link is checked the moment it is pasted: the server says whether YouTube has it (and not private or live), and the
// YouTube player on this page reads its length (2–25 minutes). Nothing is charged or started until it passes.
function ytProbe(u){return new Promise(function(res){var id=ytVid(u);if(!id)return res({len:0});var done=false,box=null,pl=null,to=null;
  function fin(v,err){if(done)return;done=true;clearTimeout(to);try{pl&&pl.destroy&&pl.destroy()}catch(e){}if(box&&box.parentNode)box.parentNode.removeChild(box);res({len:Math.round(+v||0),err:err||0})}
  to=setTimeout(function(){fin(0)},8000);
  function make(){try{box=document.createElement("div");box.setAttribute("aria-hidden","true");box.style.cssText="position:fixed;left:-9999px;top:0;width:200px;height:120px;opacity:0;pointer-events:none";var d=document.createElement("div");box.appendChild(d);document.body.appendChild(box);
    pl=new YT.Player(d,{width:200,height:120,videoId:id,playerVars:{autoplay:0,controls:0,mute:1,playsinline:1},events:{onReady:function(){var n=0;(function poll(){var v=0;try{v=pl.getDuration()}catch(e){}if(v>0)return fin(v);if(++n>24)return fin(0);setTimeout(poll,250)})()},onError:function(e){fin(0,(e&&e.data)||1)}}})}catch(e){fin(0)}}
  if(window.YT&&window.YT.Player)return make();
  var prev=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=function(){if(prev)try{prev()}catch(e){}make()};
  if(!document.getElementById("yt-api")){var s=document.createElement("script");s.id="yt-api";s.src="https://www.youtube.com/iframe_api";s.onerror=function(){fin(0)};document.head.appendChild(s)}})}
st.yc=null;var ycT=null;
function mmssA(n){n=Math.round(n);return Math.floor(n/60)+":"+String(n%60).padStart(2,"0")}
function ycPaint(){var e=$("#yt-check");if(!e)return;var y=st.yc,u=$("#yt").value.trim();
  if(!y||y.u!==u||!ytOk(u)){e.hidden=true;return}
  e.hidden=false;e.className="yt-check "+y.state;
  e.textContent=y.state==="pending"?"⏳ نتحقق من الرابط…":y.state==="bad"?"⚠️ "+y.msg:"✓ الفيديو جاهز للتحليل"+(y.len?" (المدة "+mmssA(y.len)+")":"")}
function ycRun(){var u=$("#yt").value.trim();clearTimeout(ycT);
  if(!ytOk(u)){st.yc=null;ycPaint();updGo();return}
  if(st.yc&&st.yc.u===u&&st.yc.state!=="pending")return;
  st.yc={u:u,state:"pending"};ycPaint();updGo();
  ycT=setTimeout(function(){
    var srv=fetch("/api/yt/check?u="+encodeURIComponent(u),{cache:"no-store"}).then(function(r){return r.ok?r.json():{ok:true}}).catch(function(){return {ok:true}});
    Promise.all([srv,ytProbe(u)]).then(function(x){var a=x[0]||{ok:true},p=x[1]||{len:0};if($("#yt").value.trim()!==u)return;
      var len=p.len||a.len||0,y={u:u,state:"ok",len:len};
      if(a.ok===false){y.state="bad";y.msg=a.message||"تعذّر قراءة هذا الرابط"}
      else if(p.err===100){y.state="bad";y.msg="الفيديو خاص أو محذوف. اجعله «عام» في يوتيوب ثم الصق الرابط."}
      else if(len&&len<MINS){y.state="bad";y.msg=SHORTMSG}
      else if(len>MAXS+30){y.state="bad";y.msg="المباراة أطول من ٢٥ دقيقة. ارفع مباراة أقصر أو قصّها أولًا."}
      st.yc=y;ev(y.state==="bad"?"yt_bad":"yt_ok");ycPaint();updGo()})},350)}
async function runClips(){var cs=st.clips.slice();if(!cs.length)return;
  setMode("match");$("#p-title").textContent="نحلل مباراتك…";show("processing");step(1);bar(2);$("#p-fine").textContent=UPFINE;
  stepTxt("نرفع المقاطع","نشاهد المباراة ونكتب الملاحظات","نكتب التقرير");
  var tot=cs.reduce(function(a,c){return a+c.f.size},0),done=0,ids=[];
  for(var k=0;k<cs.length;k++){var c=cs[k];$("#s1n").textContent="("+AR(k+1)+"/"+AR(cs.length)+")";
    try{ids.push(await uploadOne(c.f,function(p){bar(2+58*(done+p*c.f.size)/tot)}))}catch(e){return fail(e&&e.m||"انقطع رفع الفيديو، حاول مرة أخرى",e&&e.c||"E-UP")}
    done+=c.f.size}
  $("#s1n").textContent="";step(3);bar(62);
  return startJob({videos:ids,durations:cs.map(function(c){return Math.round(c.dur||0)}),team:$("#team").value.trim(),tactics:st.tactics})}
// v29: FAQ «كيف أسجّل مباراتي من البلايستيشن؟» shows the upload step's own guide. One source: the nodes are
// copied from the upload step at load (method names, ul[data-for=match] tips, #guide-link, #guide-clips), so the two never drift.
(function(){var box=$("#faq-rec");if(!box)return;var n=0;
  function copy(src){if(!src)return null;var c=src.cloneNode(true),sfx="-fq";c.removeAttribute("id");c.removeAttribute("data-for");
    [].forEach.call(c.querySelectorAll("[id]"),function(e){e.id=e.id+sfx});
    [].forEach.call(c.querySelectorAll("[fill],[stroke]"),function(e){["fill","stroke"].forEach(function(a){var v=e.getAttribute(a);if(v&&v.indexOf("url(#")===0)e.setAttribute(a,v.replace(/url\(#([^)]+)\)/,"url(#$1"+sfx+")"))})});return c}
  var tabs=el("div","fr-seg"),panes=[];tabs.setAttribute("role","tablist");
  [["one",$("#upload .tips ul[data-for=match]")],["link",$("#guide-link")],["clips",$("#guide-clips")]].forEach(function(p){
    var pick=$('#upload .srcpick [data-src="'+p[0]+'"]'),body=copy(p[1]);if(!pick||!body)return;
    var t=el("button",null);t.type="button";t.setAttribute("role","tab");t.innerHTML=pick.querySelector("b").innerHTML;
    var pane=el("div","fr-pane fr-"+p[0]);if(p[0]==="one"){var h=$("#upload .tips summary");if(h)pane.appendChild(el("b","g-t",h.textContent))}
    pane.appendChild(body);var k=n++;t.addEventListener("click",function(){show(k)});tabs.appendChild(t);panes.push([t,pane])});
  function show(k){panes.forEach(function(q,i){q[0].classList.toggle("on",i===k);q[0].setAttribute("aria-selected",i===k?"true":"false");q[1].hidden=i!==k;
    if(i===k){var r=q[1].querySelector(".g-row");if(r)r.dispatchEvent(new Event("scroll"))}})}
  if(!panes.length)return;box.appendChild(tabs);panes.forEach(function(q){box.appendChild(q[1])});show(0)})();
// guide dots follow the swipe
$$(".guide").forEach(function(g){var row=g.querySelector(".g-row"),dots=[].slice.call(g.querySelectorAll(".g-dots i"));
  function upd(){var c=row.children[0];if(!c)return;var step=c.offsetWidth+10,max=Math.max(1,row.scrollWidth-row.clientWidth),x=Math.abs(row.scrollLeft);
    // v30: a hidden guide (or one with nothing to scroll) is on its first picture: only a real scroll to the end lights the last dot
    var over=row.scrollWidth-row.clientWidth>4,best=over&&x>=max-4?dots.length-1:Math.min(dots.length-1,Math.round(x/step));dots.forEach(function(d,i){d.classList.toggle("on",i===best)})}
  row.addEventListener("scroll",function(){requestAnimationFrame(upd)},{passive:true});upd();
  dots.forEach(function(d,i){d.addEventListener("click",function(){go(i)})});
  // v20: prev / next buttons with a step counter
  var pv=g.querySelector(".g-prev"),nx=g.querySelector(".g-next"),num=g.querySelector(".g-num"),N=row.children.length,at=0;
  function go(i){i=Math.max(0,Math.min(N-1,i));var c=row.children[i];if(!c)return;at=i;paint();
    var rr=row.getBoundingClientRect(),cr=c.getBoundingClientRect();row.scrollBy({left:(cr.left+cr.width/2)-(rr.left+rr.width/2),behavior:"smooth"})}
  function paint(){if(pv)pv.disabled=at<=0;if(nx){nx.disabled=at>=N-1}if(num)num.textContent=AR(at+1)+" من "+AR(N)}
  var _u=upd;upd=function(){_u();var on=dots.findIndex(function(d){return d.classList.contains("on")});if(on>=0&&on!==at){at=on;paint()}};
  if(pv)pv.addEventListener("click",function(){go(at-1)});if(nx)nx.addEventListener("click",function(){go(at+1)});paint()});
setSrc("one");

/* ===== plans ===== */
function introOn(){var u=ACC.user;return !u||u.intro!==false}
// v30: «الأوفر» only while the yearly plan really costs less per month than every monthly price (first month included)
var PRAW={pack3:29,pro_month:69,pro_month_first:39,pro_year:399};
function yearCheapest(){return PRAW.pro_year/12<Math.min(PRAW.pro_month,PRAW.pro_month_first)}
function renderPlans(sel){var box=$(sel);if(!box)return;box.innerHTML="";CONFIG.plans.forEach(function(p){
  var intro=p.was&&introOn();
  var hot=p.best&&yearCheapest();var c=el("div","plan p-"+p.id+(hot?" hot":""));if(hot)c.appendChild(el("span","badge",p.best));if(p.save)c.appendChild(el("span","badge save",PX(p.save)));c.appendChild(el("b",null,p.name));
  var pr=el("div","price");pr.appendChild(document.createTextNode(PX(intro?p.price:(p.was||p.price))+" "));
  if(intro){pr.appendChild(el("s","was",PX(p.was)));pr.appendChild(document.createTextNode(" "))}
  pr.appendChild(el("small",null,CONFIG.currency+(intro?" / "+p.per:p.was?" / شهريًا":(p.per?" / "+p.per:""))));c.appendChild(pr);
  var note=intro?p.note:(p.was?"تجديد شهري • إلغاء بأي وقت":p.note);if(note)c.appendChild(el("small","pn",PX(note)));
  var ul=el("ul");p.items.forEach(function(t){ul.appendChild(el("li",null,PX(t)))});c.appendChild(ul);
  (p.buy||[]).forEach(function(o,k){var lbl=p.was&&!intro?"اشترك شهريًا (@proMonth ريال)":o.label;var bt=el("button","btn "+(p.id!=="pack"&&!k?"primary":"ghost")+" sm",PX(lbl));bt.addEventListener("click",function(){buy(o.product,bt)});c.appendChild(bt)});c.appendChild(payMarks());box.appendChild(c)});
}
renderPlans("#plans-land");renderPlans("#plans-gate");
function renderCmp(){var t=$("#cmp");if(!t)return;t.innerHTML="";var h=el("tr");CONFIG.compareHead.forEach(function(x){h.appendChild(el("th",null,x))});t.appendChild(h);
  CONFIG.compare.forEach(function(r){var tr=el("tr");r.forEach(function(x,i){tr.appendChild(el(i?"td":"th",null,PX(x)))});t.appendChild(tr)})}
renderCmp();
$$("[data-px]").forEach(function(e){e.textContent=PX(e.getAttribute("data-px"))});
$$(".bn").forEach(function(e){e.textContent=e.hasAttribute("data-short")?CONFIG.brandShort:CONFIG.brand});


/* ===== v33: moments and goals as people-free cards (no frame, thumbnail or clip of the player's match is shown anywhere) ===== */
// the player's own video is no longer kept on this device for playback; copies saved by earlier versions are removed
try{if(window.indexedDB)indexedDB.deleteDatabase("fc_clips")}catch(e){}
var CP={ms:[]};
function tsec(t){var m=String(t||"").match(/(\d+):(\d{1,2})/);return m?(+m[1])*60+(+m[2]):null}
// v31: «05:04» reads «٥:٠٤» (a leading Arabic zero looked like a minus sign on the moment cards)
function arT(t){return String(t||"").replace(/(^|[^\d:])0(\d:[0-5]\d)/g,"$1$2").replace(/\d/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[d]})}
// a drawn pitch from above with one icon in the middle — no people, no frames
var MO_IC={
  goal:'<path d="M-12 7V-8H12V7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M-12 -2.5H12M-6 -8V7M0 -8V7M6 -8V7" stroke="currentColor" stroke-width=".9" opacity=".5"/><circle cx="0" cy="3" r="4.4" fill="currentColor"/>',
  chance:'<circle r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle r="1.8" fill="currentColor"/>',
  attack:'<path d="M8 8L-6 -6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M-8 2V-8H2" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  mistake:'<path d="M0 -11L11 9H-11Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M0 -4V2.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="0" cy="6" r="1.4" fill="currentColor"/>',
  stop:'<path d="M-4.6 -11H4.6L11 -4.6V4.6L4.6 11H-4.6L-11 4.6V-4.6Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M-5 0H5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>'};
var MO_NAME={goal:"هدف",chance:"فرصة",attack:"هجمة",mistake:"خطأ",stop:"إيقاف"};
function pitchSvg(ic){var s='<svg class="mo-svg" viewBox="0 0 160 100" aria-hidden="true" focusable="false"><rect width="160" height="100" fill="#0c1c16"/>';
  for(var k=0;k<8;k++)s+='<rect x="'+(k*20)+'" width="10" height="100" fill="rgba(255,255,255,.028)"/>';
  s+='<g fill="none" stroke="rgba(214,240,255,.3)" stroke-width="1.2"><rect x="6" y="6" width="148" height="88" rx="2"/><path d="M80 6V94"/><circle cx="80" cy="50" r="13"/><rect x="6" y="28" width="22" height="44"/><rect x="132" y="28" width="22" height="44"/><rect x="6" y="40" width="8" height="20"/><rect x="146" y="40" width="8" height="20"/></g>';
  return s+'<g transform="translate(80 50)"><circle r="19" class="mo-bg"/><g class="mo-ic">'+(MO_IC[ic]||MO_IC.mistake)+'</g></g></svg>'}
// the moment's type, read from its own words (the report has no type field: only for/against)
function moType(m){var w=String(m.what||"");
  if(/هدف|أهداف|الشباك|سجّل|سجل|يسجل|أحرز|إحراز/.test(w))return "goal";
  if(/فرصة|تسديد|انفراد|رأسية|القائم|العارضة/.test(w))return "chance";
  return m.kind==="good"?"attack":"mistake"}
function moArt(ic,time,label){var a=el("span","mo-art");a.innerHTML=pitchSvg(ic);if(label)a.appendChild(el("span","mo-k",label));if(time)a.appendChild(el("span","clip-t",time));return a}
function goalsList(r){var gl=$("#m-goals");if(!gl)return;gl.innerHTML="";var gs=Array.isArray(r.goals)?r.goals:[];
  gs.forEach(function(g){var li=el("li","gl "+(g.team==="player"?"good":g.team==="opponent"?"bad":""));var tm=[];if(g.t)tm.push(arT(g.t));var mn=String(g.minute||"").replace(/['’`]/g,"").trim();if(mn&&!/غير/.test(mn))tm.push("د "+arT(mn));
    li.appendChild(moArt("goal",null,null));var tx=el("span","gl-tx");
    tx.appendChild(el("b",null,(g.team==="player"?"هدف لك":g.team==="opponent"?"هدف عليك":"هدف")+(g.scorer&&!/غير/.test(g.scorer)?" — "+g.scorer:"")));
    if(tm.length)tx.appendChild(el("span","tm",tm.join(" • ")));if(g.how)tx.appendChild(el("small",null,g.how));li.appendChild(tx);gl.appendChild(li)});
  $("#m-goals-sec").hidden=!gs.length;
  // v47: honest count: when the scoreboard says more goals than we found, say so
  var gc=r.goals_check,nt=$("#m-goals-note");if(nt){var short=gc&&gc.expected>gc.found;nt.hidden=!short;if(short)nt.textContent="رصدنا "+gc.found+" من "+gc.expected+" أهداف في هذه المباراة."}}
// v31: mistakes first, then one strength last (old reports too)
function kmOrder(a){a=(a||[]).filter(Boolean);var b=a.filter(function(m){return m.kind!=="good"}),g=a.filter(function(m){return m.kind==="good"});return b.concat(g.slice(0,1))}
function setupClips(j){
  var r=j.result||{},src=(j._reel?(r.key_moments||[]):kmOrder(r.key_moments||[])),ms=src.map(function(m){var mn=String(m.minute||"").replace(/['’`]/g,"").trim();return {t:m.t||(mn&&!/غير/.test(mn)?"د "+mn:""),s:tsec(m.t),kind:m.kind,what:m.what||"",lesson:m.lesson||"",replay:m.replay}});
  CP.ms=ms;(CP.rps||[]).forEach(function(x){try{x&&x.destroy()}catch(e){}});CP.rps=[];
  var box=$("#m-km");box.innerHTML="";var RP=window.R2WReplay;
  ms.forEach(function(m,i){var ic=moType(m),kc=m.kind==="good"?"good":m.kind==="bad"?"bad":"";
    if(!RP){/* the replay script did not load: the v33 drawn card */var b=el("button","clip mo "+kc);b.type="button";b.appendChild(moArt(ic,arT(m.t),MO_NAME[ic]));var tx0=el("span","clip-tx");tx0.appendChild(el("small",null,m.kind==="good"?"لصالحك":m.kind==="bad"?"ضدك":"لحظة"));tx0.appendChild(el("b",null,m.what));if(m.lesson){tx0.appendChild(el("span","mo-more","💡 "+m.lesson));tx0.appendChild(el("span","mo-hint","شرح المدرب"));b.setAttribute("aria-expanded","false")}b.appendChild(tx0);b.addEventListener("click",function(){moToggle(i)});box.appendChild(b);return}
    // v34: each moment is an animated replay — real (from the radar of the player's own clip) or illustrative (always labelled)
    var c=el("div","clip mo rp "+kc);c.setAttribute("role","group");
    var hd=el("div","rp-head");hd.appendChild(el("span","rp-tag",m.kind==="good"?"لصالحك":m.kind==="bad"?"ضدك":"لحظة"));hd.appendChild(el("span","rp-type",MO_NAME[ic]));if(m.t)hd.appendChild(el("span","rp-time",arT(m.t)));c.appendChild(hd);
    var host=el("div","rp-host");c.appendChild(host);
    var R=rpValid(m.replay)?m.replay:RP.illustrate(ic,m.kind,String(j._id||j.job||"")+"|"+i+"|"+m.what);
    try{CP.rps[i]=RP.mount(host,R,{})}catch(e){host.appendChild(moArt(ic,null,null))}
    var tx=el("div","clip-tx");tx.appendChild(el("b",null,m.what));
    if(m.lesson){tx.appendChild(el("span","mo-more","💡 "+m.lesson));var hb=el("button","mo-hint","شرح المدرب");hb.type="button";tx.appendChild(hb);c.setAttribute("aria-expanded","false")}
    c.appendChild(tx);c.addEventListener("click",function(e){if(e.target.closest&&e.target.closest(".rp-wrap"))return;moToggle(i)});box.appendChild(c)});
  $("#m-km-sec").hidden=!ms.length;rpNote(j)}
// a replay is shown as real only when it carries radar coordinates
function rpValid(R){return !!(R&&R.v===1&&R.src==="radar"&&R.n>2&&Array.isArray(R.u)&&R.u.length>=5&&Array.isArray(R.o)&&R.o.length>=5&&Array.isArray(R.b)&&R.b.length===R.n)}
function rpNote(j){var n=$("#m-km-rd");if(!n)return;var ks=((j.result||{}).key_moments||[]).filter(Boolean),real=ks.filter(function(m){return rpValid(m.replay)}).length,tried=ks.some(function(m){return m.replay&&m.replay.v===1});
  if(st.rpBusy===j){n.hidden=false;return}
  if(real){n.hidden=false;n.textContent=real===ks.length?"📡 كل اللحظات معادة من رادار مباراتك":"📡 "+AR(real)+" من "+AR(ks.length)+" لحظات معادة من رادار مباراتك، والباقي محاكاة توضيحية";return}
  if(tried){n.hidden=false;n.textContent="ما قدرنا نقرأ رادار اللعبة في هذا الفيديو، فاللحظات محاكاة توضيحية. فعّل الرادار (الخريطة الصغيرة) في إعدادات الكاميرا لتحصل على إعادة حقيقية";return}
  n.hidden=true;n.textContent=""}
/* v34: positions from the radar of the player's own file, read on this device right after the report arrives.
   Frames are reduced to dot coordinates and discarded; only numbers are kept (in this device's history). */
function maybeRadar(j){var r=j.result||{},ks=r.key_moments||[];
  if(!window.R2WRadar||j.mode!=="match"||j.demo||j._sample||j._hist||!r.valid_clip||!ks.length||!st.file||st.src==="link"||st.src==="clips"||st.rpBusy)return;
  if(!/^video\//.test(st.file.type||"video/"))return;
  var list=ks.map(function(m){return {s:tsec(m&&m.t),kind:m&&m.kind,what:(m&&m.what)||""}});if(!list.some(function(x){return x.s!=null}))return;
  st.rpBusy=j;var n=$("#m-km-rd");if(n){n.hidden=false;n.textContent="📡 نقرأ مواقع اللاعبين من رادار مباراتك…"}
  var file=st.file,t0=Date.now();
  R2WRadar.extract(file,list,{progress:function(p){if(n&&st.rpBusy===j)n.textContent="📡 نقرأ مواقع اللاعبين من رادار مباراتك… "+AR(Math.round(p*100))+"٪"}}).then(function(res){
    ks.forEach(function(m,k){if(!m)return;var R=res&&res.replays&&res.replays[k];m.replay=R?R:{v:1,src:"none"}});
  }).catch(function(){ks.forEach(function(m){if(m&&!m.replay)m.replay={v:1,src:"none"}})}).then(function(){st.rpBusy=null;updHist(j);if(st.last===j)setupClips(j);else rpNote(j)})}
function updHist(j){if(!j._id&&!j._ts)return;var a=hist(),k=-1;a.forEach(function(x,i){if((j._id&&x._id===j._id)||(j._ts&&x._ts===j._ts))k=i});if(k<0)return;a[k].result=JSON.parse(JSON.stringify(j.result));
  for(var t=0;t<6;t++){try{localStorage.setItem(HK,JSON.stringify(a));return}catch(e){/* full: drop the oldest saved replays first */var dropped=false;for(var q=a.length-1;q>0&&!dropped;q--){((a[q].result||{}).key_moments||[]).forEach(function(m){if(m&&m.replay&&m.replay.src==="radar"){delete m.replay;dropped=true}})}if(!dropped)a.pop()}}}
function moToggle(i,force){var c=$$("#m-km .clip")[i];if(!c)return;var on=force!=null?force:!c.classList.contains("open");c.classList.toggle("open",on);if(c.hasAttribute("aria-expanded"))c.setAttribute("aria-expanded",on?"true":"false")}
function unLabel(s){s=String(s);for(var i=0;i<3;i++){var t=s.replace(/^\s*(?:يعالج|يعالِج|يُعالج|يصلح|يُصلح|علاج|لعلاج)\s*[:：\-–]?\s*/,"");if(t===s)break;s=t}return s}
function gtbtn(sec){return el("span","tlink gt off","ث "+AR(sec))}
// v33: a time in the report opens its moment card (with the coach's explanation) instead of playing the video
function tbtn(sec,label){var b=el("button","tlink",label);b.type="button";b.setAttribute("aria-label","اللحظة "+label);b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();seekTo(sec)});return b}
// writes text into box with every mm:ss in it as a tappable time
function timeLinks(box,text){var re=/(\d{1,3}):([0-5]\d)/g,last=0,m;text=String(text||"");
  while((m=re.exec(text))){if(m.index>last)box.appendChild(document.createTextNode(text.slice(last,m.index)));box.appendChild(tbtn((+m[1])*60+(+m[2]),arT(m[0])));last=m.index+m[0].length}
  if(last<text.length)box.appendChild(document.createTextNode(text.slice(last)))}
function seekTo(sec){dtlOpen("r-dtl","km");var k=-1,bd=13;CP.ms.forEach(function(x,n){if(x.s!=null&&Math.abs(x.s-sec)<bd){bd=Math.abs(x.s-sec);k=n}});
  if(k>=0){moToggle(k,true);var c=$$("#m-km .clip")[k];setTimeout(function(){c&&c.scrollIntoView&&c.scrollIntoView({behavior:"smooth",block:"center"})},60);return}
  var s=$("#m-km-sec");s&&s.scrollIntoView&&s.scrollIntoView({behavior:"smooth",block:"center"})}
function mmssC(s){s=Math.max(0,Math.round(s));var m=Math.floor(s/60),x=s%60;return m+":"+(x<10?"0":"")+x}

/* ===== history (this device only) ===== */
var HK="fc_history_v1";
function hist(){try{return JSON.parse(localStorage.getItem(HK)||"[]")}catch(e){return []}}
/* v38: old saved goal-clip reports stay in storage but are not listed */
function histV(){return hist().filter(function(x){return x&&x.mode==="match"})}
function saveHist(j){var a=hist();var o=JSON.parse(JSON.stringify(j));o._ts=Date.now();o._id=String(o._ts);j._ts=o._ts;a.unshift(o);
  while(a.length>20)a.pop();for(var k=0;k<5;k++){try{localStorage.setItem(HK,JSON.stringify(a));break}catch(e){a.pop()}}histBadge()}
function histBadge(){var n=histV().length,b=$("#hist-n");b.hidden=!n;b.textContent=AR(n)}
function renderHist(){var a=histV(),box=$("#hist");box.innerHTML="";$("#hist-empty").hidden=!!a.length;renderJobs(a);
  a.forEach(function(j){var r=j.result||{},b=el("button","hrow");var g=+r.grade;
    var rg=el("span","ring s"+(isFinite(g)&&g<5?" lo":""));rg.style.setProperty("--v",isFinite(g)?Math.round(g*10):0);rg.appendChild(el("b",null,isFinite(g)&&g>0?ARd(g):"⚽"));b.appendChild(rg);
    var tx=el("span","ht");tx.appendChild(el("b",null,r.headline||"تحليل مباراة"));
    var meta="مباراة"+" • "+new Date(j._ts).toLocaleDateString("ar-SA-u-ca-gregory",{day:"numeric",month:"short"})+(r.score?" • "+r.score:"");
    tx.appendChild(el("small",null,meta));b.appendChild(tx);b.appendChild(el("span","arrow","‹"));
    b.addEventListener("click",function(){var o=JSON.parse(JSON.stringify(j));o._hist=true;render(o)});box.appendChild(hItem(b,{job:j.job||null,hid:j._id}))});
  histTools()}
document.querySelector('[data-go="history"]').addEventListener("click",renderHist);
$$('.lnk[data-go="history"]').forEach(function(b){b.addEventListener("click",renderHist)});
// v30: honest label: this clears the copies kept on this device; the reports saved in the account stay
$("#hist-clear").addEventListener("click",function(){if(confirm("حذف النسخ المحفوظة على هذا الجهاز فقط؟ تقاريرك في حسابك تبقى كما هي.")){localStorage.removeItem(HK);histDone("");renderHist();histBadge()}});

/* ===== v40: delete from the ACCOUNT (server) — one analysis («حذف» on its card) or the whole history («حذف السجل من الحساب»).
   Subscription, credits and fair-use are not touched by the server. Device-only clearing above stays as it was. ===== */
var ICDEL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>';
function cfmAsk(t,m,ok){return new Promise(function(res){var d=$("#cfm");$("#cfm-t").textContent=t;$("#cfm-m").textContent=m;$("#cfm-ok").textContent=ok;d.hidden=false;
  var prev=document.activeElement;setTimeout(function(){try{$("#cfm-no").focus()}catch(e){}},30);
  function done(v){d.hidden=true;$("#cfm-ok").onclick=$("#cfm-no").onclick=d.onclick=null;document.removeEventListener("keydown",kd);try{prev&&prev.focus&&prev.focus()}catch(e){}res(v)}
  function kd(e){if(e.key==="Escape")done(false)}
  $("#cfm-ok").onclick=function(){done(true)};$("#cfm-no").onclick=function(){done(false)};d.onclick=function(e){if(e.target===d)done(false)};document.addEventListener("keydown",kd)})}
var hdT=null;function histDone(t){var p=$("#hist-done");if(!p)return;p.textContent=t||"";p.hidden=!t;clearTimeout(hdT);if(t)hdT=setTimeout(function(){p.hidden=true},9000)}
function signedIn(){return !!(ACC&&ACC.token)}
// remove this device's saved copies of the given analyses (history copies, device job list, «seen», current-job pointer)
function dropLocal(ids){if(!ids||!ids.length)return;
  try{var a=hist().filter(function(h){return !(h&&h.job&&ids.indexOf(h.job)>=0)});localStorage.setItem(HK,JSON.stringify(a))}catch(e){}
  try{localStorage.setItem(DJ,JSON.stringify(devJobs().filter(function(x){return ids.indexOf(x.id)<0})))}catch(e){}
  try{localStorage.setItem(SEEN,JSON.stringify(seenSet().filter(function(x){return ids.indexOf(x)<0})))}catch(e){}
  try{var cj=JSON.parse(localStorage.getItem(JK)||"null");if(cj&&ids.indexOf(cj.id)>=0)dropJob()}catch(e){}
  JOBS=JOBS.filter(function(j){return ids.indexOf(j.id)<0});ids.forEach(function(id){hideReady(id)});histBadge()}
function delApi(body){return fetch("/api/jobs/delete",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}).then(function(r){return r.json().catch(function(){return {}}).then(function(j){j._s=r.status;return j})})}
// one card: the row button + a small «حذف» beside it (no delete on an analysis still running)
function hItem(b,o){var w=el("div","hitem");w.appendChild(b);if(o.running)return w;
  var d=el("button","hdel");d.type="button";d.innerHTML=ICDEL;d.appendChild(el("span",null,"حذف"));d.setAttribute("aria-label","حذف هذا التحليل");
  d.addEventListener("click",function(e){e.stopPropagation();delOne(o,w,d)});w.appendChild(d);return w}
function delOne(o,w,d){var acc=signedIn()&&!!o.job;
  cfmAsk("حذف هذا التحليل؟",acc?"سيُحذف هذا التحليل من حسابك نهائيًا على كل الأجهزة. لا يمكن التراجع.":"سيُحذف هذا التحليل من هذا الجهاز.",acc?"حذف نهائي":"حذف").then(function(yes){if(!yes)return;
    function local(){if(o.job)dropLocal([o.job]);if(o.hid){try{localStorage.setItem(HK,JSON.stringify(hist().filter(function(h){return h._id!==o.hid})))}catch(e){}}
      histBadge();w.classList.add("out");setTimeout(renderHist,260)}
    if(!acc)return local();
    d.disabled=true;delApi({id:o.job}).then(function(j){d.disabled=false;
      if(j&&j.ok){local();histDone("تم حذف التحليل من حسابك ✓");return}
      if(j&&j._s===401){alert("انتهت جلستك. سجّل الدخول ثم حاول مرة أخرى.");return}
      alert((j&&j.message)||"تعذّر الحذف الآن، حاول مرة أخرى.")}).catch(function(){d.disabled=false;alert("انقطع الاتصال. تأكد من الإنترنت وحاول مرة أخرى.")})})}
$("#hist-wipe").addEventListener("click",function(){var bt=this;
  cfmAsk("حذف السجل من الحساب","سيتم حذف كل التحليلات من حسابك نهائيًا على كل الأجهزة. لا يمكن التراجع.","حذف نهائي").then(function(yes){if(!yes)return;
    bt.disabled=true;delApi({all:true}).then(function(j){bt.disabled=false;
      if(!j||!j.ok){alert(j&&j._s===401?"انتهت جلستك. سجّل الدخول ثم حاول مرة أخرى.":(j&&j.message)||"تعذّر الحذف الآن، حاول مرة أخرى.");return}
      var keep=JOBS.filter(function(x){return x.state==="running"}).map(function(x){return x.id});
      try{localStorage.removeItem(HK)}catch(e){}
      try{localStorage.setItem(DJ,JSON.stringify(devJobs().filter(function(x){return keep.indexOf(x.id)>=0})))}catch(e){}
      try{localStorage.setItem(SEEN,"[]")}catch(e){}
      JOBS=JOBS.filter(function(x){return x.state==="running"});if(typeof JR!=="undefined")JR=null;hideReady();histBadge();
      histDone(j.running?"تم حذف السجل من حسابك ✓ (التحليل الجاري يبقى حتى يكتمل، ويمكنك حذفه بعدها)":"تم حذف السجل من حسابك ✓");renderHist()})
    .catch(function(){bt.disabled=false;alert("انقطع الاتصال. تأكد من الإنترنت وحاول مرة أخرى.")})})});
// which tools show: device copies → «مسح النسخ من هذا الجهاز فقط»; signed in with anything in the account → «حذف السجل من الحساب»
function histTools(){var dev=histV().length>0,acc=signedIn()&&(dev||JOBS.some(function(j){return j.mode!=="goal"}));
  $("#hist-dev").hidden=!dev;$("#hist-acc").hidden=!acc;$("#hist-tools").hidden=!(dev||acc)}
histBadge();

/* ===== v21: analyses on the server («سجلّي» running / finished, from the account and this device) + «تحليلك جاهز» banner ===== */
var JOBS=[];
function fetchJobs(){var l=devJobs().map(function(x){return x.id});hist().forEach(function(h){if(h&&h.job&&/^[a-f0-9]{32}$/.test(h.job)&&l.indexOf(h.job)<0)l.push(h.job)});var ids=l.slice(0,60).join(",");
  if(!ids&&!ACC.token&&!ACC.owner)return Promise.resolve([]);
  return fetch("/api/jobs?ids="+ids,{cache:"no-store"}).then(function(r){return r.ok?r.json():{jobs:[]}}).then(function(j){JOBS=j.jobs||[];
    if(j.gone&&j.gone.length){dropLocal(j.gone);if(cur()==="history")setTimeout(renderHist,0)}   /* v40: deleted from the account on another device */
    return JOBS}).catch(function(){return JOBS})}
function inHist(id){return hist().some(function(h){return h.job===id})}
function openJob(id){fetch("/api/job?id="+id,{cache:"no-store"}).then(function(r){return r.json()}).then(function(q){
  if(q&&q.state==="done"&&q.result){markSeen(id);q._fromJob=true;render(q);return}
  if(q&&q.state==="running"){setMode(q.mode||"match");return watchJob(id)}
  goHist()}).catch(function(e){try{console.error("openJob",e&&e.message)}catch(x){}goHist()})}
function goHist(){renderHist();show("history")}
function jobLabel(j){return j.headline||"تحليل مباراة"}
// v47: «سجلّي» never says «لا توجد تقارير بعد» while an analysis is starting or running on this device: the running one shows as
// «قيد التحليل» right away (from this page's own state), and the empty note waits for the account's list to arrive
function localRun(){if(st.starting&&!watching)return {id:"_starting",state:"running",created:st.starting,mode:"match",_local:true};
  if(watching&&!st.watchDone)return {id:watching,state:"running",created:st.watchAt||Date.now(),mode:"match",_local:true};return null}
function renderJobs(a){var box=$("#hist-jobs");if(!box)return;var loaded=false;$("#hist-empty").hidden=true;
  function paint(){box.innerHTML="";var list=JOBS.filter(function(j){return !inHist(j.id)&&j.mode!=="goal"});
    var lr=localRun();if(lr&&!list.some(function(j){return j.id===lr.id}))list.unshift(lr);
    box.hidden=!list.length;$("#hist-empty").hidden=!!(list.length||(a&&a.length))||!loaded;
    list.forEach(function(j){var b=el("button","hrow job "+j.state),g=+j.grade;
      var rg=el("span","ring s"+(j.state==="running"?" spin":""));rg.style.setProperty("--v",j.state==="done"&&isFinite(g)?Math.round(g*10):0);
      rg.appendChild(el("b",null,j.state==="done"&&isFinite(g)&&g>0?ARd(g):j.state==="error"?"!":"⚽"));b.appendChild(rg);
      var tx=el("span","ht");tx.appendChild(el("b",null,j.state==="running"?"جارٍ التحليل…":jobLabel(j)));
      var d=new Date(j.created).toLocaleDateString("ar-SA-u-ca-gregory",{day:"numeric",month:"short"});
      var stt=j.state==="running"?(j.parts>1?"الجزء "+AR(Math.min(j.parts,(j.done||0)+1))+" من "+AR(j.parts):"قيد التحليل"):j.state==="done"?"جاهز ✓":"لم يكتمل — لم يُحتسب عليك";
      var sm=el("small",null,"مباراة"+" • "+d+" • ");sm.appendChild(el("span","st-"+j.state,stt));tx.appendChild(sm);b.appendChild(tx);
      if(j.state!=="error")b.appendChild(el("span","arrow","‹"));
      if(j.state!=="error")b.addEventListener("click",function(){if(j._local&&j.id==="_starting"){show("processing");return}openJob(j.id)});box.appendChild(hItem(b,{job:j.id,running:j.state==="running"}))});
    if(typeof histTools==="function")histTools()}
  paint();fetchJobs().then(function(){loaded=true;paint()},function(){loaded=true;paint()})}
// banner on (re)opening the site: the newest finished analysis not opened yet, or the one still running
var readyPoll=null;
function hideReady(id){var b=$("#ready-bar");if(b&&(!id||b.dataset.job===id))b.hidden=true}
function showReady(j){var b=$("#ready-bar");if(!b)return;b.dataset.job=j.id;b.className="ready-bar "+j.state;
  $("#rb-t").textContent=j.state==="done"?"تحليلك جاهز ✓":"تحليلك قيد التحليل…";
  $("#rb-s").textContent=j.state==="done"?jobLabel(j):"يمكنك إغلاق الصفحة، وسننبّهك هنا عندما يجهز";
  $("#rb-go").textContent=j.state==="done"?"افتح التقرير":"تابع";b.hidden=false}
function readyCheck(){fetchJobs().then(function(list){var seen=seenSet(),wk=Date.now()-3*86400000;
  var done=list.filter(function(j){return j.mode!=="goal"&&j.state==="done"&&seen.indexOf(j.id)<0&&!inHist(j.id)&&(j.finished||j.created)>wk})[0];
  var run=list.filter(function(j){return j.state==="running"&&j.id!==watching})[0];
  if(done)showReady(done);else if(run)showReady(run);else hideReady();
  clearTimeout(readyPoll);if(run&&!done)readyPoll=setTimeout(readyCheck,15000);
  if(cur()==="history")renderHist()})}
$("#rb-go").addEventListener("click",function(){var id=$("#ready-bar").dataset.job;if(id)openJob(id)});
$("#rb-x").addEventListener("click",function(){var id=$("#ready-bar").dataset.job;var b=$("#ready-bar");if(b.classList.contains("done"))markSeen(id);else{hideReady();clearTimeout(readyPoll)}});
setTimeout(function(){var q=new URLSearchParams(location.search).get("job");if(q&&/^[a-f0-9]{32}$/.test(q)){addDevJob(q);try{history.replaceState(history.state,"",location.pathname)}catch(e){}openJob(q)}else readyCheck()},600);

/* ===== v21: optional web push «تحليلك جاهز» (only where the browser supports it; iPhone: after adding the site to the home screen) ===== */
function pushOk(){return "serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window&&Notification.permission!=="denied"}
function u8(b64){var p="=".repeat((4-b64.length%4)%4),s=atob((b64+p).replace(/-/g,"+").replace(/_/g,"/")),o=new Uint8Array(s.length);for(var i=0;i<s.length;i++)o[i]=s.charCodeAt(i);return o}
function pushOffer(id){var b=$("#p-push");if(!b)return;b.hidden=!pushOk();b.disabled=false;b.dataset.job=id;
  b.textContent=window.Notification&&Notification.permission==="granted"?"✓ سننبّهك عندما يجهز":"🔔 نبّهني أول ما يجهز";
  if(window.Notification&&Notification.permission==="granted")subPush(id).catch(function(){})}
async function subPush(id){var reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription();
  if(!s){var k=await fetch("/api/push/key").then(function(r){return r.json()});s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(k.key)})}
  await fetch("/api/push/sub",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sub:s.toJSON?s.toJSON():s,job:id})});return true}
$("#p-push").addEventListener("click",async function(){var b=this;b.disabled=true;
  try{var p=await Notification.requestPermission();if(p!=="granted"){b.textContent="لم يُفعَّل التنبيه، وستجد التقرير في «سجلّي»";return}
    await subPush(b.dataset.job);b.textContent="✓ سننبّهك عندما يجهز"}catch(e){b.textContent="تعذّر تفعيل التنبيه، وستجد التقرير في «سجلّي»"}});

/* splash */
window.addEventListener("load",function(){setTimeout(function(){var s=$("#splash");if(s){s.classList.add("out");setTimeout(function(){s.remove()},700)}},650)});

var h=(location.hash||"").slice(1);
// v20: the first entry of a visit is always home, so a deep link's back button lands on home instead of leaving the site
{try{history.replaceState({s:"home",d:(history.state&&history.state.d)||0},"",location.pathname+location.search+(h==="sample"||h==="account"||h==="pricing"||h==="history"||h==="auth"?"":location.hash))}catch(e){}}
if(h==="pricing")show("pricing");if(h==="history"){renderHist();show("history")}
// v47: a link to /#history (or #pricing, #account) opened while the site is already open only changes the address's hash: open that screen
window.addEventListener("hashchange",function(){var k=(location.hash||"").slice(1);
  if(k==="history"){if(cur()!=="history"){renderHist();show("history","replace")}}
  else if(k==="pricing"){if(cur()!=="pricing")openPricing()}
  else if(k==="account"){if(cur()!=="account"){if(ACC.user||ACC.owner)openAccount();else openAuth("login")}}});if(h==="auth")openAuth(hadAcct()?"login":"signup");if(h==="sample")window.addEventListener("load",function(){setTimeout(function(){render(JSON.parse(JSON.stringify(SAMPLE)))},50)});

/* ===== v22: monthly by card (auto-renewal, cancel), renewal reminder, «رحلتي», rating, leaderboard, share card ===== */
var CO=null,JR=null,LBT="top";
function sar(n){return EN(n)+" ريال"}
// v47 (Mishal's spec): the payment-method choice comes first, two options of the same size, on every device.
// Monthly: card (auto-renews, the embedded form) or Apple Pay (one month, Moyasar's secure page, no renewal).
// One-time (3-match pack, yearly): Apple Pay first only where the device supports it (canApplePay), else card; both go to Moyasar's secure page.
var COK=null;
function coPick(m){COK.m=m;$$("#co-pick .co-opt").forEach(function(b){var on=b.dataset.m===m;b.classList.toggle("on",on);b.setAttribute("aria-checked",on?"true":"false")});
  $("#co-p-apple").hidden=m!=="apple";$("#co-p-card").hidden=m!=="card";coMsg("")}
function coSetup(o){COK=o;var s=$("#co-sum");s.innerHTML="";
  $("#co-h").textContent=o.title;
  var top=el("div","co-price");top.appendChild(el("b",null,sar(o.amount)));top.appendChild(el("span",null," "+o.per));s.appendChild(top);
  if(o.note)s.appendChild(el("p","co-note",o.note));
  if(o.test)s.appendChild(el("p","co-test","وضع تجريبي: الدفع حاليًا ببطاقات الاختبار فقط ولا يُخصم مبلغ حقيقي."));
  var pick=$("#co-pick"),oc=pick.querySelector('[data-m="card"]'),oa=pick.querySelector('[data-m="apple"]');
  if(o.appleFirst)pick.insertBefore(oa,oc);else pick.insertBefore(oc,oa);
  $("#co-opt-card-s").textContent=o.cardSub;$("#co-opt-ap-s").textContent=o.apSub;$("#co-ap-line").textContent=o.apLine;
  $("#co-why").hidden=!o.renews;$("#co-f").hidden=!o.renews;$("#co-renew").hidden=!o.renews;$("#co-card-hosted").hidden=!!o.renews;
  $("#co-card-fine").textContent=o.renews?"بيانات بطاقتك تذهب مباشرة إلى بوابة الدفع المرخّصة ولا تمر على خوادمنا. تحفظ البوابة البطاقة للتجديد الشهري فقط، ويمكنك إلغاء التجديد من «حسابي» في أي وقت قبل موعده.":"تنتقل لصفحة الدفع الآمنة لبوابة ميسّر (مدى، فيزا، ماستركارد). بيانات بطاقتك لا تمر على خوادمنا.";
  $("#co-card-hosted").textContent="ادفع بالبطاقة "+sar(o.amount);$("#co-ap-note").textContent="تنتقل لصفحة الدفع الآمنة لبوابة ميسّر وتدفع بـ Apple Pay"+(o.renews?"، ونذكّرك قبل انتهاء المدة.":".");
  coPick(o.appleFirst||canApplePay()?"apple":"card");$("#co-err").hidden=true;show("checkout")}
function openCheckout(c){CO=c;
  coSetup({product:"pro_month",renews:true,title:"الاشتراك الشهري",amount:c.amount,per:c.amount<c.renew?"أول شهر":"لمدة 30 يومًا",test:c.test,
    note:"ثم "+sar(c.renew)+" شهريًا بالبطاقة",
    cardSub:"يتجدد تلقائيًا كل شهر، وتقدر تلغيه متى ما بغيت",apSub:"ادفع شهر واحد، بدون تجديد تلقائي",apLine:"شهر واحد، بدون تجديد تلقائي"});
  $("#co-renew").textContent="ثم "+sar(c.renew)+" كل 30 يومًا تلقائيًا من نفس البطاقة. يمكنك إلغاء التجديد من «حسابي» في أي وقت، ويبقى اشتراكك فعّالًا حتى نهاية المدة.";
  $("#co-go").textContent="ادفع "+sar(c.amount);$("#co-go").disabled=false}
function openOneTime(product){var pk=product==="pack3",n=+(PRAW&&(pk?PRAW.pack3:PRAW.pro_year))||+(pk?CONFIG.price.pack3:CONFIG.price.proYear);
  coSetup({product:product,renews:false,appleFirst:canApplePay(),title:pk?"باقة 3 مباريات":"الاشتراك السنوي",amount:n,per:pk?"دفعة واحدة":"لسنة كاملة، دفعة واحدة",
    note:pk?"3 تحليلات مباريات كاملة، بدون اشتراك ولا تجديد":"سنة كاملة بدفعة واحدة، بدون تجديد تلقائي",
    cardSub:"دفعة واحدة، بدون تجديد",apSub:"دفعة واحدة، بدون تجديد",apLine:"دفعة واحدة، بدون تجديد تلقائي"})}
function canApplePay(){try{return !!(window.ApplePaySession&&ApplePaySession.canMakePayments&&ApplePaySession.canMakePayments())}catch(e){return false}}
$$("#co-pick .co-opt").forEach(function(b){b.addEventListener("click",function(){coPick(b.dataset.m)})});
$("#co-num").addEventListener("input",function(){var v=this.value.replace(/\D/g,"").slice(0,19);this.value=v.replace(/(.{4})/g,"$1 ").trim()});
$("#co-exp").addEventListener("input",function(){var v=this.value.replace(/\D/g,"").slice(0,4);this.value=v.length>2?v.slice(0,2)+"/"+v.slice(2):v});
function coHosted(b){var h=b.innerHTML;b.disabled=true;var p=COK?COK.product:"pro_month";
  buy(p,null,p==="pro_month",true);setTimeout(function(){b.disabled=false;b.innerHTML=h},6000)}
$("#co-apple").addEventListener("click",function(){ev("pay_apple");coHosted(this)});
$("#co-card-hosted").addEventListener("click",function(){ev("pay_card_hosted");coHosted(this)});
// v46: the card goes to the payment gateway as JSON (not a raw form post), so a typo or a declined card is an Arabic message here
// instead of the gateway's English error page; the bank's verification step (3-D Secure) is still the gateway's own page.
function coFail(msg,fresh){var er=$("#co-err"),go=$("#co-go");er.textContent=msg;er.hidden=false;go.disabled=false;go.textContent="ادفع "+sar(CO?CO.amount:0);
  // an intent is single-use: after a decline (or an expired session) a new one is made quietly for the next try
  if(fresh&&CO){go.disabled=true;fetch("/api/pay/create",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({product:"pro_month"})})
    .then(function(r){return r.json()}).then(function(j){if(j.card){CO=j.card;go.textContent="ادفع "+sar(CO.amount)}go.disabled=false}).catch(function(){go.disabled=false})}}
function coErrText(j){var e=(j&&j.errors)||{},k=Object.keys(e).join(" ");
  if(/number/.test(k))return "رقم البطاقة غير صحيح، تأكد منه";
  if(/month|year/.test(k))return "تاريخ الانتهاء غير صحيح";
  if(/cvc/.test(k))return "رمز الأمان غير صحيح";
  if(/name/.test(k))return "اكتب الاسم كما على البطاقة (الاسم الأول والأخير)";
  return "تعذّر إكمال الدفع: "+((j&&j.message)||"تحقق من بيانات البطاقة")}
$("#co-f").addEventListener("submit",function(e){e.preventDefault();var er=$("#co-err");er.hidden=true;
  if(!CO){openPricing();return}
  var name=$("#co-name").value.trim(),num=$("#co-num").value.replace(/\D/g,""),ex=$("#co-exp").value.split("/"),cvc=$("#co-cvc").value.replace(/\D/g,"");
  var bad=name.length<2?"اكتب الاسم كما على البطاقة":num.length<15?"رقم البطاقة غير مكتمل":!(+ex[0]>=1&&+ex[0]<=12&&(ex[1]||"").length===2)?"اكتب تاريخ الانتهاء MM/YY":cvc.length<3?"اكتب رمز الأمان":"";
  if(bad){er.textContent=bad;er.hidden=false;return}
  var go=$("#co-go");go.disabled=true;go.textContent="لحظة…";var c=CO;
  fetch("https://api.moyasar.com/v1/payment_intents/"+encodeURIComponent(c.intent)+"/fulfill",{method:"POST",
    headers:{"content-type":"application/json",accept:"application/json",authorization:"Basic "+btoa(c.pk+":")},
    body:JSON.stringify({client_secret:c.secret,source:{type:"creditcard",name:name,number:num,month:String(+ex[0]),year:"20"+ex[1],cvc:cvc,save_card:true},metadata:{pid:c.pid}})})
  .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {s:r.status,j:j}})})
  .then(function(x){var j=x.j||{};
    if(x.s===201||x.s===200){var src=j.source||{};
      if(j.status==="initiated"&&src.transaction_url){$("#co-cvc").value="";$("#co-num").value="";location.href=src.transaction_url;return}
      if(j.status==="paid"||j.status==="authorized"||j.status==="captured"){location.href="/api/pay/return/"+encodeURIComponent(c.pid)+"?id="+encodeURIComponent(j.id)+"&status="+j.status;return}
      coFail("رُفضت البطاقة"+(src.message?" ("+src.message+")":"")+". جرّب بطاقة أخرى"+(canApplePay()?" أو Apple Pay":""),true);return}
    if(j.type==="intent_not_fulfillable"){coFail("انتهت جلسة الدفع، اضغط «ادفع» مرة ثانية",true);return}
    if(j.type==="validation_error"){coFail(coErrText(j),false);return}
    coFail("تعذّر إكمال الدفع"+(j.message?" ("+j.message+")":"")+"، حاول مرة ثانية",j.type==="invalid_client_secret")})
  .catch(function(){coFail("تعذّر الاتصال ببوابة الدفع، تأكد من الإنترنت وحاول مرة ثانية",false)})});
function daysLeft(u){return u&&u.pro_until?Math.ceil((u.pro_until*1000-Date.now())/86400000):0}
function paintSub(){var u=ACC.user,s=u&&u.sub,row=$("#ac-renew-row"),b=$("#ac-renew"),cx=$("#ac-cancel");if(!row)return;
  var pro=!!u&&u.plan==="pro";row.hidden=!pro&&!(s&&s.status==="failed");cx.hidden=!(s&&s.status==="active");
  if(s&&s.status==="active")b.textContent="تلقائي "+fmtDate(s.next_at)+" • "+sar(s.amount)+(s.last4?" • •••• "+AR(s.last4):"");
  else if(s&&s.status==="failed")b.textContent="تعذّر التجديد — جدّد يدويًا";
  else if(s&&s.status==="canceled")b.textContent="ملغى — لن يُخصم شيء";
  else b.textContent="بدون تجديد تلقائي";
  $("#jr-btn").hidden=!u;
  // reminder: ends within 3 days with nothing renewing it, or the card renewal did not go through
  var bar=$("#renew-bar"),dl=daysLeft(u),show_=false;
  if(u&&s&&s.status==="active"&&s.fails>0){show_=true;$("#rn-t").textContent="تعذّر تجديد اشتراكك";$("#rn-s").textContent="سنحاول مرة أخرى غدًا، أو جدّد الآن"}
  else if(u&&s&&s.status==="failed"&&!pro){show_=true;$("#rn-t").textContent="انتهى اشتراكك";$("#rn-s").textContent="لم يكتمل التجديد التلقائي. جدّد لتكمل رحلتك"}
  else if(pro&&!(s&&s.status==="active")&&dl<=3){show_=true;$("#rn-t").textContent="اشتراكك ينتهي "+(dl<=1?"خلال يوم":dl===2?"خلال يومين":"خلال "+AR(dl)+" أيام");$("#rn-s").textContent="جدّد حتى لا تتوقف رحلتك"}
  var dis=sessionStorage.getItem("fc_rn_x")===String(u&&u.pro_until);bar.hidden=!show_||dis}
$("#rn-go").addEventListener("click",function(){openPricing()});
$("#rn-x").addEventListener("click",function(){try{sessionStorage.setItem("fc_rn_x",String(ACC.user&&ACC.user.pro_until))}catch(e){}$("#renew-bar").hidden=true});
$("#ac-cancel").addEventListener("click",function(){var u=ACC.user;if(!u)return;
  if(!confirm("إلغاء التجديد التلقائي؟ يبقى اشتراكك فعّالًا حتى "+fmtDate(u.pro_until)+"، ولن يُخصم منك شيء بعدها."))return;
  fetch("/api/sub/cancel",{method:"POST"}).then(function(r){return r.json()}).then(function(j){if(j.user){ACC.user=j.user;paintAcct()}var m=$("#ac-msg");m.className="paymsg ok";m.textContent="✓ ألغينا التجديد التلقائي. اشتراكك فعّال حتى "+fmtDate(ACC.user.pro_until)+".";m.hidden=false}).catch(function(){})});
$("#ac-jr").addEventListener("click",function(){show("journey")});
$("#jr-btn").addEventListener("click",function(){show("journey")});

/* «رحلتي» */
var ST={up:["تحسّن ✅","up"],best:["ممتاز ✅","up"],same:["ثابت","same"],down:["تراجع","down"],unknown:["غير واضح","unk"]};
function num(v){return v==null?"؟":AR(v)}
function metName(k){return JR&&JR.meta.metrics[k]?JR.meta.metrics[k].ar:k}
function thm(t){return JR&&JR.meta.themes[t]||{ar:t,icon:"",levels:[]}}
function lvlName(t,l){var x=thm(t).levels[l];return x||""}
function lockCard(msg){var d=el("div","jr-lock");d.appendChild(el("span","lk","🔒"));d.appendChild(el("b",null,msg||"المستوى التالي مقفل"));
  var b=el("button","btn primary sm","اشترك لتكمل رحلتك");b.addEventListener("click",function(){openPricing()});d.appendChild(b);return d}
function goalCard(g){if(g.locked){var c=el("div","jr-goal locked");var h=el("div","jg-h");h.appendChild(el("span","ic",thm(g.theme).icon));h.appendChild(el("b",null,thm(g.theme).ar+" • المستوى "+AR(g.level+1)));c.appendChild(h);c.appendChild(lockCard());return c}
  var c=el("div","jr-goal"),h=el("div","jg-h");h.appendChild(el("span","ic",thm(g.theme).icon));var t=el("div");t.appendChild(el("b",null,g.name));t.appendChild(el("small",null,thm(g.theme).ar+" • المستوى "+AR(g.level+1)+" من ٣"));h.appendChild(t);c.appendChild(h);
  var up=JR.meta.metrics[g.metric].up;
  c.appendChild(el("p","jg-m","نعدّ: "+metName(g.metric)));
  var nums=el("div","jg-n");nums.appendChild(el("span",null,"آخر مباراة: "+num(g.now)));
  nums.appendChild(el("span","tg",g.target==null?"عدّها في مباراتك القادمة":g.target===0&&!up?"هدفك: ولا مرة":"هدفك: "+AR(g.target)+(up?" أو أكثر":" أو أقل")));c.appendChild(nums);
  c.appendChild(el("p","jg-tip","💡 "+g.tip));
  var dots=el("div","jg-dots");for(var i=0;i<2;i++)dots.appendChild(el("i",i<g.streak?"on":""));dots.appendChild(el("small",null,"تحسّن متتالي "+AR(g.streak)+" من ٢ للإتقان"));c.appendChild(dots);return c}
function cmpRow(x,i,entry){var r=el("div","jr-cmp s-"+(ST[x.status]||ST.unknown)[1]);
  if(x.locked){r.appendChild(el("b",null,thm(x.theme).ar+" • مستوى مقفل 🔒"));return r}
  var top=el("div","jc-t");top.appendChild(el("b",null,x.name));top.appendChild(el("span","jc-s",(ST[x.status]||ST.unknown)[0]));r.appendChild(top);
  r.appendChild(el("small",null,metName(x.metric)));
  var n=el("div","jc-n");n.appendChild(el("span",null,num(x.before)));n.appendChild(el("i",null,"←"));n.appendChild(el("b",null,num(x.after)));r.appendChild(n);
  if(x.mastered){r.appendChild(el("p","jc-m","🏅 أتقنته! تحسّنت مباراتين متتاليتين"))}
  if(x.status==="up"||x.status==="best"){var sb=el("button","btn ghost sm","🖼️ شارك بطاقة تحسّن");sb.addEventListener("click",function(){shareCard(x,entry)});r.appendChild(sb)}
  return r}
function chartSvg(entries,metrics){var W=340,Hh=170,pl=26,pr=12,pt=14,pb=26,n=entries.length,cols=["#2bc8ff","#1a7fff","#ffc048"];
  var ns="http://www.w3.org/2000/svg",svg=document.createElementNS(ns,"svg");svg.setAttribute("viewBox","0 0 "+W+" "+Hh);svg.setAttribute("class","jr-svg");svg.setAttribute("role","img");svg.setAttribute("aria-label","رسم تقدّمك عبر المباريات");
  function E(t,a,tx){var e=document.createElementNS(ns,t);for(var k in a)e.setAttribute(k,a[k]);if(tx!=null)e.textContent=tx;svg.appendChild(e);return e}
  var mx=1;metrics.forEach(function(m){entries.forEach(function(e){var v=e.metrics[m];if(v!=null&&v>mx)mx=v})});mx=Math.ceil(mx*1.15);
  var X=function(i){return n<2?(pl+W-pr)/2:pl+(W-pl-pr)*i/(n-1)},Y=function(v){return pt+(Hh-pt-pb)*(1-v/mx)};
  for(var g=0;g<=2;g++){var yv=Math.round(mx*g/2);E("line",{x1:pl,x2:W-pr,y1:Y(yv),y2:Y(yv),stroke:"#223042","stroke-width":1});E("text",{x:pl-6,y:Y(yv)+4,fill:"#93a3b8","font-size":10,"text-anchor":"end"},AR(yv))}
  entries.forEach(function(e,i){E("text",{x:X(i),y:Hh-8,fill:"#93a3b8","font-size":10,"text-anchor":"middle"},"م"+AR(i+1))});
  metrics.forEach(function(m,k){var pts=[];entries.forEach(function(e,i){var v=e.metrics[m];if(v!=null)pts.push([X(i),Y(v),v])});
    if(pts.length>1)E("polyline",{points:pts.map(function(p){return p[0].toFixed(1)+","+p[1].toFixed(1)}).join(" "),fill:"none",stroke:cols[k],"stroke-width":2.5,"stroke-linejoin":"round","stroke-linecap":"round"});
    pts.forEach(function(p){E("circle",{cx:p[0],cy:p[1],r:3.5,fill:cols[k]});E("text",{x:p[0],y:p[1]-7,fill:cols[k],"font-size":10,"text-anchor":"middle","font-weight":700},AR(p[2]))})});
  return svg}
function ratingCard(r,tier){var c=el("div","jr-rate");var big=el("div","rt-big");big.appendChild(el("small",null,"تقييم RP"));big.appendChild(el("b",null,r.now==null?"–":AR(r.now)));
  if(r.delta!=null&&r.delta!==0)big.appendChild(el("span","rt-d "+(r.delta>0?"up":"down"),(r.delta>0?"▲":"▼")+AR(Math.abs(r.delta))));else if(r.delta===0)big.appendChild(el("span","rt-d","= بدون تغيير"));
  c.appendChild(big);var subs=el("div","rt-subs");r.subs.forEach(function(s){var row=el("div","rs");row.appendChild(el("span",null,s.name));var bar=el("i");var f=el("u");f.style.width=(s.score||0)+"%";bar.appendChild(f);row.appendChild(bar);row.appendChild(el("b",null,s.score==null?"–":AR(s.score)));subs.appendChild(row)});c.appendChild(subs);
  c.appendChild(el("small","rt-note","من ٩٩. مبني على آخر ٥ مباريات رفعتها، ويرتفع كل ما تحسّنت أرقامك وأتقنت مستوى."));return c}
function sec(t,sub){var s=el("div","jr-sec");var h=el("h3",null,t);if(sub)h.appendChild(el("small","h-sub"," "+sub));s.appendChild(h);return s}
function loadJourney(){var b=$("#jr-body");if(!ACC.user){b.innerHTML="";var e=el("div","empty");e.appendChild(el("b",null,"سجّل دخولك لترى رحلتك"));var bt=el("button","btn primary","دخول");bt.addEventListener("click",function(){st.afterAuth=function(){show("journey")};openAuth("login")});e.appendChild(bt);b.appendChild(e);return}
  fetch("/api/journey",{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){if(!j.ok){b.textContent=j.message||"تعذّر التحميل";return}JR=j;paintJourney()}).catch(function(){b.textContent="تعذّر الاتصال، تأكد من الإنترنت"})}
function paintJourney(){var j=JR,b=$("#jr-body"),full=j.tier==="full",n=j.n;b.innerHTML="";
  if(!n){var e=el("div","empty");e.appendChild(el("b",null,"رحلتك تبدأ بأول مباراة"));e.appendChild(el("span",null,"حلّل مباراة كاملة، ونعطيك هدفين لمباراتك القادمة مرتبطين بأرقام نعدّها من الفيديو."));var bt=el("button","btn primary","حلّل مباراتك");bt.addEventListener("click",function(){start("match")});e.appendChild(bt);b.appendChild(e);return}
  var last=j.entries[n-1];
  if(j.rating)b.appendChild(ratingCard(j.rating,j.tier));
  // level + weekly streak (subscribers)
  var chips=el("div","jr-chips");
  if(full){var lvl=j.levels.reduce(function(a,x){return a+x.level},0);chips.appendChild(el("span","chip","🏆 مستواك: "+AR(lvl+1)));chips.appendChild(el("span","chip","🔥 سلسلة "+arCount(j.streak.weeks||0,"أسبوع واحد","أسبوعان","أسابيع","أسبوعًا")));chips.appendChild(el("span","chip","⚽ "+arCount(n,"مباراة واحدة","مباراتان","مباريات","مباراة")))}
  else{chips.appendChild(el("span","chip","⚽ "+arCount(n,"مباراة واحدة","مباراتان","مباريات","مباراة")));chips.appendChild(el("span","chip lock","🔒 مستواك"));chips.appendChild(el("span","chip lock","🔒 سلسلة الأسابيع"))}
  b.appendChild(chips);
  // comparison with the previous match
  var s1=sec("آخر مقارنة",n>1?"مباراة "+AR(n)+" مقابل "+AR(n-1):"");
  if(n<2)s1.appendChild(el("p","jr-p","ارفع مباراتك القادمة، وسنقارن أرقامك بهذه المباراة."));
  else{last.cmp.forEach(function(x,i){s1.appendChild(cmpRow(x,i,last))});last.unlocked.forEach(function(u){var d=el("div","jr-unl"+(u.locked?" lk":""));d.appendChild(el("b",null,u.locked?"🔒 انفتح لك مستوى جديد في "+thm(u.theme).ar+"، وهو للمشتركين":"🔓 انفتح المستوى "+AR(u.level+1)+": "+u.name));s1.appendChild(d)})}
  b.appendChild(s1);
  // goals for the next match
  var s2=sec("أهدافك للمباراة القادمة");last.goals.forEach(function(g){s2.appendChild(goalCard(g))});b.appendChild(s2);
  // chart across all matches
  var ms=[];(n>1?last.cmp:[]).concat(last.goals).forEach(function(g){if(g.metric&&!g.locked&&ms.indexOf(g.metric)<0&&ms.length<2)ms.push(g.metric)});
  if(ms.length){var s3=sec("تقدّمك عبر المباريات");s3.appendChild(chartSvg(j.entries,ms));var lg=el("div","jr-lg");ms.forEach(function(m,k){var x=el("span","k"+k);x.textContent=metName(m);lg.appendChild(x)});s3.appendChild(lg);b.appendChild(s3)}
  // levels per theme
  var s4=sec("المستويات");
  if(full){j.levels.forEach(function(l){var t=thm(l.theme),r=el("div","jr-lv"+(l.active?" act":""));r.appendChild(el("span","ic",t.icon));var tx=el("div");tx.appendChild(el("b",null,t.ar+(l.done?" • أتقنته كله 🏅":"")));
    var st_=el("div","lv-steps");t.levels.forEach(function(nm,i){st_.appendChild(el("span",i<l.level?"done":i===l.level&&!l.done&&l.active?"now":"",(i<l.level?"✓ ":"")+nm))});tx.appendChild(st_);r.appendChild(tx);s4.appendChild(r)})}
  else{var pv=el("div","jr-lv blur");pv.appendChild(el("span","ic","⚡"));var tx2=el("div");tx2.appendChild(el("b",null,"الضغط"));tx2.appendChild(el("div","lv-steps","الضغط بعد فقد الكرة ← مصايد الضغط ← التحوّل السريع"));pv.appendChild(tx2);s4.appendChild(pv);s4.appendChild(lockCard("المستويات وسلسلة الأسابيع للمشتركين"))}
  b.appendChild(s4);
  // leaderboard + nickname
  var s5=sec("قائمة المتصدرين");var lb=el("button","btn ghost","🏅 افتح قائمة المتصدرين");lb.addEventListener("click",function(){show("leaders")});s5.appendChild(lb);
  var why=j.lb&&j.lb.why;if(why==="sub")s5.appendChild(el("p","jr-p","🔒 اشترك لتدخل القائمة. تقييمك يظهر لك هنا."));else if(why==="few")s5.appendChild(el("p","jr-p","تظهر في القائمة بعد ٣ مباريات محللة (عندك "+AR(j.lb.n)+")."));
  var nf=el("div","jr-nick");nf.appendChild(el("label",null,"اسمك في القائمة (مستعار)"));var ni=el("input","inp");ni.type="text";ni.maxLength=16;ni.placeholder="مثلًا: صقر_الوسط";ni.value=j.profile.nick||"";nf.appendChild(ni);
  var hl=el("label","chk");var hc=el("input");hc.type="checkbox";hc.checked=!!j.profile.hide;hl.appendChild(hc);hl.appendChild(document.createTextNode(" أخفني من القائمة"));nf.appendChild(hl);
  var sv=el("button","btn ghost sm","حفظ");var nm=el("small","nk-m");sv.addEventListener("click",function(){fetch("/api/profile",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({nick:ni.value,hide:hc.checked})}).then(function(r){return r.json()}).then(function(x){nm.textContent=x.ok?"✓ حُفظ":(x.message||"تعذّر الحفظ");if(x.ok){JR.profile=x.profile}})});
  nf.appendChild(sv);nf.appendChild(nm);s5.appendChild(nf);b.appendChild(s5);
  if(!full){var cta=el("div","jr-cta");cta.appendChild(el("b",null,"كمّل رحلتك"));cta.appendChild(el("span",null,"المستويات، سلسلة الأسابيع، الأهداف الجديدة بعد الإتقان، وقائمة المتصدرين."));var cb=el("button","btn primary","اشترك لتكمل رحلتك");cb.addEventListener("click",function(){openPricing()});cta.appendChild(cb);b.appendChild(cta)}
}
/* the journey block under a match report: this match against the one before it, and the two goals for the next one */
function reportJourney(j){var box=$("#r-jr");box.hidden=true;box.innerHTML="";var id=j&&(j.job||j.id);if(!ACC.user||!id||j._sample||j.demo||j.mode==="goal")return;
  fetch("/api/journey",{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(x){if(!x||!x.ok)return;JR=x;var i=-1;x.entries.forEach(function(e,k){if(e.job===id)i=k});if(i<0)return;var e=x.entries[i];
    box.appendChild(el("h3",null,"📈 رحلة التحسن"));
    if(i>0){box.appendChild(el("small","h-sub","مقارنة بمباراتك السابقة"));e.cmp.forEach(function(c,k){box.appendChild(cmpRow(c,k,e))})}
    else box.appendChild(el("p","jr-p","هذه أول مباراة في رحلتك. ارفع القادمة وسنقارن أرقامك."));
    box.appendChild(el("b","jr-nx","هدفاك للمباراة القادمة:"));e.goals.forEach(function(g){box.appendChild(goalCard(g))});
    var ob=el("button","btn ghost","افتح رحلتي ‹");ob.addEventListener("click",function(){show("journey")});box.appendChild(ob);box.hidden=false;
    if(st.last!==j)return;var hv=x.rating&&x.rating.hist?x.rating.hist[i]:null;st.r2w=hv!=null?hv:null;paintRing(j);paneOn("r-dtl","jr",1);tabsBuild("r-dtl",$("#r-dtl").dataset.cur)}).catch(function(){})}
var _render1=render;render=function(j){_render1(j);try{reportJourney(j)}catch(e){}};

/* leaderboard */
function loadLeaders(){var ol=$("#lb-list"),me=$("#lb-me");ol.innerHTML="";me.hidden=true;
  $$(".lb-seg button").forEach(function(b){b.classList.toggle("on",b.dataset.lb===LBT)});
  fetch("/api/leaderboard?tab="+LBT,{cache:"no-store"}).then(function(r){return r.json()}).then(function(j){ol.innerHTML="";
    if(!j.rows.length)ol.appendChild(el("li","lb-empty",LBT==="month"?"لم يتحسن أحد هذا الشهر بعد. حلّل مباراتك القادمة وقد تكون الأول هنا.":"لا يوجد لاعبون في القائمة بعد. حلّل ٣ مباريات واختر اسمًا مستعارًا لتكون من أوائل المتصدرين."));
    j.rows.forEach(function(r){var li=el("li",r.me?"me":"");li.appendChild(el("span","rk",AR(r.rank)));li.appendChild(el("b","nk",r.nick));
      li.appendChild(el("span","sc",LBT==="month"?(r.month>0?"▲"+AR(r.month):r.month<0?"▼"+AR(-r.month):"="):AR(r.rating)));li.appendChild(el("small","nn",arCount(r.n,"مباراة واحدة","مباراتان","مباريات","مباراة")));ol.appendChild(li)});
    var m=j.me;if(m){me.hidden=false;me.innerHTML="";
      if(m.rank)me.appendChild(el("b",null,"ترتيبك: "+AR(m.rank)+" من "+AR(j.total)));
      else if(m.why==="sub"){me.appendChild(el("b",null,"تقييمك يظهر في «رحلتي»"));me.appendChild(lockCard("اشترك لتدخل القائمة"))}
      else if(m.why==="few")me.appendChild(el("b",null,"تدخل القائمة بعد ٣ مباريات محللة (عندك "+AR(m.n)+")"));
      else if(m.why==="nick"){me.appendChild(el("b",null,"اختر اسمك المستعار من «رحلتي» لتظهر في القائمة"));var g=el("button","btn ghost sm","اختر اسمك");g.addEventListener("click",function(){show("journey")});me.appendChild(g)}
      else if(m.why==="hidden")me.appendChild(el("b",null,"أنت مخفي من القائمة (يمكنك تغيير ذلك من «رحلتي»)"));
      else me.appendChild(el("b",null,LBT==="month"?"ليست لديك مباريات هذا الشهر بعد":"لست في القائمة حاليًا"))}
  }).catch(function(){ol.innerHTML="";ol.appendChild(el("li","lb-empty","تعذّر الاتصال، تأكد من الإنترنت"))})}
$$(".lb-seg button").forEach(function(b){b.addEventListener("click",function(){LBT=b.dataset.lb;loadLeaders()})});

/* «بطاقة تحسّن»: our own card, drawn here and saved as a PNG (no game logos) */
function shareCard(x,entry){var cv=document.createElement("canvas"),W=1080,Hh=1350;cv.width=W;cv.height=Hh;var g=cv.getContext("2d");
  var bg=g.createLinearGradient(0,0,W,Hh);bg.addColorStop(0,"#0b2440");bg.addColorStop(.55,"#0a0e14");bg.addColorStop(1,"#0f2a3b");g.fillStyle=bg;g.fillRect(0,0,W,Hh);
  g.strokeStyle="rgba(43,200,255,.55)";g.lineWidth=6;roundRect(g,40,40,W-80,Hh-80,48);g.stroke();
  g.direction="ltr";g.textAlign="center";g.fillStyle="#eef3f8";g.font="italic 800 64px ReplayWM, Plex, sans-serif";g.fillText("Replay",W/2,200);
  g.fillStyle="#2bc8ff";g.font="700 30px Plex, sans-serif";g.fillText("RP",W/2,248);
  g.direction="rtl";g.fillStyle="#eef3f8";g.font="700 64px Plex, sans-serif";g.fillText("بطاقة تحسّن",W/2,350);
  g.fillStyle="#93a3b8";g.font="600 40px Plex, sans-serif";g.fillText(x.name,W/2,420);
  g.font="400 32px Plex, sans-serif";g.fillText(metName(x.metric),W/2,475);
  // before → after
  g.direction="ltr";g.font="700 190px Plex, sans-serif";g.fillStyle="#93a3b8";g.fillText(AR(x.before),W*0.72,760);g.fillStyle="#2bc8ff";g.fillText(AR(x.after),W*0.28,760);
  g.font="700 90px Plex, sans-serif";g.fillStyle="#eef3f8";g.fillText("←",W/2,730);
  g.direction="rtl";g.font="600 34px Plex, sans-serif";g.fillStyle="#93a3b8";g.fillText("قبل",W*0.72,830);g.fillStyle="#2bc8ff";g.fillText("بعد",W*0.28,830);
  g.fillStyle="#2bc8ff";g.font="700 60px Plex, sans-serif";g.fillText(x.mastered?"🏅 أتقنته":"تحسّن ✅",W/2,970);
  if(JR&&JR.rating&&JR.rating.now!=null){g.fillStyle="#eef3f8";g.font="600 40px Plex, sans-serif";g.fillText("تقييم RP: "+AR(JR.rating.now),W/2,1060)}
  g.fillStyle="#93a3b8";g.font="400 28px Plex, sans-serif";g.fillText("مقارنة بين مباراتين من مبارياتي",W/2,1150);
  g.direction="ltr";g.fillStyle="#1a7fff";g.font="600 30px Plex, sans-serif";g.fillText(location.host,W/2,1230);
  var img=new Image();img.onload=function(){try{g.drawImage(img,W/2-45,70,90,90)}catch(e){}done()};img.onerror=done;img.src="logo.svg?v=17";
  var fin=false;function done(){if(fin)return;fin=true;cv.toBlob(function(bl){if(!bl)return;var f=new File([bl],"r2w-progress.png",{type:"image/png"});
    if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:"Replay"}).catch(function(){dl(bl)})}else dl(bl)},"image/png")}
  function dl(bl){var a=document.createElement("a");a.href=URL.createObjectURL(bl);a.download="r2w-progress.png";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},4000)}
  setTimeout(done,1500);window.__r2wCard=cv}
if("serviceWorker" in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
})();

/* ===== v14: motion landing — hero video, autoplay-when-visible demos, reveal, counters ===== */
(function(){
  var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SD=navigator.connection&&navigator.connection.saveData;
  var still=RM||SD;
  // v31: one video at a time, and only the one on screen. The hero (fixed page background) counts as on screen while
  // the home page's top section is in view; a demo plays when at least half of it shows. Posters show at once; with
  // reduced motion or data saver no video is ever loaded (poster only).
  var hv=document.querySelector(".hv-v"),hvBox=document.querySelector(".hv"),homeEl=document.getElementById("home");
  var slow=navigator.connection&&/(^|-)2g$/.test(navigator.connection.effectiveType||"");if(slow)still=true;
  var items=[];
  if(hv){var wide=window.matchMedia&&matchMedia("(min-aspect-ratio: 1/1)").matches;
    hv.poster=wide?"hero-h.jpg?v=16":"hero-v.jpg?v=16";hv.removeAttribute("autoplay");
    if(hvBox)items.push({v:hv,el:hvBox,src:wide?"m/hero-h.mp4?v=31":"m/hero-v.mp4?v=31",need:.2,r:0});
    hv.addEventListener("playing",function(){hv.classList.add("on")},{once:true})}
  var vids=[].slice.call(document.querySelectorAll("video.lazyv"));
  vids.forEach(function(v){v.removeAttribute("autoplay");items.push({v:v,el:v,src:v.dataset.src,need:.5,r:0})});
  window.__r2wMedia=items;
  if(!("IntersectionObserver" in window)){document.querySelectorAll(".reveal").forEach(function(e){e.classList.add("in")});return}
  function pick(){var best=null,home=homeEl&&homeEl.classList.contains("active");
    if(!still&&home&&!document.hidden)items.forEach(function(it){if(it.r>=it.need&&(!best||it.r>best.r))best=it});
    items.forEach(function(it){var v=it.v;
      if(it===best){if(!v.getAttribute("src")&&it.src){v.preload="auto";v.src=it.src}if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){})}}
      else if(!v.paused)v.pause()})}
  window.__r2wPick=pick;
  if(!still){var vo=new IntersectionObserver(function(es){es.forEach(function(e){for(var i=0;i<items.length;i++)if(items[i].el===e.target)items[i].r=e.isIntersecting?e.intersectionRatio:0});pick()},{threshold:[0,.2,.35,.5,.65,.8,1]});
    items.forEach(function(it){vo.observe(it.el)});
    document.addEventListener("visibilitychange",pick);window.addEventListener("popstate",function(){setTimeout(pick,60)});
    document.addEventListener("click",function(){setTimeout(pick,120)});
    if(window.MutationObserver&&homeEl)new MutationObserver(function(){setTimeout(pick,30)}).observe(homeEl,{attributes:true,attributeFilter:["class"]})}
  var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target);
    e.target.querySelectorAll("[data-count]").forEach(count)}})},{threshold:.15,rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".reveal").forEach(function(e){ro.observe(e)});
  function ar(n){return String(n).replace(/\d/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[d]})}
  function count(b){var to=+b.dataset.count;if(still||!to){b.textContent=ar(to);return}var t0=null,D=1300;
    function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);b.textContent=ar(Math.round(to*e));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
  var caps=[["١٤:٠٢","مساحة مفتوحة خلف الدفاع","good"],["١٤:٠٤","المدافع خرج من مكانه","bad"],["١٤:٠٦","تسديدة على المرمى","good"]],ci=0;
  var cap=document.querySelector(".scr-cap");
  if(cap&&!still)setInterval(function(){if(document.hidden)return;ci=(ci+1)%caps.length;var c=caps[ci],tx=cap.querySelector(".scr-txt");tx.style.opacity=0;
    setTimeout(function(){cap.querySelector(".scr-t").textContent=c[0];tx.textContent=c[1];cap.className="scr-cap "+c[2];tx.style.opacity=1},300)},2600);
})();


/* ===== v18: full-page motion background (fixed hero loop + light particles) ===== */
(function(){
  var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dim=document.querySelector(".pg-dim"),hvb=document.querySelector(".hv"),raf=0;
  function upd(){raf=0;var home=document.getElementById("home").classList.contains("active");var hh=hvb?hvb.offsetHeight:600;
    var k=home?Math.min(1,Math.max(0,(window.scrollY-hh*0.25)/(hh*0.6))):1;if(dim)dim.style.opacity=String(0.18+0.6*k)}
  window.addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(upd)},{passive:true});
  window.addEventListener("popstate",function(){setTimeout(upd,30)});document.addEventListener("click",function(){setTimeout(upd,60)});upd();
  var cv=document.getElementById("fx");if(!cv||RM||!cv.getContext)return;
  var g=cv.getContext("2d"),W=0,H=0,P=[],last=0,run=true,t0=performance.now();
  // v31: the particle layer stops while the page scrolls (it sits over the background video) and runs lighter on phones
  var coarse=window.matchMedia&&matchMedia("(pointer:coarse)").matches,scrollT=0;
  window.addEventListener("scroll",function(){scrollT=performance.now()},{passive:true});
  window.addEventListener("touchmove",function(){scrollT=performance.now()},{passive:true});
  function size(){W=cv.width=Math.round(innerWidth);H=cv.height=Math.round(innerHeight);var n=Math.round(Math.min(coarse?24:46,Math.max(coarse?12:18,W*H/(coarse?40000:26000))));P=[];
    for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.18,vy:-(.08+Math.random()*.22),r:.6+Math.random()*1.6,h:Math.random()<.6?"43,200,255":"25,195,255",a:.25+Math.random()*.45})}
  size();window.addEventListener("resize",size);
  document.addEventListener("visibilitychange",function(){run=!document.hidden;if(run)requestAnimationFrame(fr)});
  function fr(ts){if(!run)return;requestAnimationFrame(fr);if(ts-last<(coarse?50:33))return;if(ts-scrollT<220)return;last=ts;
    g.clearRect(0,0,W,H);var t=(ts-t0)/1000;
    // two slow HUD scan lines
    for(var s=0;s<2;s++){var y=((t*18+s*H/2)%(H+80))-40;var gr=g.createLinearGradient(0,y-30,0,y+2);gr.addColorStop(0,"rgba(43,200,255,0)");gr.addColorStop(1,"rgba(43,200,255,.05)");g.fillStyle=gr;g.fillRect(0,y-30,W,32)}
    for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(p.y<-6){p.y=H+6;p.x=Math.random()*W}if(p.x<-6)p.x=W+6;if(p.x>W+6)p.x=-6;
      g.beginPath();g.fillStyle="rgba("+p.h+","+(p.a*(.55+.45*Math.sin(t*1.3+i)))+")";g.arc(p.x,p.y,p.r,0,6.283);g.fill()}
    g.lineWidth=.6;for(var a=0;a<P.length;a++)for(var b=a+1;b<P.length;b++){var dx=P[a].x-P[b].x,dy=P[a].y-P[b].y,d=dx*dx+dy*dy;if(d<9000){g.strokeStyle="rgba(25,195,255,"+(.10*(1-d/9000))+")";g.beginPath();g.moveTo(P[a].x,P[a].y);g.lineTo(P[b].x,P[b].y);g.stroke()}}}
  requestAnimationFrame(fr);
})();
