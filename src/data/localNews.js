/**
 * Статті, які додаються напряму в код (без CRM).
 *
 * Формат збігається з тим, що віддає CRM (/api/news), тому ці записи
 * підмішуються до списку новин і працюють скрізь: головна, /media, /article/:id.
 *
 * Поля:
 *   id         — рядок, він же слаг у URL: /article/<id>
 *   category   — один із: gr | export | international | buildwithukraine |
 *                zbroyaexpo | investments | analytics | events
 *   createdAt  — ISO-дата, за нею сортується стрічка
 *   published  — false ховає статтю
 *   mainImage  — необовʼязково: URL або шлях; порожній рядок = без картинки
 *   blocks     — [{ id, type: "text" | "subheading" | "image", content, src, alt }]
 *   i18n       — необовʼязково: переклади, які перекривають базові поля.
 *                Базові поля — українською, i18n.en — англійська версія.
 *                Немає перекладу для мови — показується базовий текст.
 */
export const LOCAL_NEWS = [
  {
    // id — той самий UUID, під яким стаття була в CRM. Завдяки цьому вже
    // розіслані посилання /article/3bec57d0-… продовжують відкриватися.
    id: "3bec57d0-0cbf-46cc-a01d-e0de928497e6",
    // Канонічна адреса. Захід за UUID перекидає сюди (ArticlePage → Navigate).
    slug: "rada-zbroiariv-bezperervnist-oboronnykh-zakupivel",
    category: "gr",
    published: true,
    createdAt: "2026-08-14T09:00:00.000Z",
    title:
      "Рада зброярів закликає забезпечити безперервність оборонних закупівель на тлі змін у системі",
    mainImage: "",
    blocks: [
      {
        id: "b1",
        type: "text",
        content:
          "На тлі публічної дискусії та можливих змін у системі оборонних закупівель Українська рада зброярів, найбільше галузеве об'єднання українських виробників озброєння та військової техніки, закликає Міністерство оборони забезпечити безперервність контрактування українського ОПК та постачання необхідного озброєння Силам оборони.",
      },
      {
        id: "b2",
        type: "text",
        content:
          "Для нас це не питання персоналій. Будь-які кадрові, структурні чи процедурні зміни не мають впливати на безперервність забезпечення Сил оборони озброєнням і військовою технікою.",
      },
      {
        id: "b3",
        type: "text",
        content:
          "Станом на середину серпня однією з ключових проблем для української оборонної промисловості залишається недостатній рівень контрактування. За оцінкою учасників ринку, сьогодні законтрактовано до 25% наявних виробничих спроможностей. Без достатнього обсягу замовлень залишаються виробники різних типів озброєння та військової техніки.",
      },
      {
        id: "b4",
        type: "text",
        content: "Це проблема не лише для підприємств.",
      },
      {
        id: "b5",
        type: "text",
        content:
          "Виробництво озброєння має тривалий цикл. Після укладення контракту виробникам необхідно закупити компоненти, організувати виробництво, провести випробування та приймання і лише після цього передати готову продукцію військовим.",
      },
      {
        id: "b6",
        type: "text",
        content:
          "Тому контракт, який не укладено сьогодні, неможливо компенсувати миттєвим збільшенням фінансування через кілька місяців. Затримки з контрактуванням у серпні створюють ризик для обсягів постачання восени та взимку.",
      },
      {
        id: "b7",
        type: "text",
        content:
          "Водночас для самої галузі тривалий період без достатнього внутрішнього замовлення означає ризик втрати інженерів і виробничих команд, скорочення виробничих ліній, зменшення обігових коштів та можливостей інвестувати у вдосконалення і масштабування українських розробок.",
      },
      {
        id: "b8",
        type: "text",
        content:
          "За останні роки українська оборонна промисловість суттєво наростила спроможності у відповідь на запит держави та потреби війська. Важливо не допустити їх втрати через перерви у контрактуванні.",
      },
      {
        id: "b9",
        type: "text",
        content:
          "Окремим викликом залишається фінансування. Допомога міжнародних партнерів є критично важливою для України, однак окремі фінансові інструменти мають власні умови та обмеження і не можуть повністю замінити внутрішній ресурс для закупівлі всієї номенклатури, якої потребують Сили оборони.",
      },
      {
        id: "b10",
        type: "text",
        content:
          "Українська рада зброярів не оцінює, якою саме має бути модель закупівель, які процедури мають використовуватися або яка структура має відповідати за їх реалізацію. Визначення цих механізмів є відповідальністю держави.",
      },
      {
        id: "b11",
        type: "text",
        content:
          "Для ринку важливий результат: військові мають безперебійно та вчасно отримувати необхідне озброєння і військову техніку, а українські виробники мають отримувати достатній обсяг замовлень, щоб забезпечувати ці потреби сьогодні та зберігати спроможність виробляти завтра.",
      },
      {
        id: "b12",
        type: "subheading",
        content:
          "У зв'язку з цим Українська рада зброярів закликає Міністерство оборони:",
      },
      {
        id: "b13",
        type: "text",
        content:
          "1. Забезпечити безперервність контрактування українських виробників, незалежно від кадрових, структурних чи процедурних змін у системі оборонних закупівель.",
      },
      {
        id: "b14",
        type: "text",
        content:
          "2. Не допустити паузи між наявними та наступними замовленнями, враховуючи тривалість виробничого циклу та необхідність завчасної закупівлі компонентів.",
      },
      {
        id: "b15",
        type: "text",
        content:
          "3. Забезпечити достатній та прогнозований фінансовий ресурс для закупівлі озброєння і військової техніки, необхідних Силам оборони, зокрема тієї номенклатури, яка не може бути повністю профінансована за рахунок доступних партнерських програм.",
      },
      {
        id: "b16",
        type: "text",
        content:
          "4. Забезпечити для виробників зрозумілий горизонт замовлень, який дозволить планувати виробництво, утримувати команди, закуповувати компоненти та продовжувати розвиток українських технологій.",
      },
      {
        id: "b17",
        type: "text",
        content:
          "5. Підтримувати постійний діалог із галуззю щодо поточного рівня контрактування, виробничих можливостей та ризиків для майбутніх поставок.",
      },
      {
        id: "b18",
        type: "text",
        content:
          "Українська рада зброярів готова надати Міністерству оборони агреговані дані щодо виробничих спроможностей, рівня контрактування і долучитися до пошуку рішень.",
      },
    ],
    i18n: {
      en: {
        title:
          "Ukrainian Council of Defence Industry calls for uninterrupted defence procurement amid changes to the system",
        blocks: [
          {
            id: "b1",
            type: "text",
            content:
              "Amid public debate and possible changes to the defence procurement system, the Ukrainian Council of Defence Industry — the largest sectoral association of Ukrainian manufacturers of weapons and military equipment — calls on the Ministry of Defence to ensure the continuity of contracting with Ukraine's defence industry and the supply of the weapons the Defence Forces need.",
          },
          {
            id: "b2",
            type: "text",
            content:
              "For us this is not a question of personalities. No personnel, structural or procedural changes should affect the continuity of supplying the Defence Forces with weapons and military equipment.",
          },
          {
            id: "b3",
            type: "text",
            content:
              "As of mid-August, one of the key problems for the Ukrainian defence industry remains an insufficient level of contracting. Market participants estimate that up to 25% of available production capacity is currently under contract. Manufacturers of various types of weapons and military equipment are left without a sufficient volume of orders.",
          },
          {
            id: "b4",
            type: "text",
            content: "This is a problem not only for the companies themselves.",
          },
          {
            id: "b5",
            type: "text",
            content:
              "Weapons production has a long cycle. Once a contract is signed, manufacturers have to purchase components, set up production, carry out testing and acceptance, and only then hand the finished product over to the military.",
          },
          {
            id: "b6",
            type: "text",
            content:
              "That is why a contract not signed today cannot be offset by an immediate increase in funding a few months later. Delays in contracting in August create a risk for delivery volumes in autumn and winter.",
          },
          {
            id: "b7",
            type: "text",
            content:
              "At the same time, for the industry itself a prolonged period without sufficient domestic orders means the risk of losing engineers and production teams, cutting production lines, and reducing working capital and the ability to invest in improving and scaling up Ukrainian developments.",
          },
          {
            id: "b8",
            type: "text",
            content:
              "In recent years Ukraine's defence industry has substantially built up its capabilities in response to the state's demand and the needs of the military. It is important not to let those capabilities be lost through interruptions in contracting.",
          },
          {
            id: "b9",
            type: "text",
            content:
              "Funding remains a separate challenge. Support from international partners is critically important for Ukraine, yet individual financial instruments come with their own conditions and limitations and cannot fully replace domestic resources for procuring the entire range of items the Defence Forces require.",
          },
          {
            id: "b10",
            type: "text",
            content:
              "The Ukrainian Council of Defence Industry does not take a position on what the procurement model should be, which procedures should be used, or which body should be responsible for implementing them. Defining these mechanisms is the responsibility of the state.",
          },
          {
            id: "b11",
            type: "text",
            content:
              "What matters for the market is the outcome: the military must receive the weapons and military equipment they need without interruption and on time, and Ukrainian manufacturers must receive a sufficient volume of orders to meet those needs today and retain the capacity to produce tomorrow.",
          },
          {
            id: "b12",
            type: "subheading",
            content:
              "In view of this, the Ukrainian Council of Defence Industry calls on the Ministry of Defence to:",
          },
          {
            id: "b13",
            type: "text",
            content:
              "1. Ensure the continuity of contracting with Ukrainian manufacturers, regardless of personnel, structural or procedural changes in the defence procurement system.",
          },
          {
            id: "b14",
            type: "text",
            content:
              "2. Prevent any pause between existing and subsequent orders, taking into account the length of the production cycle and the need to purchase components in advance.",
          },
          {
            id: "b15",
            type: "text",
            content:
              "3. Ensure sufficient and predictable financial resources for procuring the weapons and military equipment the Defence Forces need, in particular those items that cannot be fully financed through available partner programmes.",
          },
          {
            id: "b16",
            type: "text",
            content:
              "4. Give manufacturers a clear order horizon that allows them to plan production, retain teams, purchase components and continue developing Ukrainian technologies.",
          },
          {
            id: "b17",
            type: "text",
            content:
              "5. Maintain an ongoing dialogue with the industry on the current level of contracting, production capabilities and risks to future deliveries.",
          },
          {
            id: "b18",
            type: "text",
            content:
              "The Ukrainian Council of Defence Industry is ready to provide the Ministry of Defence with aggregated data on production capacity and contracting levels, and to join the search for solutions.",
          },
        ],
      },
    },
  },
  {
    /*
     * Пресреліз партнерів (АПКБУ + ASIS Ukraine) про конференцію
     * «Корпоративна безпека 2026». Публікуємо заднім числом: дата в
     * `createdAt` — 10 серпня, і саме вона ставить реліз між релізом за
     * 14 серпня і матеріалами за червень. Стрічка сортується за цим полем,
     * тому вручну між ними нічого вкладати не потрібно.
     */
    id: "korporatyvna-bezpeka-2026",
    slug: "korporatyvna-bezpeka-2026",
    category: "events",
    /*
     * Тільки українською: англійського перекладу немає, а без `lang` запис
     * показувався б і на /en — з українським текстом. `useNews` фільтрує
     * стрічку саме за цим полем.
     */
    lang: "uk",
    published: true,
    createdAt: "2026-08-10T09:00:00.000Z",
    title:
      "У Києві вп'яте відбудеться головна конференція країни з корпоративної безпеки",
    mainImage: "",
    blocks: [
      {
        id: "b1",
        type: "text",
        content:
          "**«Корпоративна безпека 2026» збере 1 жовтня понад 250 власників, CEO, топ-менеджерів, керівників служб безпеки бізнесу та представників держави.**",
      },
      {
        id: "b2",
        type: "text",
        content:
          "**Організатори — Асоціація професіоналів корпоративної безпеки України (АПКБУ) та ASIS Ukraine.**",
      },
      {
        id: "b3",
        type: "text",
        content:
          "1 жовтня 2026 року в Києві вп'яте відбудеться конференція «Корпоративна безпека» — професійна платформа, де власники бізнесу, топ-менеджмент, керівники служб безпеки та представники держави обмінюються рішеннями, які вже довели ефективність в умовах війни.",
      },
      {
        id: "b4",
        type: "text",
        content:
          "Цьогорічний фокус — трансформація безпеки бізнесу під час повномасштабної війни, кібербезпека, штучний інтелект у захисті компаній та безпека оборонного сектору.",
      },
      {
        id: "b5",
        type: "text",
        content:
          "Програма поєднає чотири панельні сесії та чотири практичні воркшопи. Панельні дискусії присвячені трансформації корпоративної безпеки в умовах повномасштабної війни і погляду CEO на безпеку бізнесу у 2026–2027 роках, кібербезпеці як ключовому напряму захисту компаній, корпоративній безпеці в епоху штучного інтелекту та безпеці оборонного бізнесу — між інноваціями та загрозами. Практична частина охопить технології захисту об'єктів в умовах війни, комплаєнс-контроль в оборонному секторі, безпеку в корпоративному управлінні та майстер-клас з дій у кризових ситуаціях.",
      },
      {
        id: "b6",
        type: "text",
        content:
          "Серед спікерів — перші особи найбільших компаній і громадських організацій України:",
      },
      {
        id: "b7",
        type: "text",
        content:
          "— **Сергій Погребной**, голова правління АПКБУ, партнер Sayenko Kharenko, віцепрезидент ASIS Ukraine, співвласник SK Security;",
      },
      {
        id: "b8",
        type: "text",
        content:
          "— **Ігор Федірко**, виконавчий директор Української ради зброярів;",
      },
      {
        id: "b9",
        type: "text",
        content: "— **Олена Степура**, співвласниця Artellence, член АПКБУ;",
      },
      {
        id: "b10",
        type: "text",
        content:
          "— **Тетяна Андріанова**, CEO «Октава Капітал», керуючий партнер NotaGroup, голова комітету з корпоративної безпеки Групи компаній «Октава», заступниця голови правління АПКБУ, член ASIS Ukraine;",
      },
      {
        id: "b11",
        type: "text",
        content:
          "— **Віктор Дроботенко**, керівник напряму аналітики ризиків та розслідувань SK Security, голова ASIS Ukraine, член АПКБУ;",
      },
      {
        id: "b12",
        type: "text",
        content:
          "— **Василь Чмелюк**, операційний директор «Астарта-Київ», найбільшого агропромислового холдингу та виробника цукру в Україні;",
      },
      {
        id: "b13",
        type: "text",
        content:
          "— **Євген Шевченко**, CEO холдингу SHERIFF, одного з найбільших безпекових холдингів України.",
      },
      {
        id: "b14",
        type: "text",
        content:
          "До дискусій також долучаться керівники безпеки провідних mil-tech компаній, експерти з кібервійни, бізнес-розвідки та комплаєнсу в оборонному секторі, а також представники державних структур.",
      },
      {
        id: "b15",
        type: "text",
        content:
          "«За роки великої війни український бізнес заплатив за свій безпековий досвід найвищу ціну — і сьогодні цей досвід унікальний у світовому масштабі. Виграє не той, у кого більший бюджет на захист, а той, хто вміє керувати ризиками. Тому 1 жовтня ми збираємо на одній сцені тих, хто ухвалює рішення, щоб кожен пішов не з враженнями, а з інструментами», — зазначає **Сергій Погребной**, голова правління співорганізатора заходу АПКБУ.",
      },
      {
        id: "b16",
        type: "text",
        content:
          "Участь передбачає два формати: повний доступ до всіх сесій і воркшопів або доступ лише до практичної частини. Реєстрація за зниженою вартістю триває до 30 серпня включно. Програма та реєстрація — на [сайті конференції](http://conference.corporatesecurity.org.ua/). З міркувань безпеки локацію заходу буде повідомлено зареєстрованим учасникам.",
      },
      {
        id: "b17",
        type: "text",
        content:
          "Генеральні партнери конференції — Sayenko Kharenko, SK Security та Octava Capital. Партнери — APIS Holding, 10Guards, OBLAVA, ФОРТЕЦЯ, YouControl, Meest China. PR-партнер — Ideas&Strategy. Охоронний партнер — SHERIFF.",
      },
      {
        id: "b18",
        type: "text",
        content:
          "**Медіа та інформаційним партнерам.** Конференція відкрита до інформаційного партнерства на бартерній основі: організатори розміщують логотип партнера на сайті та в програмі події і згадують його у погоджених матеріалах; від партнера очікуються публікація узгодженого анонсу і підсумкового матеріалу, розсилка по власній базі та публікації в соцмережах. Інформаційне партнерство включає два квитки на конференцію.",
      },
      {
        id: "b19",
        type: "subheading",
        content: "Довідково",
      },
      {
        id: "b20",
        type: "text",
        content:
          "[Асоціація професіоналів корпоративної безпеки України (АПКБУ)](https://corporatesecurity.org.ua/) — неприбуткова громадська організація, яка понад 12 років формує і розвиває ринок корпоративної безпеки України. АПКБУ об'єднує понад 150 фахівців: керівників служб безпеки найбільших холдингів, адвокатів, експертів із корпоративного управління, кібербезпеки, форензіку, бізнес-розвідки та захисту інформації. У структурі Асоціації діють 16 профільних комітетів. АПКБУ бере участь у законодавчих ініціативах та проводить найбільші профільні конференції у Східній Європі.",
      },
      {
        id: "b21",
        type: "text",
        content:
          "[ASIS Ukraine](http://asis.in.ua/) — національний осередок глобальної професійної асоціації, заснованої 1955 року, що об'єднує понад 34 000 фахівців із безпеки з більш ніж 240 відділеннями по всьому світу — від менеджерів до CSO та CEO у державному й приватному секторах. Місія відділення — розвиток приватної та корпоративної безпеки в Україні через впровадження міжнародних стандартів ASIS, підтримку сертифікації та професійної освіти, інтеграцію українських фахівців у глобальну мережу і розвиток культури управління ризиками.",
      },
      {
        id: "b22",
        type: "text",
        content:
          "**Медіаконтакт**: Назар Галич, PR-менеджер Ideas&Strategy (PR-партнер конференції), halych2007@gmail.com, +38 066 231 32 20 (Telegram, WhatsApp, Signal)",
      },
    ],
  },
];
