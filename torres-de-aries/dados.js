/* Portal Torres de Áries — tabela compartilhada pela página e pelo visualizador 3D.
   Troque os valores de CONFIG pela tabela oficial. Com demo: false, o aviso de demonstração some
   e só ficam vendidas/reservadas as unidades listadas em CONFIG.situacao. */
(function(){
"use strict";
const CONFIG = {
  demo: true,
  corretor: { nome: "Leonardo", sub: "Corretor · Portal Torres de Áries", whatsapp: "" }, // ex.: "22999998888"
  torres: 6,
  andares: [1,2,3,4,5,6,7],
  finais: {                     // 01–04: varandas da frente · 05–08: varandas dos fundos
    "01": { quartos: 2, area: 45, face: "frente" },
    "02": { quartos: 1, area: null, face: "frente" },
    "03": { quartos: 1, area: null, face: "frente" },
    "04": { quartos: 2, area: 45, face: "frente" },
    "05": { quartos: 2, area: 45, face: "fundos" },
    "06": { quartos: 1, area: null, face: "fundos" },
    "07": { quartos: 1, area: null, face: "fundos" },
    "08": { quartos: 2, area: 45, face: "fundos" }
  },
  preco: { base2q: 249900, base1q: 209900, porAndar: 1800 },
  fluxo: { sinal: 1500, mensais: 24, valorMensal: 450 },
  /* "T1-302": "vendido" | "reservado" | "disponivel" */
  situacao: {}
};

function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

const UNITS = {};
for(let t=1;t<=CONFIG.torres;t++){
  const r = rng(t*977+13);
  for(const a of CONFIG.andares){
    for(const f of Object.keys(CONFIG.finais)){
      const id = `T${t}-${a}${f}`, tip = CONFIG.finais[f];
      const x = r();
      let s = CONFIG.situacao[id];
      if(!s) s = CONFIG.demo ? (x<.44?"vendido":x<.52?"reservado":"disponivel") : "disponivel";
      const base = tip.quartos===2 ? CONFIG.preco.base2q : CONFIG.preco.base1q;
      UNITS[id] = { id, torre:t, andar:a, final:f, apto:`${a}${f}`, quartos:tip.quartos, area:tip.area, face:tip.face, status:s, preco: base + (a-1)*CONFIG.preco.porAndar };
    }
  }
}

const BRL = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const ST = { disponivel:["disp","Disponível"], reservado:["res","Reservado"], vendido:["vend","Vendido"] };
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tipoTxt = u => `${u.quartos} quarto${u.quartos>1?"s":""}${u.area?` · ${u.area} m²`:""}`;
const nomeU = u => `Torre ${u.torre} · apto ${u.apto}`;
function towerStats(t){ const us=Object.values(UNITS).filter(u=>u.torre===t); return { total:us.length, disp:us.filter(u=>u.status==="disponivel").length, vend:us.filter(u=>u.status==="vendido").length }; }
function fluxo(u){ const F=CONFIG.fluxo, obra=F.mensais*F.valorMensal; return { sinal:F.sinal, mensais:F.mensais, valorMensal:F.valorMensal, financiamento:Math.max(0,u.preco-F.sinal-obra) }; }
function whatsLink(text){ const n=String(CONFIG.corretor.whatsapp||"").replace(/\D/g,""); const num=n?(n.startsWith("55")?n:"55"+n):""; return `https://wa.me/${num}?text=${encodeURIComponent(text)}`; }

/* lista de interesse compartilhada entre a página e o 3D */
const KEY="ta-lead";
function loadLead(){ try{ const s=JSON.parse(localStorage.getItem(KEY)||"{}"); return { picked:(Array.isArray(s.picked)?s.picked:[]).filter(id=>UNITS[id]), name:s.name||"" }; }catch(e){ return {picked:[],name:""}; } }
function saveLead(v){ try{ localStorage.setItem(KEY, JSON.stringify(v)); }catch(e){} }

window.TA = { CONFIG, UNITS, BRL, ST, esc, tipoTxt, nomeU, towerStats, fluxo, whatsLink, loadLead, saveLead };
})();
