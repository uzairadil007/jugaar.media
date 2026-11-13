// Builds the girly-theme UGC creator portfolio templates into /ugc.
// Run: node scripts/build-ugc.mjs
// Every name, rate and email on these pages is placeholder content for a template.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "ugc");
mkdirSync(out, { recursive: true });

const themes = [
  {
    slug: "blush-ballet", theme: "Blush Ballet", name: "Ayla", tag: "Creates", niche: "Beauty & makeup UGC",
    motif: "🎀", hero: "split",
    fonts: ["Playfair+Display:ital,wght@0,500;0,700;1,500", "Jost:wght@300;400;500"],
    display: "'Playfair Display', serif", body: "'Jost', sans-serif",
    c: { bg: "#fff6f8", bg2: "#ffe9ef", ink: "#4a2c34", mute: "#8d6a73", accent: "#e48aa6", accent2: "#f7d3de", line: "#f0cdd7", onAccent: "#fff" },
    radius: "28px", btn: "999px",
    tiles: [["#f7c6d4", "#fdeef2"], ["#e9a5b9", "#f9dbe4"], ["#f3d9c9", "#fff3ec"], ["#dcb3c4", "#f6e3ea"], ["#f5bfc9", "#ffe9ee"], ["#e7c1cf", "#fbeef3"]],
    lead: "Soft-glam tutorials, honest first impressions and get-ready-with-me videos that make your product feel like a ritual.",
    work: ["GRWM · Foundation", "Lip combo try-on", "Unboxing · PR kit", "Before / after", "5-minute glam", "Brush routine"],
    css: `
      .hero h1 em{font-style:italic;color:var(--accent)}
      .ribbon{position:absolute;inset:auto 0 0 0;height:10px;background:repeating-linear-gradient(90deg,var(--accent2) 0 30px,var(--accent) 30px 34px)}
      .card,.pkg{box-shadow:0 18px 40px -24px rgba(228,138,166,.6)}
      .pkg.hot{background:linear-gradient(160deg,#fff,var(--accent2))}
    `,
  },
  {
    slug: "strawberry-milk", theme: "Strawberry Milk", name: "Mina", tag: "Makes", niche: "Food & snack UGC",
    motif: "🍓", hero: "center",
    fonts: ["Fredoka:wght@500;600;700", "Nunito:wght@400;600;700"],
    display: "'Fredoka', sans-serif", body: "'Nunito', sans-serif",
    c: { bg: "#fff1f4", bg2: "#ffd9e2", ink: "#7a1f35", mute: "#a5566a", accent: "#ff4f7f", accent2: "#ffc2d1", line: "#7a1f35", onAccent: "#fff" },
    radius: "22px", btn: "16px",
    tiles: [["#ff8fab", "#ffd6e0"], ["#ff5c8a", "#ffc2d1"], ["#ffb3c6", "#fff0f3"], ["#f7a1b5", "#ffe5ec"], ["#ff7096", "#ffccd5"], ["#ffc8dd", "#fff"]],
    lead: "Sweet, snackable videos: taste tests, recipe hacks and aesthetic kitchen moments your audience will want to screenshot.",
    work: ["Taste test", "3-ingredient dessert", "What I eat in a day", "Packaging ASMR", "Lunchbox prep", "Café-at-home"],
    css: `
      body{background-color:var(--bg);background-image:linear-gradient(90deg,rgba(255,79,127,.08) 50%,transparent 50%),linear-gradient(rgba(255,79,127,.08) 50%,transparent 50%);background-size:36px 36px}
      .card,.pkg,.step,.phone,.about-box{border:3px solid var(--ink)!important;box-shadow:6px 6px 0 var(--ink)!important}
      .btn{border:3px solid var(--ink);box-shadow:4px 4px 0 var(--ink)}
      .btn:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ink)}
      .marquee{background:var(--accent);color:#fff;border-block:3px solid var(--ink)}
      nav{background:#fff;border-bottom:3px solid var(--ink)}
      .hero h1{text-shadow:4px 4px 0 var(--accent2)}
    `,
  },
  {
    slug: "lavender-haze", theme: "Lavender Haze", name: "Lina", tag: "Lux", niche: "Skincare & self-care UGC",
    motif: "✨", hero: "center",
    fonts: ["Cormorant+Garamond:ital,wght@0,500;0,600;1,500", "Outfit:wght@300;400;500"],
    display: "'Cormorant Garamond', serif", body: "'Outfit', sans-serif",
    c: { bg: "#f5efff", bg2: "#ebe1ff", ink: "#3b2a5a", mute: "#7a6a99", accent: "#9b7bff", accent2: "#ffc9ef", line: "rgba(155,123,255,.25)", onAccent: "#fff" },
    radius: "32px", btn: "999px",
    tiles: [["#c9b6ff", "#f4ecff"], ["#e3b8ff", "#fdeaff"], ["#b9c8ff", "#eef2ff"], ["#ffc9ef", "#fff0fa"], ["#d7c2ff", "#f6f0ff"], ["#a99bff", "#e9e4ff"]],
    lead: "Dreamy, slow-paced skincare routines and texture shots that make your serum look like it belongs in a spa.",
    work: ["Night routine", "Texture close-ups", "Skin diary · week 1", "Bathroom shelfie", "Sunday reset", "Product layering"],
    css: `
      body{background:radial-gradient(60vw 60vw at 10% 0%,#e8dcff 0,transparent 60%),radial-gradient(50vw 50vw at 100% 30%,#ffe0f5 0,transparent 60%),radial-gradient(60vw 60vw at 30% 100%,#dfe8ff 0,transparent 60%),var(--bg);background-attachment:fixed}
      .card,.pkg,.step,.about-box{background:rgba(255,255,255,.55)!important;backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.8)!important}
      nav{background:rgba(255,255,255,.5);backdrop-filter:blur(14px)}
      .hero h1{background:linear-gradient(90deg,#7b5cff,#d77bd9,#7b5cff);-webkit-background-clip:text;background-clip:text;color:transparent}
      .btn{background:linear-gradient(90deg,#9b7bff,#d58be6)}
    `,
  },
  {
    slug: "coquette", theme: "Coquette", name: "Hira", tag: "Studio", niche: "Fashion & accessories UGC",
    motif: "🎀", hero: "editorial",
    fonts: ["Pinyon+Script", "Cormorant:ital,wght@0,500;0,600;1,500", "Lato:wght@300;400;700"],
    display: "'Cormorant', serif", script: "'Pinyon Script', cursive", body: "'Lato', sans-serif",
    c: { bg: "#fbf6ee", bg2: "#f6e7e3", ink: "#5a1a24", mute: "#8b5a60", accent: "#c4303f", accent2: "#f3d5d5", line: "#e6c9c4", onAccent: "#fff" },
    radius: "4px", btn: "2px",
    tiles: [["#e9c4c4", "#fbf1ee"], ["#c4303f", "#eab5b5"], ["#f2dcd3", "#fffaf5"], ["#d9a6a8", "#f7e6e3"], ["#efd2cf", "#fff"], ["#b5323f", "#f0c9c7"]],
    lead: "Romantic outfit styling, lookbooks and try-on hauls with bows, lace and the little details that make people click ‘add to cart’.",
    work: ["Outfit of the day", "Try-on haul", "Bag spill", "Jewellery stack", "Styling 1 piece 3 ways", "Lookbook"],
    css: `
      .hero .script{font-family:var(--script);font-size:clamp(70px,13vw,180px);line-height:.9;color:var(--accent);font-weight:400}
      .card,.pkg,.step,.about-box{border:1px solid var(--line);outline:1px dashed var(--line);outline-offset:-8px}
      .sec-title{font-style:italic}
      .divider{text-align:center;color:var(--accent);letter-spacing:1em;margin:10px 0 0}
      .btn{letter-spacing:.2em;text-transform:uppercase;font-size:12px}
    `,
  },
  {
    slug: "peachy-keen", theme: "Peachy Keen", name: "Pari", tag: "Peach", niche: "Hair & body care UGC",
    motif: "🍑", hero: "split",
    fonts: ["Shrikhand", "DM+Sans:wght@400;500;700"],
    display: "'Shrikhand', cursive", body: "'DM Sans', sans-serif",
    c: { bg: "#fff4ec", bg2: "#ffe2cf", ink: "#5b2b1d", mute: "#94604f", accent: "#ff7f5c", accent2: "#ffd0b5", line: "#ffd9c4", onAccent: "#fff" },
    radius: "36px", btn: "999px",
    tiles: [["#ffb38a", "#ffe7d6"], ["#ff8e72", "#ffd6c2"], ["#ffc6a5", "#fff2e8"], ["#f7a07c", "#ffe0cc"], ["#ffcfb0", "#fff"], ["#ff9b85", "#ffe3db"]],
    lead: "Juicy, feel-good videos: wash-day routines, shower-tok and body care that looks as good as it smells.",
    work: ["Wash day", "Everything shower", "Heatless curls", "Scent layering", "Body oil glow", "Hair mask demo"],
    css: `
      .hero h1{color:var(--accent);transform:rotate(-2deg);font-weight:400}
      .blob{position:absolute;border-radius:50%;filter:blur(2px);z-index:0}
      .card:nth-child(odd){transform:rotate(-1.5deg)} .card:nth-child(even){transform:rotate(1.5deg)}
      .card:hover{transform:rotate(0) translateY(-6px)}
      .sec-title{font-weight:400;color:var(--accent)}
      .pkg h3{font-family:var(--body);font-weight:700}
    `,
  },
  {
    slug: "matcha-latte", theme: "Matcha Latte", name: "Maha", tag: "Matcha", niche: "Wellness & healthy-living UGC",
    motif: "🍵", hero: "editorial",
    fonts: ["Instrument+Serif:ital@0;1", "Inter:wght@300;400;500;600"],
    display: "'Instrument Serif', serif", body: "'Inter', sans-serif",
    c: { bg: "#f4f1e8", bg2: "#e9e5d6", ink: "#2f3a2c", mute: "#6b7563", accent: "#7f9a6f", accent2: "#dfe6d3", line: "#d6d2c2", onAccent: "#fff" },
    radius: "14px", btn: "10px",
    tiles: [["#a9bd98", "#eef2e6"], ["#d9c9ad", "#f7f1e6"], ["#8faa7d", "#dde8d2"], ["#e6dcc6", "#fff"], ["#b8c7a6", "#f2f5ec"], ["#c9b89a", "#efe7d8"]],
    lead: "Calm, clean-girl content: morning routines, healthy swaps and wellness products shown in real, everyday life.",
    work: ["Morning routine", "Matcha at home", "Healthy swap", "Gym bag essentials", "Supplement shelf", "Slow Sunday"],
    css: `
      .hero h1{font-weight:400;letter-spacing:-.03em}
      .hero h1 em{color:var(--accent)}
      .card,.pkg,.step,.about-box{border:1px solid var(--line);background:#faf8f2!important;box-shadow:none}
      .sec-title{font-weight:400}
      .marquee{background:var(--ink);color:var(--bg)}
    `,
  },
  {
    slug: "cherry-glam", theme: "Cherry Glam", name: "Zara", tag: "Cherry", niche: "Luxury beauty & fragrance UGC",
    motif: "🍒", hero: "editorial", dark: true,
    fonts: ["Bodoni+Moda:ital,wght@0,500;0,700;1,500", "Manrope:wght@300;400;600"],
    display: "'Bodoni Moda', serif", body: "'Manrope', sans-serif",
    c: { bg: "#22070d", bg2: "#320c15", ink: "#fbe9e4", mute: "#c9a3a3", accent: "#e0263f", accent2: "#e8c07a", line: "rgba(232,192,122,.25)", onAccent: "#fff" },
    radius: "6px", btn: "4px",
    tiles: [["#7a0f1f", "#2a0810"], ["#b3122b", "#3a0a14"], ["#5a1520", "#1a0508"], ["#e8c07a", "#5a3a16"], ["#8f1426", "#2a0810"], ["#3a0c16", "#120306"]],
    lead: "Glossy, cinematic close-ups for perfume, lipstick and luxury launches. Dark, rich and made to stop the scroll.",
    work: ["Perfume reveal", "Red lip moment", "Vanity tour", "Date-night look", "Gift set unboxing", "Cinematic B-roll"],
    css: `
      .hero h1 em{color:var(--accent2);font-style:italic}
      .card,.pkg,.step,.about-box{border:1px solid var(--line);background:var(--bg2)!important}
      .btn{background:var(--accent2);color:#22070d}
      .btn.ghost{border-color:var(--accent2);color:var(--accent2)}
      .eyebrow,.price{color:var(--accent2)!important}
      .marquee{background:var(--accent);color:#fff}
      .phone .cap{color:#fff}
    `,
  },
  {
    slug: "y2k-butterfly", theme: "Y2K Butterfly", name: "Bia", tag: "Bubbly", niche: "Tech, apps & gadget UGC",
    motif: "🦋", hero: "collage",
    fonts: ["Unbounded:wght@500;700;900", "Space+Grotesk:wght@400;500;700"],
    display: "'Unbounded', sans-serif", body: "'Space Grotesk', sans-serif",
    c: { bg: "#ffe4f6", bg2: "#fff", ink: "#2b0a3d", mute: "#7a4b8a", accent: "#ff2fa8", accent2: "#7cf3ff", line: "#2b0a3d", onAccent: "#fff" },
    radius: "20px", btn: "999px",
    tiles: [["#ff2fa8", "#ffb3e1"], ["#7cf3ff", "#e3fcff"], ["#c084fc", "#f3e8ff"], ["#ff8ad8", "#fff"], ["#a5f3fc", "#ffe4f6"], ["#f472b6", "#c4b5fd"]],
    lead: "Bubbly, fast-cut videos for apps, gadgets and girly tech: desk setups, phone cases and ‘apps I can’t live without’.",
    work: ["Desk setup", "App walkthrough", "Phone case haul", "What’s on my iPhone", "Gadget unboxing", "Day-in-my-life"],
    css: `
      body{background:radial-gradient(circle at 20% 20%,#fff 0 2px,transparent 3px) 0 0/60px 60px,linear-gradient(160deg,#ffe4f6,#f3e8ff 50%,#e3fcff)}
      .hero h1{background:linear-gradient(180deg,#fff 0%,#ffb3e1 30%,#ff2fa8 55%,#7a1f8a 56%,#ff8ad8 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:2px var(--ink);font-weight:900}
      .card,.pkg,.step,.about-box,.phone{border:2px solid var(--ink)!important}
      .btn{background:linear-gradient(90deg,#ff2fa8,#c084fc);border:2px solid var(--ink)}
      .marquee{background:var(--ink);color:var(--accent2)}
      .sparkle{position:absolute;font-size:28px;animation:twinkle 2.4s infinite}
      @keyframes twinkle{50%{opacity:.2;transform:scale(.7) rotate(20deg)}}
    `,
  },
  {
    slug: "vanilla-cloud", theme: "Vanilla Cloud", name: "Noor", tag: "Neutral", niche: "Home & lifestyle UGC",
    motif: "☁️", hero: "center",
    fonts: ["Italiana", "Karla:wght@300;400;600"],
    display: "'Italiana', serif", body: "'Karla', sans-serif",
    c: { bg: "#faf6f0", bg2: "#f1e9de", ink: "#3d342c", mute: "#8a7d70", accent: "#bf9b7a", accent2: "#efe4d6", line: "#e6dccf", onAccent: "#fff" },
    radius: "999px 999px 24px 24px", btn: "999px",
    tiles: [["#e8dccb", "#fbf8f3"], ["#d6c2a8", "#f5eee4"], ["#efe6da", "#fff"], ["#cdb79c", "#efe4d6"], ["#e2d3c0", "#faf6f0"], ["#d9c8b4", "#f6efe6"]],
    lead: "Soft, neutral home content: cosy corners, organising, candles and the quiet aesthetic moments people save for later.",
    work: ["Room refresh", "Restock & organise", "Candle evening", "Cosy reading nook", "Laundry day", "Kitchen reset"],
    css: `
      .hero h1{font-weight:400;letter-spacing:.04em}
      .phone{border-radius:999px 999px 26px 26px!important}
      .card .ph{border-radius:999px 999px 18px 18px}
      .pkg,.step,.about-box{border-radius:28px!important;border:1px solid var(--line);box-shadow:none}
      .sec-title{font-weight:400;letter-spacing:.04em}
    `,
  },
  {
    slug: "rose-garden", theme: "Rose Garden", name: "Rumi", tag: "Rose", niche: "Mom life & family UGC",
    motif: "🌷", hero: "collage",
    fonts: ["DM+Serif+Display:ital@0;1", "Quicksand:wght@400;500;700"],
    display: "'DM Serif Display', serif", body: "'Quicksand', sans-serif",
    c: { bg: "#fbf2ee", bg2: "#f4e3dc", ink: "#4b2e2a", mute: "#86625b", accent: "#c76b7e", accent2: "#b7c4a5", line: "#ead5cc", onAccent: "#fff" },
    radius: "18px", btn: "999px",
    tiles: [["#e7a9b5", "#fbecee"], ["#b7c4a5", "#eef2e7"], ["#f1c8bd", "#fff6f2"], ["#d48a99", "#f6dde1"], ["#c9d3b8", "#f7f9f2"], ["#f3d2c8", "#fff"]],
    lead: "Warm, real-life family content: baby essentials, mum hacks and cosy home moments that feel like advice from a friend.",
    work: ["Diaper bag packing", "Toddler snack ideas", "Nursery tour", "Mum morning routine", "Toy rotation", "Family picnic"],
    css: `
      body{background-image:radial-gradient(circle at 0 0,rgba(199,107,126,.12) 0 120px,transparent 121px),radial-gradient(circle at 100% 40%,rgba(183,196,165,.18) 0 160px,transparent 161px);background-color:var(--bg)}
      .polaroid{background:#fff;padding:10px 10px 34px;box-shadow:0 14px 30px -14px rgba(75,46,42,.4);border-radius:4px;position:absolute}
      .polaroid .ph{border-radius:2px}
      .polaroid span{position:absolute;bottom:8px;left:0;right:0;text-align:center;font-size:13px;color:var(--mute)}
      .hero h1 em{color:var(--accent)}
    `,
  },
];

const services = (t) => [
  { name: "Starter", price: "$150", per: "1 video", items: ["1 × 15–30s vertical video", "1 hook variation", "Raw footage included", "1 round of edits"] },
  { name: "Signature", price: "$400", per: "3 videos", hot: true, items: ["3 × 15–60s vertical videos", "3 hooks per video", "Captions & on-screen text", "2 rounds of edits"] },
  { name: "Monthly", price: "$1,100", per: "per month", items: ["8 videos a month", "Photos for ads & product pages", "Script ideas for your brand", "Priority turnaround"] },
];

const steps = ["Send your brief & product", "I script & plan the hooks", "Film, edit & deliver in 5–7 days", "Edits, then you post or run ads"];
const marqueeWords = ["UGC videos", "Product photos", "Unboxings", "Voiceovers", "Hooks that convert", "Paid ad creatives", "Raw footage"];

const phone = (t, i, extra = "", cls = "phone") => {
  const [a, b] = t.tiles[i % t.tiles.length];
  return `<div class="${cls}" style="background:linear-gradient(160deg,${a},${b});${extra}"><div class="notch"></div><div class="play">▶</div><div class="cap">${t.work[i % t.work.length]}</div></div>`;
};

function heroHTML(t) {
  const title = `${t.name} <em>${t.tag}</em>`;
  const cta = `<div class="ctas"><a class="btn" href="#contact">Work with me</a><a class="btn ghost" href="#work">See my work</a></div>`;
  if (t.hero === "split") return `
  <header class="hero split">
    ${t.slug === "peachy-keen" ? `<div class="blob" style="width:320px;height:320px;background:#ffd0b5;top:-60px;right:-80px"></div><div class="blob" style="width:200px;height:200px;background:#ffe2cf;bottom:40px;left:-60px"></div>` : ""}
    <div class="wrap grid">
      <div>
        <p class="eyebrow">${t.motif} ${t.niche}</p>
        <h1>${title}</h1>
        <p class="lead">${t.lead}</p>
        ${cta}
      </div>
      <div class="stack">${phone(t, 0, "transform:rotate(-8deg) translate(-40px,30px)")}${phone(t, 1, "transform:rotate(2deg);z-index:2")}${phone(t, 2, "transform:rotate(10deg) translate(40px,30px)")}</div>
    </div>
    ${t.slug === "blush-ballet" ? `<div class="ribbon"></div>` : ""}
  </header>`;
  if (t.hero === "center") return `
  <header class="hero center">
    <div class="wrap">
      <p class="eyebrow">${t.motif} ${t.niche}</p>
      <h1>${title}</h1>
      <p class="lead">${t.lead}</p>
      ${cta}
      <div class="fan">${phone(t, 3, "transform:rotate(-10deg) translateY(30px)")}${phone(t, 0, "transform:translateY(-10px);z-index:2")}${phone(t, 4, "transform:rotate(10deg) translateY(30px)")}</div>
    </div>
  </header>`;
  if (t.hero === "editorial") return `
  <header class="hero editorial">
    <div class="wrap">
      <div class="ed-top"><span class="eyebrow">${t.motif} ${t.niche}</span><span class="eyebrow">UGC creator</span></div>
      ${t.script ? `<h1><span class="script">${t.name}</span> <em>${t.tag}</em></h1>` : `<h1>${title}</h1>`}
      ${t.slug === "coquette" ? `<p class="divider">🎀 🎀 🎀</p>` : ""}
      <div class="ed-grid">
        <p class="lead">${t.lead}</p>
        ${phone(t, 1)}
        <div class="ed-side"><p class="eyebrow">Available for</p><p>Paid ads · Organic posts · Product pages · Launch campaigns</p>${cta}</div>
      </div>
    </div>
  </header>`;
  // collage
  const pos = [
    "top:40px;left:2%;transform:rotate(-9deg)", "top:20px;right:3%;transform:rotate(8deg)",
    "bottom:30px;left:8%;transform:rotate(6deg)", "bottom:10px;right:9%;transform:rotate(-7deg)",
  ];
  const polaroid = t.slug === "rose-garden";
  const items = pos.map((p, i) => polaroid
    ? `<div class="polaroid" style="${p}"><div class="ph" style="width:150px;aspect-ratio:4/5;background:linear-gradient(160deg,${t.tiles[i][0]},${t.tiles[i][1]})"></div><span>${t.work[i]}</span></div>`
    : phone(t, i, `position:absolute;width:150px;${p}`)).join("");
  const sparkles = t.slug === "y2k-butterfly" ? `<span class="sparkle" style="top:18%;left:30%">✦</span><span class="sparkle" style="top:70%;right:30%;animation-delay:.8s">✧</span><span class="sparkle" style="top:30%;right:24%;animation-delay:1.4s">🦋</span><span class="sparkle" style="bottom:12%;left:34%;animation-delay:.4s">✦</span>` : "";
  return `
  <header class="hero collage">
    <div class="collage-items">${items}</div>${sparkles}
    <div class="wrap">
      <p class="eyebrow">${t.motif} ${t.niche}</p>
      <h1>${title}</h1>
      <p class="lead">${t.lead}</p>
      ${cta}
    </div>
  </header>`;
}

function page(t) {
  const fontHref = `https://fonts.googleapis.com/css2?${t.fonts.map((f) => "family=" + f).join("&")}&display=swap`;
  const c = t.c;
  const pk = services(t);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.name} ${t.tag} — ${t.niche}</title>
<meta name="description" content="${t.name} ${t.tag}: ${t.niche}. ${t.theme} UGC portfolio template by Jugaar Media.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontHref}" rel="stylesheet">
<style>
  :root{--bg:${c.bg};--bg2:${c.bg2};--ink:${c.ink};--mute:${c.mute};--accent:${c.accent};--accent2:${c.accent2};--line:${c.line};--on:${c.onAccent};
    --display:${t.display};--body:${t.body};${t.script ? `--script:${t.script};` : ""}--r:${t.radius};--br:${t.btn};color-scheme:${t.dark ? "dark" : "light"}}
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--ink);font-family:var(--body);line-height:1.6;overflow-x:hidden}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1160px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
  .tpl{background:var(--ink);color:var(--bg);font-size:12px;text-align:center;padding:7px 12px;letter-spacing:.04em}
  .tpl a{text-decoration:underline}
  nav{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px)}
  nav .wrap{display:flex;align-items:center;justify-content:space-between;height:70px}
  .logo{font-family:var(--display);font-size:24px;font-weight:600}
  nav ul{display:flex;gap:28px;list-style:none;font-size:14px}
  nav ul a:hover{color:var(--accent)}
  .btn{display:inline-block;background:var(--accent);color:var(--on);padding:14px 28px;border-radius:var(--br);font-weight:600;font-size:15px;transition:.2s;border:2px solid transparent;cursor:pointer;font-family:var(--body)}
  .btn:hover{transform:translateY(-2px)}
  .btn.ghost{background:transparent;color:var(--ink);border-color:var(--ink)}
  .btn.sm{padding:10px 20px;font-size:13px}
  .eyebrow{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:600}
  h1,h2,h3{font-family:var(--display);line-height:1.02}
  .hero{position:relative;overflow:hidden;padding:80px 0 100px}
  .hero h1{font-size:clamp(56px,9vw,124px);margin:16px 0 22px;font-weight:700}
  .hero h1 em{font-style:normal}
  .lead{font-size:18px;color:var(--mute);max-width:520px}
  .ctas{display:flex;gap:14px;flex-wrap:wrap;margin-top:32px}
  .phone{width:200px;aspect-ratio:9/16;border-radius:30px;position:relative;box-shadow:0 30px 60px -30px rgba(0,0,0,.35);border:6px solid #fff;overflow:hidden;flex:none}
  .phone .notch{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:60px;height:16px;border-radius:10px;background:rgba(0,0,0,.18)}
  .phone .play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;background:rgba(255,255,255,.75);display:grid;place-items:center;color:var(--ink);font-size:18px;padding-left:4px}
  .phone .cap{position:absolute;bottom:14px;left:14px;right:14px;font-size:13px;font-weight:600;color:var(--ink);background:rgba(255,255,255,.7);padding:6px 10px;border-radius:10px;backdrop-filter:blur(4px)}
  ${t.dark ? ".phone{border-color:#3a0c16}.phone .cap{background:rgba(0,0,0,.45)}.phone .play{background:rgba(255,255,255,.2);color:#fff}" : ""}
  .split .grid{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:center}
  .stack{display:flex;justify-content:center;align-items:center;min-height:460px}
  .stack .phone{margin:0 -50px}
  .center{text-align:center}.center .lead{margin:0 auto}.center .ctas{justify-content:center}
  .fan{display:flex;justify-content:center;margin-top:60px}.fan .phone{margin:0 -24px}
  .editorial .ed-top{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:14px}
  .editorial h1{font-size:clamp(64px,13vw,190px);letter-spacing:-.04em;margin:30px 0}
  .ed-grid{display:grid;grid-template-columns:1fr auto 1fr;gap:48px;align-items:end;border-top:1px solid var(--line);padding-top:36px}
  .ed-side p:not(.eyebrow){margin:8px 0 0;color:var(--mute)}
  .collage{padding:120px 0 140px;text-align:center;min-height:640px}
  .collage .lead{margin:0 auto}.collage .ctas{justify-content:center}
  .collage-items{position:absolute;inset:0;max-width:1300px;margin:0 auto}
  .marquee{background:var(--accent2);overflow:hidden;white-space:nowrap;padding:16px 0;font-family:var(--display);font-size:22px}
  .marquee div{display:inline-block;animation:scroll 30s linear infinite}
  .marquee span{margin:0 26px}
  @keyframes scroll{to{transform:translateX(-50%)}}
  section{padding:100px 0}
  .sec-head{text-align:center;max-width:640px;margin:0 auto 54px}
  .sec-title{font-size:clamp(38px,5vw,60px);margin:10px 0 14px}
  .sec-head p{color:var(--mute)}
  .about{display:grid;grid-template-columns:1fr 1.2fr;gap:56px;align-items:center}
  .about-box{background:var(--bg2);border-radius:var(--r);aspect-ratio:4/5;display:grid;place-items:center;font-size:110px;position:relative;overflow:hidden}
  .about-box small{position:absolute;bottom:16px;font-size:13px;color:var(--mute)}
  .about h2{font-size:clamp(36px,4.5vw,54px);margin:10px 0 20px}
  .about p{color:var(--mute);margin-bottom:14px}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
  .chips span{border:1px solid var(--line);padding:8px 16px;border-radius:999px;font-size:14px;background:var(--bg)}
  .work{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
  .card{background:var(--bg2);border-radius:var(--r);padding:14px;transition:.25s}
  .card:hover{transform:translateY(-6px)}
  .card .ph{aspect-ratio:9/14;border-radius:calc(var(--r) * .7);position:relative;overflow:hidden}
  .card .ph .play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.8);display:grid;place-items:center;padding-left:4px;color:#333}
  .card h3{font-size:22px;margin:16px 6px 4px}
  .card p{font-size:14px;color:var(--mute);margin:0 6px 6px}
  .pkgs{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;align-items:stretch}
  .pkg{background:var(--bg2);border-radius:var(--r);padding:36px 30px;display:flex;flex-direction:column}
  .pkg.hot{background:var(--accent2);position:relative}
  .pkg.hot::before{content:"Most booked";position:absolute;top:-13px;left:30px;background:var(--accent);color:var(--on);font-size:12px;padding:4px 12px;border-radius:999px;font-weight:600}
  .pkg h3{font-size:28px}
  .price{font-family:var(--display);font-size:44px;margin:14px 0 2px;color:var(--accent)}
  .per{font-size:13px;color:var(--mute);margin-bottom:22px}
  .pkg ul{list-style:none;flex:1;margin-bottom:26px}
  .pkg li{padding:9px 0;border-bottom:1px solid var(--line);font-size:15px}
  .pkg li::before{content:"${t.motif} ";font-size:12px}
  .note{text-align:center;color:var(--mute);font-size:13px;margin-top:22px}
  .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
  .step{background:var(--bg2);border-radius:var(--r);padding:28px 24px}
  .step b{font-family:var(--display);font-size:42px;color:var(--accent);display:block;margin-bottom:10px}
  .contact{background:var(--bg2);text-align:center;border-radius:var(--r);padding:80px 30px}
  .contact h2{font-size:clamp(40px,6vw,74px);margin:12px 0 16px}
  .contact p{color:var(--mute);max-width:520px;margin:0 auto 30px}
  form{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:620px;margin:0 auto;text-align:left}
  form input,form textarea,form select{width:100%;padding:15px 18px;border-radius:14px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font:inherit}
  form textarea{grid-column:1/-1;min-height:120px;resize:vertical}
  form .full{grid-column:1/-1}
  form button{grid-column:1/-1;justify-self:center}
  footer{padding:40px 0;text-align:center;color:var(--mute);font-size:14px}
  footer .socials{display:flex;gap:20px;justify-content:center;margin-bottom:12px;font-weight:600;color:var(--ink)}
  ${t.css}
  @media (max-width:900px){
    nav ul{display:none}
    .split .grid,.about,.ed-grid{grid-template-columns:1fr}
    .ed-grid .phone{margin:0 auto}
    .stack{min-height:380px}.stack .phone,.fan .phone{width:150px}
    .work,.pkgs{grid-template-columns:1fr 1fr}
    .steps{grid-template-columns:1fr 1fr}
    .collage{padding:60px 0 80px;min-height:0}
    .collage-items{position:static;display:flex;justify-content:center;gap:12px;margin-bottom:40px;flex-wrap:wrap}
    .collage-items>*{position:relative!important;inset:auto!important;width:120px!important}
    .collage-items .polaroid .ph{width:100px!important}
    .collage-items>*:nth-child(n+4){display:none}
    .sparkle{display:none}
    .hero h1{font-size:clamp(42px,12vw,72px)}
    .collage-items{gap:8px}.collage-items>*{width:110px!important}
  }
  @media (max-width:560px){
    .work,.pkgs,.steps,form{grid-template-columns:1fr}
    section{padding:70px 0}
    .stack .phone{width:130px;margin:0 -36px}
    .fan .phone{width:120px;margin:0 -18px}
  }
</style>
</head>
<body>
  <div class="tpl">${t.theme} UGC template by <a href="index.html">Jugaar Media</a> · names, rates and links are placeholders</div>
  <nav><div class="wrap">
    <a class="logo" href="#">${t.name} ${t.tag} ${t.motif}</a>
    <ul><li><a href="#about">About</a></li><li><a href="#work">Portfolio</a></li><li><a href="#rates">Rates</a></li><li><a href="#process">Process</a></li></ul>
    <a class="btn sm" href="#contact">Let’s collab</a>
  </div></nav>
  ${heroHTML(t)}
  <div class="marquee"><div>${[...marqueeWords, ...marqueeWords].map((w) => `<span>${w}</span><span>${t.motif}</span>`).join("")}</div></div>

  <section id="about"><div class="wrap about">
    <div class="about-box">${t.motif}<small>Add your photo here</small></div>
    <div>
      <p class="eyebrow">Hi, I’m ${t.name}</p>
      <h2>I make content that feels like a friend’s recommendation.</h2>
      <p>I’m a UGC creator focused on ${t.niche.replace(" UGC", "").toLowerCase()}. Brands hire me for scroll-stopping videos they can run as ads, post on their own pages or use on product listings.</p>
      <p>Every video is filmed in natural light, scripted around a strong hook and delivered ready to post: edited, captioned and in the right format.</p>
      <div class="chips"><span>TikTok</span><span>Instagram Reels</span><span>YouTube Shorts</span><span>Meta ads</span><span>Amazon listings</span></div>
    </div>
  </div></section>

  <section id="work" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><p class="eyebrow">Portfolio</p><h2 class="sec-title">Recent content</h2><p>Replace these tiles with your own videos or embeds.</p></div>
    <div class="work">${t.work.map((w, i) => `<div class="card"><div class="ph" style="background:linear-gradient(160deg,${t.tiles[i][0]},${t.tiles[i][1]})"><div class="play">▶</div></div><h3>${w}</h3><p>Vertical video · 9:16</p></div>`).join("")}</div>
  </div></section>

  <section id="rates" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><p class="eyebrow">Packages</p><h2 class="sec-title">Simple rates</h2><p>Every package includes product research, scripting and usage rights for organic posting.</p></div>
    <div class="pkgs">${pk.map((p) => `<div class="pkg${p.hot ? " hot" : ""}"><h3>${p.name}</h3><div class="price">${p.price}</div><div class="per">${p.per}</div><ul>${p.items.map((i) => `<li>${i}</li>`).join("")}</ul><a class="btn${p.hot ? "" : " ghost"}" href="#contact">Book ${p.name}</a></div>`).join("")}</div>
    <p class="note">Sample rates. Paid-ad usage rights and whitelisting are quoted separately.</p>
  </div></section>

  <section id="process" style="padding-top:0"><div class="wrap">
    <div class="sec-head"><p class="eyebrow">How it works</p><h2 class="sec-title">From brief to post</h2></div>
    <div class="steps">${steps.map((s, i) => `<div class="step"><b>0${i + 1}</b>${s}</div>`).join("")}</div>
  </div></section>

  <section id="contact" style="padding-top:0"><div class="wrap"><div class="contact">
    <p class="eyebrow">${t.motif} Let’s create together</p>
    <h2>Have a product to share?</h2>
    <p>Tell me about your brand and I’ll reply within 48 hours with ideas and a quote.</p>
    <form onsubmit="event.preventDefault();location.href='mailto:hello@example.com?subject='+encodeURIComponent('Collab: '+this.brand.value)+'&body='+encodeURIComponent(this.msg.value+'\\n\\n'+this.who.value+' · '+this.email.value)">
      <input name="who" placeholder="Your name" required>
      <input name="email" type="email" placeholder="Email" required>
      <input name="brand" class="full" placeholder="Brand / product" required>
      <textarea name="msg" placeholder="What would you like to create?"></textarea>
      <button class="btn" type="submit">Send enquiry</button>
    </form>
  </div></div></section>

  <footer><div class="wrap">
    <div class="socials"><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">YouTube</a><a href="mailto:hello@example.com">Email</a></div>
    <p>© ${new Date().getFullYear()} ${t.name} ${t.tag} · ${t.theme} template by Jugaar Media</p>
  </div></footer>
</body>
</html>
`;
}

for (const t of themes) writeFileSync(join(out, `${t.slug}.html`), page(t));

// Gallery page
const gallery = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Girly UGC website templates — Jugaar Media</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=Jost:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Jost',sans-serif;background:#fff7f9;color:#3d2830}
  a{color:inherit;text-decoration:none}
  header{text-align:center;padding:80px 24px 50px}
  h1{font-family:'Playfair Display',serif;font-size:clamp(40px,6vw,72px);line-height:1.05}
  h1 em{color:#e48aa6}
  header p{color:#8d6a73;margin-top:14px;font-size:18px}
  .grid{max-width:1200px;margin:0 auto;padding:0 24px 80px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
  .t{border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 18px 40px -26px rgba(120,40,70,.45);transition:.25s}
  .t:hover{transform:translateY(-6px)}
  .sw{height:170px;display:flex;align-items:center;justify-content:center;font-size:52px;position:relative}
  .sw i{position:absolute;bottom:12px;left:12px;display:flex;gap:6px}
  .sw i b{width:20px;height:20px;border-radius:50%;border:2px solid #fff}
  .t div.meta{padding:18px 20px 22px}
  .t h2{font-size:22px}
  .t p{font-size:14px;color:#8d6a73}
</style>
</head>
<body>
  <header><h1>10 <em>girly</em> UGC websites</h1><p>Creator portfolio templates by Jugaar Media. Click one to open it.</p></header>
  <div class="grid">
    ${themes.map((t, i) => `<a class="t" href="${t.slug}.html"><div class="sw" style="background:linear-gradient(135deg,${t.c.bg2},${t.c.accent2})">${t.motif}<i>${[t.c.bg, t.c.accent, t.c.accent2, t.c.ink].map((x) => `<b style="background:${x}"></b>`).join("")}</i></div><div class="meta"><h2>${String(i + 1).padStart(2, "0")} · ${t.theme}</h2><p>${t.niche}</p></div></a>`).join("")}
  </div>
</body>
</html>
`;
writeFileSync(join(out, "index.html"), gallery);
console.log(`Built ${themes.length} sites + gallery in ugc/`);
