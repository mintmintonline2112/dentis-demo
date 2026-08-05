/* ==========================================================================
   SSD — Studio of Smile Design · main.js (toàn bộ JS của site)
   Load ở cuối <body>, SAU các file vendor (gsap...) nếu trang cần.
   Cấu trúc:
     1. SHARED   — chạy mọi trang (theme toggle, topbar cuộn)
     2. LANDING  — chỉ chạy khi <body class="page-landing">
     3. NIỀNG RĂNG — chỉ chạy khi <body class="page-nieng">
     4. CẠO VÔI RĂNG — chỉ chạy khi <body class="page-caovoi">
   Quy ước: JS chỉ toggle class trạng thái `is-*`; bám phần tử qua id / data-*.
   ========================================================================== */

/* ==========================================================================
   1. SHARED
   ========================================================================== */

/* ---- Nút chuyển Dark / Light ---- */
(function () {
  const root = document.documentElement;
  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  function apply(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    btn.setAttribute("aria-pressed", String(theme === "light"));
    try { localStorage.setItem("ssd-theme", theme); } catch (e) {}
  }
  // đồng bộ trạng thái ban đầu (head.js đã áp theme từ localStorage)
  apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  btn.addEventListener("click", () => {
    apply(root.getAttribute("data-theme") === "light" ? "dark" : "light");
  });
})();

/* ---- Topbar: nền glass khi cuộn ---- */
(function () {
  const tb = document.getElementById("topbar");
  if (!tb) return;
  const on = () => tb.classList.toggle("is-scrolled", window.scrollY > 40);
  on();
  window.addEventListener("scroll", on, { passive: true });
})();

/* ==========================================================================
   2. LANDING — landing-1.html
   ========================================================================== */
if (document.body.classList.contains("page-landing")) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Vị trí menu (MOBILE): bấm điểm chọn để đặt menu, bấm Save để lưu ---- */
  (function () {
    const root = document.documentElement;
    const saveBtn = document.querySelector(".save-btn");
    const toast = document.getElementById("toast");
    const dots = [].slice.call(document.querySelectorAll(".pos-dot"));
    const POS = ["left", "center", "right"];
    const isMobile = () => window.matchMedia("(max-width:640px)").matches;
    let toastTimer;

    function curPos() {
      const p = root.getAttribute("data-pos");
      return POS.indexOf(p) >= 0 ? p : "left";
    }
    // Lật hướng fan cho vị trí phải (khi có GSAP vì GSAP ghi transform inline đè CSS)
    function applyFan() {
      if (!window.gsap) return;               // không GSAP → CSS lo phần này
      const mirror = isMobile() && curPos() === "right";
      document.querySelectorAll(".spoke").forEach((s) => {
        const deg = parseFloat(s.style.getPropertyValue("--deg")) || 0;
        gsap.to(s, {
          rotation: mirror ? -deg : deg,
          transformOrigin: mirror ? "right center" : "left center",
          duration: .45, ease: "power3.out", overwrite: "auto"
        });
      });
    }
    let editing = false;
    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1600);
    }
    function setEditing(on) {
      editing = on;
      root.classList.toggle("is-pos-editing", on);
      if (saveBtn) saveBtn.setAttribute("aria-pressed", String(on));
    }
    function setPos(pos) {
      root.setAttribute("data-pos", pos);      // menu trượt tới vị trí xem trước
      applyFan();
    }

    // bấm 1 trong 3 điểm → đặt menu ở đó (xem trước, chưa lưu)
    dots.forEach((d) => d.addEventListener("click", () => setPos(d.dataset.pos)));

    // nút đĩa mềm: lần 1 = bật chọn vị trí, lần 2 = lưu & ẩn điểm
    if (saveBtn) saveBtn.addEventListener("click", () => {
      if (!isMobile()) return;
      if (!editing) {
        setEditing(true);
        showToast("Chọn vị trí rồi bấm Lưu");
      } else {
        try { localStorage.setItem("ssd-menu-pos", curPos()); } catch (e) {}
        setEditing(false);
        showToast("Đã lưu vị trí menu");
      }
    });
    // rời chế độ chọn khi bấm ra ngoài (không phải điểm chọn / nút Save)
    document.addEventListener("click", (e) => {
      if (editing && !e.target.closest(".pos-dot") && !e.target.closest(".save-btn")) setEditing(false);
    });

    // áp đúng hướng fan cho vị trí đã lưu (sau khi GSAP intro chạy) + khi xoay màn hình
    setTimeout(applyFan, 1500);
    window.addEventListener("resize", applyFan);
  })();

  /* ---- Kéo mặt số để XOAY cả cụm menu (render tách khỏi input → mượt) ---- */
  (function () {
    const root = document.documentElement;
    const lens = document.querySelector(".dial-lens");
    const spokes = [].slice.call(document.querySelectorAll(".spoke"));
    if (!lens) return;

    let targetRot = 0, rot = 0, prevTarget = 0, vel = 0;
    let dragging = false, lastAng = 0, running = false, raf = 0;

    const center = () => {
      const r = lens.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const angle = (x, y) => { const c = center(); return Math.atan2(y - c.y, x - c.x) * 180 / Math.PI; };
    const norm = (d) => { while (d > 180) d -= 360; while (d < -180) d += 360; return d; };
    const isMirror = () =>
      window.matchMedia("(max-width:640px)").matches && root.getAttribute("data-pos") === "right";

    // vẽ theo góc "rot" đã được làm mượt
    function render() {
      const m = isMirror();
      for (let i = 0; i < spokes.length; i++) {
        const s = spokes[i];
        const deg = parseFloat(s.style.getPropertyValue("--deg")) || 0;
        s.style.transform = "rotate(" + ((m ? -deg : deg) + rot) + "deg)";
      }
      lens.style.transform = "rotate(" + rot + "deg)";
    }

    // vòng lặp: kéo → theo sát; buông → quán tính; luôn ease tới đích cho mượt
    function loop() {
      if (dragging) {
        vel = vel * 0.6 + (targetRot - prevTarget) * 0.4;   // vận tốc làm mượt
        prevTarget = targetRot;
      } else {
        targetRot += vel;                                    // quán tính
        vel *= 0.94;
        if (Math.abs(vel) < 0.015) vel = 0;
      }
      rot += (targetRot - rot) * 0.25;                       // nội suy mượt
      render();
      if (dragging || vel !== 0 || Math.abs(targetRot - rot) > 0.02) {
        raf = requestAnimationFrame(loop);
      } else {
        rot = targetRot; render(); running = false;
      }
    }
    function start() { if (!running) { running = true; prevTarget = targetRot; raf = requestAnimationFrame(loop); } }

    lens.addEventListener("pointerdown", (e) => {
      dragging = true;
      try { lens.setPointerCapture(e.pointerId); } catch (_) {}
      lastAng = angle(e.clientX, e.clientY);
      vel = 0; prevTarget = targetRot;
      root.classList.add("is-dial-dragging");
      e.preventDefault();
      start();
    });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const a = angle(e.clientX, e.clientY);
      targetRot += norm(a - lastAng);     // chỉ cập nhật đích, render để loop lo
      lastAng = a;
      start();
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dial-dragging");
      start();                            // loop tiếp tục chạy quán tính
    }
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
  })();

  /* ---- Menu vòng cung + panel (GSAP; có fallback không thư viện) ---- */
  if (!window.gsap) {
    // Không có thư viện → hiện mọi thứ (menu + panel vẫn dùng được, chỉ không có hiệu ứng).
    document.documentElement.classList.remove("has-js");
    // fallback tối thiểu: click menu để mở panel bằng CSS class
    document.querySelectorAll('.spoke a, a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href.startsWith("#")) return;   // link sang trang khác (vd niềng răng) → điều hướng bình thường
        const id = href.slice(1);
        e.preventDefault();
        document.querySelectorAll(".panel").forEach((p) => p.classList.remove("is-active"));
        document.documentElement.classList.remove("is-panel-open");
        if (id && id !== "home") {
          const p = document.getElementById(id);
          if (p) { p.classList.add("is-active"); document.documentElement.classList.add("is-panel-open"); }
        }
      });
    });
    const cb = document.querySelector(".panel-close");
    if (cb) cb.addEventListener("click", () => {
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("is-active"));
      document.documentElement.classList.remove("is-panel-open");
    });
  } else {
    const root    = document.documentElement;
    const spokes  = gsap.utils.toArray(".spoke");
    const anchors = spokes.map((s) => s.querySelector("a"));
    const panels  = gsap.utils.toArray(".panel");
    const closeBtn = document.querySelector(".panel-close");

    /* ---- Intro khi tải: logo, icon, mặt số, rồi MENU XOÈ RA (thường trực) ---- */
    if (reduce) {
      gsap.set([".brand", ".theme-toggle", ".dial-lens"], { opacity: 1 });
      spokes.forEach((s) => {
        const deg = parseFloat(s.style.getPropertyValue("--deg")) || 0;
        gsap.set(s, { opacity: 1, rotation: deg, transformOrigin: "left center" });
      });
    } else {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to([".brand", ".theme-toggle"], { opacity: 1, duration: .8, stagger: .1 })
        .fromTo(".dial-lens",
          { opacity: 0, scale: .5, transformOrigin: "50% 50%" },
          { opacity: 1, scale: 1, duration: 1 }, "-=.4");
      spokes.forEach((s, i) => {
        const deg = parseFloat(s.style.getPropertyValue("--deg")) || 0;
        intro.fromTo(s,
          { opacity: 0, rotation: -1, transformOrigin: "left center" },
          { opacity: 1, rotation: deg, duration: .7 }, .5 + i * .08);
        gsap.from(s.querySelector("a"), { x: -22, duration: .7, ease: "power3.out", delay: .5 + i * .08 });
      });
    }

    /* ---- Mở / đóng PANEL nội dung ---- */
    function openPanel(id) {
      const panel = document.getElementById(id);
      if (!panel || !panel.classList.contains("panel")) return;
      panels.forEach((p) => { if (p !== panel) p.classList.remove("is-active"); });
      panel.classList.add("is-active");
      panel.scrollTop = 0;
      root.classList.add("is-panel-open");
      anchors.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + id));

      const els = panel.querySelectorAll(".reveal");
      if (reduce) gsap.set(els, { opacity: 1, y: 0 });
      else gsap.fromTo(els,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: .7, ease: "power3.out", stagger: .09, delay: .12, overwrite: true });
    }
    function closePanel() {
      panels.forEach((p) => p.classList.remove("is-active"));
      root.classList.remove("is-panel-open");
      anchors.forEach((a) => a.classList.remove("is-current"));
    }

    /* ---- Mọi link #... : #home = đóng/về trang chủ, còn lại mở panel tương ứng ---- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const id = a.getAttribute("href").slice(1);
        if (!id || id === "home") closePanel();
        else openPanel(id);
      });
    });

    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanel(); });
  }
}

/* ==========================================================================
   3. NIỀNG RĂNG — nieng-rang.html
   ========================================================================== */
if (document.body.classList.contains("page-nieng")) {
  /* ---- Before / After slider ---- */
  (function () {
    const ba = document.getElementById("ba");
    if (!ba) return;
    let dragging = false;
    const setPos = (clientX) => {
      const r = ba.getBoundingClientRect();
      let p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty("--pos", p + "%");
    };
    ba.addEventListener("pointerdown", (e) => {
      dragging = true;
      try { ba.setPointerCapture(e.pointerId); } catch (_) {}
      setPos(e.clientX);
    });
    ba.addEventListener("pointermove", (e) => { if (dragging) setPos(e.clientX); });
    const stop = () => { dragging = false; };
    ba.addEventListener("pointerup", stop);
    ba.addEventListener("pointercancel", stop);
    // phím mũi tên khi focus
    ba.tabIndex = 0;
    ba.addEventListener("keydown", (e) => {
      const cur = parseFloat(getComputedStyle(ba).getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") ba.style.setProperty("--pos", Math.max(0, cur - 4) + "%");
      if (e.key === "ArrowRight") ba.style.setProperty("--pos", Math.min(100, cur + 4) + "%");
    });
  })();
}

/* ==========================================================================
   4. CẠO VÔI RĂNG — cao-voi-rang.html
   ========================================================================== */
if (document.body.classList.contains("page-caovoi")) {
  /* ---- Stepper điều khiển slider quy trình ---- */
  (function () {
    const badge = document.getElementById("vizBadge");
    const slides = document.getElementById("slides");
    if (!slides) return;
    const steps = [].slice.call(document.querySelectorAll(".step"));
    const dots = [].slice.call(document.querySelectorAll("#dots i"));
    const prev = document.getElementById("prev"), next = document.getElementById("next");
    let cur = 0;
    function go(n) {
      cur = Math.max(0, Math.min(2, n));
      slides.style.transform = "translateX(" + (-cur * 100) + "%)";
      badge.textContent = "Bước " + (cur + 1);
      steps.forEach((s, i) => s.classList.toggle("is-active", i === cur));
      dots.forEach((d, i) => d.classList.toggle("is-on", i === cur));
      prev.disabled = cur === 0; next.disabled = cur === 2;
    }
    steps.forEach((s) => s.addEventListener("click", () => go(+s.dataset.step)));
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    prev.addEventListener("click", () => go(cur - 1)); next.addEventListener("click", () => go(cur + 1));
    // kéo/vuốt để chuyển bước
    let sx = null;
    slides.parentElement.addEventListener("pointerdown", (e) => sx = e.clientX);
    slides.parentElement.addEventListener("pointerup", (e) => {
      if (sx === null) return; const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    });
    go(0);
  })();
}
