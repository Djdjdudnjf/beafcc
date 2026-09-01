/* =============================================================
   reference.js — مرجع بايثون السريع / Python quick reference
   ============================================================= */
(function (global) {
  'use strict';

  var CATS = [
    { id: 'keywords', label: { ar: 'الكلمات المحجوزة', en: 'Keywords' } },
    { id: 'builtins', label: { ar: 'الدوال المدمجة', en: 'Built-in functions' } },
    { id: 'str',      label: { ar: 'دوال النصوص', en: 'String methods' } },
    { id: 'list',     label: { ar: 'دوال القوائم', en: 'List methods' } },
    { id: 'dict',     label: { ar: 'دوال القواميس', en: 'Dict methods' } },
    { id: 'operators',label: { ar: 'العوامل', en: 'Operators' } },
    { id: 'errors',   label: { ar: 'الأخطاء', en: 'Exceptions' } },
    { id: 'stdlib',   label: { ar: 'المكتبة القياسية', en: 'Standard library' } }
  ];

  function T(tag, cat, ar, en, ex) {
    return { tag: tag, cat: cat, desc: { ar: ar, en: en }, ex: ex };
  }

  var TAGS = [
    /* ---------- الكلمات المحجوزة / keywords ---------- */
    T('def', 'keywords', 'يعرّف دالة جديدة.', 'Defines a new function.', 'def greet(name):\n    return f"hi {name}"'),
    T('return', 'keywords', 'يُعيد قيمة من الدالة ويُنهيها فوراً.', 'Returns a value from a function and exits it immediately.', 'return a + b'),
    T('if / elif / else', 'keywords', 'ينفّذ كتلة بناءً على شرط.', 'Runs a block based on a condition.', 'if x > 0:\n    print("موجب")\nelse:\n    print("غير ذلك")'),
    T('for … in', 'keywords', 'يكرّر على عناصر مجموعة.', 'Iterates over the items of a collection.', 'for item in items:\n    print(item)'),
    T('while', 'keywords', 'يكرّر ما دام الشرط صحيحاً.', 'Repeats while a condition stays true.', 'while count > 0:\n    count -= 1'),
    T('break', 'keywords', 'يخرج من الحلقة فوراً.', 'Exits the loop immediately.', 'if found:\n    break'),
    T('continue', 'keywords', 'يتخطّى بقية الدورة الحالية.', 'Skips the rest of the current pass.', 'if n % 2:\n    continue'),
    T('class', 'keywords', 'يعرّف صنفاً (قالب كائنات).', 'Defines a class — a blueprint for objects.', 'class Dog:\n    pass'),
    T('import / from', 'keywords', 'يستورد وحدة أو جزءاً منها.', 'Imports a module or part of one.', 'import math\nfrom math import sqrt'),
    T('try / except', 'keywords', 'يلتقط الأخطاء بدل الانهيار.', 'Catches errors instead of crashing.', 'try:\n    int(x)\nexcept ValueError:\n    pass'),
    T('finally', 'keywords', 'يُنفَّذ دائماً، للتنظيف.', 'Always runs, for cleanup.', 'finally:\n    f.close()'),
    T('raise', 'keywords', 'يرفع خطأً متعمّداً.', 'Raises an error deliberately.', 'raise ValueError("قيمة غير صالحة")'),
    T('with', 'keywords', 'يدير مورداً ويغلقه تلقائياً.', 'Manages a resource and closes it automatically.', 'with open("f.txt") as f:\n    data = f.read()'),
    T('lambda', 'keywords', 'دالة صغيرة بلا اسم في سطر واحد.', 'A small anonymous one-line function.', 'sorted(x, key=lambda i: i["age"])'),
    T('and / or / not', 'keywords', 'يربط الشروط منطقياً.', 'Combines conditions logically.', 'if a > 0 and b > 0:'),
    T('in / not in', 'keywords', 'يفحص الانتماء لمجموعة أو نص.', 'Tests membership in a collection or string.', '"y" in "Python"'),
    T('is / is not', 'keywords', 'يقارن الهوية لا القيمة. يُستخدم مع None.', 'Compares identity, not value. Used with None.', 'if x is None:'),
    T('None', 'keywords', 'قيمة «لا شيء» — غياب القيمة.', 'The "nothing" value — the absence of a value.', 'result = None'),
    T('True / False', 'keywords', 'القيمتان المنطقيتان.', 'The two boolean values.', 'is_ready = True'),
    T('global', 'keywords', 'يسمح بتعديل متغيّر عامّ داخل دالة. تجنّبه.', 'Allows modifying a global inside a function. Avoid it.', 'global counter'),
    T('assert', 'keywords', 'يتحقّق من شرط أثناء الاختبار.', 'Asserts a condition during testing.', 'assert add(2, 3) == 5'),
    T('pass', 'keywords', 'لا يفعل شيئاً — نائب مكان.', 'Does nothing — a placeholder.', 'def todo():\n    pass'),

    /* ---------- الدوال المدمجة / builtins ---------- */
    T('print()', 'builtins', 'يعرض قيمة أو أكثر في المخرجات.', 'Displays one or more values in the output.', 'print("a", 1, sep=" | ")'),
    T('input()', 'builtins', 'يقرأ سطراً من المستخدم ويُعيده نصاً دائماً.', 'Reads a line from the user; always returns a string.', 'name = input("الاسم: ")'),
    T('len()', 'builtins', 'يُعيد عدد العناصر أو الأحرف.', 'Returns the number of items or characters.', 'len([1, 2, 3])   # 3'),
    T('type()', 'builtins', 'يُعيد نوع القيمة.', 'Returns the type of a value.', 'type(5)   # int'),
    T('int() / float()', 'builtins', 'يحوّل إلى عدد صحيح أو عشري. int تقطع ولا تقرّب.', 'Converts to a whole or decimal number. int truncates, it does not round.', 'int("25")\nfloat("3.5")'),
    T('str()', 'builtins', 'يحوّل أي قيمة إلى نص.', 'Converts any value to a string.', 'str(25) + " سنة"'),
    T('bool()', 'builtins', 'يحوّل إلى قيمة منطقية. الفراغ والصفر False.', 'Converts to a boolean. Empty values and zero are False.', 'bool("")   # False'),
    T('range()', 'builtins', 'يولّد متتالية أعداد. النهاية غير مشمولة.', 'Generates a sequence of numbers. The stop is excluded.', 'range(1, 10, 2)   # 1 3 5 7 9'),
    T('sum()', 'builtins', 'يجمع عناصر مجموعة عددية.', 'Adds up the items of a numeric collection.', 'sum([10, 20])   # 30'),
    T('min() / max()', 'builtins', 'أصغر أو أكبر عنصر، ويقبلان key.', 'The smallest or largest item; both accept a key.', 'max(items, key=lambda i: i["price"])'),
    T('sorted()', 'builtins', 'يُعيد قائمة مرتّبة جديدة ولا يغيّر الأصل.', 'Returns a new sorted list, leaving the original alone.', 'sorted(nums, reverse=True)'),
    T('round()', 'builtins', 'يقرّب عدداً إلى خانات محدّدة.', 'Rounds a number to a given number of places.', 'round(3.14159, 2)   # 3.14'),
    T('abs()', 'builtins', 'القيمة المطلقة.', 'The absolute value.', 'abs(-7)   # 7'),
    T('enumerate()', 'builtins', 'يُعطي الفهرس والعنصر معاً.', 'Yields the index and the item together.', 'for i, x in enumerate(items, 1):'),
    T('zip()', 'builtins', 'يدمج مجموعتين عنصراً بعنصر.', 'Pairs up two collections item by item.', 'zip(names, grades)'),
    T('map() / filter()', 'builtins', 'يطبّق دالة على الكل أو ينتقي بعضها.', 'Applies a function to all items, or selects some.', 'list(map(str.upper, words))'),
    T('any() / all()', 'builtins', 'هل تحقّق شرطٌ في عنصر واحد أو في الكل.', 'Whether a condition holds for any item, or for all.', 'all(n > 0 for n in nums)'),
    T('isinstance()', 'builtins', 'يفحص إن كانت القيمة من نوع معيّن.', 'Checks whether a value is of a given type.', 'isinstance(x, int)'),
    T('open()', 'builtins', 'يفتح ملفاً. استخدمه مع with دائماً.', 'Opens a file. Always use it with with.', 'with open("f.txt", encoding="utf-8") as f:'),

    /* ---------- دوال النصوص / string methods ---------- */
    T('.upper() / .lower()', 'str', 'يحوّل النص لأحرف كبيرة أو صغيرة.', 'Converts the text to upper or lower case.', '"abc".upper()   # ABC'),
    T('.strip()', 'str', 'يحذف المسافات من الطرفين.', 'Removes whitespace from both ends.', '"  hi  ".strip()   # hi'),
    T('.split()', 'str', 'يقسم النص إلى قائمة عند فاصل.', 'Splits the text into a list at a separator.', '"a,b".split(",")   # ["a","b"]'),
    T('.join()', 'str', 'يدمج قائمة نصوص بفاصل.', 'Joins a list of strings with a separator.', '", ".join(["a","b"])   # a, b'),
    T('.replace()', 'str', 'يستبدل كل تطابق بنصّ آخر.', 'Replaces every match with other text.', '"a-b".replace("-", " ")'),
    T('.startswith() / .endswith()', 'str', 'هل يبدأ أو ينتهي بنصّ معيّن.', 'Whether it starts or ends with given text.', '"file.py".endswith(".py")'),
    T('.find() / .index()', 'str', 'موضع أول ظهور. find تُعيد ‎-1‎ والأخرى ترفع خطأً.', 'Position of the first occurrence. find returns -1; index raises.', '"python".find("y")   # 1'),
    T('.count()', 'str', 'عدد مرات تكرار جزء داخل النص.', 'How many times a part occurs in the text.', '"aaa".count("a")   # 3'),
    T('.title() / .capitalize()', 'str', 'حرف أول كبير لكل كلمة، أو للجملة.', 'Capitalises each word, or just the sentence.', '"ali baba".title()'),
    T('f-string', 'str', 'يُدرج قيماً داخل نص. الطريقة المعتمدة للتنسيق.', 'Embeds values inside text. The standard formatting approach.', 'f"{name} عمره {age} — {price:.2f}"'),

    /* ---------- دوال القوائم / list methods ---------- */
    T('.append()', 'list', 'يضيف عنصراً واحداً في النهاية.', 'Adds a single item at the end.', 'items.append("x")'),
    T('.insert()', 'list', 'يضيف عنصراً في موضع محدّد.', 'Inserts an item at a given position.', 'items.insert(0, "أول")'),
    T('.extend()', 'list', 'يضيف كل عناصر مجموعة أخرى.', 'Adds all items from another collection.', 'items.extend([1, 2])'),
    T('.remove()', 'list', 'يحذف أول عنصر يطابق القيمة.', 'Removes the first item matching a value.', 'items.remove("x")'),
    T('.pop()', 'list', 'يحذف عنصراً بالفهرس ويُعيده.', 'Removes an item by index and returns it.', 'last = items.pop()'),
    T('.sort()', 'list', 'يرتّب القائمة في مكانها ويُعيد None.', 'Sorts the list in place and returns None.', 'items.sort(key=len, reverse=True)'),
    T('.reverse()', 'list', 'يعكس ترتيب القائمة في مكانها.', 'Reverses the list in place.', 'items.reverse()'),
    T('.copy()', 'list', 'ينشئ نسخة مستقلّة. ‎b = a‎ لا ينسخ!', 'Creates an independent copy. b = a does not copy!', 'backup = items.copy()'),
    T('.index() / .count()', 'list', 'موضع عنصر، أو عدد تكراره.', 'The position of an item, or how often it occurs.', 'items.index("x")'),
    T('[start:stop:step]', 'list', 'التقطيع. النهاية غير مشمولة.', 'Slicing. The stop index is excluded.', 'items[1:3]\nitems[::-1]   # معكوسة'),
    T('[expr for x in xs]', 'list', 'اختصار القوائم — يبني قائمة في سطر.', 'A comprehension — builds a list in one line.', '[n * 2 for n in nums if n > 0]'),

    /* ---------- دوال القواميس / dict methods ---------- */
    T('.get()', 'dict', 'يقرأ مفتاحاً بأمان مع قيمة بديلة.', 'Reads a key safely with a fallback value.', 'd.get("phone", "غير مسجّل")'),
    T('.keys() / .values()', 'dict', 'كل المفاتيح أو كل القيم.', 'All the keys, or all the values.', 'list(d.keys())'),
    T('.items()', 'dict', 'أزواج المفتاح والقيمة، للمرور عليها.', 'Key–value pairs, for looping.', 'for k, v in d.items():'),
    T('.setdefault()', 'dict', 'يُعيد القيمة، وينشئها إن لم توجد.', 'Returns the value, creating it if absent.', 'groups.setdefault(key, []).append(x)'),
    T('.update()', 'dict', 'يدمج قاموساً آخر داخله.', 'Merges another dictionary into it.', 'settings.update({"theme": "dark"})'),
    T('.pop()', 'dict', 'يحذف مفتاحاً ويُعيد قيمته.', 'Removes a key and returns its value.', 'd.pop("temp", None)'),
    T('{k: v for …}', 'dict', 'اختصار القواميس.', 'A dictionary comprehension.', '{w: len(w) for w in words}'),

    /* ---------- العوامل / operators ---------- */
    T('+  -  *  /', 'operators', 'الجمع والطرح والضرب والقسمة. ‎/‎ تُنتج float دائماً.', 'Add, subtract, multiply, divide. / always yields a float.', '10 / 4   # 2.5'),
    T('//', 'operators', 'القسمة الصحيحة — تُهمل الكسر.', 'Floor division — drops the fraction.', '10 // 4   # 2'),
    T('%', 'operators', 'باقي القسمة. يُستخدم لفحص القابلية للقسمة.', 'The remainder. Used to test divisibility.', 'n % 2 == 0   # زوجي'),
    T('**', 'operators', 'الأُسّ.', 'Exponentiation.', '2 ** 10   # 1024'),
    T('==  !=', 'operators', 'المساواة وعدمها. ‎=‎ للإسناد لا للمقارنة!', 'Equality and inequality. A single = assigns, it does not compare!', 'if x == 5:'),
    T('<  >  <=  >=', 'operators', 'المقارنات، وتقبل السلسلة.', 'Comparisons; they can be chained.', 'if 18 <= age <= 65:'),
    T('+=  -=  *=  /=', 'operators', 'اختصارات التعديل في المكان.', 'Shorthand in-place updates.', 'total += price'),

    /* ---------- الأخطاء / exceptions ---------- */
    T('SyntaxError', 'errors', 'الكود غير مفهوم نحوياً — قوس أو نقطتان ناقصة.', 'The code is not valid Python — a missing bracket or colon.', 'print("hi"   # قوس ناقص'),
    T('IndentationError', 'errors', 'إزاحة خاطئة أو خلط مسافات بـ Tab.', 'Wrong indentation, or spaces mixed with tabs.', 'if x:\nprint(x)   # ينقص إزاحة'),
    T('NameError', 'errors', 'اسم غير معرّف — خطأ إملائي أو استخدام قبل التعريف.', 'Undefined name — a typo, or use before definition.', 'print(totl)   # المقصود total'),
    T('TypeError', 'errors', 'نوع غير مناسب للعملية.', 'The wrong type for the operation.', '"5" + 5'),
    T('ValueError', 'errors', 'النوع صحيح لكن القيمة غير صالحة.', 'The type is right but the value is invalid.', 'int("abc")'),
    T('IndexError', 'errors', 'فهرس خارج نطاق القائمة.', 'An index beyond the end of the list.', '[1, 2][5]'),
    T('KeyError', 'errors', 'مفتاح غير موجود في القاموس.', 'A key that does not exist in the dictionary.', 'd["missing"]'),
    T('ZeroDivisionError', 'errors', 'قسمة على صفر.', 'Division by zero.', '10 / 0'),
    T('AttributeError', 'errors', 'دالة أو خاصية غير موجودة لهذا النوع.', 'No such method or attribute on this type.', '"نص".append("x")'),
    T('FileNotFoundError', 'errors', 'الملف المطلوب غير موجود.', 'The requested file does not exist.', 'open("missing.txt")'),

    /* ---------- المكتبة القياسية / standard library ---------- */
    T('math', 'stdlib', 'دوال رياضية: الجذر والتقريب وπ.', 'Mathematical functions: roots, rounding, pi.', 'math.sqrt(16)\nmath.ceil(4.1)'),
    T('random', 'stdlib', 'العشوائية: أعداد واختيار وخلط.', 'Randomness: numbers, picking, shuffling.', 'random.randint(1, 6)\nrandom.choice(items)'),
    T('datetime', 'stdlib', 'التواريخ والأوقات وتنسيقها.', 'Dates, times and their formatting.', 'datetime.now().strftime("%Y-%m-%d")'),
    T('json', 'stdlib', 'تحويل بين كائنات بايثون ونص JSON.', 'Converting between Python objects and JSON text.', 'json.dumps(data, ensure_ascii=False)'),
    T('collections.Counter', 'stdlib', 'يحصي تكرار العناصر في سطر واحد.', 'Counts item frequencies in a single line.', 'Counter(votes).most_common(1)'),
    T('statistics', 'stdlib', 'المتوسّط والوسيط والانحراف المعياري.', 'Mean, median and standard deviation.', 'statistics.mean(scores)'),
    T('pathlib.Path', 'stdlib', 'مسارات الملفات بأسلوب حديث يعمل على كل نظام.', 'Modern file paths that work on every OS.', 'Path("data") / "file.txt"'),
    T('itertools', 'stdlib', 'أدوات تكرار متقدّمة: تباديل وتجميعات.', 'Advanced iteration tools: permutations and combinations.', 'itertools.combinations(items, 2)'),
    T('re', 'stdlib', 'التعابير النمطية للبحث في النصوص.', 'Regular expressions for searching text.', 're.findall(r"\\d+", text)'),
    T('csv', 'stdlib', 'قراءة وكتابة ملفات الجداول.', 'Reading and writing spreadsheet files.', 'csv.DictReader(f)')
  ];

  global.REFERENCE = { cats: CATS, tags: TAGS };
})(window);
