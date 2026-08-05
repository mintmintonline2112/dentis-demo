# SSD — Studio of Smile Design · Design System (MASTER)

> Nguồn sự thật (source of truth) cho toàn bộ giao diện của website nha khoa SSD.
> Được trích xuất từ `landing-1.html`, `nieng-rang.html`, `cao-voi-rang.html`.
> Mọi trang mới **phải** dùng token & component trong file này thay vì tự chế màu/số mới.

---

## 1. Tinh thần thương hiệu (Brand Essence)

| Thuộc tính | Giá trị |
|---|---|
| Tên thương hiệu | **SSD — Studio of Smile Design** |
| Lĩnh vực | Nha khoa thẩm mỹ ("thiết kế nụ cười") |
| Triết lý | "Mỗi nụ cười là một thiết kế riêng" — tối giản, tinh tế, chăm chút như tác phẩm studio |
| Phong cách thị giác | **Monochrome** (đen – xám – trắng), editorial, nhiều khoảng trống, chữ IN HOA tracking rộng |
| Ngôn ngữ nội dung | Tiếng Việt (`<html lang="vi">`), giọng thân thiện – chuyên môn |
| Mặc định | **Dark mode** là mặc định; Light mode là lựa chọn được lưu lại |

**Nguyên tắc vàng:**
1. Không dùng màu sắc rực rỡ làm màu thương hiệu — accent chính là "màu chữ đậm" của theme (gần trắng ở dark, gần đen ở light). Màu chỉ xuất hiện cục bộ trong minh hoạ (SVG vôi răng vàng `#c9a75a`, tia nước xanh `#7fd4ff`…).
2. Mọi màu đều đi qua **CSS custom properties** và phải hoạt động ở cả 2 theme.
3. Heading luôn dùng **Barlow Condensed, uppercase**; body dùng **Barlow**.
4. Chuyển động mềm, sang (ease `cubic-bezier(.2,.7,.2,1)`), luôn tôn trọng `prefers-reduced-motion`.

---

## 2. Màu sắc (Color Tokens)

### 2.1 Bảng token chuẩn

**Nguồn duy nhất: [`assets/css/style.css`](../assets/css/style.css) (section 1. TOKENS)** — khai báo trên `:root` (dark mặc định), override trong `html[data-theme="light"]`. Không khai báo lại token màu ở nơi khác.

| Token | Dark (mặc định) | Light | Vai trò |
|---|---|---|---|
| `--bg` | `#0b0b0d` | `#f4f4f5` | Nền trang |
| `--surface` | `#131316` | `#ffffff` | Nền card / khối nổi |
| `--ink` (alias `--fg`) | `#e9e9ea` | `#17171a` | Chữ chính, icon |
| `--muted` | `#8a8a8f` | `#5f5f66` | Chữ phụ, meta, caption |
| `--accent` | `#d9d9dc` | `#2a2a30` | Điểm nhấn: eyebrow, nút solid, gạch card |
| `--accent-2` | `#bcbcc0` | `#17171a` | Accent đậm hơn (hover nút, gradient band) |
| `--accent-soft` | `rgba(255,255,255,.08)` | `rgba(0,0,0,.06)` | Nền icon-chip mềm |
| `--card-hover` | `#131316` | `#e9e9ec` | Nền card khi hover |
| `--line` | `rgba(255,255,255,.14)` | `rgba(0,0,0,.14)` | Viền, divider |
| `--shadow` | `0 30px 70px -32px rgba(0,0,0,.72)` | `0 30px 70px -36px rgba(19,20,24,.4)` | Bóng lớn (card nổi, ảnh) |
| `--shadow-sm` | `0 14px 34px -20px rgba(0,0,0,.7)` | `0 14px 34px -22px rgba(19,20,24,.5)` | Bóng nhỏ (step active) |

> ✅ **Đã đồng bộ:** tên chuẩn là `--ink`; `style.css` có sẵn alias `--fg: var(--ink)` để CSS cũ của landing vẫn chạy. Code mới **chỉ dùng `--ink`**.

### 2.2 Token riêng của hero landing

| Token | Dark | Light |
|---|---|---|
| `--hero-base` | `#050506` | `#dfe1e4` |
| `--hero-filter` | `grayscale(.4) contrast(1.03) brightness(.92)` | `grayscale(.1) contrast(1.02) brightness(1.03)` |
| `--scrim` | tổ hợp radial + linear gradient **đen** (bảo vệ chữ trắng) | tổ hợp gradient **trắng** (bảo vệ chữ tối) |

### 2.3 Màu minh hoạ (chỉ dùng trong SVG/illustration, không dùng cho UI)

| Nhóm | Mã màu |
|---|---|
| Men răng | `#ece1c6` (ố) → `#f2ead6` → `#fdfdfb` (sạch) |
| Vôi răng (vàng nâu) | `#c9a75a`, `#c1a052`, `#b9975a` |
| Tia nước / dụng cụ | `#7fd4ff`, `#aeb7c0`, `#d7dde3`, `#eef4f8` |
| Radial nền slide | `rgba(201,167,90,.20)`, `rgba(63,180,255,.20)` |

### 2.4 Kỹ thuật pha màu

Dùng `color-mix(in srgb, …)` để tạo màu dẫn xuất thay vì hard-code, ví dụ:
- Viền hover: `color-mix(in srgb, var(--ink) 35%, transparent)`
- Nền mờ (glass): `color-mix(in srgb, var(--bg) 55–82%, transparent)` + `backdrop-filter: blur(4–10px)`

---

## 3. Chữ (Typography)

### 3.1 Font

Self-host tại `assets/fonts/fonts.css` (woff2, subset `vietnamese` + `latin` + `latin-ext`, `font-display: swap`).

| Font | Weights có sẵn | Dùng cho |
|---|---|---|
| **Barlow** | 300 / 400 / 500 | Body, đoạn văn, link liên hệ |
| **Barlow Condensed** | 300 / 400 / 500 / 600 | Heading, nav, label, nút, meta, số liệu |

```css
body { font-family: "Barlow", system-ui, sans-serif; }
.cond { font-family: "Barlow Condensed", sans-serif; } /* utility class có sẵn */
```

### 3.2 Thang chữ (Type Scale)

| Cấp | Font | Cỡ | Thuộc tính |
|---|---|---|---|
| Display / H1 hero | Condensed 600 | `clamp(48px, 9–10vw, 120–140px)` | uppercase, `line-height: .92–.95`, `letter-spacing: .01em` |
| H2 panel (landing) | Condensed 600 | `clamp(38px, 6vw, 88px)` | uppercase, `line-height: 1` |
| H2 section (trang con) | Condensed 600 | `clamp(30px, 4.6–5vw, 60px)` | uppercase, `line-height: 1` |
| H3 card | Condensed 500–600 | `20–22px` | uppercase, `letter-spacing: .02–.05em` |
| Lead (sub hero) | Barlow 400 | `clamp(16px, 2vw, 19–20px)` | màu `--muted` |
| Body panel | Barlow 400 | `18px`, `line-height: 1.7` | màu `--muted` |
| Body card | Barlow 400 | `14.5–15px` | màu `--muted` |
| Kicker / eyebrow | Condensed | `12–13px` | uppercase, `letter-spacing: .3–.35em`, màu `--muted` hoặc `--accent` |
| Nav / label / nút | Condensed 500 | `12–15px` | uppercase, `letter-spacing: .12–.2em` |
| Meta / caption / badge | Condensed | `10.5–12px` | uppercase, `letter-spacing: .1–.2em`, màu `--muted` |

**Quy tắc:** heading không bao giờ dùng Barlow thường; body không bao giờ dùng Condensed. Tracking rộng (≥ `.1em`) chỉ đi cùng uppercase + cỡ nhỏ.

---

## 4. Khoảng cách & Bố cục (Spacing & Layout)

| Token/khái niệm | Giá trị |
|---|---|
| Container | `.wrap { max-width: 1180px; margin: 0 auto; padding: 0 clamp(22px, 5vw, 64px); }` |
| Grid card | `display:grid; grid-template-columns: repeat(auto-fit, minmax(230–240px, 1fr)); gap: 20–24px` |
| Blog grid | `minmax(228px,1fr)`, `gap: 24px`, `max-width: 1240px` |
| Section padding | `70–80px 0` (trang con); panel landing: `120px clamp(30px,8vw,140px) 170px` |
| Khoảng cách sec-head → nội dung | `40–50px` |
| Padding card | `30px 26px` → `34px 28px` |
| Gap trong card/step | `14–22px` |
| Topbar | fixed, padding `16–20px clamp(22px,5vw,64px)` |

Breakpoints đang dùng: `640px` (mobile menu landing), `700px`, `820px`, `860px` (đổi grid 2 cột → 1 cột). Ưu tiên **fluid bằng `clamp()`** thay vì nhiều breakpoint.

---

## 5. Bo góc, viền, bóng (Radius / Border / Shadow)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--radius-sm` | `11px` | Ô phân trang |
| `--radius-md` | `14px` | FAQ item, icon-chip, stat |
| `--radius-lg` | `16px` | Card, post, step |
| `--radius-xl` | `18–26px` | Ảnh gallery, before/after, viz, CTA band |
| `--radius-pill` | `20–40px` | Badge, label, nút, toast |
| `--radius-full` | `50%` | Nút tròn (ctrl-btn, knob, pos-dot) |
| Viền chuẩn | `1px solid var(--line)`; nhấn mạnh: đổi sang `var(--accent)` hoặc `color-mix(ink 25–35%)` |
| Bóng | chỉ dùng `--shadow` / `--shadow-sm`; không chế bóng mới |

---

## 6. Chuyển động (Motion)

### 6.1 Easing & duration chuẩn

| Tên | Giá trị | Dùng cho |
|---|---|---|
| **Ease thương hiệu** | `cubic-bezier(.2,.7,.2,1)` | Mọi transform (hover card, slide menu, toast…) |
| Ease slider | `cubic-bezier(.7,0,.2,1)` | Trượt slide quy trình |
| GSAP | `power3.out` | Intro, reveal panel |
| Nhanh | `.25–.3s` | Màu, opacity, border |
| Vừa | `.35–.45s` | Transform hover, theme transition (`.45–.5s`) |
| Chậm | `.55–.7s` | Mở panel, trượt slide, zoom ảnh |

### 6.2 Pattern hiệu ứng đặc trưng

- **Hover nâng:** card `translateY(-4 → -8px)` + đổi `background: var(--card-hover)` + bóng.
- **Hover ảnh:** `scale(1.045)` + tăng saturate.
- **Reveal khi mở panel (GSAP):** `{opacity:0, y:30}` → `{opacity:1, y:0, duration:.7, stagger:.09}`.
- **Logo equalizer:** 5 thanh `scaleY(.7→1)`, `eq 1.6s ease-in-out infinite`, delay lệch `.15s`.
- **Theme toggle:** icon sun/moon xoay + scale khi đổi theme; nút hover `rotate(20deg)`.
- **Keyframes có sẵn:** `eq`, `savePulse`, `posPulse`, `drip`, `vibe`, `twinkle`.

### 6.3 Accessibility bắt buộc

```css
@media (prefers-reduced-motion: reduce){ /* tắt animation trang trí, set opacity:1 cho phần GSAP ẩn sẵn */ }
```
Trạng thái ẩn ban đầu cho GSAP chỉ áp khi có class `has-js` trên `<html>` (chống trang trắng khi không có JS).

---

## 7. Component Library

### 7.0 Quy ước đặt tên class (BẮT BUỘC cho mọi code mới)

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| **Block (component)** | kebab-case, từ đầy đủ, **cấm viết tắt khó hiểu** | `.topbar`, `.compare`, `.benefit-card` (không dùng `.ba`, `.bcard`, `.kk`) |
| **Element trong block** | `<block>-<element>` | `.compare-handle`, `.step-no`, `.slide-caption`, `.band-inner`, `.post-more` |
| **Biến thể đánh số** | `<block>-<n>` | `.slide-1`, `.slide-2`, `.slide-3` |
| **State (JS toggle)** | tiền tố **`is-`** — JS chỉ được thêm/gỡ class `is-*` | `.is-active`, `.is-scrolled`, `.is-visible`, `.is-on`, `.is-current`, `.is-disabled` |
| **Flag trên `<html>`** | cũng dùng `is-*`; ngoại lệ duy nhất: `has-js` (convention phổ biến) | `html.is-panel-open`, `html.is-pos-editing`, `html.is-dial-dragging` |
| **Scope trang** | `page-<slug>` đặt trên `<body>`; CSS riêng của trang phải nằm sau scope này khi class có nguy cơ trùng tên (vd `.hero`) | `body.page-landing`, `.page-nieng .hero`, `.page-caovoi footer` |
| **JS hook** | ưu tiên `id` hoặc `data-*` cho phần tử JS bám vào; class chỉ để style + state `is-*` | `#topbar`, `#ba`, `data-step="0"` |

Quy tắc kèm theo:
- Đổi tên class = đổi đồng bộ **3 nơi**: CSS selector, HTML `class="..."`, chuỗi trong JS (`querySelector`, `classList`...).
- Không đặt class mới trùng nghĩa với class đã có — tra bảng component bên dưới trước.
- Tiền tố `page-` đã được dùng làm scope, nên **không** đặt tên block bắt đầu bằng `page-`.

### 7.1 Brand logo (equalizer)
5 `<span>` thanh dọc `width: 3.5–4px`, `background: var(--ink)`, cao 60/100/44/78/30%, animation `eq`. Trang con thêm chữ `SSD` (Condensed 600, `letter-spacing: .28em`, 14px).

### 7.2 Topbar (trang con)
`position: fixed`, flex space-between, trong suốt; khi cuộn > 40px JS thêm class `.is-scrolled` → nền `color-mix(bg 82%, transparent)` + `backdrop-filter: blur(10px)` + viền dưới `--line`.

### 7.3 Theme toggle
Nút 26–30px, không nền không viền, chứa 2 SVG (sun/moon, `stroke-width: 1.6`). Lưu vào `localStorage`. Dark = mặc định (không có `data-theme`), light = `data-theme="light"`.

### 7.4 Nút (Buttons)
```css
.btn { /* pill */ font-family:"Barlow Condensed"; text-transform:uppercase; letter-spacing:.12em;
  font-size:15px; font-weight:500; padding:15px 32–34px; border-radius:40px;
  transition: transform .3s, background-color .3s, color .3s; }
.btn-solid { background:var(--accent); color:var(--bg); }        /* hover: translateY(-3px) + --accent-2 */
.btn-ghost { border:1px solid rgba(255,255,255,.5); color:#fff; } /* chỉ dùng trên nền ảnh hero */
```

### 7.5 Card dịch vụ / lợi ích
- **Card chuẩn:** nền `--surface`, viền `--line`, radius 16px, thanh accent trên đầu (`40×3px`, radius 2px), hover nâng −8px + `--shadow`.
- **Benefit card (`.benefit-card`):** thêm icon-chip `.benefit-icon` `52×52px`, radius 14px, nền `--accent-soft`, icon stroke `--accent` 26px.

### 7.6 Post card (blog)
Thumb `aspect-ratio: 16/10` với texture chấm (`radial-gradient` dot 16px + mask), icon SVG line-art 64px giữa; badge chuyên mục pill góc trên trái; meta ngày · thời gian đọc (Condensed 11px, chấm phân cách 3px); link "Đọc tiếp →" gạch chân dưới, hover giãn `gap`.

### 7.7 Kicker / Eyebrow / Sec-head
- `.kicker` (landing): `01 — Tên mục`, Condensed 12px, `letter-spacing: .35em`, `--muted`.
- `.eyebrow` (trang con): chữ giữa 2 gạch ngang 28×1px màu `--accent`, `letter-spacing: .3em`.
- `.sec-head`: `.kicker` + `h2` uppercase, căn giữa, margin-bottom `44–50px`.

### 7.8 Breadcrumb
Condensed 12px uppercase `letter-spacing: .2em`; phân cách `/` mờ 50%; trang hiện tại màu `--accent` + `aria-current="page"`.

### 7.9 Badge / Label / Stat
- Pill: padding `5–6px 10–14px`, viền `color-mix(ink 25–30%)`, nền glass `color-mix(bg 55–72%, transparent)` (+ `backdrop-filter` khi trên ảnh).
- Stat (hero): nền glass tối + viền `rgba(255,255,255,.18)`, radius 14px; số Condensed 24px, nhãn 11px uppercase.

### 7.10 Pagination
Ô `min-width/height: 42px`, viền `--line`, radius 11px, Condensed 15px; active = đảo màu (`background: var(--ink); color: var(--bg)`); disabled = `opacity: .35`.

### 7.11 FAQ (accordion)
Dùng `<details>/<summary>` thuần; viền đổi sang `--accent` khi `[open]`; icon plus tự vẽ bằng `::before/::after`, dọc ẩn đi khi mở; câu trả lời màu `--muted` 15.5px.

### 7.12 Stepper + slider quy trình
Danh sách `.step` (viền, radius 16px, hover trượt `translateX(4px)`, active viền `--accent` + số tròn 42px đảo màu) điều khiển `.slides` (flex, `translateX(-n*100%)`, ease `cubic-bezier(.7,0,.2,1)`); có prev/next tròn 48px + dots 9px; hỗ trợ vuốt (pointer, ngưỡng 40px).

### 7.13 Before/After slider
Container `aspect-ratio: 3/2`, radius 20px; lớp "Trước" cắt bằng `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`; thanh kéo 2px + knob tròn 48px đảo màu; điều khiển bằng pointer + phím mũi tên (bước 4%); nhãn Trước/Sau dạng pill glass; kèm dòng hint `◂ Kéo để so sánh ▸`.

### 7.14 Menu vòng cung + dial (chỉ landing)
Nav dạng nan quạt toả từ tâm (`--pivot-x/y`, `--radius-arc: 92px`, mobile 76px), mỗi nan xoay theo `--deg` (−60° → −1°); mặt số SVG 124px (mobile 96px) xoay SMIL, kéo được với quán tính; mobile có 3 vị trí neo (left/center/right) lưu `localStorage`.

### 7.15 Toast
Pill giữa đáy màn hình, đảo màu (`background: var(--ink); color: var(--bg)`), Condensed 12px uppercase; hiện `1.6s` rồi tự ẩn; `role="status" aria-live="polite"`.

### 7.16 CTA band
Khối gradient `linear-gradient(120deg, var(--accent), var(--accent-2))`, radius 24px, chữ màu `--bg` (đảo), nút bên trong đảo tiếp (`background: var(--bg); color: var(--ink)`).

### 7.17 Footer
Viền trên `--line`, Condensed 12px uppercase `letter-spacing: .14em`, màu `--muted`, căn giữa: `© 2026 SSD — Studio of Smile Design`.

### 7.18 Subhero (hero chuẩn cho trang phụ)
`.subhero` (trong BASE + SHARED): `padding: 150px 0 40px`, căn giữa; chứa breadcrumb (tự căn giữa) → `.eyebrow` → `h1` (Condensed 600, `clamp(44px, 8vw, 110px)`) → `.hero-lead`. Mọi trang phụ mới dùng component này thay vì tự chế hero.

### 7.19 Card dạng link
`a.card` (display:block) + `.card-more` ("Xem chi tiết →", Condensed 12px uppercase, gạch chân dưới, hover giãn gap) — dùng cho danh sách giải pháp/kênh liên hệ có thể bấm.

---

## 8. Icon & Minh hoạ

- **Icon:** SVG inline, line-art, `fill="none" stroke="currentColor"`, `stroke-width: 1.6–2`, `stroke-linecap/linejoin: round`, viewBox 24. Icon minh hoạ lớn (blog, quy trình) viewBox 64/240×300, cùng phong cách nét.
- **Trang trí SVG:** `aria-hidden="true"` cho phần thuần trang trí; minh hoạ có nghĩa thì dùng `aria-label`.
- **Ảnh:** `object-fit: cover`, `loading="lazy" decoding="async"` (ngoài màn hình đầu), filter `saturate(.82–.9)` để hoà tông monochrome, hover trả bão hoà; ảnh Unsplash phải ghi credit.

---

## 9. JavaScript Conventions

| Hạng mục | Quy ước |
|---|---|
| **Cấu trúc file** | **KHÔNG viết JS inline trong HTML.** 2 file duy nhất: `assets/js/head.js` (chống FOUC — load **không defer/async** trong `<head>`) và `assets/js/main.js` (toàn bộ logic — load cuối `<body>`, SAU vendor) |
| **Scope theo trang** | `main.js` chia 4 section: SHARED chạy mọi trang; phần riêng gate bằng `document.body.classList.contains("page-<slug>")` — KHÔNG để code trang này chạy trên trang khác (vd handler `a[href^="#"]` của landing) |
| Thư viện | GSAP + ScrollTrigger + Lenis + Three (self-host tại `assets/vendor/`); **mọi tính năng phải có fallback không-JS/không-GSAP** |
| Chống FOUC | `head.js`: thêm class `has-js`, áp theme + vị trí menu từ `localStorage` trước khi render |
| Pattern | IIFE `(function(){ ... })()` cho từng tính năng độc lập, guard phần tử tồn tại (`if (!el) return`); `try/catch` quanh `localStorage` |
| Tương tác kéo | Pointer Events + `setPointerCapture`; render tách khỏi input qua `requestAnimationFrame` |
| Keys `localStorage` | `ssd-theme` (theme — dùng chung mọi trang), `ssd-menu-pos` (vị trí menu mobile, chỉ landing) |
| Bàn phím | `Escape` đóng panel; mũi tên trái/phải cho slider; phần tử tương tác tự chế phải có `tabIndex` |

---

## 10. Accessibility Checklist

- [x] `lang="vi"`; heading đúng cấp (1 `h1`/trang)
- [x] Nút icon có `aria-label` + `title`; toggle có `aria-pressed`
- [x] Breadcrumb: `<nav aria-label="Breadcrumb">` + `aria-current="page"`
- [x] Toast: `role="status" aria-live="polite"`
- [x] `prefers-reduced-motion` được tôn trọng ở mọi trang
- [x] Chữ trên ảnh luôn có scrim/gradient bảo vệ tương phản
- [x] Trạng thái disabled rõ ràng (`opacity: .35` + `cursor: not-allowed`)

---

## 11. Cấu trúc trang chuẩn (khi thêm trang dịch vụ mới)

### Sơ đồ site

| Trang | File | Body class |
|---|---|---|
| Trang chủ (SPA menu vòng cung) | `landing-1.html` | `page-landing` |
| Về Dr. Đỗ Thái Long (Về chúng tôi) | `ve-chung-toi.html` | `page-ve-chung-toi` |
| Giải pháp điều trị (hub dịch vụ) | `giai-phap-dieu-tri.html` | `page-giai-phap` |
| ├─ Niềng răng | `nieng-rang.html` | `page-nieng` |
| └─ Cạo vôi răng | `cao-voi-rang.html` | `page-caovoi` |
| Ca điều trị (trước/sau) | `ca-dieu-tri.html` | `page-ca-dieu-tri` |
| Kiến thức y khoa (blog) | `kien-thuc-y-khoa.html` | `page-kien-thuc` |
| Liên hệ tư vấn | `lien-he.html` | `page-lien-he` |

Menu vòng cung ở landing trỏ tới 5 trang chính (Về chúng tôi · Giải pháp · Ca điều trị · Kiến thức · Liên hệ); trang dịch vụ con liên kết từ hub Giải pháp điều trị.

```
<html lang="vi">
└─ head: <script src="assets/js/head.js"> (chống FOUC, load chặn render)
         → fonts.css → css/style.css (file CSS DUY NHẤT của cả site)
   (KHÔNG dùng <style> hay <script> inline; <body class="page-<slug>"> để scope CSS/JS riêng của trang)
└─ body
   ├─ header.topbar  (brand equalizer + SSD, theme-toggle)
   ├─ main
   │   ├─ section.hero        (breadcrumb → eyebrow/h1 → lead → [cta, stats])
   │   ├─ section minh hoạ    (before/after HOẶC slider quy trình HOẶC gallery)
   │   ├─ section.section     (sec-head + .cards)
   │   ├─ section.faq         (details/summary) [tuỳ chọn]
   │   └─ section CTA         (.cta nút đơn HOẶC .band gradient)
   └─ footer (© 2026 SSD — Studio of Smile Design)
   └─ cuối body: [vendor nếu trang cần] → <script src="assets/js/main.js">
```

Đặt tên file theo slug tiếng Việt không dấu: `nieng-rang.html`, `cao-voi-rang.html`, …
Liên kết về từ menu vòng cung trong `landing-1.html` (thêm `.spoke` mới với `--deg` phù hợp).

---

## 12. Tài sản (Assets)

| Đường dẫn | Nội dung |
|---|---|
| `assets/css/style.css` | **File CSS duy nhất của cả site**, 5 section theo thứ tự: 1. TOKENS · 2. BASE + SHARED · 3. LANDING (`.page-landing`) · 4. NIỀNG RĂNG (`.page-nieng`) · 5. CẠO VÔI RĂNG (`.page-caovoi`). Đường dẫn ảnh trong css: `../../images/…` |
| `assets/js/head.js` | Chống FOUC (`has-js`, theme, vị trí menu) — load **không defer/async** trong `<head>` |
| `assets/js/main.js` | **File JS logic duy nhất của cả site**, 4 section: SHARED · LANDING · NIỀNG RĂNG · CẠO VÔI RĂNG (gate bằng `body.page-<slug>`) — load cuối `<body>` sau vendor |
| `assets/fonts/` | Barlow + Barlow Condensed woff2 (300–600) + `fonts.css` |
| `assets/vendor/` | `gsap.min.js`, `ScrollTrigger.min.js`, `lenis.min.js`, `three.min.js` |
| `images/background2.png` | Ảnh hero phòng khám (dùng chung landing + cạo vôi) |
| `images/nieng-truoc.jpg` / `nieng-sau.jpg` | Cặp ảnh before/after niềng răng |
| `images/nieng-rang-mac-cai.jpg` / `nieng-rang-mo-hinh.jpg` | Gallery chỉnh nha (credit Unsplash) |

---

## 13. Nhật ký đồng bộ (Refactor Log)

Đã xử lý (08/2026):

1. ✅ **Gộp toàn bộ CSS về 1 file** `assets/css/style.css` (5 section: tokens → base/shared → landing → niềng răng → cạo vôi). CSS riêng từng trang scope bằng class `page-<slug>` trên `<body>` để không đè lẫn nhau.
2. ✅ **`--fg` → `--ink`**: chuẩn là `--ink`, alias `--fg: var(--ink)` giữ trong style.css cho CSS cũ của landing.
3. ✅ **Key theme hợp nhất về `ssd-theme`** — đổi theme ở trang nào cũng ăn sang mọi trang.
4. ✅ **`--surface` chuẩn hoá** `#131316` (dark) / `#ffffff` (light) cho mọi trang.
5. ✅ **Card landing dùng card chuẩn** (radius 16, gạch accent, hover −8px) thay kiểu vuông cũ; nút CTA `nieng-rang` chuyển sang `btn btn-solid`; `nieng-rang` có thêm topbar glass khi cuộn như `cao-voi-rang`.

6. ✅ **Bỏ hẳn `<style>` inline** — mọi CSS nằm trong `assets/css/style.css`; đường dẫn ảnh trong css là `../../images/…`.
7. ✅ **Đặt lại toàn bộ class theo quy ước mục 7.0** (đổi đồng bộ CSS + HTML + JS): state dùng `is-*` (`is-active`, `is-scrolled`, `is-visible`, `is-on`, `is-current`, `is-disabled`, `is-panel-open`, `is-pos-editing`, `is-dial-dragging`); bỏ viết tắt (`.kk`→`.kicker`, `.ba-*`→`.compare-*`, `.bcard`→`.benefit-card`, `.bgrid`→`.benefit-grid`, `.ic`→`.benefit-icon`, `.viz`→`.process-viz`, `.cap`→`.slide-caption`, `.no`→`.step-no`, `.pl`→`.faq-plus`, `.d`→`.dot`, `.pg-*`→`.pagination-*`, `.more`→`.post-more`, `.x`→`.panel-close-x`, `.lead`/`.sub`→`.hero-lead`, `.s1/s2/s3`→`.slide-1/2/3`, `.inner`→`.band-inner`, `.copy`→`.copyright`, `.head`/`h2.sec`→`.sec-head`). ID và `data-*` giữ nguyên.

8. ✅ **Tách toàn bộ JS ra file riêng** — không còn `<script>` inline: `assets/js/head.js` (chống FOUC, load chặn trong `<head>`) + `assets/js/main.js` (toàn bộ logic, chia section SHARED / LANDING / NIỀNG RĂNG / CẠO VÔI RĂNG, gate bằng `body.classList.contains("page-<slug>")` để code trang này không chạy nhầm trên trang khác).

**Quy tắc từ nay:**
- Trang mới KHÔNG viết `<style>` hay `<script>` inline — link `assets/css/style.css` + `assets/js/head.js` (head) + `assets/js/main.js` (cuối body), thêm `class="page-<slug>"` vào `<body>`.
- CSS riêng của trang viết vào section mới cuối `style.css`; JS riêng viết vào section mới trong `main.js` bọc trong `if (document.body.classList.contains("page-<slug>")) { ... }`.
- Class mới phải theo đúng quy ước đặt tên ở **mục 7.0** (block kebab-case đầy đủ, element `block-element`, state `is-*`, không viết tắt).
