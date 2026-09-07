/*
 * Логотипи партнерів — по одному файлу на організацію.
 *
 * Раніше вся стрічка була двома готовими картинками (`comm1.png`,
 * `comm2.png`): щоб додати партнера, доводилось перемальовувати смугу в
 * редакторі, а на екрані було видно одинадцять одних і тих самих карток двічі.
 * Тепер картка — це окремий файл, і список нижче — єдине місце, куди треба
 * дописати новачка.
 *
 * Кожен файл уже зведений до однакової картки 324×280: білий фон, той самий
 * радіус кутів, знак по центру в полі 250×108. Тому в розмітці не треба ні
 * підкладки, ні вирівнювання — тільки висота.
 *
 * `name` іде в `alt`: назва організації, а не «логотип такий-то».
 */
import aiad from "../../assets/partners/partner-aiad.webp";
import amrop from "../../assets/partners/partner-amrop.webp";
import artellence from "../../assets/partners/partner-artellence.webp";
import bankCreditDnipro from "../../assets/partners/partner-bank-credit-dnipro.webp";
import bdi from "../../assets/partners/partner-bdi.webp";
import calibrated from "../../assets/partners/partner-calibrated.webp";
import citibank from "../../assets/partners/partner-citibank.webp";
import coreTeam from "../../assets/partners/partner-core-team.webp";
import defenderMedia from "../../assets/partners/partner-defender-media.webp";
import deloitte from "../../assets/partners/partner-deloitte.webp";
import diDenmark from "../../assets/partners/partner-di-denmark.webp";
import dou from "../../assets/partners/partner-dou.webp";
import eda from "../../assets/partners/partner-eda.webp";
import edaiaEstonia from "../../assets/partners/partner-edaia-estonia.webp";
import epsa from "../../assets/partners/partner-epsa.webp";
import fsiNorway from "../../assets/partners/partner-fsi-norway.webp";
import gicat from "../../assets/partners/partner-gicat.webp";
import iddPortugal from "../../assets/partners/partner-idd-portugal.webp";
import juscutum from "../../assets/partners/partner-juscutum.webp";
import kmbs from "../../assets/partners/partner-kmbs.webp";
import kse from "../../assets/partners/partner-kse.webp";
import ladif from "../../assets/partners/partner-ladif.webp";
import militarnyi from "../../assets/partners/partner-militarnyi.webp";
import mimKyiv from "../../assets/partners/partner-mim-kyiv.webp";
import molfar from "../../assets/partners/partner-molfar.webp";
import moris from "../../assets/partners/partner-moris.webp";
import msa from "../../assets/partners/partner-msa.webp";
import mtbBank from "../../assets/partners/partner-mtb-bank.webp";
import nidv from "../../assets/partners/partner-nidv.webp";
import oschadbank from "../../assets/partners/partner-oschadbank.webp";
import pumb from "../../assets/partners/partner-pumb.webp";
import pwc from "../../assets/partners/partner-pwc.webp";
import rasmussenGlobal from "../../assets/partners/partner-rasmussen-global.webp";
import sahaIstanbul from "../../assets/partners/partner-saha-istanbul.webp";
import sayenkoKharenko from "../../assets/partners/partner-sayenko-kharenko.webp";
import snakeIsland from "../../assets/partners/partner-snake-island.webp";
import soff from "../../assets/partners/partner-soff.webp";
import starkDefence from "../../assets/partners/partner-stark-defence.webp";
import uavs from "../../assets/partners/partner-uavs.webp";
import ukreximbank from "../../assets/partners/partner-ukreximbank.webp";
import ydtc from "../../assets/partners/partner-ydtc.webp";
import youControl from "../../assets/partners/partner-youcontrol.webp";

/*
 * Порядок списку — це порядок у стрічці: перший рядок бере парні позиції,
 * другий — непарні (див. index.jsx). Тому сусіди по списку розходяться по
 * різних рядках, і жодна група — міжнародні асоціації, консультанти, банки —
 * не збивається в один кут стрічки.
 */
export const PARTNERS = [
  { src: bdi, name: "BDI" },
  { src: deloitte, name: "Deloitte" },
  { src: aiad, name: "AIAD" },
  { src: pwc, name: "PwC" },
  { src: gicat, name: "GICAT" },
  { src: kse, name: "Kyiv School of Economics" },
  { src: soff, name: "SOFF" },
  { src: sayenkoKharenko, name: "Sayenko Kharenko" },
  { src: iddPortugal, name: "idD Portugal Defence" },
  { src: eda, name: "European Defence Association" },
  {
    src: ladif,
    name: "Latvijas Drošības un aizsardzības industriju federācija",
  },
  { src: juscutum, name: "Juscutum" },
  { src: nidv, name: "NIDV" },
  { src: molfar, name: "Molfar" },
  {
    src: edaiaEstonia,
    name: "Estonian Defence and Aerospace Industry Association",
  },
  { src: youControl, name: "YouControl" },
  { src: fsiNorway, name: "FSi" },
  { src: snakeIsland, name: "Snake Island Institute" },
  { src: sahaIstanbul, name: "SAHA Istanbul" },
  { src: moris, name: "Moris" },
  { src: diDenmark, name: "Dansk Industri" },
  { src: starkDefence, name: "Stark Defence" },
  { src: citibank, name: "Citibank" },
  { src: coreTeam, name: "Core Team" },
  { src: amrop, name: "Amrop" },
  { src: calibrated, name: "Calibrated" },
  { src: bankCreditDnipro, name: "Банк Кредит Дніпро" },
  { src: artellence, name: "Artellence" },
  { src: oschadbank, name: "Ощадбанк" },
  { src: msa, name: "Могилянська стратегічна агенція" },
  { src: ukreximbank, name: "Укрексімбанк" },
  { src: uavs, name: "Незалежна асоціація шкіл БПЛА України" },
  { src: pumb, name: "ПУМБ" },
  { src: ydtc, name: "YDTC" },
  { src: mtbBank, name: "MTB Bank" },
  { src: rasmussenGlobal, name: "Rasmussen Global" },
  { src: kmbs, name: "Києво-Могилянська бізнес-школа" },
  { src: militarnyi, name: "Мілітарний" },
  { src: mimKyiv, name: "MIM Kyiv" },
  { src: defenderMedia, name: "Defender Media" },
  { src: dou, name: "DOU" },
  { src: epsa, name: "EPSA" },
];
