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
  {
    /*
     * Англійська версія релізу (переклад від клієнта). Українська лишається
     * в CRM: /article/defence-city-launched — пара слагів у articleMeta.js, тому
     * перемикач мови ходить між двома версіями, а не лишає ту саму адресу.
     */
    id: "defence-city-officially-launched",
    slug: "defence-city-officially-launched",
    category: "gr",
    // Тільки англійською: українська версія приходить із CRM
    lang: "en",
    published: true,
    createdAt: "2026-01-21T09:00:00.000Z",
    title:
      "Defence City Officially Launched: What Changes for the Defence Market",
    mainImage: "",
    blocks: [
      {
        id: "b1",
        type: "text",
        content:
          'On 15 January, the Ukrainian Council of Defence Industry (UCDI) hosted a closed offline meeting "Among Defence Manufacturers: Defence City is Operational, How to Become a Resident?", dedicated to the launch of the special legal regime "Defence City" and its practical application for Ukrainian defence companies.',
      },
      {
        id: "b2",
        type: "text",
        content:
          "One of the key features of the Defence City regime is the ability to export without obtaining special authority from the Cabinet of Ministers (which typically takes 6–12 months). The relevant procedure is set out in a separate regulation approved by the Government at the beginning of the year.",
      },
      {
        id: "b3",
        type: "text",
        content:
          "The Head of the State Service of Export Control of Ukraine, Oleh Tsilvik, emphasised that Defence City residency does not mean the abolition or simplification of export control procedures. Registration with the State Service of Export Control of Ukraine and obtaining a permit remain mandatory.",
      },
      {
        id: "b4",
        type: "text",
        content:
          "It is crucial for companies to prepare for the export track now. To date, about 30%* of the surveyed weapon-producing companies have registered with the State Service of Export Control of Ukraine, which is the first step toward entering the international market. These are the findings of an express survey conducted by the Ukrainian Council of Defence Industry among its members.",
      },
      {
        id: "b5",
        type: "text",
        content:
          "To help manufacturers navigate export procedures, the Ukrainian Council of Defence Industry has established the Export Support Office. During its first month of operation, the Office provided over 20 individual consultations for companies in the defence-industrial complex on entering international markets. Consultations can be requested via the Export Map page.",
      },
      {
        id: "b6",
        type: "text",
        content:
          "The Director of the Department for the Defence-Industrial Complex, Military-Technical Cooperation, and Export Control of the NSDC Staff, Andrii Tyvonchuk, outlined the role and functions of the Interagency Commission on Military-Technical Cooperation and Export Control. He announced that the commission's meeting will be held immediately after its updated composition is finalised.",
      },
      {
        id: "b7",
        type: "subheading",
        content: "Residency, Registers, and Legal Nuances of Defence City",
      },
      {
        id: "b8",
        type: "text",
        content:
          "The Deputy Director of the Department of Strategic Development of the Defence-Industrial Complex of the Ministry of Defence, Viktoriia Komisarenko, provided detailed clarifications on acquiring Defence City residency:",
      },
      {
        id: "b9",
        type: "text",
        content:
          "— Residency provides companies with significant tax incentives (exemption from corporate income tax upon reinvestment), simplified customs and currency procedures, and support for relocation to safer areas of Ukraine;",
      },
      {
        id: "b10",
        type: "text",
        content:
          "— To start, enterprises must conduct an internal audit for compliance with residency requirements;",
      },
      {
        id: "b11",
        type: "text",
        content:
          "— At the next stage, the company submits an application to the Ministry of Defence for residency status. The key document is the Compliance Report, which includes annual financial statements. At least 75% of qualified income (50% for aviation construction) must derive from defence activities.",
      },
      {
        id: "b12",
        type: "text",
        content:
          "Legal partners from Juscutum—Dmytro Paliushchenko, Head of Business Support Practice, and Petro Bilyk, Partner of Technology and Investment Practice—emphasised the critical role of well-drafted defence contracts. They stressed the importance of proper intellectual property protection, clearly defined delivery terms, and correct arbitration clauses. They specifically drew attention to clear mechanisms for working with export-import licences and the vetting of counterparties and end-users.",
      },
      {
        id: "b13",
        type: "subheading",
        content:
          "Register of Defence Manufacturers and the Defence City Register",
      },
      {
        id: "b14",
        type: "text",
        content:
          "The Director of the Directorate for Digital Transformation in Defence of the Ministry of Defence of Ukraine, Artem Romaniukov, presented the vision for the Register of Defence Manufacturers, which the Ministry of Defence plans to launch in February-March. The Register is designed to be a secure electronic platform for interaction between manufacturers and state buyers, simplifying some bureaucratic procedures. Currently, it is not synchronised with the Defence City register; however, such integration is considered a logical next step and will require changes to the regulatory framework.",
      },
      {
        id: "b15",
        type: "text",
        content:
          "The speakers of the event emphasised that Defence City is a new tool that has just begun operating, meaning that questions and challenges will inevitably arise during implementation. The Ukrainian Council of Defence Industry systematically collects inquiries from manufacturers, records problematic issues, and works in cooperation with government bodies to develop regulatory improvements.",
      },
      {
        id: "b16",
        type: "text",
        content:
          "* Methodology: the express survey was conducted in real-time in two waves during two profile events (Defence City / export). In total, more than 100 company representatives voted.",
      },
      {
        id: "b17",
        type: "subheading",
        content: "For Reference",
      },
      {
        id: "b18",
        type: "text",
        content:
          "The Ukrainian Council of Defence Industry (UCDI) is an independent association of private manufacturers of weapons and military equipment, which consolidates the industry, strengthens interaction with the state and international partners, and shapes Ukraine's modern security architecture. The UCDI helps manufacturers in the defence-industrial complex find partners, scale production, and secure access to financing and technology, thereby strengthening the country's defence capability.",
      },
      {
        id: "b19",
        type: "text",
        content:
          "Amongst Defence Manufacturers is a series of closed professional meetings organised by the Ukrainian Council of Defence Industry to establish cooperation between weapon manufacturers, government structures, and financial institutions. The goal is to create an effective platform for interaction among manufacturers, GR specialists, lawyers, and experts in order to drive systemic changes and increase the transparency, efficiency, and competitiveness of Ukraine's defence industry.",
      },
    ],
  },
  {
    /*
     * Англійська версія релізу (переклад від клієнта). Українська лишається
     * в CRM: /article/ukrainska-rada-zbroiariv-stala-efekt — пара слагів у articleMeta.js, тому
     * перемикач мови ходить між двома версіями, а не лишає ту саму адресу.
     */
    id: "ucdi-effective-platform-for-direct-dialogue",
    slug: "ucdi-effective-platform-for-direct-dialogue",
    category: "gr",
    // Тільки англійською: українська версія приходить із CRM
    lang: "en",
    published: true,
    createdAt: "2025-05-08T09:00:00.000Z",
    title:
      "Ukrainian Council of Defence Industry Becomes an Effective Platform for Direct Dialogue Between Manufacturers and the State",
    mainImage: "",
    blocks: [
      {
        id: "b1",
        type: "text",
        content:
          "The Ukrainian Council of Defence Industry has become an effective platform for direct dialogue between manufacturers and the state. No protocols or unnecessary pathos—just real impact on decisions.",
      },
      {
        id: "b2",
        type: "text",
        content: "**Here is how it works:**",
      },
      {
        id: "b3",
        type: "text",
        content:
          "During the latest 'Among defence manufacturers' meeting, participants discussed an experimental programme of the Main Directorate of Defence Innovations of the Ministry of Defence of Ukraine—focusing on forward contracts and financing innovations. For the first time, the developers of the programme did not arrive with a finished document, but rather to listen to the manufacturers.",
      },
      {
        id: "b4",
        type: "text",
        content:
          "**The result is concrete proposals from market participants:**",
      },
      {
        id: "b5",
        type: "text",
        content:
          "— formulating orders through a description of the problem that needs to be solved rather than through tactical and technical requirements (TTR);",
      },
      {
        id: "b6",
        type: "text",
        content:
          "— providing critical status for enterprises that secure contracts;",
      },
      {
        id: "b7",
        type: "text",
        content:
          "— allowing flexible financing models: from full state funding to co-financing or self-funded execution;",
      },
      {
        id: "b8",
        type: "text",
        content:
          "— ensuring the possibility of flexible contract amendments during the development process.",
      },
      {
        id: "b9",
        type: "text",
        content:
          "Currently, the Ministry of Defence and the UCDI are already working together on implementing these proposals. This is a win-win:",
      },
      {
        id: "b10",
        type: "text",
        content:
          "— The state creates an effective mechanism that is not detached from reality.",
      },
      {
        id: "b11",
        type: "text",
        content:
          "— Manufacturers understand the logic of the programme even before its launch and will be able to enter contracts quickly.",
      },
      {
        id: "b12",
        type: "text",
        content:
          "We expect the first forward contracts to appear by the end of 2025.",
      },
      {
        id: "b13",
        type: "text",
        content:
          "This is another significant shift: from defence bureaucracy to real cooperation with manufacturers. When innovations are not blocked by the system, but supported. When programmes are designed not in offices, but together with those who create weapons for the front line every day.",
      },
      {
        id: "b14",
        type: "text",
        content: "Join the meetings via the link.",
      },
    ],
  },
  {
    /*
     * Англійська версія релізу (переклад від клієнта). Українська лишається
     * в CRM: /article/codified-but-not-procured — пара слагів у articleMeta.js, тому
     * перемикач мови ходить між двома версіями, а не лишає ту саму адресу.
     */
    id: "codified-but-not-procured-ugv",
    slug: "codified-but-not-procured-ugv",
    category: "gr",
    // Тільки англійською: українська версія приходить із CRM
    lang: "en",
    published: true,
    createdAt: "2025-04-29T09:00:00.000Z",
    title:
      "Codified but Not Procured: Council of Defence Industry Initiates Dialogue on UGV Procurement Issues",
    mainImage: "",
    blocks: [
      {
        id: "b1",
        type: "text",
        content:
          "The Ukrainian Council of Defence Industry (UCDI) hosted a strategic meeting dedicated to one of the most pressing issues in the defence industry: the situation where unmanned ground vehicles (UGVs) have already been codified but have yet to be delivered to the troops.",
      },
      {
        id: "b2",
        type: "text",
        content:
          "The meeting was attended by representatives of UGV manufacturers, state buyers, the command of the Armed Forces of Ukraine, relevant structures of the Ministry of Defence and the General Staff, as well as specific combat units. This diverse range of participants made it possible, for the first time, to address most of the core issues—from the lack of direct budget instruments for UGV procurement to unregulated technical standards and the need for unification.",
      },
      {
        id: "b3",
        type: "text",
        content: "**The participants raised and discussed issues regarding:**",
      },
      {
        id: "b4",
        type: "text",
        content:
          "— the need to simplify requirements for Technical Specifications (TS) under martial law;",
      },
      {
        id: "b5",
        type: "text",
        content: "— the creation of experience-sharing centres between units;",
      },
      {
        id: "b6",
        type: "text",
        content: "— mechanisms for equipment repair and modernisation;",
      },
      {
        id: "b7",
        type: "text",
        content:
          "— the involvement of combat brigades in codification and performance evaluation processes;",
      },
      {
        id: "b8",
        type: "text",
        content:
          "— the possibility of creating working groups in key areas—from standards to repair and modernisation.",
      },
      {
        id: "b9",
        type: "text",
        content:
          "The participants agreed on the main point: robots are already changing logistics, fire support, and tactical decisions on the battlefield. However, without the simplification of procedures, budget planning, and institutionalised cooperation, their potential will remain unrealised.",
      },
      {
        id: "b10",
        type: "text",
        content:
          "**Ihor Fedirko, CEO of the Ukrainian Council of Defence Industry:**",
      },
      {
        id: "b11",
        type: "text",
        content:
          '"We see that the market is ready. The military is interested. The technologies are proven. What is blocking progress are systemic gaps. This meeting is the first step toward a joint roadmap of solutions that will allow UGVs to become a norm in combat units, rather than an exception."',
      },
      {
        id: "b12",
        type: "text",
        content:
          "**Maksym Vasylchenko, representative of the Ukrainian Robotic Forces:**",
      },
      {
        id: "b13",
        type: "text",
        content:
          '"UGVs on the front line are no longer a concept, but a fully functional tool. However, we face a situation where the state formally recognises the capability of a development but does not create mechanisms for its systemic deployment. It is critically important for us to see and understand the procedure step by step. And even more important is to receive real feedback."',
      },
      {
        id: "b14",
        type: "text",
        content:
          "The representative of the Ukrainian Robotic Forces added that, according to their data alone, at least 8 manufacturers of unmanned ground vehicles already have codified products but still do not have a single contract.",
      },
      {
        id: "b15",
        type: "text",
        content:
          "One of the key arguments of the discussion: there is already a combat battalion that has completely replaced its logistics with UGVs—and this is real proof of how modern warfare is changing. However, scaling such solutions is only possible under effective regulation.",
      },
      {
        id: "b16",
        type: "text",
        content:
          "Based on the results of the meeting, the Ukrainian Council of Defence Industry, together with the Ukrainian Robotic Forces, is taking charge of coordinating further actions—from consolidating technical proposals to establishing communication with relevant structures. The next step is to ensure that promising developments reach the front line as quickly as possible.",
      },
    ],
  },
];
