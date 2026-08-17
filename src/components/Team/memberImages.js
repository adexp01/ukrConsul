/*
 * Фото команди. Файли лежать у WebP і завширшки 910 px — це подвійна ширина
 * найбільшого слота (455 px на широкому екрані), тобто рівно стільки, скільки
 * потрібно для Retina. До цього тут були PNG по 2–3 МБ кожен, і збірник клав
 * усі 31 МБ у дист навіть тоді, коли блок «Команда» вимкнений прапорцем.
 */
import k1 from "../../assets/k1.webp";
import k2 from "../../assets/k2.webp";
import k3 from "../../assets/k3.webp";
import k4 from "../../assets/k4.webp";
import k5 from "../../assets/k5.webp";
import m11 from "../../assets/m11.webp";
import m12 from "../../assets/m12.webp";
import n1 from "../../assets/n1.webp";
import n2 from "../../assets/n2.webp";
import v11 from "../../assets/v11.webp";
import v12 from "../../assets/v12.webp";
import v13 from "../../assets/v13.webp";
import r1 from "../../assets/r1.webp";
import r2 from "../../assets/r2.webp";

export const TEAM_MEMBER_IMAGES = {
  fedirko: k1,
  popova: k2,
  shamota: k3,
  svynchuk: k4,
  shvets: k5,
  tabur: m11,
  poladova: m12,
  golumbiovska: n1,
  motrechko: n2,
  vedrovska: v11,
  borovyk: v12,
  demchuk: v13,
  yaremenko: r1,
  milyutin: r2,
};

export const getTeamMemberImage = (member) => {
  if (!member) return null;
  if (member.image) return member.image;
  if (member.id) return TEAM_MEMBER_IMAGES[member.id] ?? null;
  return null;
};
