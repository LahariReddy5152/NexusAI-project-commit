/** Peach & blue galaxy palette — reference artwork */
export const PALETTE = {
  navy: 0x060818,
  deepSpace: 0x0a0e28,
  indigo: 0x301934,
  peach: 0xffcb9a,
  coral: 0xff7f50,
  warmPink: 0xff77aa,
  lavender: 0xe6e6fa,
  softOrange: 0xffaa77,
  lightBlue: 0x77bbff,
  electricBlue: 0x00ffff,
  royalBlue: 0x4466cc,
  royalPurple: 0x7851a9,
  purple: 0x8844aa,
  gold: 0xffd700,
  horizonGlow: 0xffcc99,
  white: 0xffffff
};

export function hex(h) {
  return `#${h.toString(16).padStart(6, "0")}`;
}
