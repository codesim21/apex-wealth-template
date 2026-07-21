(() => {
  "use strict";

  const BENCHMARK_RATE = 0.07;

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");

  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.classList.toggle("is-open", !open);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ---------- Compound Growth Estimator ---------- */
  const investmentEl = document.getElementById("investment");
  const yearsEl = document.getElementById("years");
  const investmentOut = document.getElementById("investment-output");
  const yearsOut = document.getElementById("years-output");
  const projectedEl = document.getElementById("projected-value");
  const growthEl = document.getElementById("growth-value");
  const multipleEl = document.getElementById("multiple-value");

  const formatGBP = (value) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);

  const formatCompact = (value) => {
    if (value >= 1_000_000) {
      return (
        "£" +
        (value / 1_000_000).toLocaleString("en-GB", {
          maximumFractionDigits: 2,
        }) +
        "M"
      );
    }
    return formatGBP(value);
  };

  const compound = (principal, years, rate) =>
    principal * Math.pow(1 + rate, years);

  const updateEstimator = () => {
    if (!investmentEl || !yearsEl) return;

    const principal = Number(investmentEl.value);
    const years = Number(yearsEl.value);
    const future = compound(principal, years, BENCHMARK_RATE);
    const growth = future - principal;
    const multiple = future / principal;

    if (investmentOut) {
      investmentOut.textContent = formatCompact(principal);
    }
    if (yearsOut) {
      yearsOut.textContent = years === 1 ? "1 year" : `${years} years`;
    }

    if (projectedEl) {
      projectedEl.classList.add("is-updating");
      projectedEl.textContent = formatGBP(Math.round(future));
      window.setTimeout(() => projectedEl.classList.remove("is-updating"), 180);
    }
    if (growthEl) growthEl.textContent = formatGBP(Math.round(growth));
    if (multipleEl) {
      multipleEl.textContent =
        multiple.toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + "×";
    }
  };

  if (investmentEl && yearsEl) {
    investmentEl.addEventListener("input", updateEstimator);
    yearsEl.addEventListener("input", updateEstimator);
    updateEstimator();
  }

  // /* ---------- Contact form (demo) ---------- */
  // const form = document.getElementById("contact-form");
  // const status = document.getElementById("form-status");

  // if (form && status) {
  //   form.addEventListener("submit", (e) => {
  //     e.preventDefault();

  //     const name = form.querySelector("#name");
  //     const email = form.querySelector("#email");

  //     status.hidden = false;

  //     if (!name?.value.trim() || !email?.validity.valid) {
  //       status.textContent = "Please provide a valid name and email address.";
  //       status.classList.add("is-error");
  //       return;
  //     }

  //     status.classList.remove("is-error");
  //     status.textContent =
  //       "Thank you. A partner will be in touch within one business day.";
  //     form.reset();
  //   });
  // }
  const realForm = document.getElementById("contact-form");
  const realStatus = document.getElementById("form-status");
  
  if (realForm) {
      realForm.addEventListener("submit", function(e) {
          // This stops the browser from redirecting to the Web3Forms page
          e.preventDefault(); 
          
          const formData = new FormData(realForm);
          const object = Object.fromEntries(formData);
          const json = JSON.stringify(object);
  
          // Optional loading text while sending
          if (realStatus) {
              realStatus.hidden = false;
              realStatus.textContent = "Sending securely...";
              realStatus.classList.remove("is-error");
          }
  
          // Send the data invisibly in the background
          fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json"
              },
              body: json
          })
          .then(async (response) => {
              if (response.status == 200) {
                  if (realStatus) {
                      // Display the premium success message right on your site
                      realStatus.textContent = "Thank you. A partner will be in touch within one business day.";
                  }
                  realForm.reset(); // Clears the form fields
              } else {
                  if (realStatus) {
                      realStatus.textContent = "Something went wrong. Please try again.";
                      realStatus.classList.add("is-error");
                  }
              }
          })
          .catch(error => {
              console.log(error);
          });
      });
  }
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
