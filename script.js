// Keep the fixed header compact after the page starts moving.
(function () {
    const header = document.querySelector('.site-header');
    if (!header) return;
    function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
})();

// Homepage translations and automatic language selection.
(function () {
    let select = document.getElementById('languageSelect');
    if (!select) {
        const label = document.createElement('label');
        label.className = 'language-picker';
        label.innerHTML = '<span class="language-globe" aria-hidden="true"></span><span class="sr-only" data-language-label>Language</span><select id="languageSelect" aria-label="Language"><option value="en">English</option><option value="ru">Русский</option><option value="he">עברית</option></select>';
        const nav = document.querySelector('.site-nav');
        if (nav) nav.appendChild(label);
        else document.querySelector('.wrap')?.prepend(label);
        select = label.querySelector('select');
    }

    const translations = {
        ru: {
            'nav.gallery': 'AI-галерея', 'nav.faq': 'Частые вопросы', 'nav.pricing': 'Цены', 'nav.contact': 'Контакты', 'nav.download': 'Скачать приложение',
            'language.label': 'Язык', 'language.auto': 'Авто', 'banner.kicker': 'Умная AI-галерея', 'banner.title': 'Ваша фотоплёнка,<br><em>отфильтрована</em> и рассортирована.', 'banner.description': 'Офлайн-галерея с искусственным интеллектом для порядка в фотографиях: очистка от лишнего, распознавание лиц, умный поиск и сортировка по людям, событиям и моментам.', 'banner.learn': 'Как это работает',
            'hero.kicker': 'Как это работает', 'hero.title': 'Ваши фотографии,<br>организованные по-вашему.', 'hero.description': 'Наведите порядок в тысячах моментов на телефоне. Находите важное, удаляйте лишнее и создавайте свою галерею.', 'hero.features': 'Возможности',
            'strip.title': 'Чистая галерея автоматически', 'strip.cleanTitle': 'Порядок сохраняется сам', 'strip.cleanText': 'Приложение сортирует беспорядок за вас, чтобы очистить галерею за малую часть прежнего времени. Проверьте, нажмите, готово.', 'strip.momentsTitle': 'Моменты, а не беспорядок', 'strip.momentsText': 'Filtored превращает особенные моменты, затерявшиеся среди сотен фотографий, в события, чтобы галерея рассказывала вашу историю.', 'strip.searchTitle': 'Находите за секунды', 'strip.searchText': 'Категории фотографий можно искать: найдите любую еду, поездку, документ или сохранённую деталь за секунды.', 'strip.peopleTitle': 'Люди распознаются сразу', 'strip.peopleText': 'Filtored узнаёт близких и собирает их фотографии в профили — от только что сделанных снимков до почти забытых моментов, <strong>всё в одном месте.</strong>', 'strip.timeTitle': 'Ваше время ценно', 'strip.timeText': 'Тратьте меньше времени на поиск, сортировку и очистку фотографий, а больше — на действительно важное.',
            'privacy.title': 'Ваши фотографии не покидают телефон', 'privacy.description': 'Весь AI работает на устройстве. Никаких загрузок, аккаунтов и мелких оговорок под обещаниями конфиденциальности. В авиарежиме всё работает так же.', 'privacy.firstTitle': 'Конфиденциальность прежде всего', 'privacy.firstText': 'Ваши фотографии остаются личными и обрабатываются прямо на телефоне.', 'privacy.accountTitle': 'Аккаунт не нужен', 'privacy.accountText': 'Установите, просканируйте, готово. Регистрироваться не нужно.', 'privacy.offlineTitle': 'Создано для работы офлайн', 'privacy.offlineText': 'Ваша галерея остаётся умной даже без подключения.', 'cta.title': 'Filtored уже здесь', 'cta.description': 'Бесплатно в Google Play. Ваши фотографии остаются на телефоне.', 'cta.getItOn': 'Скачать в', 'footer.rights': '© 2026 Filtored. Все права защищены.', 'footer.privacy': 'Конфиденциальность'
        },
        he: {
            'nav.gallery': 'גלריית AI', 'nav.faq': 'שאלות נפוצות', 'nav.pricing': 'מחירים', 'nav.contact': 'צור קשר', 'nav.download': 'הורדת האפליקציה',
            'language.label': 'שפה', 'language.auto': 'אוטומטי', 'banner.kicker': 'גלריית AI חכמה', 'banner.title': 'גלריית התמונות שלך,<br><em>מסוננת</em> וממוינת.', 'banner.description': 'גלריית תמונות חכמה שפועלת ללא חיבור, ומסדרת את התמונות שלך בעזרת AI: ניקוי תמונות, זיהוי פנים, חיפוש חכם ומיון לפי אנשים, אירועים ורגעים.', 'banner.learn': 'איך זה עובד',
            'hero.kicker': 'איך זה עובד', 'hero.title': 'התמונות שלך,<br>מסודרות בדרך שלך.', 'hero.description': 'הכניסו סדר לאלפי הרגעים שחיים בטלפון שלכם. מצאו את מה שחשוב, פנו את מה שלא, והפכו את הגלריה לשלכם.', 'hero.features': 'לכל היכולות',
            'strip.title': 'גלריה נקייה יותר, באופן אוטומטי', 'strip.cleanTitle': 'הספרייה נשארת מסודרת', 'strip.cleanText': 'Filtored ממיין את העומס עבורכם, כך שתוכלו לנקות את הגלריה בחלק קטן מהזמן. בודקים, לוחצים, סיימנו.', 'strip.momentsTitle': 'רגעים, לא בלגן', 'strip.momentsText': 'כשרגעים מיוחדים נבלעים בין מאות תמונות, Filtored הופך אותם לאירועים כדי שהגלריה שלכם תספר את הסיפור.', 'strip.searchTitle': 'מוצאים בשניות', 'strip.searchText': 'אפשר לחפש בקטגוריות התמונות שלכם, כך שמציאת כל ארוחה, טיול, מסמך או פרט ששמרתם לוקחת שניות.', 'strip.peopleTitle': 'האנשים מזוהים מיד', 'strip.peopleText': 'Filtored מזהה את האנשים בחייכם ומרכז את התמונות שלהם בפרופילים — מתמונות שצילמתם עכשיו ועד רגעים שכמעט שכחתם, <strong>הכול במקום אחד.</strong>', 'strip.timeTitle': 'הזמן שלכם יקר', 'strip.timeText': 'השקיעו פחות זמן בחיפוש, מיון וניקוי התמונות, ויותר זמן במה שבאמת חשוב.',
            'privacy.title': 'התמונות שלכם לעולם לא עוזבות את הטלפון', 'privacy.description': 'כל פעולות ה-AI מתבצעות במכשיר. בלי העלאות, בלי חשבון ובלי כוכביות ליד ההבטחה לפרטיות. גם במצב טיסה הכול עובד בדיוק אותו דבר.', 'privacy.firstTitle': 'הפרטיות קודמת לכול', 'privacy.firstText': 'התמונות שלכם נשארות פרטיות ומעובדות ישירות בטלפון.', 'privacy.accountTitle': 'לא צריך חשבון', 'privacy.accountText': 'מתקינים, סורקים, סיימנו. אין צורך להירשם.', 'privacy.offlineTitle': 'נבנתה לעבודה ללא חיבור', 'privacy.offlineText': 'הגלריה נשארת חכמה גם בלי חיבור לאינטרנט.', 'cta.title': 'Filtored כאן', 'cta.description': 'בחינם ב-Google Play. התמונות שלכם נשארות בטלפון.', 'cta.getItOn': 'להורדה ב-', 'footer.rights': '© 2026 Filtored. כל הזכויות שמורות.', 'footer.privacy': 'פרטיות'
        }
    };

    const translatableElements = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
    translatableElements.forEach(function (element) {
        element.dataset.i18nDefault = element.innerHTML;
    });

    const languagePicker = select.parentElement;
    const languageOptions = Array.prototype.slice.call(select.options).map(function (option) {
        return { value: option.value, label: option.textContent };
    });
    languagePicker.classList.add('is-customized');
    languagePicker.insertAdjacentHTML('beforeend', '<button class="language-trigger" type="button" aria-haspopup="listbox" aria-expanded="false"></button><div class="language-menu" role="listbox"></div>');
    const trigger = languagePicker.querySelector('.language-trigger');
    const menu = languagePicker.querySelector('.language-menu');
    languageOptions.forEach(function (option) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'language-option';
        item.dataset.value = option.value;
        item.textContent = option.label;
        item.setAttribute('role', 'option');
        item.addEventListener('click', function () {
            select.value = option.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            closeMenu();
        });
        menu.appendChild(item);
    });

    function closeMenu() {
        languagePicker.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function () {
        const isOpen = languagePicker.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (event) {
        if (!languagePicker.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeMenu();
    });

    const pageTranslations = {
        gallery: {
            ru: { '.site-nav a': ['Главная', 'Частые вопросы', 'Цены', 'Контакты', 'Скачать приложение'], '.seo-hero .kicker': 'AI-галерея', '.seo-hero h1': 'Приватная AI-галерея для Android', '.seo-lede': 'Filtored превращает переполненную фотоплёнку в чистую библиотеку, где легко искать фотографии. Приложение находит дубликаты, организует людей и моменты и обрабатывает всё на телефоне.', '.seo-actions a': ['Скачать Filtored', 'Читать FAQ'], '.seo-grid h2': ['Умный поиск фотографий', 'Очистка от дубликатов', 'Конфиденциальность на устройстве'], '.seo-grid p': ['Находите фотографии по тому, что на них изображено, кто на них запечатлён и к каким моментам они относятся.', 'Проверяйте дубликаты и похожие фотографии, чтобы галереей было проще управлять.', 'Основная AI-организация работает на Android-устройстве, поэтому фотографии остаются личными.'], '.seo-section h2': ['Чем Filtored отличается от обычной галереи?', 'Для кого создана эта AI-галерея?', 'Работает ли Filtored офлайн?'], '.seo-section p': ['Обычная галерея в основном показывает фотографии по датам. Filtored организует фотографии с помощью AI: группирует людей, выделяет события, находит дубликаты и делает фотоплёнку доступной для поиска без аккаунта для основных функций.', 'Filtored создан для людей, у которых на Android-телефоне тысячи фотографий и которым нужен более быстрый способ очистить, найти и организовать галерею.', 'Да. Filtored построен на AI, работающем на устройстве. Основные функции организации фотографий работают на телефоне, и для обычного использования фотографии не нужно загружать.'], '.seo-section li': ['Тем, кто хочет удалить дубликаты фотографий.', 'Тем, кто хочет группировать фотографии по лицам, событиям и моментам.', 'Тем, кому нужна приватная организация фотографий на устройстве.', 'Тем, кто хочет умную галерею без создания ещё одного аккаунта.'], '.foot-left span:last-child': '© 2026 Filtored. Все права защищены.', '.foot-links a': ['Скачать', 'Частые вопросы', 'Конфиденциальность'] },
            he: { '.site-nav a': ['דף הבית', 'שאלות נפוצות', 'מחירים', 'צור קשר', 'הורדת האפליקציה'], '.seo-hero .kicker': 'גלריית AI', '.seo-hero h1': 'גלריית AI פרטית לאנדרואיד', '.seo-lede': 'Filtored הופך גלריית תמונות עמוסה לספרייה נקייה שקל לחפש בה. הוא מוצא תמונות כפולות, מסדר אנשים ורגעים, ומשאיר את העיבוד בטלפון שלכם.', '.seo-actions a': ['הורדת Filtored', 'לקריאת השאלות הנפוצות'], '.seo-grid h2': ['חיפוש תמונות חכם', 'ניקוי תמונות כפולות', 'פרטיות במכשיר'], '.seo-grid p': ['מצאו תמונות לפי מה שמופיע בהן, מי מופיע בהן ולאילו רגעים הן שייכות.', 'בדקו תמונות כפולות ודומות כדי שיהיה קל יותר לנהל את הגלריה.', 'ארגון ה-AI המרכזי מתבצע במכשיר האנדרואיד שלכם, כך שהתמונות נשארות פרטיות.'], '.seo-section h2': ['מה הופך את Filtored לשונה מאפליקציית גלריה רגילה?', 'למי גלריית ה-AI הזו מתאימה?', 'האם Filtored הוא מארגן תמונות AI שפועל ללא חיבור?'], '.seo-section p': ['גלריה רגילה מציגה בעיקר תמונות לפי תאריך. Filtored הוא מארגן תמונות מבוסס AI: הוא עוזר לקבץ אנשים, להציג אירועים, למצוא תמונות כפולות ולהפוך את גלריית התמונות לחיפושית, בלי צורך בחשבון עבור הפונקציות המרכזיות.', 'Filtored נבנה עבור אנשים עם אלפי תמונות בטלפון האנדרואיד שרוצים דרך מהירה יותר לנקות, לחפש ולסדר את הגלריה.', 'כן. Filtored מבוסס על AI במכשיר. הפונקציות המרכזיות של ארגון התמונות פועלות בטלפון, ואין צורך להעלות תמונות לשימוש רגיל.'], '.seo-section li': ['אנשים שרוצים להסיר תמונות כפולות.', 'אנשים שרוצים לקבץ תמונות לפי פנים, אירועים ורגעים.', 'אנשים שרוצים ארגון תמונות פרטי במכשיר.', 'אנשים שרוצים גלריה חכמה בלי ליצור חשבון נוסף.'], '.foot-left span:last-child': '© 2026 Filtored. כל הזכויות שמורות.', '.foot-links a': ['הורדה', 'שאלות נפוצות', 'פרטיות'] }
        },
        contact: {
            ru: { '.site-nav a': ['Главная', 'Частые вопросы', 'Цены', 'Скачать приложение'], '.contact-wrap h1': 'Свяжитесь с нами', '.contact-intro': 'Вопросы, сообщения об ошибках и идеи — мы читаем всё и отвечаем почти на каждое сообщение.', '.contact-card h2': ['Напишите нам', 'Будьте на связи'], '.contact-card p': ['Самый быстрый способ связаться с нами. Обычно мы отвечаем в течение одного-двух дней.', 'Советы, новости и материалы изнутри.'], '.foot-left span:last-child': '© 2026 Filtored. Все права защищены.', '.foot-links a': ['Частые вопросы', 'Конфиденциальность'] },
            he: { '.site-nav a': ['דף הבית', 'שאלות נפוצות', 'מחירים', 'הורדת האפליקציה'], '.contact-wrap h1': 'צרו קשר', '.contact-intro': 'שאלות, דיווחי באגים ורעיונות — אנחנו קוראים הכול ומשיבים לרוב הפניות.', '.contact-card h2': ['כתבו לנו', 'הישארו מעודכנים'], '.contact-card p': ['הדרך המהירה ביותר ליצור קשר. בדרך כלל אנחנו עונים בתוך יום או יומיים.', 'טיפים, עדכונים והצצה אל מאחורי הקלעים.'], '.foot-left span:last-child': '© 2026 Filtored. כל הזכויות שמורות.', '.foot-links a': ['שאלות נפוצות', 'פרטיות'] }
        },
        download: {
            ru: { '.site-nav a': ['Главная', 'Частые вопросы', 'Цены', 'Контакты'], '.dl-copy h1': 'Скачайте Filtored<br>на телефон', '.dl-lede': 'Чистая галерея для важных моментов с умной организацией прямо на телефоне.', '.dl-actions .play-badge-text small': 'Скачать в', '.foot-left span:last-child': '© 2026 Filtored. Все права защищены.', '.foot-links a': ['Контакты', 'Частые вопросы', 'Конфиденциальность'] },
            he: { '.site-nav a': ['דף הבית', 'שאלות נפוצות', 'מחירים', 'צור קשר'], '.dl-copy h1': 'הורידו את Filtored<br>לטלפון שלכם', '.dl-lede': 'גלריה נקייה יותר לרגעים החשובים, עם ארגון חכם שפועל ישירות בטלפון שלכם.', '.dl-actions .play-badge-text small': 'להורדה ב-', '.foot-left span:last-child': '© 2026 Filtored. כל הזכויות שמורות.', '.foot-links a': ['צור קשר', 'שאלות נפוצות', 'פרטיות'] }
        },
        pricing: {
            ru: { '.site-nav a': ['Главная', 'Частые вопросы', 'Контакты', 'Скачать приложение'], '.pricing-heading h1': 'Больше возможностей', '.pricing-heading p': 'Выберите вариант Filtored для своей галереи. В любом случае фотографии остаются на телефоне.', '.billing-toggle button': ['Ежемесячно', 'Ежегодно'], '.billing-note': 'Экономия от 16%', '.plan-option-tag': ['Начните здесь', 'Популярный выбор', 'Всё без ограничений'], '.plan-name-text': ['Бесплатный', 'Плюс', 'Премиум'], '.plan-option-desc': ['Всё необходимое для чистой галереи.', 'Больше возможностей для очистки и редактирования профилей.', 'Полный набор возможностей Filtored для вашей библиотеки.'], '.plan-cta .btn': 'Выбрать Плюс', '.plan-table th': ['Возможности', 'Бесплатный', 'Плюс', 'Премиум'], '.plan-table td:first-child': ['Сканирование и организация всего', 'Умный поиск', 'Удаление фотографий вручную', 'Инструменты очистки', 'Уникальные профили', 'Выбор темы', 'Премиум-темы и фоны'], '.pricing-footnote': 'Без аккаунта. Без загрузок. Без неожиданных платежей.' },
            he: { '.site-nav a': ['דף הבית', 'שאלות נפוצות', 'צור קשר', 'הורדת האפליקציה'], '.pricing-heading h1': 'יותר אפשרויות', '.pricing-heading p': 'בחרו את הדרך שבה Filtored מתאים לגלריה שלכם. בכל אפשרות התמונות נשארות בטלפון.', '.billing-toggle button': ['חודשי', 'שנתי'], '.billing-note': 'חיסכון של 16% ומעלה', '.plan-option-tag': ['מתחילים כאן', 'הפופולרי ביותר', 'הכול ללא הגבלה'], '.plan-name-text': ['חינמי', 'פלוס', 'פרימיום'], '.plan-option-desc': ['כל מה שצריך לגלריה נקייה יותר.', 'יותר כוח לניקוי ולעריכת פרופילים.', 'חוויית Filtored המלאה לספרייה שלכם.'], '.plan-cta .btn': 'בחירת פלוס', '.plan-table th': ['יתרונות', 'חינמי', 'פלוס', 'פרימיום'], '.plan-table td:first-child': ['סריקה וארגון של הכול', 'חיפוש חכם', 'מחיקת תמונות ידנית', 'כלי ניקוי', 'פרופילים ייחודיים', 'בחירת ערכת נושא', 'ערכות נושא ורקעים פרימיום'], '.pricing-footnote': 'בלי חשבון. בלי העלאות. בלי חיובים מפתיעים.' }
        },
        privacy: {
            ru: { '.site-nav a': ['Главная', 'AI-галерея', 'Частые вопросы', 'Цены', 'Контакты', 'Скачать приложение'], '.foot-links a': ['Контакты', 'Частые вопросы', 'Конфиденциальность'], '.wrap > h1': 'Политика конфиденциальности Filtored AI Gallery', '.wrap > p': ['Последнее обновление: 12 мая 2026 г.', 'Filtored создан для организации ваших материалов с заботой о конфиденциальности. По умолчанию обработка происходит на устройстве. В этой политике объясняется, какие данные используются, где они обрабатываются и какие настройки вам доступны.', 'Приложению не нужен вход в аккаунт для основных функций, и оно не собирает контакты, сообщения или точные данные о местоположении.', 'Если вы используете дополнительную удалённую обработку, выбирайте надёжную инфраструктуру и по возможности HTTPS для защиты данных при передаче.', 'Filtored предназначен для широкой аудитории и не рассчитан на детей младше 13 лет.', 'Мы можем обновлять эту политику по мере развития функций. Дата «Последнее обновление» будет отражать последнюю версию.', 'По вопросам конфиденциальности используйте контактные данные на странице приложения в магазине.'], '.wrap > h2': ['Какие данные использует приложение', 'Как работает обработка', 'Хранение и срок хранения', 'Передача данных', 'Разрешения и настройки', 'Безопасность', 'Конфиденциальность детей', 'Изменения политики', 'Контакты'], '.wrap > ul li': ['Фотографии и видео из вашей библиотеки, к которым вы разрешили доступ приложению', 'Производные данные, созданные приложением (например, теги, группы, кластеры дубликатов и похожих фото, избранное, состояние скрытых файлов и корзины, версии сканирования)', 'Базовые технические данные, необходимые для работы функций (например, журнал прогресса и ошибок сканирования)', '<strong>На устройстве (по умолчанию)</strong>: сканирование, добавление тегов, группировка, поиск дубликатов и похожих фото, а также организация по лицам и объектам выполняются локально.', '<strong>Дополнительная обработка на сервере</strong>: если вы явно включите загрузку на сервер или настроите сервер, выбранные фотографии могут быть отправлены туда для дополнительного анализа. Вы управляете этим в настройках.', '<strong>На устройстве</strong>: приложение хранит метаданные локально, чтобы поиск, организация, скрытые файлы и корзина работали быстро.', '<strong>Корзина</strong>: удалённые при организации материалы перемещаются в корзину и могут быть восстановлены до окончательного удаления.', '<strong>Дополнительный сервер</strong>: если вы его включили, хранение и срок хранения определяются оператором и настройками этого сервера.', 'По умолчанию ваши материалы не передаются третьим сторонам.', 'Если вы включите дополнительную обработку на сервере, данные передаются настроенному вами серверу.', '<strong>Доступ к материалам</strong>: нужен для чтения и организации фотографий и видео.', '<strong>Уведомления и работа в фоне (зависит от платформы)</strong>: могут использоваться для показа прогресса длительного сканирования.', '<strong>Скрытые файлы / Safe</strong>: чувствительные материалы можно поместить в защищённое хранилище с аутентификацией устройства, если это поддерживается.', '<strong>Сброс настроек</strong>: в любой момент можно очистить теги, запустить сканирование заново и отключить дополнительное использование сервера в настройках.'] },
            he: { '.site-nav a': ['דף הבית', 'גלריית AI', 'שאלות נפוצות', 'מחירים', 'צור קשר', 'הורדת האפליקציה'], '.foot-links a': ['צור קשר', 'שאלות נפוצות', 'פרטיות'], '.wrap > h1': 'מדיניות הפרטיות של Filtored AI Gallery', '.wrap > p': ['עדכון אחרון: 12 במאי 2026', 'Filtored נועדה לארגן את המדיה שלכם תוך מתן עדיפות לפרטיות. כברירת מחדל, העיבוד מתבצע במכשיר שלכם. מדיניות זו מסבירה אילו נתונים נמצאים בשימוש, היכן הם מעובדים ואילו אפשרויות שליטה עומדות לרשותכם.', 'האפליקציה אינה דורשת התחברות לחשבון עבור הפונקציות המרכזיות ואינה אוספת אנשי קשר, הודעות או נתוני מיקום מדויקים.', 'אם אתם משתמשים בעיבוד מרוחק, השתמשו בתשתית אמינה וב-HTTPS ככל האפשר כדי להגן על הנתונים בזמן העברה.', 'Filtored מיועדת לקהל הרחב ואינה מיועדת לילדים מתחת לגיל 13.', 'אנו עשויים לעדכן מדיניות זו ככל שהפונקציות מתפתחות. תאריך העדכון האחרון ישקף את הגרסה העדכנית ביותר.', 'לשאלות בנושא פרטיות, השתמשו בפרטי הקשר בדף האפליקציה בחנות.'], '.wrap > h2': ['באילו נתונים האפליקציה משתמשת', 'איך העיבוד עובד', 'אחסון ושמירת נתונים', 'שיתוף', 'הרשאות ובקרות', 'אבטחה', 'פרטיות ילדים', 'שינויים במדיניות', 'צור קשר'], '.wrap > ul li': ['תמונות וסרטונים בספרייה שלכם שהרשיתם לאפליקציה לגשת אליהם', 'מטא-נתונים שהאפליקציה יוצרת (למשל: תגיות, קבוצות, אשכולות של תמונות כפולות או דומות, מועדפים, מצב מוסתר או אשפה וגרסאות סריקה)', 'נתוני אבחון טכניים בסיסיים הדרושים להפעלת הפונקציות (למשל: יומני התקדמות ושגיאות סריקה)', '<strong>במכשיר (ברירת מחדל)</strong>: סריקה, תיוג, קיבוץ, זיהוי תמונות כפולות או דומות וארגון לפי פנים או אובייקטים מתבצעים באופן מקומי.', '<strong>עיבוד שרת אופציונלי</strong>: אם תפעילו במפורש העלאות או תגדירו שרת, תמונות נבחרות עשויות להישלח אליו לניתוח נוסף. השליטה בכך נמצאת בהגדרות.', '<strong>במכשיר</strong>: האפליקציה שומרת את המטא-נתונים באופן מקומי כדי שפונקציות החיפוש, הארגון, הפריטים המוסתרים והאשפה יעבדו במהירות.', '<strong>אשפה</strong>: פריטים שהסרתם בתהליכי הארגון מועברים לאשפה וניתן לשחזר אותם עד למחיקה לצמיתות.', '<strong>שרת אופציונלי</strong>: אם הפעלתם אותו, האחסון ומשך השמירה נשלטים על ידי המפעיל וההגדרות של אותו שרת.', 'כברירת מחדל, המדיה שלכם אינה משותפת עם צדדים שלישיים.', 'אם תפעילו עיבוד שרת אופציונלי, הנתונים ישותפו עם השרת שהגדרתם.', '<strong>הרשאת מדיה</strong>: נדרשת לקריאה ולארגון של תמונות וסרטונים.', '<strong>התראות ופעילות ברקע (תלוי פלטפורמה)</strong>: עשויות לשמש להצגת התקדמות בזמן סריקות ארוכות.', '<strong>מוסתר / Safe</strong>: ניתן למקם פריטים רגישים באחסון מוסתר המוגן באימות המכשיר, במכשירים נתמכים.', '<strong>בקרות איפוס</strong>: ניתן לנקות תגיות, לסרוק מחדש ולהשבית שימוש אופציונלי בשרת בכל עת דרך ההגדרות.'] }
        },
        faq: {
            ru: { '.site-nav a': ['Главная', 'Контакты', 'Цены', 'Скачать приложение'], '.faq-wrap h1': 'Ответы на вопросы', '.faq-intro': 'Коротко обо всём, о чём нас обычно спрашивают.', '.faq-item summary': ['Filtored бесплатен?', 'Мои фотографии куда-нибудь загружаются?', 'Нужен ли аккаунт?', 'На каких телефонах это работает?', 'Есть ли версия для iPhone?', 'Может ли приложение удалить фотографии без моего разрешения?', 'Нашли ошибку или есть идея?'], '.faq-item p': ['Да. Filtored можно бесплатно скачать в Google Play.', 'Нет. Весь AI работает на телефоне. Ничего не отправляется на сервер — в авиарежиме приложение работает точно так же.', 'Нет. Установите, просканируйте, готово. Регистрироваться не нужно.', 'На любом Android-телефоне с Android 5.0 или новее и примерно 100 МБ свободного места.', 'Пока нет. Filtored в первую очередь для Android. Версию для iPhone мы хотели бы сделать позже.', 'Никогда. Filtored только предлагает дубликаты и неудачные снимки — ничего не удаляется, пока вы сами не проверите и не подтвердите действие.', 'Мы хотим услышать об этом — свяжитесь с нами через страницу контактов.'], '.faq-more': 'Не нашли ответ? <a href="../contact/index.html">Напишите нам напрямую.</a>', '.foot-left span:last-child': '© 2026 Filtored. Все права защищены.', '.foot-links a': ['Контакты', 'Конфиденциальность'] },
            he: { '.site-nav a': ['דף הבית', 'צור קשר', 'מחירים', 'הורדת האפליקציה'], '.faq-wrap h1': 'תשובות לשאלות', '.faq-intro': 'הגרסה הקצרה של כל מה שאנשים שואלים אותנו.', '.faq-item summary': ['האם Filtored חינמית?', 'האם התמונות שלי מועלות למקום כלשהו?', 'האם צריך חשבון?', 'באילו טלפונים האפליקציה עובדת?', 'האם קיימת גרסה לאייפון?', 'האם האפליקציה יכולה למחוק תמונות בלי לשאול אותי?', 'מצאתם באג או יש לכם רעיון?'], '.faq-item p': ['כן. Filtored זמינה להורדה בחינם ב-Google Play.', 'לא. כל פעולות ה-AI מתבצעות בטלפון. שום דבר לא נשלח לשרת — האפליקציה פועלת בדיוק אותו דבר במצב טיסה.', 'לא. מתקינים, סורקים, סיימנו. אין צורך להירשם.', 'בכל טלפון Android עם Android 5.0 ומעלה וכ-100MB של מקום פנוי.', 'עדיין לא. Filtored מתמקדת באנדרואיד. נשמח ליצור גרסה לאייפון בעתיד.', 'לעולם לא. Filtored רק מציעה תמונות כפולות ותמונות לא מוצלחות — שום דבר לא נמחק עד שתבדקו ותאשרו בעצמכם.', 'נשמח לשמוע — פנו אלינו דרך <a href="../contact/index.html">דף יצירת הקשר</a>.'], '.faq-more': 'לא מצאתם תשובה? <a href="../contact/index.html">שאלו אותנו ישירות.</a>', '.foot-left span:last-child': '© 2026 Filtored. כל הזכויות שמורות.', '.foot-links a': ['צור קשר', 'פרטיות'] }
        }
    };

    function browserLanguage() {
        const languages = navigator.languages || [navigator.language || 'en'];
        const match = languages.find(function (language) { return /^(en|ru|he|iw)(-|$)/i.test(language); }) || 'en';
        if (/^ru/i.test(match)) return 'ru';
        if (/^he|^iw/i.test(match)) return 'he';
        return 'en';
    }

    function pageKey() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/ai-photo-gallery/')) return 'gallery';
        if (path.includes('/contact/')) return 'contact';
        if (path.includes('/download/')) return 'download';
        if (path.includes('/faq/')) return 'faq';
        if (path.includes('/pricing/')) return 'pricing';
        if (path.includes('/privacy/')) return 'privacy';
        return '';
    }

    function applyPageTranslations(language) {
        const page = pageTranslations[pageKey()];
        if (!page) return;
        const selectors = Object.assign({}, page.ru, page.he);
        const dictionary = page[language] || {};
        Object.keys(selectors).forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element, index) {
                if (!element.dataset.pageTranslationDefault) element.dataset.pageTranslationDefault = element.innerHTML;
                const translated = dictionary[selector];
                const value = Array.isArray(translated) ? translated[index] : translated;
                element.innerHTML = value || element.dataset.pageTranslationDefault;
            });
        });
        if (pageKey() === 'pricing') {
            const ctaLabels = {
                ru: { free: 'Начать', plus: 'Выбрать Плюс', premium: 'Выбрать Премиум' },
                he: { free: 'מתחילים', plus: 'בחירת פלוס', premium: 'בחירת פרימיום' }
            }[language];
            if (ctaLabels) {
                document.querySelectorAll('.plan-option').forEach(function (option) {
                    option.dataset.ctaText = ctaLabels[option.dataset.plan];
                });
                const activePlan = document.querySelector('.plan-option.is-active');
                const ctaButton = document.querySelector('#planCtaBtn');
                if (activePlan && ctaButton) ctaButton.textContent = activePlan.dataset.ctaText;
            }
        }
    }

    function applyLanguage(language) {
        const activeLanguage = language === 'auto' ? browserLanguage() : language;
        const dictionary = translations[activeLanguage] || {};
        document.documentElement.lang = activeLanguage;
        document.documentElement.dir = activeLanguage === 'he' ? 'rtl' : 'ltr';
        document.documentElement.dataset.language = activeLanguage;
        select.value = activeLanguage;
        translatableElements.forEach(function (element) {
            const value = dictionary[element.dataset.i18n];
            element.innerHTML = value || element.dataset.i18nDefault;
        });
        select.setAttribute('aria-label', dictionary['language.label'] || 'Language');
        const languageLabel = select.parentElement.querySelector('[data-language-label], .sr-only');
        if (languageLabel) languageLabel.textContent = dictionary['language.label'] || 'Language';
        trigger.textContent = select.options[select.selectedIndex]?.textContent || 'Auto';
        menu.querySelectorAll('.language-option').forEach(function (option) {
            option.classList.toggle('is-selected', option.dataset.value === activeLanguage);
            option.setAttribute('aria-selected', String(option.dataset.value === activeLanguage));
        });
        trigger.setAttribute('aria-label', dictionary['language.label'] || 'Language');
        applyPageTranslations(activeLanguage);
        if (pageKey() === 'pricing') {
            window.dispatchEvent(new Event('resize'));
            requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
        }
    }

    const savedLanguage = localStorage.getItem('filtored-language') || 'auto';
    applyLanguage(savedLanguage);
    select.addEventListener('change', function () {
        localStorage.setItem('filtored-language', select.value);
        applyLanguage(select.value);
    });
})();

// Mobile navigation menu
(function () {
    const header = document.querySelector('.site-header');
    const button = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    if (!header || !button || !nav) return;

    function setOpen(isOpen) {
        header.classList.toggle('is-nav-open', isOpen);
        button.setAttribute('aria-expanded', String(isOpen));
        button.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    }

    button.addEventListener('click', function () {
        setOpen(!header.classList.contains('is-nav-open'));
    });

    nav.addEventListener('click', function (event) {
        if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 860) setOpen(false);
    });
})();

// Reveal-on-scroll for sections
(function () {
    const targets = document.querySelectorAll('.private-inner, .strip, .cta, .hero-copy, .hero-shot');
    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (!('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('in'); });
        return;
    }

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
})();

// Staggered slide-up for feature cards
(function () {
    const grid = document.querySelector('.cards');
    if (!grid) return;
    const cards = grid.querySelectorAll('.card');
    cards.forEach(function (el) { el.classList.add('reveal'); });

    function showAll() {
        cards.forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('in');
                // drop reveal classes once done so hover transitions stay snappy
                setTimeout(function () { el.classList.remove('reveal', 'in'); }, 900);
            }, i * 220);
        });
    }

    if (!('IntersectionObserver' in window)) { showAll(); return; }

    const io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            showAll();
            io.disconnect();
        }
    }, { threshold: 0.2 });

    io.observe(grid);
})();

// Fade-up for zigzag panels as they scroll into view
(function () {
    const rows = document.querySelectorAll('.zig-row');
    if (!rows.length) return;

    if (!('IntersectionObserver' in window)) {
        rows.forEach(function (el) { el.classList.add('zig-visible'); });
        return;
    }

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('zig-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    rows.forEach(function (el) { io.observe(el); });
})();

// Hero banner slideshow with dots
(function () {
    const track = document.querySelector('.cta-slides');
    const dotsWrap = document.getElementById('ctaDots');
    if (!track || !dotsWrap) return;

    const slides = Array.prototype.slice.call(track.querySelectorAll('.cta-slide'));
    const count = slides.length;
    if (count < 2) return;

    // clone of the first photo, so the last one keeps sliding forward into it
    const clone = slides[0].cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.alt = '';
    track.appendChild(clone);

    const total = count + 1;
    const step = 100 / total;
    let index = 0;
    let timer;

    track.style.width = (total * 100) + '%';
    slides.concat(clone).forEach(function (s) { s.style.width = step + '%'; });

    const dots = slides.map(function (_, i) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'cta-dot';
        dot.setAttribute('aria-label', 'Show photo ' + (i + 1));
        dot.addEventListener('click', function () { go(i); restart(); });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function move(i, animate) {
        track.style.transition = animate ? '' : 'none';
        track.style.transform = 'translateX(-' + (i * step) + '%)';
        if (!animate) void track.offsetWidth;
    }

    function go(i) {
        index = i;
        move(index, true);
        const active = index % count;
        dots.forEach(function (d, n) { d.setAttribute('aria-current', String(n === active)); });
    }

    track.addEventListener('transitionend', function () {
        if (index === count) {
            index = 0;
            move(0, false);
            track.style.transition = '';
        }
    });

    function restart() {
        clearInterval(timer);
        timer = setInterval(function () { go(index + 1); }, 7000);
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            clearInterval(timer);
            return;
        }

        go(index + 1);
        restart();
    });

    go(0);
    restart();
})();


