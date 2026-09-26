/* Shared by index.html and admin.html */
const LAYOUTS = {
  "img-left":   {label:"Image left, text right", n:1, schem:{cols:"1.2fr 1fr", areas:'"a t"'}},
  "img-right":  {label:"Text left, image right", n:1, schem:{cols:"1fr 1.2fr", areas:'"t a"'}},
  "two-top":    {label:"Two images, text below", n:2, schem:{cols:"1fr 1fr", areas:'"a b" "t t"', rows:"1.4fr 1fr"}},
  "big-stack":  {label:"Big image left, two stacked right, text below", n:3, schem:{cols:"2fr 1fr", areas:'"a b" "a c" "t t"', rows:"1fr 1fr 1fr"}},
  "three-row":  {label:"Three images in a row, text below", n:3, schem:{cols:"1fr 1fr 1fr", areas:'"a b c" "t t t"', rows:"1.4fr 1fr"}},
  "text-stack": {label:"Text left, two stacked images right", n:2, schem:{cols:"1fr 1fr", areas:'"t a" "t b"'}},
  "full":       {label:"Full-width image, text below", n:1, schem:{cols:"1fr", areas:'"a" "t"', rows:"1.6fr 1fr"}},
  "text":       {label:"Text only", n:0, schem:{cols:"1fr", areas:'"t"'}}
};
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const paras = t => String(t||"").split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  .map(p => "<p>" + esc(p).replace(/\n/g,"<br>") + "</p>").join("");
const uid = () => "s" + Math.random().toString(36).slice(2,10);

function normalize(c){
  c = c && typeof c === "object" ? c : {};
  return {
    hero: {title: c.hero?.title ?? "Welcome", subtitle: c.hero?.subtitle ?? "", image: c.hero?.image || null},
    sections: Array.isArray(c.sections) ? c.sections.map(s => ({
      id: s.id || uid(), layout: LAYOUTS[s.layout] ? s.layout : "img-left",
      title: s.title || "", text: s.text || "", images: Array.isArray(s.images) ? s.images.slice(0,3) : []
    })) : []
  };
}

async function loadContent(){
  const r = await fetch("content.json?t=" + Date.now(), {cache:"no-store"});
  if (!r.ok) throw new Error("content.json not found");
  return normalize(await r.json());
}

function renderPublic(content, root, srcFor = p => p){
  document.title = content.hero.title || "Presentation";
  const {hero, sections} = content, total = sections.length;
  const slides = sections.map((s,i) => {
    const L = LAYOUTS[s.layout];
    const figs = Array.from({length:L.n}, (_,k) => s.images[k]
      ? `<figure class="m m${k+1}"><img src="${esc(srcFor(s.images[k]))}" alt="" loading="lazy"></figure>`
      : `<figure class="m m${k+1} empty" aria-hidden="true"></figure>`).join("");
    const copy = (s.title || s.text) ? `<div class="copy">${s.title?`<h2>${esc(s.title)}</h2>`:""}<div class="body">${paras(s.text)}</div></div>` : "";
    return `<section class="slide" id="slide-${i+1}" aria-label="Slide ${i+1} of ${total}">
      <div class="slide-count">${i+1} / ${total}</div><div class="grid L-${s.layout}">${figs}${copy}</div></section>`;
  }).join("");
  root.innerHTML = `
    <header class="hero" id="slide-0">
      ${hero.image?`<div class="hero-bg" style="background-image:url('${esc(srcFor(hero.image))}')"></div>`:""}
      <div class="hero-inner"><h1>${esc(hero.title)}</h1>${hero.subtitle?`<p>${esc(hero.subtitle)}</p>`:""}</div>
    </header>
    <main class="slides">${slides}</main>
    ${total ? `<nav class="dots" aria-label="Slides">${["Intro",...sections.map((s,i)=>s.title||"Slide "+(i+1))].map((t,i)=>`<button data-go="${i}" aria-label="${esc(t)}"></button>`).join("")}</nav>` : ""}
    <footer class="site-foot">${esc(hero.title)}</footer>`;
  const dots = [...root.querySelectorAll(".dots button")];
  if (!dots.length) return;
  dots.forEach(b => b.onclick = () => document.getElementById("slide-"+b.dataset.go)?.scrollIntoView());
  const targets = [...Array(total+1).keys()].map(i => document.getElementById("slide-"+i));
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ const i = targets.indexOf(e.target); dots.forEach((d,k)=>d.setAttribute("aria-current", k===i?"true":"false")); }
  }), {threshold:.5});
  targets.forEach(t => t && obs.observe(t));
}
