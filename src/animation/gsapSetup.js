import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

/*
 * Одне місце, де реєструються плагіни GSAP.
 *
 * Раніше `gsap.registerPlugin(ScrollTrigger, useGSAP)` стояло в шістнадцяти
 * файлах — з тією ж помилкою в кожному: useGSAP це хук, а не плагін, і
 * реєструвати його не потрібно. Тепер компоненти просто імпортують `gsap`
 * і `ScrollTrigger` звідси, а реєстрація трапляється один раз при першому
 * імпорті цього модуля.
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger, ScrollToPlugin };
