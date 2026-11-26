
/* ============================================================
   Replay — طبقة خلفية تجريبية (Demo backend)
   تعترض كل طلبات /api/* وترجع بيانات واقعية محفوظة في المتصفح.
   بدون سيرفر حقيقي: يكفي python3 -m http.server
   ============================================================ */
(function(){
  "use strict";
  var TPL = {"demo": false, "mode": "match", "video": true, "_sample": true, "_reel": [7, 21, 35, 49, 63], "result": {"valid_clip": true, "style": "تعتمد على أسلوب هجومي سريع ومباشر في التحولات، مستغلًا دقة التمرير البيني والإنهاء الحاسم أمام المرمى. في المقابل، يغلب على أسلوبك الدفاعي الاندفاع الفردي باللاعبين لقطع الكرة مما يترك مساحات في عمق منطقتك.", "recurring_mistakes": ["الاندفاع بقلب الدفاع أو لاعب الارتكاز نحو حامل الكرة وترك مساحات شاغرة في عمق منطقة الجزاء.", "ضعف الرقابة على العرضيات والتغطية العكسية مما سمح للخصم بالتعادل في الدقائق الأخيرة.", "التسرع في التمرير بمنتصف الملعب تحت ضغط الخصم وارتكاب تدخلات خشنة نلت عليها بطاقات."], "pre_match": {"formation": "٤-٣-١-٢ أو ٤-١-٢-١-٢ ضيقة لتعزيز الكثافة في الوسط والاعتماد على ثنائية هجومية سريعة.", "defensive_style": "دفاع متوازن (Balanced) وتجنب الضغط المستمر حتى لا تتفكك خطوطك الخلفية.", "width_depth": "أنزل خط الدفاع قليلًا لتفادي الكرات البينية، وضيّق العرض لحماية عمق الملعب.", "build_up": "بناء لعب متوازن مع تمرير مباشر وسريع نحو ثنائي الهجوم لاستغلال المساحات.", "notes": "اضبط هذه الخيارات مسبقًا في خطتك الأساسية من قائمة التكتيكات لضمان ثبات الدفاع.", "why": ["لعبك من العمق بتمريرات بينية، فالتشكيلة الضيقة تضع لاعبين أكثر قرب حامل الكرة.", "تستقبل من عمق منطقتك بعد اندفاع المدافع، فارتكاز إضافي يغطي هذه المساحة.", "مرتداتك السريعة تحتاج مهاجمَين متقاربين بدل جناحين بعيدين."]}, "player_instructions": [{"pos": "قلبا الدفاع", "ins": "البقاء في الخلف أثناء الهجوم وعدم الخروج من الخط للحفاظ على عمق الدفاع وتفادي الانفرادات."}, {"pos": "الظهيران", "ins": "البقاء في الخلف أثناء الهجوم لمنع الاختراقات السريعة وتأمين العرضيات العكسية."}, {"pos": "الارتكاز", "ins": "تغطية المنتصف والبقاء في الخلف أثناء الهجوم لحماية المساحة أمام قلبي الدفاع."}, {"pos": "الوسط", "ins": "التوازن الدفاعي وتغطية الأطراف لمساعدة الظهيرين عند تقدم الخصم."}, {"pos": "المهاجم", "ins": "البقاء في العمق والاختراق خلف المدافعين لاستغلال سرعة وإنهاء مالين المميز."}], "in_game": ["دافع بوضعية الاحتواء (L2) بدل الاندفاع المباشر بطلب الكرة بالتدخل الخشن.", "استخدم ضغط الزميل (R1) فقط لتضييق زاوية التمرير، وتحكّم يدويًا بلاعب التغطية لإغلاق مسار التسديد.", "بدّل إلى لاعب الارتكاز وليس إلى قلبي الدفاع عندما يبني الخصم هجمته على حدود منطقة الجزاء.", "أنزل خطوط فريقك قليلًا عندما يتقدم الخصم بكثافة على الأطراف لمنع العرضيات الخطيرة."], "game_plans": {"behind": "اضبط خطة هجومية على سهم الهجوم: خط دفاع أعلى قليلًا، اندفاع أكثر للأمام، وضغط قوي بعد فقدان الكرة للتعويض السريع.", "ahead": "اضبط خطة دفاعية على سهم الدفاع: إنزال خط الدفاع، بقاء كامل الرباعي الخلفي ولاعب الارتكاز في الخلف لحماية النتيجة.", "when": "اضبطها قبل المباراة على الأسهم من قائمة التكتيكات؛ انتقل للدفاعية بعد الدقيقة ٧٥ عند تقدمك، واستخدم الهجومية فور التأخر."}, "practice": ["التدريب على الدفاع الفردي بـL2 وضبط المسافة مع المهاجم دون الضغط على زر التدخل سريعًا.", "التمرن على التغطية العكسية للكرات العرضية والتبديل السريع بالعصا اليمنى (القير اليمين) للمدافع البعيد.", "التمرير الهادئ والخروج الآمن بالكرة تحت الضغط في الثلث الأخير دون تسرع."], "grade": 7.5, "headline": "اضبط اندفاع دفاعك بالعمق، فالهجوم لديك رائع وحاسم.", "assignment": {"title": "الانضباط الدفاعي وعدم سحب قلبي الدفاع", "how": "في مباراتك القادمة، لا تتحكم أبدًا بقلب الدفاع لقطع الكرة خارج منطقة الجزاء. استخدم لاعب الوسط الدفاعي فقط لتعطيل الهجمة بالاحتواء L2 حتى يعود الفريق لمراكزه."}, "ratings": [{"area": "الدفاع", "score": 6.5, "note": "تلقيت أهدافًا سهلة بسبب الاندفاع الفردي وترك مساحات في التغطية العكسية."}, {"area": "الهجوم واستغلال الفرص", "score": 9, "note": "فعالية استثنائية أمام المرمى وإنهاء متقن لمعظم الفرص المتاحة عبر مالين."}, {"area": "التمرير وبناء اللعب", "score": 7.5, "note": "تمريرات بينية حاسمة في الهجوم، ولكن حدث تسرع وفقدان غير مبرر في الوسط أحيانًا."}, {"area": "التمركز وشكل الفريق", "score": 6.5, "note": "فراغات واضحة بين خط الوسط والدفاع استغلها الخصم في صناعة الخطورة."}, {"area": "القرارات تحت الضغط", "score": 7, "note": "ردة فعل ذهنية قوية في الأشواط الإضافية، رغم بعض التراخي واستقبال أهداف متأخرة."}], "strengths": ["حسم هجومي مذهل وترجمة شبه تامة للفرص داخل منطقة الجزاء.", "سرعة استعادة التوازن والرد الفوري بتسجيل الأهداف بعد تلقي الشباك لأي هدف.", "رؤية ممتازة في الثلث الهجومي الأخير عبر التمرير البيني الأرضي الدقيق."], "drills": [{"name": "تحدي الدفاع الفردي (Jockey)", "minutes": 15, "how": "في وضع التدريب، واجه المهاجم باستخدام زر L2 فقط دون الضغط على زر التدخل O. حافظ على مسافة مترين لمنع المراوغة وغلق زاوية التسديد.", "fixes": "يعالج الاندفاع العشوائي لقلبي الدفاع الذي تسبب في استقبال أول هدفين."}, {"name": "الدفاع ضد العرضيات والكرات الساقطة", "minutes": 10, "how": "العب مباراة ودية ضد الكمبيوتر مع التركيز على التبديل بالعصا اليمنى (القير اليمين) للمدافع في القائم البعيد. قم بتشتيت العرضيات دون سحب الحارس مبكرًا.", "fixes": "يصلح خطأ استقبال هدف التعادل الثالث في الدقيقة ٨٢ الناتج عن غياب التغطية العكسية."}, {"name": "الخروج بالكرة تحت الضغط", "minutes": 10, "how": "تمرن في سيناريو تدريبي على تدوير الكرة بين رباعي الدفاع ومحور الارتكاز بلمستين كحد أقصى. مرر دائمًا للاعب الخالي من الرقابة دون استعجال الهجوم المباشر.", "fixes": "يعالج فقدان الكرة في خط الوسط ونيل البطاقات الصفراء بسبب الاحتكاكات المتسرعة."}], "score": "KMI ٥ - ٤ BOC (بعد أشواط إضافية)", "key_moments": [{"t": "04:28", "kind": "bad", "what": "اندفاع متهور في العمق الدفاعي سمح لمهاجم الخصم بالمراوغة وإحراز هدف التعادل.", "lesson": "تمهل في التدخل واستعمل وضعية الاحتواء الدفاعي L2 لتأخير المهاجم."}, {"t": "05:00", "kind": "good", "what": "رد هجومي سريع ومباشر بانفراد لمالين أنهاه بتسديدة متقنة في الشباك.", "lesson": "استمرار التركيز المباشر بعد تلقي الأهداف يصدم الخصم ويعيدك للمقدمة."}, {"t": "12:24", "kind": "bad", "what": "استقبال هدف التعادل الثالث في اللحظات الأخيرة من كرة عرضية دون رقابة عكسية.", "lesson": "تغطية القائم البعيد وتشتيت العرضيات بتركيز يمنعان عودة الخصم في الأوقات القاتلة."}, {"t": "15:19", "kind": "good", "what": "تمريرة بينية رائعة يترجمها مالين لهدف التقدم الرابع في مستهل الشوط الإضافي.", "lesson": "التمرير الأرضي السريع في عمق دفاع الخصم يضمن الفعالية وصناعة الفرص المحققة."}, {"t": "19:53", "kind": "bad", "what": "استقبال هدف متأخر قلص الفارق نتيجة التراخي الدفاعي في الدقيقة الأخيرة.", "lesson": "اليقظة الدفاعية واجبة حتى إطلاق صافرة النهاية لتجنب أي مفاجآت."}], "play_read": {"current_formation": "4-4-2", "build_up": "تمرير مباشر وسريع نحو المهاجمين بعد استعادة الكرة، وتمريرات بينية كثيرة.", "attack": "يهاجم من العمق غالبًا بتمريرة بينية، وعرضياته قليلة.", "press": "يندفع فرديًا بقلب الدفاع أو الارتكاز لقطع الكرة.", "forward": "يتقدم بأربعة لاعبين في المرتدة، ولعبه سريع جدًا.", "loses_ball": "في منتصف الملعب عند التسرع بالتمرير تحت الضغط.", "danger": "من عمق المنطقة بعد اندفاع المدافع، ومن العرضيات المتأخرة."}}};

  // ---------- تخزين محلي ----------
  var K="demo_db_v2";
  function db(){ try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return {}} }
  function save(d){ try{localStorage.setItem(K,JSON.stringify(d))}catch(e){} }
  function now(){ return Math.floor(Date.now()/1000); }
  function hex32(){ var s="",h="0123456789abcdef"; for(var i=0;i<32;i++) s+=h[(Math.random()*16)|0]; return s; }
  function ad(n){ return String(n).replace(/[0-9]/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[+d];}); }
  function pick(a){ return a[(Math.random()*a.length)|0]; }

  // ---------- المستخدم التجريبي ----------
  function freshUser(email){
    return { email: email||"demo@replay.app", plan:"pro", pro_until: now()+86400*365,
             credits: 3, used30: 0, nick:"", name:"لاعب" };
  }
  function getUser(){ var d=db(); return d.user||null; }
  function setUser(u){ var d=db(); d.user=u; save(d); }

  // ---------- مخزن الوظائف/التقارير ----------
  function jobs(){ var d=db(); return d.jobs||{}; }
  function putJob(j){ var d=db(); d.jobs=d.jobs||{}; d.jobs[j.job]={job:j.job,result:j.result,mode:j.mode,video:j.video,_ts:Date.now()}; save(d); }
  function getJob(id){ return jobs()[id]||null; }
  function delJobs(ids){ var d=db(); d.jobs=d.jobs||{}; ids.forEach(function(i){delete d.jobs[i];}); save(d); }

  // يضيف الوظيفة لقائمة الجهاز حتى يظهر «سجلّي» (نفس مفتاح app.js)
  var DJ="fc_jobs_v21";
  function addDevJob(id){
    var a=[]; try{a=JSON.parse(localStorage.getItem(DJ)||"[]")}catch(e){}
    a=a.filter(function(x){return x.id!==id}); a.unshift({id:id,t:Date.now()}); a=a.slice(0,30);
    try{localStorage.setItem(DJ,JSON.stringify(a))}catch(e){}
  }

  // ---------- توليد تقرير متنوّع ----------
  var HEADS=[
    "اضبط اندفاع دفاعك بالعمق، فالهجوم لديك رائع وحاسم.",
    "لعبك الهجومي مرعب، لكن خط دفاعك يحتاج انضباطًا أكثر.",
    "قراراتك تحت الضغط هي الفرق — اهدأ في الثلث الأخير.",
    "تمركزك ممتاز، بقي أن تُنهي الفرص التي صنعتها.",
    "أنت قريب جدًا من مستوى أعلى، نقطة واحدة تفصلك."
  ];
  var ASG=[
    {title:"الانضباط الدفاعي وعدم سحب قلبي الدفاع", how:"في مباراتك القادمة لا تتحكم بقلب الدفاع لقطع الكرة خارج المنطقة. استخدم الارتكاز بالاحتواء L2 حتى يعود الفريق لمراكزه."},
    {title:"الهدوء في بناء اللعب", how:"لا تتسرع بالتمرير تحت الضغط. مرّر للخلف وافتح زاوية جديدة بدل المخاطرة في الوسط."},
    {title:"استغلال التحولات السريعة", how:"فور استعادة الكرة، ابحث عن التمريرة البينية الأولى نحو المهاجم قبل أن يرتب الخصم دفاعه."}
  ];
  var OPPS=["BOC","RMA","FCB","PSG","LIV","MCI","JUV","DOR","ATM","INT"];

  function genJob(team, mode){
    var j=JSON.parse(JSON.stringify(TPL));
    delete j._sample; j.demo=false; j.locked=false; j.video=true; j.mode=mode||"match";
    var r=j.result;
    var g=Math.round((5.5+Math.random()*3.5)*2)/2; r.grade=g;
    var t=(team&&String(team).trim())?String(team).trim().slice(0,8).toUpperCase():"YOU";
    var a=(Math.random()*5)|0, b=(Math.random()*5)|0;
    r.score=t+" "+ad(a)+" - "+ad(b)+" "+pick(OPPS);
    r.headline=pick(HEADS);
    r.assignment=pick(ASG);
    if(Array.isArray(r.ratings)) r.ratings=r.ratings.map(function(x){
      var s=Math.max(4,Math.min(10, x.score+(Math.random()*2-1)));
      return {area:x.area, score:Math.round(s*2)/2, note:x.note};
    });
    j.job=hex32();
    return j;
  }

  // ---------- متصدرون تجريبيون ----------
  function leaders(tab){
    var base=[
      {nick:"أبو ستّة",rating:9.2,n:18,month:3},
      {nick:"الصقر",rating:8.8,n:24,month:1},
      {nick:"كينغ",rating:8.5,n:12,month:4},
      {nick:"المايسترو",rating:8.3,n:31,month:-1},
      {nick:"طارق",rating:8.0,n:9,month:2},
      {nick:"HBK",rating:7.8,n:15,month:0},
      {nick:"الجنرال",rating:7.6,n:21,month:5},
      {nick:"زيكو",rating:7.4,n:7,month:-2}
    ];
    if(tab==="month") base=base.slice().sort(function(x,y){return y.month-x.month;});
    var rows=base.map(function(x,i){ return {rank:i+1,nick:x.nick,rating:x.rating,n:x.n,month:x.month,me:false}; });
    return {rows:rows, me:null};
  }

  // ---------- ردود المدرّب ----------
  var COACH=[
    "من تقريرك، أكبر فرصة لك هي الانضباط الدفاعي: جرّب الاحتواء L2 بدل التدخل المباشر، وستلاحظ أنك تستقبل أهدافًا أقل بكثير.",
    "لاحظت أن أغلب أخطائك تبدأ من التسرع في الوسط. خذ لمسة إضافية، ومرّر للطرف المفتوح بدل المخاطرة في العمق.",
    "هجومك ممتاز بالفعل. لو ضبطت خط دفاعك قليلًا للخلف بعد الدقيقة ٧٥ ستحافظ على النتائج التي تصنعها.",
    "ركّز على مهمتك الواحدة لهذه المباراة فقط. تحسّن جانب واحد كل مباراة أفضل من محاولة إصلاح كل شيء مرة واحدة."
  ];

  // ---------- أدوات الرد ----------
  function J(obj,status){ return new Response(JSON.stringify(obj),{status:status||200,headers:{"content-type":"application/json; charset=utf-8"}}); }
  function body(opt){ try{ if(opt&&opt.body) return JSON.parse(opt.body); }catch(e){} return {}; }
  function qp(u,k){ try{ return new URL(u, location.origin).searchParams.get(k); }catch(e){ return null; } }

  function route(path, u, opt){
    var d, b=body(opt);
    switch(true){
      case path==="/api/status":
        return J({live:true, free: !db().freeUsed});
      case path==="/api/me":
        return J({user:getUser()});
      case path==="/api/auth/logout":
        setUser(null); try{localStorage.removeItem("fc_tok")}catch(e){} return J({ok:true});
      case path==="/api/auth/delete-account":
        localStorage.removeItem(K); try{localStorage.removeItem(DJ)}catch(e){} return J({ok:true});
      case path.indexOf("/api/auth/")===0:
        // signup / login — أي بريد وكلمة مرور
        if(!b.email||!b.password) return J({ok:false,message:"اكتب بريدك وكلمة المرور"},400);
        var u=getUser(); if(!u||u.email!==b.email) u=freshUser(b.email);
        setUser(u); return J({ok:true, token:"demo-"+hex32(), user:u});
      case path==="/api/free/claim":
        d=db(); d.freeUsed=true; save(d); return J({ok:true});
      case path==="/api/video/start":
        return J({},409); // ادفع المسار نحو استخراج اللقطات
      case path==="/api/yt/check":
        return J({ok:true, duration:720, title:"مباراتك على يوتيوب"});
      case path==="/api/analyze": {
        var job=genJob(b.team, b.mode); putJob(job); addDevJob(job.job);
        var us=getUser(); if(us && us.plan!=="pro" && us.credits>0){ us.credits-=1; us.used30=(us.used30||0)+1; setUser(us);} 
        else if(us){ us.used30=(us.used30||0)+1; setUser(us); }
        return J(job);
      }
      case path==="/api/job/start": {
        var job2=genJob(b.team, b.mode); putJob(job2); addDevJob(job2.job);
        return J({job:job2.job, state:"queued"});
      }
      case path==="/api/job": {
        var id=qp(u,"id"); var jb=getJob(id);
        if(!jb){ jb=genJob("", "match"); jb.job=id||jb.job; putJob(jb); }
        return J({state:"done", job:jb.job, mode:jb.mode, video:true, result:jb.result, _reel:[7,21,35,49,63]});
      }
      case path==="/api/jobs": {
        var ids=(qp(u,"ids")||"").split(",").filter(Boolean);
        var all=jobs(), out=[];
        ids.forEach(function(i){ if(all[i]) out.push({job:i, result:all[i].result, mode:all[i].mode||"match", video:true}); });
        return J({jobs:out, gone:[]});
      }
      case path==="/api/jobs/delete":
        delJobs((b.ids)||[]); return J({ok:true});
      case path==="/api/journey":
        return J({ok:true, n:0});
      case path==="/api/leaderboard":
        return J(leaders(qp(u,"tab")||"top"));
      case path==="/api/chat":
        return J({answer: pick(COACH), left: 7});
      case path==="/api/profile":
        d=db(); if(d.user){ d.user.nick=b.nick||""; save(d);} return J({ok:true});
      case path==="/api/pay/create": {
        var us2=getUser()||freshUser(); 
        if(/pack/.test(b.product||"")) us2.credits=(us2.credits||0)+3;
        else { us2.plan="pro"; us2.pro_until=now()+86400*365; }
        setUser(us2); return J({ok:true, user:us2});
      }
      case path==="/api/pay/verify":
      case path==="/api/pay/owner-grant": {
        var us3=getUser()||freshUser(); us3.plan="pro"; us3.pro_until=now()+86400*365; setUser(us3);
        return J({ok:true, user:us3});
      }
      case path==="/api/sub/cancel": {
        var us4=getUser(); if(us4){ us4.canceled=true; setUser(us4);} return J({ok:true, user:us4});
      }
      case path==="/api/feedback": return J({ok:true});
      case path==="/api/ev": return J({ok:true});
      case path==="/api/push/key": return J({key:null});
      case path==="/api/push/sub": return J({ok:true});
      default:
        return J({ok:true});
    }
  }

  var _fetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function(url, opt){
    var u = (typeof url==="string") ? url : (url && url.url) || "";
    var path = u.split("?")[0].replace(location.origin,"");
    if(path.indexOf("/api/")===0){
      try{ return Promise.resolve(route(path, u, opt)); }
      catch(e){ return Promise.resolve(J({ok:true})); }
    }
    return _fetch ? _fetch(url, opt) : Promise.reject(new Error("no fetch"));
  };

  // أوقف تسجيل خدمة العامل (sw) حتى لا يتعارض مع الوضع التجريبي
  if("serviceWorker" in navigator){
    navigator.serviceWorker.getRegistrations&&navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();});}).catch(function(){});
  }
})();
