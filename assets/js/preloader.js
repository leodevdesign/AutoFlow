!(function () {
        var e = document.getElementById("site-preloader"),
          t = document.getElementById("preloader-percent"),
          s = e && e.querySelector("img");
        if (!e || !t) {
          document.body.classList.remove("preloader-active");
          return;
        }
        var n = 1880,
          o = 0,
          r = null,
          i = !1,
          a = !1;
        function l() {
          if (i) return;
          ((i = !0),
            r && clearInterval(r),
            (t.textContent = "100%"),
            document.body.classList.remove("preloader-active"),
            e.classList.add("is-hidden"),
            setTimeout(function () {
              e && e.parentNode && e.parentNode.removeChild(e);
            }, 500));
        }
        function d() {
          var e = Math.min((Date.now() - o) / n, 1);
          ((t.textContent = Math.round(100 * e) + "%"), e >= 1 && l());
        }
        function c() {
          if (a) return;
          ((a = !0),
            setTimeout(function () {
              ((o = Date.now()),
                e.classList.add("is-loading"),
                (r = setInterval(d, 16)),
                d(),
                setTimeout(l, n));
            }, 120));
        }
        ((t.textContent = "0%"),
          s && s.complete
            ? c()
            : s
              ? (s.addEventListener("load", c, { once: !0 }),
                s.addEventListener("error", c, { once: !0 }),
                setTimeout(c, 600))
              : c());
      })();
