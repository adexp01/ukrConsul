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
];
