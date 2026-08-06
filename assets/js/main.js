/* ==========================================================================
   Dr. Đỗ Long — Nha khoa chuyên khoa · main.js (toàn bộ JS của site)
   Load ở cuối <body>, SAU các file vendor (gsap...) nếu trang cần.
   Cấu trúc:
     1. SHARED   — chạy mọi trang (theme toggle, topbar cuộn, compare slider)
     2. LANDING  — chỉ chạy khi <body class="page-landing">
     3. CẠO VÔI RĂNG — chỉ chạy khi <body class="page-caovoi">
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

/* ---- Compare slider Trước/Sau (niềng răng + ca điều trị) ---- */
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
    let movedDeg = 0, pressEl = null;      // phân biệt CLICK (toggle menu) với KÉO (xoay)
    let menuOpen = false;

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

    /* ---- Mở / đóng menu khi CLICK mặt số ---- */
    function setMenu(open) {
      menuOpen = open;
      root.classList.toggle("is-menu-open", open);
      lens.setAttribute("aria-expanded", String(open));
      // không GSAP / tắt hiệu ứng → CSS transition (opacity/visibility) tự lo
      if (!window.gsap || reduce) return;
      // mặt số "nhún" nhẹ xác nhận cú bấm (animate svg con, không đụng transform
      // của .dial-lens vì render() đang ghi rotate lên đó)
      gsap.fromTo(lens.querySelector("svg"),
        { scale: .93, transformOrigin: "50% 50%" },
        { scale: 1, duration: .45, ease: "back.out(2.2)", overwrite: "auto" });
      const m = isMirror();
      spokes.forEach((s, i) => {
        const deg = parseFloat(s.style.getPropertyValue("--deg")) || 0;
        const target = (m ? -deg : deg) + rot;           // giữ nguyên góc dial đang xoay
        if (open) {
          gsap.fromTo(s,
            { opacity: 0, rotation: target - 9 },
            { opacity: 1, rotation: target, duration: .55, ease: "power3.out", delay: i * .04, overwrite: "auto" });
        } else {
          // gập về phía mặt số: xoay sâu hơn + chậm hơn, gia tốc dần (power3.in)
          // → khớp cửa sổ visibility .75s bên CSS, không bị cắt ngang
          gsap.to(s, {
            opacity: 0, rotation: target - 12, duration: .5, ease: "power3.in",
            delay: (spokes.length - 1 - i) * .03, overwrite: "auto",
            onComplete: () => { s.style.transform = "rotate(" + target + "deg)"; }
          });
        }
      });
    }

    // kéo được từ mặt số HOẶC từ các vạch chia trên menu — cùng một cơ chế,
    // tâm xoay luôn là tâm mặt số (angle() tính theo lens)
    function grab(e) {
      dragging = true;
      pressEl = e.currentTarget; movedDeg = 0;
      try { pressEl.setPointerCapture(e.pointerId); } catch (_) {}
      lastAng = angle(e.clientX, e.clientY);
      vel = 0; prevTarget = targetRot;
      root.classList.add("is-dial-dragging");
      e.preventDefault();
      start();
    }
    lens.addEventListener("pointerdown", grab);
    document.querySelectorAll(".spoke-tick i").forEach((t) => t.addEventListener("pointerdown", grab));
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const a = angle(e.clientX, e.clientY);
      const d = norm(a - lastAng);
      movedDeg += Math.abs(d);            // cộng dồn để biết đây là kéo hay chỉ là click
      targetRot += d;                     // chỉ cập nhật đích, render để loop lo
      lastAng = a;
      start();
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dial-dragging");
      // gần như không xoay (< 3°) và bấm vào mặt số → tính là CLICK: toggle menu
      if (movedDeg < 3 && pressEl === lens) setMenu(!menuOpen);
      start();                            // loop tiếp tục chạy quán tính
    }
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);

    // bàn phím: Enter / Space trên mặt số cũng toggle menu
    lens.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMenu(!menuOpen); }
    });
  })();

  /* ---- Intro khi tải: logo + mặt số (menu ĐÓNG sẵn — click mặt số để xoè) ---- */
  if (!window.gsap) {
    // Không có thư viện → hiện logo + toàn bộ menu luôn (CSS html:not(.has-js) lo phần spoke)
    document.documentElement.classList.remove("has-js");
  } else if (reduce) {
    gsap.set([".brand", ".theme-toggle", ".dial-lens"], { opacity: 1 });
  } else {
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .to([".brand", ".theme-toggle"], { opacity: 1, duration: .8, stagger: .1 })
      .fromTo(".dial-lens",
        { opacity: 0, scale: .5, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: 1 }, "-=.4");
  }
}

/* ==========================================================================
   3. CẠO VÔI RĂNG — cao-voi-rang.html
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
