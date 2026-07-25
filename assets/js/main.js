/* =========================================================
   Анна Шаверина — сайт карьерного консультанта
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG — замените плейсхолдеры на реальные ссылки Анны.
   Это единственное место, где нужно править контакты.
   --------------------------------------------------------- */
const CONFIG = {
  hh:    "https://hh.ru/mentors/6411",
  dzen:  "https://dzen.ru/shaverina_consultant",
  vk:    "https://vk.com/shaverina_consultant",
  setka: "https://setka.ru/users/a08baf91-d9fd-4711-a15f-7b4570cbdf1e",
  max:   "https://max.ru/join/SMhe42i6_j_sAY8gJr7YliVVt_5zvStjUOI-_NRWU5I",
  phone: "+79930726515",
  email: "a.shaverina@gmail.com",
  tg:    "",                              // TODO: прямая ссылка на Telegram (t.me/…)

  // Куда отправлять заявку с формы. Пока не задан endpoint — форма
  // показывает подтверждение. Впишите URL (Formspree, Getform и т.п.):
  formEndpoint: ""
};

document.addEventListener("DOMContentLoaded", () => {
  wireLinks();
  wireHeader();
  wireMobileNav();
  wireReveal();
  wireCounters();
  wireFaqAccordion();
  wireForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* -------- подставить реальные ссылки из CONFIG -------- */
function wireLinks(){
  document.querySelectorAll("[data-link]").forEach(a => {
    const key = a.getAttribute("data-link");
    if (key === "email"){ a.href = "mailto:" + CONFIG.email; a.removeAttribute("target"); return; }
    if (key === "phone"){ a.href = "tel:" + CONFIG.phone; a.removeAttribute("target"); return; }
    // Telegram пока не задан — ведём в Max (мессенджер Анны), чтобы ссылка не была пустой
    if (key === "tg" && !CONFIG.tg){
      if (CONFIG.max){ a.href = CONFIG.max; return; }
      a.href = "mailto:" + CONFIG.email; a.removeAttribute("target"); return;
    }
    if (CONFIG[key]) a.href = CONFIG[key];
  });
}

/* -------- тень/бордер у шапки при скролле -------- */
function wireHeader(){
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });
}

/* -------- мобильное меню -------- */
function wireMobileNav(){
  const burger = document.getElementById("burger");
  const nav = document.getElementById("mobileNav");
  const close = () => {
    nav.classList.remove("open");
    nav.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    nav.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  window.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* -------- появление секций (split + stagger) -------- */
function wireReveal(){
  const items = document.querySelectorAll(".reveal");
  items.forEach(el => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d);
  });
  if (!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.05, rootMargin:"0px 0px -40px 0px" });
  items.forEach(el => io.observe(el));

  // Страховка. Контент не должен остаться невидимым ни при каких условиях:
  // подмороженный рендер, печать, нестандартный браузер, быстрый скролл.
  const sweep = () => {
    const vh = window.innerHeight;
    items.forEach(el => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.98 && r.bottom > 0) el.classList.add("in");
    });
  };
  window.addEventListener("scroll", sweep, { passive:true });
  window.addEventListener("resize", sweep, { passive:true });
  window.addEventListener("beforeprint", () => items.forEach(el => el.classList.add("in")));
  setTimeout(sweep, 1200);
}

/* -------- счётчики цифр в тёмном блоке -------- */
function wireCounters(){
  const nums = document.querySelectorAll(".num[data-count]");
  if (!nums.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    if (reduce){ el.textContent = target.toLocaleString("ru-RU") + suffix; return; }
    const dur = 900; const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ru-RU") + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){ animate(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold:0.6 });
  nums.forEach(el => io.observe(el));
}

/* -------- FAQ: открыт только один пункт -------- */
function wireFaqAccordion(){
  const items = document.querySelectorAll(".faq-item");
  items.forEach(item => {
    item.addEventListener("toggle", () => {
      if (item.open){
        items.forEach(other => { if (other !== item) other.open = false; });
      }
    });
  });
}

/* -------- форма заявки -------- */
function wireForm(){
  const form = document.getElementById("leadForm");
  if (!form) return;
  const success = document.getElementById("formSuccess");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());

    // Вариант 1: настроен endpoint — отправляем POST.
    if (CONFIG.formEndpoint){
      try{
        const res = await fetch(CONFIG.formEndpoint, {
          method:"POST",
          headers:{ "Accept":"application/json", "Content-Type":"application/json" },
          body:JSON.stringify(data)
        });
        if (res.ok){ showSuccess(); return; }
      }catch(_){ /* упадём в запасной вариант ниже */ }
    }

    // Вариант 2 (запасной): открыть Telegram, показать подтверждение.
    showSuccess();
    if (CONFIG.tg && CONFIG.tg !== "https://t.me/"){
      window.open(CONFIG.tg, "_blank", "noopener");
    }
  });

  function showSuccess(){
    success.hidden = false;
    form.querySelectorAll("input,textarea,button").forEach(el => el.setAttribute("disabled",""));
    success.scrollIntoView({ behavior:"smooth", block:"center" });
  }
}
