import photo01 from "../../assets/zel.png";
import photo02 from "../../assets/f1.png";
import photo03 from "../../assets/f2.png";
import photo04 from "../../assets/f3.png";
import photo05 from "../../assets/f4.png";
import photo06 from "../../assets/f5.png";
import photo07 from "../../assets/f6.png";
import photo08 from "../../assets/f7.png";
import photo09 from "../../assets/mirror.png";
import photo10 from "../../assets/pynkt.png";
import yar1 from "../../assets/yar1.png";
import m1 from "../../assets/m1.png";
import j1 from "../../assets/j1.png";
import e1 from "../../assets/e1.png";
import v1 from "../../assets/v1.png";
import max1 from "../../assets/max1.png";
import den1 from "../../assets/den1.png";
import artem1 from "../../assets/artem1.png";

export const ECO_SYSTEM_MEMBER_IMAGES = {
  kamyshin: photo01,
  fedirko: photo02,
  kovalenko: photo03,
  melnyk: photo04,
  shevchenko: photo05,
  bondar: photo06,
  lysenko: photo07,
  savchenko: photo08,
  hyhorenko: photo09,
  kravchenko: photo10,
  filimonov: yar1,
  rudominskyi: m1,
  vysotska: j1,
  buchatskyi: e1,
  honcharuk: v1,
  vasylchenko: max1,
  kanin: den1,
  platonenko: artem1,
};

export const getEcoSystemMemberImage = (member) => {
  if (!member) return null;
  if (member.image) return member.image;
  if (member.id) return ECO_SYSTEM_MEMBER_IMAGES[member.id] ?? null;
  return null;
};
