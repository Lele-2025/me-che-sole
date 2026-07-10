// ─── PALETTE ────────────────────────────────────────────────────────
export const C = {
  sea1:"#29B6CE", sea2:"#007FA0", sun:"#F4C430",
  aqua:"#68D8C8", cream:"#FFFDE8", sand:"#FFF6C0",
  deep:"#005880", navy:"#003A58", coral:"#FF6B35",
  muted:"#6ABBC8", white:"#FFFFFF",
};

export const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=DM+Sans:wght@400;600;700;800&display=swap');
@keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes pulse   { 0%,100%{opacity:0.6} 50%{opacity:1} }
@keyframes spotRise{ from{opacity:0;transform:translateY(8px)scale(0.9)} to{opacity:1;transform:none} }
@keyframes slideProgress { from{width:0%} to{width:100%} }
@keyframes waveL   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes waveR   { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
@keyframes tideAnim{ 0%,100%{height:6px;opacity:0.35} 50%{height:18px;opacity:0.55} }
.card-hover{transition:transform .18s,box-shadow .18s;}
.card-hover:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(41,182,206,0.22);}
`;
