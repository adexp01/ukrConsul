import { MainMedia } from "../MainMedia";
import { MediaInfo } from "../MediaInfo";
import { MediaItems } from "../MediaItems";
import { DownloadMedia } from "../DownloadMedia";
import { SendRequest } from "../UI/SendRequest";
import { ForJournalist } from "../ForJournalist";

/*
 * Додаткові секції сторінки «Медіа», зібрані в один модуль.
 *
 * Зроблено саме окремим модулем, щоб сторінка підтягувала його через
 * `import()`: інакше `import "./style.css"` усередині цих шести компонентів —
 * побічний ефект, який збірник не викидає навіть тоді, коли самі компоненти
 * не рендеряться. Тобто ~15 КБ CSS вантажилось у кожного відвідувача даремно.
 */
export const MediaExtraSections = () => (
  <>
    <MediaInfo />
    <MediaItems />
    <MainMedia />
    <ForJournalist />
    <DownloadMedia />
    <SendRequest />
  </>
);

export default MediaExtraSections;
