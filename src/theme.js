// ─── PALETTE ────────────────────────────────────────────────────────
// sea1/sea2/sun/aqua/cream/sand(vecchio)/deep/navy/coral/muted: palette
// originale "Costa Garganica", ancora in uso in WizardPrenotazione,
// DettaglioLido, Mappa, StaffLoginModal — non toccarla finché quei
// componenti non passano anche loro al redesign "Lido Minimal".
// white/sabbia/maiolica*/terracotta/ink*/line: nuova direzione "Lido
// Minimal", finora applicata solo a Home/CardLido/Logo (vedi CLAUDE.md).
export const C = {
  sea1:"#29B6CE", sea2:"#007FA0", sun:"#F4C430",
  aqua:"#68D8C8", cream:"#FFFDE8", sand:"#FFF6C0",
  deep:"#005880", navy:"#003A58", coral:"#FF6B35",
  muted:"#6ABBC8", white:"#FFFFFF",

  sabbia:"#F5F2EC", maiolica:"#2D5F8A", maiolicaDark:"#1F4569",
  terracotta:"#C05F3C", ink:"#1C1C1C", inkMuted:"#6B6560", line:"#E4DFD5",
};

// Pattern "maiolica pugliese": piastrella conica a pinwheel, quattro
// quarti di cerchio alternati blu/terracotta a bassissima opacità.
// Va usato con parsimonia (badge, divisori sottili), mai come sfondo
// pieno di una schermata intera.
export const maiolicaPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23F5F2EC'/%3E%3Cpath d='M20 20 L20 0 A20 20 0 0 1 40 20 Z' fill='%232D5F8A' opacity='0.14'/%3E%3Cpath d='M20 20 L40 20 A20 20 0 0 1 20 40 Z' fill='%23C05F3C' opacity='0.12'/%3E%3Cpath d='M20 20 L20 40 A20 20 0 0 1 0 20 Z' fill='%232D5F8A' opacity='0.14'/%3E%3Cpath d='M20 20 L0 20 A20 20 0 0 1 20 0 Z' fill='%23C05F3C' opacity='0.12'/%3E%3C/svg%3E")`;

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=DM+Sans:wght@400;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
@keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse   { 0%,100%{opacity:0.6} 50%{opacity:1} }
@keyframes spotRise{ from{opacity:0;transform:translateY(8px)scale(0.9)} to{opacity:1;transform:none} }
@keyframes slideProgress { from{width:0%} to{width:100%} }
@keyframes waveL   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes waveR   { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
@keyframes tideAnim{ 0%,100%{height:6px;opacity:0.35} 50%{height:18px;opacity:0.55} }
.card-hover{transition:transform .16s,box-shadow .16s;}
.card-hover:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(28,28,28,0.1);}
`;
