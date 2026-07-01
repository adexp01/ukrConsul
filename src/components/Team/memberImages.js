import fedirko from "../../assets/f1.png";
import popova from "../../assets/f2.png";
import shamota from "../../assets/f3.png";
import svynchuk from "../../assets/f4.png";
import shvets from "../../assets/f5.png";
import tabur from "../../assets/f6.png";
import poladova from "../../assets/f7.png";
import golumbiovska from "../../assets/mirror.png";
import motrechko from "../../assets/pynkt.png";
import vedrovska from "../../assets/zel.png";
import k1 from "../../assets/k1.png";
import k2 from "../../assets/k2.png";
import k3 from "../../assets/k3.png";
import k4 from "../../assets/k4.png";
import k5 from "../../assets/k5.png";
import m11 from "../../assets/m11.png";
import m12 from "../../assets/m12.png";
import n1 from "../../assets/n1.png";
import n2 from "../../assets/n2.png";
import v11 from "../../assets/v11.png";
import v12 from "../../assets/v12.png";
import v13 from "../../assets/v13.png";
import r1 from "../../assets/r1.png";
import r2 from "../../assets/r2.png";

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
