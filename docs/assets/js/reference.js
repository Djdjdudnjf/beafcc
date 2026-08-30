/* =============================================================
   reference.js — مرجع وسوم HTML / HTML tag reference
   ============================================================= */
(function (global) {
  'use strict';

  var CATS = [
    { id: 'structure', label: { ar: 'الهيكل', en: 'Structure' } },
    { id: 'text',      label: { ar: 'النصوص', en: 'Text' } },
    { id: 'semantic',  label: { ar: 'الدلالة', en: 'Semantics' } },
    { id: 'links',     label: { ar: 'روابط ووسائط', en: 'Links & media' } },
    { id: 'lists',     label: { ar: 'قوائم وجداول', en: 'Lists & tables' } },
    { id: 'forms',     label: { ar: 'نماذج', en: 'Forms' } },
    { id: 'meta',      label: { ar: 'رأس الصفحة', en: 'Head & meta' } }
  ];

  function T(tag, cat, ar, en, ex) {
    return { tag: tag, cat: cat, desc: { ar: ar, en: en }, ex: ex };
  }

  var TAGS = [
    /* الهيكل */
    T('<!doctype html>', 'structure', 'يعلن أن المستند صفحة HTML حديثة. أول سطر دائماً.', 'Declares the document as modern HTML. Always the first line.', '<!doctype html>'),
    T('<html>', 'structure', 'العنصر الجذر الذي يحتوي كل شيء.', 'The root element containing everything.', '<html lang="ar" dir="rtl">…</html>'),
    T('<head>', 'structure', 'معلومات عن الصفحة لا تظهر فيها.', 'Information about the page, not shown in it.', '<head>…</head>'),
    T('<body>', 'structure', 'كل ما يراه الزائر.', 'Everything the visitor sees.', '<body>…</body>'),
    T('<div>', 'structure', 'حاوية كتلة محايدة بلا معنى دلالي.', 'A neutral block container with no semantic meaning.', '<div class="card">…</div>'),
    T('<span>', 'structure', 'حاوية سطرية محايدة لجزء من نص.', 'A neutral inline container for part of a text.', '<p>السعر <span>99</span></p>'),
    T('<!-- -->', 'structure', 'تعليق لا يظهر في الصفحة.', 'A comment that never appears on the page.', '<!-- ملاحظة للمطوّر -->'),

    /* النصوص */
    T('<h1>–<h6>', 'text', 'ستة مستويات عناوين، h1 الأهم.', 'Six heading levels, h1 the most important.', '<h1>العنوان</h1>'),
    T('<p>', 'text', 'فقرة نصية.', 'A paragraph of text.', '<p>نص الفقرة.</p>'),
    T('<br>', 'text', 'كسر سطر داخل النص. عنصر فارغ.', 'A line break inside text. A void element.', 'سطر<br>سطر'),
    T('<hr>', 'text', 'خط فاصل أفقي بين الأقسام.', 'A horizontal rule between sections.', '<hr>'),
    T('<strong>', 'text', 'أهمية قوية (يظهر عريضاً).', 'Strong importance (renders bold).', '<strong>مهم</strong>'),
    T('<em>', 'text', 'تأكيد لفظي (يظهر مائلاً).', 'Stress emphasis (renders italic).', '<em>فعلاً</em>'),
    T('<b>', 'text', 'عريض بلا معنى إضافي.', 'Bold with no added meaning.', '<b>اسم</b>'),
    T('<i>', 'text', 'مائل بلا معنى إضافي.', 'Italic with no added meaning.', '<i>مصطلح</i>'),
    T('<mark>', 'text', 'تظليل النص كقلم فسفوري.', 'Highlighted text, like a marker pen.', '<mark>مظلّل</mark>'),
    T('<small>', 'text', 'نص جانبي صغير كالحقوق.', 'Small side text such as legal notes.', '<small>شامل الضريبة</small>'),
    T('<del>', 'text', 'نص محذوف (يظهر مشطوباً).', 'Deleted text (struck through).', '<del>200</del>'),
    T('<ins>', 'text', 'نص مضاف (يظهر تحته خط).', 'Inserted text (underlined).', '<ins>150</ins>'),
    T('<sub>', 'text', 'نص منخفض.', 'Subscript text.', 'H<sub>2</sub>O'),
    T('<sup>', 'text', 'نص مرتفع.', 'Superscript text.', 'م<sup>2</sup>'),
    T('<blockquote>', 'text', 'اقتباس كتلة كاملة.', 'A block quotation.', '<blockquote>حكمة</blockquote>'),
    T('<q>', 'text', 'اقتباس قصير داخل السطر.', 'A short inline quotation.', '<q>نص</q>'),
    T('<cite>', 'text', 'اسم العمل المقتبس منه.', 'The title of a cited work.', '<cite>الكتاب</cite>'),
    T('<code>', 'text', 'قطعة كود قصيرة بخط ثابت.', 'A short code snippet in monospace.', '<code>&lt;p&gt;</code>'),
    T('<pre>', 'text', 'نص محفوظ التنسيق بمسافاته وأسطره.', 'Preformatted text keeping spaces and lines.', '<pre>سطر\n  مُزاح</pre>'),
    T('<kbd>', 'text', 'مفاتيح لوحة المفاتيح.', 'Keyboard keys.', '<kbd>Ctrl</kbd>'),
    T('<samp>', 'text', 'مخرجات برنامج.', 'Program output.', '<samp>Done</samp>'),
    T('<abbr>', 'text', 'اختصار مع شرحه في title.', 'An abbreviation explained in title.', '<abbr title="HyperText">HT</abbr>'),
    T('<time>', 'text', 'تاريخ أو وقت بصيغة يفهمها الحاسوب.', 'A machine-readable date or time.', '<time datetime="2026-01-01">رأس السنة</time>'),

    /* الدلالة */
    T('<header>', 'semantic', 'رأس الصفحة أو القسم.', 'The header of a page or section.', '<header><h1>الموقع</h1></header>'),
    T('<nav>', 'semantic', 'مجموعة روابط التنقّل.', 'A group of navigation links.', '<nav><a href="#">الرئيسية</a></nav>'),
    T('<main>', 'semantic', 'المحتوى الأساسي الفريد. مرة واحدة في الصفحة.', 'The unique primary content. Once per page.', '<main>…</main>'),
    T('<section>', 'semantic', 'قسم موضوعي له عنوان.', 'A thematic section with a heading.', '<section><h2>عنوان</h2></section>'),
    T('<article>', 'semantic', 'محتوى مستقل قابل للنشر وحده.', 'Self-contained content publishable alone.', '<article>…</article>'),
    T('<aside>', 'semantic', 'محتوى جانبي مكمّل.', 'Complementary side content.', '<aside>روابط ذات صلة</aside>'),
    T('<footer>', 'semantic', 'تذييل الصفحة أو القسم.', 'The footer of a page or section.', '<footer>© 2026</footer>'),
    T('<figure>', 'semantic', 'محتوى مستقل مع تعليق.', 'Self-contained content with a caption.', '<figure><img …><figcaption>شرح</figcaption></figure>'),
    T('<figcaption>', 'semantic', 'تعليق العنصر داخل figure.', 'The caption inside a figure.', '<figcaption>الشكل 1</figcaption>'),
    T('<details>', 'semantic', 'صندوق قابل للطي يفتحه المستخدم.', 'A collapsible box the user can open.', '<details><summary>المزيد</summary>نص</details>'),
    T('<summary>', 'semantic', 'عنوان صندوق details الظاهر دائماً.', 'The always-visible title of a details box.', '<summary>اقرأ المزيد</summary>'),

    /* روابط ووسائط */
    T('<a>', 'links', 'رابط إلى صفحة أو قسم أو بريد.', 'A link to a page, section or email.', '<a href="page.html">نص</a>'),
    T('<img>', 'links', 'صورة. عنصر فارغ يحتاج src وalt.', 'An image. A void element needing src and alt.', '<img src="a.jpg" alt="وصف">'),
    T('<picture>', 'links', 'صور بديلة حسب الشاشة أو الصيغة.', 'Alternative images per screen or format.', '<picture><source …><img …></picture>'),
    T('<source>', 'links', 'مصدر بديل داخل picture أو video أو audio.', 'An alternative source inside picture, video or audio.', '<source src="v.mp4" type="video/mp4">'),
    T('<video>', 'links', 'مشغّل فيديو مدمج.', 'A built-in video player.', '<video controls src="v.mp4"></video>'),
    T('<audio>', 'links', 'مشغّل صوت مدمج.', 'A built-in audio player.', '<audio controls src="a.mp3"></audio>'),
    T('<track>', 'links', 'ترجمة نصية للفيديو.', 'Captions or subtitles for a video.', '<track kind="captions" src="ar.vtt">'),
    T('<iframe>', 'links', 'إطار يعرض صفحة أخرى بالداخل.', 'A frame showing another page inside.', '<iframe src="…" title="وصف"></iframe>'),
    T('<svg>', 'links', 'رسم متجهي يكبر بلا فقدان جودة.', 'Vector graphics that scale losslessly.', '<svg><circle r="20"/></svg>'),

    /* قوائم وجداول */
    T('<ul>', 'lists', 'قائمة غير مرتّبة بنقاط.', 'An unordered bulleted list.', '<ul><li>عنصر</li></ul>'),
    T('<ol>', 'lists', 'قائمة مرتّبة بأرقام.', 'An ordered numbered list.', '<ol><li>خطوة</li></ol>'),
    T('<li>', 'lists', 'عنصر واحد داخل قائمة.', 'A single item inside a list.', '<li>نص</li>'),
    T('<dl>', 'lists', 'قائمة تعريفات (مصطلح ووصف).', 'A description list (term and description).', '<dl><dt>HTML</dt><dd>لغة ترميز</dd></dl>'),
    T('<dt>', 'lists', 'المصطلح أو السؤال.', 'The term or question.', '<dt>المصطلح</dt>'),
    T('<dd>', 'lists', 'الوصف أو الجواب.', 'The description or answer.', '<dd>الشرح</dd>'),
    T('<table>', 'lists', 'جدول بيانات.', 'A data table.', '<table>…</table>'),
    T('<caption>', 'lists', 'عنوان الجدول، أول عنصر بداخله.', 'The table title, its first element.', '<caption>النتائج</caption>'),
    T('<thead>', 'lists', 'قسم عناوين الجدول.', 'The table header section.', '<thead><tr><th>…</th></tr></thead>'),
    T('<tbody>', 'lists', 'قسم بيانات الجدول.', 'The table body section.', '<tbody>…</tbody>'),
    T('<tfoot>', 'lists', 'قسم المجاميع في الجدول.', 'The table footer (totals) section.', '<tfoot>…</tfoot>'),
    T('<tr>', 'lists', 'صف في الجدول.', 'A table row.', '<tr>…</tr>'),
    T('<th>', 'lists', 'خلية عنوان. استخدم scope معها.', 'A header cell. Use scope with it.', '<th scope="col">الاسم</th>'),
    T('<td>', 'lists', 'خلية بيانات.', 'A data cell.', '<td>95</td>'),

    /* نماذج */
    T('<form>', 'forms', 'حاوية النموذج مع action وmethod.', 'The form container with action and method.', '<form action="/x" method="post">…</form>'),
    T('<input>', 'forms', 'حقل إدخال يتغيّر حسب type.', 'An input field that changes with type.', '<input type="email" name="mail">'),
    T('<label>', 'forms', 'تسمية الحقل، تُربط بـ for.', 'A field label, bound with for.', '<label for="n">الاسم</label>'),
    T('<textarea>', 'forms', 'حقل نص متعدد الأسطر.', 'A multi-line text field.', '<textarea rows="4"></textarea>'),
    T('<select>', 'forms', 'قائمة منسدلة.', 'A dropdown list.', '<select><option>خيار</option></select>'),
    T('<option>', 'forms', 'خيار داخل القائمة المنسدلة.', 'An option inside a dropdown.', '<option value="1">واحد</option>'),
    T('<optgroup>', 'forms', 'تجميع خيارات تحت عنوان.', 'Groups options under a label.', '<optgroup label="المدن">…</optgroup>'),
    T('<button>', 'forms', 'زر. النوع الافتراضي داخل النموذج submit.', 'A button. Default type inside a form is submit.', '<button type="submit">إرسال</button>'),
    T('<fieldset>', 'forms', 'إطار حول مجموعة حقول مترابطة.', 'A box around a group of related fields.', '<fieldset><legend>عنوان</legend>…</fieldset>'),
    T('<legend>', 'forms', 'عنوان مجموعة fieldset.', 'The caption of a fieldset.', '<legend>بياناتك</legend>'),
    T('<datalist>', 'forms', 'اقتراحات جاهزة لحقل إدخال.', 'Suggested values for an input.', '<datalist id="d"><option value="A"></datalist>'),
    T('<progress>', 'forms', 'شريط تقدّم.', 'A progress bar.', '<progress value="70" max="100"></progress>'),
    T('<meter>', 'forms', 'مقياس ضمن مدى معروف.', 'A gauge within a known range.', '<meter value="0.6">60%</meter>'),

    /* رأس الصفحة */
    T('<title>', 'meta', 'عنوان الصفحة في التبويب ونتائج البحث.', 'The page title in the tab and search results.', '<title>موقعي</title>'),
    T('<meta charset>', 'meta', 'ترميز المحارف. utf-8 يدعم كل اللغات.', 'Character encoding. utf-8 supports every language.', '<meta charset="utf-8">'),
    T('<meta name="viewport">', 'meta', 'يجعل الصفحة تتأقلم مع الجوال.', 'Makes the page adapt to phones.', '<meta name="viewport" content="width=device-width, initial-scale=1">'),
    T('<meta name="description">', 'meta', 'وصف الصفحة في نتائج البحث.', 'The page description in search results.', '<meta name="description" content="وصف">'),
    T('<meta property="og:…">', 'meta', 'بطاقة المشاركة في الشبكات الاجتماعية.', 'The social share card.', '<meta property="og:title" content="عنوان">'),
    T('<link>', 'meta', 'يربط ملفاً خارجياً مثل CSS أو الأيقونة.', 'Links an external file such as CSS or the favicon.', '<link rel="stylesheet" href="style.css">'),
    T('<style>', 'meta', 'قواعد CSS داخل الصفحة.', 'CSS rules inside the page.', '<style>p{color:red}</style>'),
    T('<script>', 'meta', 'كود JavaScript أو ربط ملف خارجي.', 'JavaScript code or an external file link.', '<script src="app.js"></script>')
  ];

  global.REFERENCE = { cats: CATS, tags: TAGS };
})(window);
