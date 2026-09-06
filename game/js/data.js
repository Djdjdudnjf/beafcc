/* ============================================================
   data.js — محتوى اللعبة: الأقاليم، الأبطال، الأعداء، البطاقات، السجل
   ============================================================ */
(function (root) {
  'use strict';
  var MAL = root.MAL || (root.MAL = {});

  /* ---------------------------------------------------------
     أيقونات SVG (مسارات بخط رفيع تُرسم داخل viewBox 24)
     --------------------------------------------------------- */
  var ICONS = {
    sword:   'M4 20l3-3M6.5 17.5L17 7l3-3-1 4-10 10zM8 16l-3 1 1-3',
    speed:   'M3 12h9M6 8h8M6 16h6M15 6l5 6-5 6',
    boot:    'M8 3v9l-3 3v6h14v-4c0-3-3-3-5-5l-2-2V3z',
    heart:   'M12 20s-7-4.6-7-9.3A4 4 0 0112 8a4 4 0 017 2.7C19 15.4 12 20 12 20z',
    arrows:  'M4 12h9M13 8l4 4-4 4M4 5h6M4 19h6',
    drop:    'M12 3s5 6 5 10a5 5 0 11-10 0c0-4 5-10 5-10z',
    flame:   'M12 21c3.3 0 6-2.4 6-5.5 0-4-4-5.5-3-10.5-3 1.5-5 4-5 6.5 0 1-1 1.5-1.6.6C7 10 6 11.6 6 15.5 6 18.6 8.7 21 12 21z',
    bounce:  'M3 17c3-6 6-6 9 0s6 6 9 0M6 8h.01M18 8h.01',
    eye:     'M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z M12 14.2A2.2 2.2 0 1012 9.8a2.2 2.2 0 000 4.4z',
    lion:    'M12 3l2.5 3H19l-1.5 3.5L19 13l-3 1-1 4-3-2-3 2-1-4-3-1 1.5-3.5L5 6h4.5z',
    vamp:    'M6 4h12l-2 8-4 8-4-8z M9 8h6',
    burst:   'M12 12l8-3-6 6 3 8-5-6-8 3 6-6-3-8z',
    wind:    'M3 8h11a3 3 0 10-3-3M3 13h14a3 3 0 11-3 3M3 18h8',
    blade:   'M20 4L9 15l-4 1 1-4L17 1M9 15l3 3',
    coin:    'M12 21a9 9 0 100-18 9 9 0 000 18zM9 9.5h6M9 14.5h6M12 7v10',
    magnet:  'M6 4v7a6 6 0 0012 0V4h-4v7a2 2 0 11-4 0V4z',
    crit:    'M12 2l2 6.5L20.5 10 15 14l2 7-5-4-5 4 2-7-5.5-4L10 8.5z',
    hide:    'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z',
    shield:  'M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM9 12l2 2 4-4',
    tornado: 'M4 5h16M6 9h12M9 13h7M11 17h4M12 21h1',
    falcon:  'M3 9l6 2 3-6 3 6 6-2-5 5 2 6-6-3-6 3 2-6z',
    bolt:    'M13 2L4 14h6l-1 8 9-12h-6z',
    dance:   'M7 21l3-9M17 21l-3-9M12 12V7M12 7a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM6 9l6-2 6 2',
    phoenix: 'M12 21c-4 0-7-3-7-7 0-3 2-5 3-8 1 2 2 3 4 3 0-3 2-5 4-6 0 4 4 5 4 11 0 4-3 7-8 7z',
    guard:   'M4 6l8-3 8 3v6c0 5-4 8.5-8 9-4-.5-8-4-8-9z M12 8v6',
    star:    'M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.8 6.4 20l1.4-6.2L3 9.5l6.4-.6z',
    revive:  'M12 21c-4-3-8-6-8-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 11c0 4-4 7-8 10zM12 9v5M9.5 11.5h5'
  };

  /* ---------------------------------------------------------
     الأقاليم الثمانية
     --------------------------------------------------------- */
  var REGIONS = [
    {
      id: 'gibraltar', name: 'جَبَل طارِق', sub: '٩٢ﻫ / ٧١١م · مَرْسى العُبور',
      desc: 'صخرةٌ تطلّ على المضيق، ورمالٌ ما زالت دافئة من أثر السفن.',
      pal: { sky:'#2a1c14', g1:'#6b4b2e', g2:'#4a3320', stone:'#8d7154', accent:'#d8a445', enemy:'#8a4a3a', prop:'#5b4530', fog:'#c99a5c' },
      props:'rocks', waves: 7, diff: 0.85, reward: 70,
      music:{ maqam:'hijaz', root:146.83, tempo:86, rhythm:'maqsum' },
      roster:['bandit','bandit','archer','shieldman'],
      boss:{ id:'sakhra', name:'صَخْرَة', title:'حارِسُ المَرْسى', hp:900, speed:88, r:30, dmg:16, color:'#9b5540', patterns:['slam','charge','summon'] },
      codex:{ id:'cx_gib', k:'الإقليم الأول', title:'جبل طارق', text:'سُمّي الجبلُ باسم طارق بن زياد الذي عبر المضيق سنة ٩٢ﻫ/٧١١م، فصار «جبل طارق»، ومنه أخذت اللغاتُ الأوروبية اسم Gibraltar. وما زال الاسمُ العربيُّ حياً في لسان العالم بعد ثلاثة عشر قرناً.' }
    },
    {
      id: 'cordoba', name: 'قُرْطُبة', sub: 'القرن ٤ﻫ / ١٠م · حاضِرةُ الدُّنيا',
      desc: 'أعمدةُ الجامع كغابةٍ من رخام، ودروبٌ تُضاء ليلاً.',
      pal: { sky:'#241a26', g1:'#5e4b56', g2:'#3f3340', stone:'#b39b86', accent:'#e8c07a', enemy:'#7a4470', prop:'#6c5566', fog:'#c9a7c0' },
      props:'arches', waves: 8, diff: 0.94, reward: 90,
      music:{ maqam:'rast', root:155.56, tempo:90, rhythm:'baladi' },
      roster:['bandit','archer','shieldman','charger'],
      boss:{ id:'ibnfata', name:'ابنُ الفَتى', title:'عَريفُ الحَرَسِ المُتمرِّد', hp:1300, speed:126, r:27, dmg:18, color:'#a5518f', patterns:['dashCombo','radial','summon'] },
      codex:{ id:'cx_cor', k:'الإقليم الثاني', title:'خزانةُ قرطبة', text:'تذكر المصادر أن خزانة الحَكَم المستنصر بقرطبة ضمّت مئات الآلاف من المجلدات، وأن فهرسها وحده كان مجلداتٍ عدة. وكانت المدينة يومئذٍ من أكبر مدن أوروبا، بشوارعَ مرصوفةٍ ومياهٍ جاريةٍ وحماماتٍ عامة.' }
    },
    {
      id: 'seville', name: 'إشْبيلِيَة', sub: 'القرن ٦ﻫ / ١٢م · نَهرُ الوادي الكبير',
      desc: 'مئذنةٌ تناطح السماء، وبساتينُ تشرب من النهر.',
      pal: { sky:'#12241f', g1:'#3f5f4a', g2:'#28402f', stone:'#a8b096', accent:'#e0c96a', enemy:'#3f7d63', prop:'#4b6b52', fog:'#9dc4a8' },
      props:'garden', waves: 9, diff: 1.12, reward: 110,
      music:{ maqam:'bayati', root:164.81, tempo:94, rhythm:'saidi' },
      roster:['bandit','archer','shieldman','charger','slinger'],
      boss:{ id:'rubban', name:'رُبّانُ النَّهْر', title:'سيّدُ المَعابِر', hp:1750, speed:104, r:30, dmg:20, color:'#2f8f74', patterns:['spearWall','radial','summon'] },
      codex:{ id:'cx_sev', k:'الإقليم الثالث', title:'مئذنةُ إشبيلية', text:'بُنيت مئذنةُ جامع إشبيلية في العهد المُوحِّدي بين ١١٨٤ و١١٩٨م، وما زالت قائمةً إلى اليوم بعد أن صارت برجَ جرسٍ للكاتدرائية باسم «الخيرالدا». ومن إشبيلية أيضاً ابنُ العوّام صاحبُ «كتاب الفلاحة» الذي وصف مئات النباتات وطرق زراعتها.' }
    },
    {
      id: 'toledo', name: 'طُلَيْطِلة', sub: 'القرن ٥ﻫ / ١١م · ثَغْرُ الشَّمال',
      desc: 'صخرةٌ يلتفّ حولها نهر تاجُه، ومدينةٌ تُترجَم فيها الدنيا.',
      pal: { sky:'#1b1d28', g1:'#4d5164', g2:'#33364a', stone:'#9aa0b6', accent:'#c9d2e8', enemy:'#4a5c8a', prop:'#5a5f78', fog:'#a9b3cf' },
      props:'walls', waves: 9, diff: 1.28, reward: 130,
      music:{ maqam:'nahawand', root:174.61, tempo:98, rhythm:'ayyub' },
      roster:['archer','shieldman','charger','slinger','bandit'],
      boss:{ id:'thaghr', name:'صاحِبُ الثَّغْر', title:'رامي الأسْوار', hp:2200, speed:96, r:29, dmg:22, color:'#5a72b0', patterns:['volley','mines','charge'] },
      codex:{ id:'cx_tol', k:'الإقليم الرابع', title:'مدرسةُ المترجمين', text:'بعد سنة ١٠٨٥م صارت طليطلة مَعبراً نقلت منه أوروبا علومَ العرب إلى اللاتينية؛ ترجم جيرارد الكريموني وحده عشراتِ الكتب، منها «المجسطي» و«القانون في الطب» لابن سينا. ومن هذه الترجمات قامت جامعاتُ أوروبا الأولى.' }
    },
    {
      id: 'zaragoza', name: 'سَرَقُسْطة', sub: 'القرن ٥ﻫ / ١١م · قَصْرُ الجَعْفَرِيّة',
      desc: 'عقودٌ متشابكةٌ كالدانتيل، ونهرُ إبْرُه يلفّ السور.',
      pal: { sky:'#2a2013', g1:'#7a6135', g2:'#544122', stone:'#c2a878', accent:'#f0cf8a', enemy:'#9a7333', prop:'#6b5530', fog:'#dcc08a' },
      props:'columns', waves: 10, diff: 1.45, reward: 150,
      music:{ maqam:'hijaz', root:184.99, tempo:100, rhythm:'maqsum' },
      roster:['archer','shieldman','charger','slinger','naffat'],
      boss:{ id:'hajib', name:'الحاجِب', title:'كاسِرُ الأعْمِدة', hp:2700, speed:92, r:33, dmg:24, color:'#c79a3e', patterns:['pillars','slam','radial'] },
      codex:{ id:'cx_zar', k:'الإقليم الخامس', title:'قصر الجعفرية', text:'بناه المقتدر بن هود في القرن الخامس الهجري، وهو من أقدم قصور الأندلس الباقية. ومن سرقسطة خرج ابنُ باجّة، أول فلاسفة الأندلس الكبار، الذي شرح كتب أرسطو وأثّر في ابن رشد من بعده.' }
    },
    {
      id: 'valencia', name: 'بَلَنْسِيَة', sub: 'القرن ٦ﻫ / ١٢م · حَدائقُ السّاقِية',
      desc: 'سواقٍ تقسم الماء بالعدل، وحقولٌ لا تنام.',
      pal: { sky:'#131f2a', g1:'#3b6470', g2:'#264450', stone:'#93b4bb', accent:'#7fd4d0', enemy:'#2f6b8f', prop:'#3f6472', fog:'#9fd0d8' },
      props:'palms', waves: 10, diff: 1.62, reward: 175,
      music:{ maqam:'saba', root:196.00, tempo:104, rhythm:'saidi' },
      roster:['archer','shieldman','charger','slinger','naffat','horseman'],
      boss:{ id:'ashqar', name:'الأشْقَر', title:'قائدُ المُرْتَزَقة', hp:3300, speed:150, r:31, dmg:26, color:'#3f93c4', patterns:['charge','spin','summon'] },
      codex:{ id:'cx_val', k:'الإقليم السادس', title:'ورقُ شاطبة', text:'من شاطبة قرب بلنسية خرج أولُ ورقٍ صُنع في أوروبا في القرن السادس الهجري/الثاني عشر الميلادي، ووصفه الإدريسي في كتابه. ومن هناك انتقلت صناعة الورق إلى بقية القارة، فغيّرت شكل الكتاب والعلم فيها.' }
    },
    {
      id: 'granada', name: 'غَرْناطة', sub: 'القرن ٨ﻫ / ١٤م · الحَمْراء',
      desc: 'قصرٌ من نورٍ وماء، وجبالٌ بيضاءُ في الأفق.',
      pal: { sky:'#2b1418', g1:'#7e3f3a', g2:'#57282a', stone:'#d4a08a', accent:'#ff9d6e', enemy:'#a8372c', prop:'#6e3630', fog:'#e8ae8e' },
      props:'alhambra', waves: 11, diff: 1.80, reward: 210,
      music:{ maqam:'hijaz', root:207.65, tempo:108, rhythm:'war' },
      roster:['archer','shieldman','charger','slinger','naffat','horseman','captain'],
      boss:{ id:'shurta', name:'صاحِبُ الشُّرْطة', title:'سَيْفُ الحَمْراء', hp:4100, speed:158, r:30, dmg:28, color:'#e0573f', patterns:['dashCombo','spin','radial','summon'] },
      codex:{ id:'cx_gra', k:'الإقليم السابع', title:'ولا غالبَ إلا الله', text:'نُقشت عبارة «ولا غالبَ إلا الله» — شعار بني الأحمر — آلافَ المرات على جدران الحمراء وسقوفها. وقصرُ الحمراء الذي بُني في القرنين الثالث عشر والرابع عشر ما زال أكثرَ المعالم زيارةً في إسبانيا اليوم.' }
    },
    {
      id: 'alpujarras', name: 'البُشَرّات', sub: '٨٩٧ﻫ / ١٤٩٢م · آخِرُ الجِبال',
      desc: 'قرىً معلّقةٌ في الجبل، وثلجٌ يحفظ آخر الحكايات.',
      pal: { sky:'#1a1a22', g1:'#525a63', g2:'#383e46', stone:'#c8ccd4', accent:'#eaf2ff', enemy:'#6d4a86', prop:'#5c626e', fog:'#dfe6f0' },
      props:'peaks', waves: 12, diff: 2.00, reward: 300,
      music:{ maqam:'kurd', root:220.00, tempo:112, rhythm:'war' },
      roster:['archer','shieldman','charger','slinger','naffat','horseman','captain'],
      boss:{ id:'layth', name:'اللَّيثُ الأسْوَد', title:'آخِرُ الفُرْسان', hp:6200, speed:150, r:36, dmg:30, color:'#8f6ab0', patterns:['dashCombo','radial','pillars','spin','summon'], final:true },
      codex:{ id:'cx_alp', k:'الإقليم الثامن', title:'ما بقي من الأندلس', text:'انتهى الحكم الأندلسي بتسليم غرناطة سنة ١٤٩٢م، ولجأ كثيرٌ من أهلها إلى جبال البُشَرّات. لكن الأثر بقي: في الإسبانية اليوم آلافُ الكلمات ذات الأصل العربي — من «قِيثارة» و«زَيتون» و«مِخَدّة» إلى كلمة الرجاء «إن شاء الله» (ojalá).' }
    }
  ];

  /* ---------------------------------------------------------
     السجل التاريخي الإضافي (يُفتح بإنجازات)
     --------------------------------------------------------- */
  var BONUS_CODEX = [
    { id:'cx_zahrawi', k:'أعلام', title:'الزَّهراوي', text:'أبو القاسم الزهراوي (ت نحو ٤٠٤ﻫ/١٠١٣م) طبيبُ مدينة الزهراء قرب قرطبة، ألّف «التصريف لمن عجز عن التأليف»، وضمّ مقالته الأخيرة رسومَ نحو مئتي أداةٍ جراحية صمّمها بنفسه. ظلّ كتابه مرجعاً للجراحة في أوروبا قروناً.', how:'أسقط أول زعيم' },
    { id:'cx_firnas', k:'أعلام', title:'عبّاس بن فِرْناس', text:'من أهل رُندة وسكن قرطبة (ت ٢٧٤ﻫ/٨٨٧م). تنسب إليه المصادر محاولةَ طيرانٍ بجناحين من ريش، وصناعةَ آلةٍ تحاكي حركة الأفلاك، وأولَ إنتاجٍ للزجاج الشفاف في الأندلس.', how:'اقتل ٥٠٠ عدو' },
    { id:'cx_ziryab', k:'أعلام', title:'زِرْياب', text:'قدم إلى قرطبة سنة ٢٠٦ﻫ/٨٢٢م فغيّر ذوق الأندلس كله: أضاف وتراً خامساً للعود، وأسّس أولَ معهدٍ للموسيقى في الغرب، ورتّب المائدة على أطباقٍ متتابعة — وهي العادة التي تسير عليها موائد العالم اليوم.', how:'أكمل ثلاثة أقاليم' },
    { id:'cx_hazm', k:'أعلام', title:'ابنُ حَزْم', text:'كتب ابنُ حزم القرطبي «طوقَ الحمامة في الأُلفة والأُلّاف» نحو سنة ٤١٣ﻫ/١٠٢٢م وهو في شاطبة، فصار من أرقّ ما كُتب عن الحبّ في التراث الإنساني، وتُرجم إلى أكثر من عشرين لغة.', how:'انتصر بلا أن تُصاب في موجة كاملة ١٠ مرات' },
    { id:'cx_mayrit', k:'أعلام', title:'مَجْريط', text:'مدينة مدريد الإسبانية اليوم كانت حصناً أندلسياً اسمه «مَجْريط»، بناه محمد الأول أمير قرطبة في القرن التاسع الميلادي؛ ومعنى الاسم يُردّ إلى مجاري المياه تحت أرضها. وهي العاصمة الأوروبية الوحيدة التي أسّسها المسلمون.', how:'أكمل الأندلس كلها' }
  ];

  /* ---------------------------------------------------------
     الأبطال
     --------------------------------------------------------- */
  var HEROES = [
    {
      id:'faris', name:'الفارِس', title:'سَيْفٌ وسِرْج',
      desc:'متوازنٌ ومتين: ضربةٌ واسعة بالسيف الأندلسي، درعٌ يصدّ ما يأتي من أمامه، وكرّةٌ تفتح الصفوف. أفضل بداية.',
      cost:0,
      hp:150, speed:220, dmg:23, atkCd:0.40, range:80, arc:1.28, weapon:'sword', block:0.22,
      dashCd:1.05, dashMax:2, crit:0.06,
      colors:{ cloth:'#c9b393', trim:'#d8a445', metal:'#e6e2d8', skin:'#c98f63' },
      ult:{ id:'karra', name:'الكَرّة', desc:'دوّامة سيفٍ تجرح كل من حولك ثلاث مرات، وأنت محصَّن أثناءها.', cost:100 },
      stats:{ قوة:4, سرعة:3, صلابة:3, مدى:2 }
    },
    {
      id:'rami', name:'الرّامي', title:'قَوْسٌ لا يُخطئ',
      desc:'يقاتل من بعيد بسهامٍ نافذة. سريعُ الحركة لكنه قليل الاحتمال — ابقَ متحركاً.',
      cost:400,
      hp:92, speed:234, dmg:16, atkCd:0.34, range:430, arc:0, weapon:'bow',
      dashCd:0.95, dashMax:2, crit:0.10,
      colors:{ cloth:'#8fae86', trim:'#e0c96a', metal:'#d9d2c2', skin:'#b87f57' },
      ult:{ id:'wabil', name:'الوابِل', desc:'وابلٌ من السهام ينهمر على كل عدوٍّ في الميدان.', cost:100 },
      stats:{ قوة:3, سرعة:4, صلابة:2, مدى:5 }
    },
    {
      id:'dariq', name:'حامِلُ الدَّرَقة', title:'جِدارٌ يَمْشي',
      desc:'درقةٌ لَمْطِيّة تصدّ ما يأتي من أمامك، وضرباتٌ ثقيلة تدفع الصفوف. بطيءٌ لكنه لا ينكسر.',
      cost:900,
      hp:180, speed:184, dmg:27, atkCd:0.56, range:74, arc:1.5, weapon:'shield',
      dashCd:1.25, dashMax:1, crit:0.04, block:0.55,
      colors:{ cloth:'#9a6a4a', trim:'#c98b3a', metal:'#cfd4d8', skin:'#a8734e' },
      ult:{ id:'sadma', name:'الصَّدْمة', desc:'صدمةُ درقةٍ تدفع كل من حولك وتُذهِلهم، وتمنحك درعاً.', cost:100 },
      stats:{ قوة:5, سرعة:2, صلابة:5, مدى:2 }
    },
    {
      id:'ayyar', name:'العَيّار', title:'ظِلٌّ بخَنْجَرَين',
      desc:'خنجران سريعان وثلاثُ كرّاتٍ في الجَعبة. ضرباتُه الحرجة قاتلة، لكن خطأً واحداً يكفي.',
      cost:1500,
      hp:88, speed:252, dmg:12, atkCd:0.19, range:66, arc:1.0, weapon:'daggers',
      dashCd:0.72, dashMax:3, crit:0.22, critMul:2.4,
      colors:{ cloth:'#5b4a63', trim:'#b9a0d8', metal:'#e8e4f0', skin:'#c08a60' },
      ult:{ id:'tayf', name:'الطَّيْف', desc:'يبطؤ الزمن، فتنقضّ على أقرب خمسة أعداءٍ ضربةً واحدة.', cost:100 },
      stats:{ قوة:2, سرعة:5, صلابة:1, مدى:2 }
    }
  ];

  /* ---------------------------------------------------------
     الأعداء
     --------------------------------------------------------- */
  var ENEMIES = {
    bandit:    { id:'bandit',    name:'قاطِعُ طريق', hp:34,  speed:96,  dmg:8,  r:15, atkRange:40,  atkCd:1.70, gold:3, ai:'chase',  w:1.0 },
    archer:    { id:'archer',    name:'رامٍ مُرتزَق', hp:26,  speed:84,  dmg:7,  r:14, atkRange:320, atkCd:2.6,  gold:4, ai:'ranged', w:0.7, keep:215 },
    shieldman: { id:'shieldman', name:'حامِلُ تُرس',  hp:72,  speed:64,  dmg:11, r:18, atkRange:44,  atkCd:2.1,  gold:6, ai:'shield', w:0.55, block:0.55 },
    charger:   { id:'charger',   name:'المُغير',      hp:52,  speed:100, dmg:14, r:16, atkRange:52,  atkCd:3.4,  gold:7, ai:'charge', w:0.5 },
    slinger:   { id:'slinger',   name:'المِقْلاعيّ',  hp:30,  speed:78,  dmg:10, r:14, atkRange:290, atkCd:3.5,  gold:5, ai:'lob',    w:0.45, keep:235 },
    naffat:    { id:'naffat',    name:'النَّفّاط',    hp:44,  speed:72,  dmg:9,  r:16, atkRange:245, atkCd:4.2,  gold:8, ai:'fire',   w:0.35, keep:195 },
    horseman:  { id:'horseman',  name:'فارِسٌ مُغاوِر',hp:88,  speed:182, dmg:16, r:20, atkRange:56,  atkCd:4.0,  gold:11,ai:'rider',  w:0.3 },
    captain:   { id:'captain',   name:'العَريف',      hp:180, speed:90,  dmg:17, r:22, atkRange:56,  atkCd:2.2,  gold:24, ai:'captain', w:0.14, elite:true }
  };

  /* ---------------------------------------------------------
     بطاقات الغنيمة (٢٦ بطاقة)
     r: common / rare / epic / legend
     --------------------------------------------------------- */
  var UPGRADES = [
    { id:'edge',    n:'حَدُّ السَّيف',   d:'+٢٠٪ ضرر.',                                   r:'common', i:'sword', max:8,  ap:function(p){ p.dmgMul *= 1.20; } },
    { id:'swift',   n:'خِفّةُ اليَد',    d:'+١٦٪ سرعة هجوم.',                              r:'common', i:'speed', max:6,  ap:function(p){ p.atkSpeedMul *= 1.16; } },
    { id:'sandal',  n:'نَعْلٌ خفيف',     d:'+١٠٪ سرعة حركة.',                              r:'common', i:'boot',  max:5,  ap:function(p){ p.speedMul *= 1.10; } },
    { id:'mail',    n:'دِرْعٌ مُضاعَف',  d:'+٢٥ صحة قصوى، وتُشفى بالمقدار نفسه.',           r:'common', i:'heart', max:8,  ap:function(p){ p.maxHp += 25; p.hp += 25; } },
    { id:'hawk',    n:'عَيْنُ الصَّقر',  d:'+١٥٪ مدى، ومقذوفاتك أكبر.',                     r:'common', i:'eye',   max:4,  ap:function(p){ p.rangeMul *= 1.15; p.projSizeMul *= 1.12; } },
    { id:'hide',    n:'جِلْدُ الوَعِل',  d:'−١٢٪ من كل ضرر تتلقاه.',                        r:'common', i:'hide',  max:5,  ap:function(p){ p.dr = 1 - (1 - p.dr) * 0.88; } },
    { id:'purse',   n:'حَظُّ التّاجِر',  d:'+٤٠٪ ذهب من الأعداء.',                          r:'common', i:'coin',  max:4,  ap:function(p){ p.goldMul += 0.40; } },
    { id:'magnet',  n:'جاذِبُ الغَنيمة', d:'تلتقط الغنائم من ضعف المسافة.',                 r:'common', i:'magnet',max:3,  ap:function(p){ p.magnet += 90; } },

    { id:'split',   n:'سِهامٌ مَشْقوقة', d:'مقذوفٌ إضافي للرُّماة، واتساعٌ أكبر لضربة السيف.', r:'rare', i:'arrows', max:4, ap:function(p){ p.projExtra += 1; p.arcBonus += 0.30; } },
    { id:'venom',   n:'سُمُّ الأفْعى',   d:'ضرباتك تسمّم: ٦ ضرر كل ثانية لثلاث ثوانٍ.',      r:'rare', i:'drop',   max:4, ap:function(p){ p.poison += 6; } },
    { id:'greek',   n:'نارٌ إغريقيّة',   d:'كل ضربةٍ خامسة تُشعل انفجاراً.',                 r:'rare', i:'flame',  max:3, ap:function(p){ p.burnEvery = p.burnEvery ? Math.max(2, p.burnEvery - 1) : 5; p.burnDmg += 26; } },
    { id:'ricochet',n:'رَمْيةٌ مُرتَدّة',d:'مقذوفاتك ترتدّ إلى عدوٍّ آخر.',                  r:'rare', i:'bounce', max:3, ap:function(p){ p.ricochet += 1; } },
    { id:'lion',    n:'قَلْبُ الأسَد',   d:'+٤٥٪ ضرر حين تنزل صحتك تحت ٤٠٪.',              r:'rare', i:'lion',   max:3, ap:function(p){ p.lowHpDmg += 0.45; } },
    { id:'wind',    n:'خَطْوةُ الرّيح',  d:'+١ شحنة اندفاع، و−١٥٪ زمن استعادة.',            r:'rare', i:'wind',   max:3, ap:function(p){ p.dashMax += 1; p.dashCd *= 0.85; } },
    { id:'crit',    n:'ضَرْبةٌ قاصِمة',  d:'+١٠٪ فرصة ضربة حرجة و+٥٠٪ ضررها.',              r:'rare', i:'crit',   max:5, ap:function(p){ p.crit += 0.10; p.critMul += 0.5; } },
    { id:'thorn',   n:'ثَأر',           d:'حين تُصاب، موجةُ صدمةٍ تدفع من حولك وتجرحهم.',   r:'rare', i:'burst',  max:3, ap:function(p){ p.thorns += 26; } },
    { id:'regen',   n:'بَرَكةُ الحَكيم', d:'تستعيد ٢ صحة كل ثانية.',                         r:'rare', i:'revive', max:4, ap:function(p){ p.regen += 2; } },

    { id:'vamp',    n:'مَصُّ الدِّماء',  d:'١٠٪ من ضررك يعود إليك صحة.',                    r:'epic', i:'vamp',   max:3, ap:function(p){ p.lifesteal += 0.10; } },
    { id:'blade',   n:'ظِلُّ الاندِفاع', d:'اندفاعك يجرح كل من يمرّ به ويمنحك مناعةً أطول.', r:'epic', i:'blade',  max:2, ap:function(p){ p.dashBlade += 30; p.dashIfr += 0.10; } },
    { id:'bastion', n:'حِصْن',          d:'درعٌ بـ٣٥ يتجدد بعد ٥ ثوانٍ بلا إصابة.',         r:'epic', i:'shield', max:3, ap:function(p){ p.shieldMax += 35; } },
    { id:'sand',    n:'عاصِفةُ الرِّمال',d:'كل ٨ ثوانٍ دوّامةٌ تُبطئ وتجرح من حولك.',        r:'epic', i:'tornado',max:2, ap:function(p){ p.sandstorm += 1; } },
    { id:'dance',   n:'رَقْصةُ السُّيوف',d:'كلما طالت متتاليتك زاد ضررك — حتى +٥٠٪.',        r:'epic', i:'dance',  max:2, ap:function(p){ p.comboDmg += 0.5; } },

    { id:'falcon',  n:'صَقْرٌ مُرافِق',  d:'صقرٌ يطير معك وينقضّ على الأعداء.',              r:'legend', i:'falcon', max:2, ap:function(p){ p.falcons += 1; } },
    { id:'fath',    n:'سَيْفُ الفَتْح',  d:'+٧٥٪ ضرر، لكن −٢٠٪ من صحتك القصوى.',            r:'legend', i:'star',   max:2, ap:function(p){ p.dmgMul *= 1.75; p.maxHp = Math.max(30, Math.round(p.maxHp * 0.80)); p.hp = Math.min(p.hp, p.maxHp); } },
    { id:'thunder', n:'رَعْدُ الجَبَل',  d:'كل ٤ ضربات، صاعقةٌ تضرب ثلاثة أعداء.',           r:'legend', i:'bolt',   max:2, ap:function(p){ p.thunder += 1; } },
    { id:'breath',  n:'نَفَسٌ أخير',    d:'مرةً واحدة في الجولة: تنجو من ضربةٍ قاتلة بـ٤٠٪ صحة.', r:'legend', i:'phoenix', max:1, ap:function(p){ p.lastBreath += 1; } }
  ];

  /* ---------------------------------------------------------
     دار الصَّنعة — تطويرات دائمة
     --------------------------------------------------------- */
  var FORGE = [
    { id:'vitality', n:'عَزيمة',  d:'+١٤ صحة قصوى في كل جولة.',            i:'heart',  max:5, cost:function(l){ return 120 + l * 130; } },
    { id:'edge',     n:'صَقْل',   d:'+٧٪ ضرر في كل جولة.',                 i:'sword',  max:5, cost:function(l){ return 150 + l * 160; } },
    { id:'swift',    n:'رَشاقة',  d:'+٤٪ سرعة حركة.',                       i:'boot',   max:4, cost:function(l){ return 130 + l * 140; } },
    { id:'guard',    n:'شَكيمة',  d:'−٥٪ من الضرر المستلَم.',               i:'guard',  max:4, cost:function(l){ return 180 + l * 190; } },
    { id:'fortune',  n:'بَرَكة',  d:'+١٢٪ ذهب.',                            i:'coin',   max:4, cost:function(l){ return 110 + l * 120; } },
    { id:'wind',     n:'ريح',     d:'+١ شحنة اندفاع.',                      i:'wind',   max:1, cost:function(){ return 950; } },
    { id:'resolve',  n:'عَزْم',   d:'تبدأ كل جولة ببطاقة غنيمة إضافية.',    i:'star',   max:2, cost:function(l){ return 700 + l * 700; } },
    { id:'revive',   n:'نَصْر',   d:'تُبعث مرةً واحدة في الجولة بنصف صحتك.', i:'revive', max:1, cost:function(){ return 1900; } }
  ];

  MAL.Data = {
    icons: ICONS,
    regions: REGIONS,
    bonusCodex: BONUS_CODEX,
    heroes: HEROES,
    enemies: ENEMIES,
    upgrades: UPGRADES,
    forge: FORGE,
    heroById: function (id) {
      for (var i = 0; i < HEROES.length; i++) if (HEROES[i].id === id) return HEROES[i];
      return HEROES[0];
    },
    upgradeById: function (id) {
      for (var i = 0; i < UPGRADES.length; i++) if (UPGRADES[i].id === id) return UPGRADES[i];
      return null;
    },
    forgeById: function (id) {
      for (var i = 0; i < FORGE.length; i++) if (FORGE[i].id === id) return FORGE[i];
      return null;
    },
    allCodex: function () {
      var out = [];
      for (var i = 0; i < REGIONS.length; i++) out.push(REGIONS[i].codex);
      for (var j = 0; j < BONUS_CODEX.length; j++) out.push(BONUS_CODEX[j]);
      return out;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
