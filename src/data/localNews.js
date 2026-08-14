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
 */
export const LOCAL_NEWS = [];
