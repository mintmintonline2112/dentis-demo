/* ==========================================================================
   Dr. Đỗ Long · head.js — PHẢI load KHÔNG defer/async trong <head> (chặn render)
   Chống FOUC: đánh dấu có JS + áp theme/vị trí menu đã lưu TRƯỚC khi vẽ trang.
   ========================================================================== */
document.documentElement.classList.add("has-js");
try {
  if (localStorage.getItem("ssd-theme") === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
} catch (e) {}
/* vị trí menu mobile (chỉ landing dùng data-pos, vô hại với trang khác) */
try {
  var _p = localStorage.getItem("ssd-menu-pos");
  document.documentElement.setAttribute("data-pos", _p === "center" || _p === "right" ? _p : "left");
} catch (e) {
  document.documentElement.setAttribute("data-pos", "left");
}
