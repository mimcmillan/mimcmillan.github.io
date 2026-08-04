/* Matthew McMillan — site scripts
   1. Collapsible publication cards (+/− toggle)
   2. Open a card directly when its id is in the URL hash
   3. Contents sidebar: collapsed by default on small screens
   4. Contents sidebar: highlight the section currently in view
*/

(function () {
  "use strict";

  /* ---------- 1. collapsible cards ---------- */

  document.querySelectorAll(".pub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pub = btn.closest(".pub");
      var open = pub.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------- 1b. expand/collapse all (pages with 2+ cards) ---------- */

  var pubs = Array.prototype.slice.call(document.querySelectorAll(".pub"));
  if (pubs.length >= 2) {
    var bar = document.createElement("div");
    bar.className = "expand-all-bar";
    var allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "expand-all";
    bar.appendChild(allBtn);

    var allOpen = function () {
      return pubs.every(function (p) { return p.classList.contains("open"); });
    };
    var setLabel = function () {
      allBtn.textContent = allOpen() ? "Collapse all" : "Expand all";
    };

    allBtn.addEventListener("click", function () {
      var expand = !allOpen();
      pubs.forEach(function (p) {
        p.classList.toggle("open", expand);
        var b = p.querySelector(".pub-toggle");
        if (b) b.setAttribute("aria-expanded", expand ? "true" : "false");
      });
      setLabel();
    });

    /* keep the label truthful when individual cards are toggled */
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".pub-toggle")) setLabel();
    });

    var main = document.querySelector("main");
    main.insertBefore(bar, main.firstElementChild);
    setLabel();
  }

  /* ---------- 2. deep links to cards ---------- */

  function openFromHash() {
    if (!location.hash) return;
    var el = document.getElementById(location.hash.slice(1));
    if (el && el.classList.contains("pub") && !el.classList.contains("open")) {
      el.classList.add("open");
      var btn = el.querySelector(".pub-toggle");
      if (btn) btn.setAttribute("aria-expanded", "true");
    }
  }
  window.addEventListener("hashchange", openFromHash);
  openFromHash();

  /* ---------- 3. contents box: fold on phones ---------- */

  var tocDetails = document.querySelector(".toc details");
  if (tocDetails && window.matchMedia("(max-width: 900px)").matches) {
    tocDetails.removeAttribute("open");
  }

  /* ---------- 4. scroll spy ---------- */

  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.toc nav a[href^="#"]')
  );
  var targets = tocLinks
    .map(function (a) {
      return document.getElementById(decodeURIComponent(a.hash.slice(1)));
    })
    .filter(Boolean);

  if (targets.length) {
    var spy = function () {
      var current = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].getBoundingClientRect().top <= 130) current = targets[i];
      }
      tocLinks.forEach(function (a) {
        a.classList.toggle(
          "current",
          decodeURIComponent(a.hash.slice(1)) === current.id
        );
      });
    };
    document.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    spy();
  }
})();
