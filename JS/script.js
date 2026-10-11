/* ==========================================
   JELAJAH KEBUMEN
   Interaksi website
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("destinationSearch");
  const filterButtons = document.querySelectorAll(".filter-button");
  const destinationCards = document.querySelectorAll(".destination-card");
  const emptyState = document.getElementById("emptyState");
  const resetButton = document.getElementById("resetFilters");
  const resultCount = document.getElementById("resultCount");
  const backToTop = document.getElementById("backToTop");

  let activeCategory = "semua";

  // PENCARIAN DAN FILTER DESTINASI

  function filterDestinations() {
    const keyword = searchInput
      ? searchInput.value.trim().toLocaleLowerCase("id")
      : "";

    let visibleCount = 0;

    destinationCards.forEach(function (card) {
      const category = card.dataset.category || "";
      const searchableText = (
        (card.dataset.search || "") + " " +
        card.textContent
      ).toLocaleLowerCase("id");

      const matchesCategory =
        activeCategory === "semua" ||
        category === activeCategory;

      const matchesSearch =
        searchableText.includes(keyword);

      const shouldShow = matchesCategory && matchesSearch;

      card.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount++;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (resultCount) {
      resultCount.textContent =
        visibleCount + " cerita untuk dijelajahi";
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.filter || "semua";

      filterButtons.forEach(function (item) {
        const isActive = item === button;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      filterDestinations();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterDestinations);

    // Tekan "/" untuk langsung menuju pencarian.
    document.addEventListener("keydown", function (event) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (
          target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
        );

      if (
        event.key === "/" &&
        !isTyping &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        searchInput.focus();
      }

      if (
        event.key === "Escape" &&
        document.activeElement === searchInput
      ) {
        searchInput.value = "";
        filterDestinations();
        searchInput.blur();
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      activeCategory = "semua";

      if (searchInput) {
        searchInput.value = "";
      }

      filterButtons.forEach(function (button) {
        const isActive = button.dataset.filter === "semua";

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      filterDestinations();

      const destinationSection =
        document.getElementById("destinasi");

      if (destinationSection) {
        destinationSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  // MODAL DETAIL DESTINASI

  const detailButtons = document.querySelectorAll(".detail-link");
  const modalElement = document.getElementById("destinationModal");

  if (modalElement) {
    detailButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const title =
          button.dataset.title || "Cerita Kebumen";

        const category =
          button.dataset.category || "Destinasi Kebumen";

        const description =
          button.dataset.description || "";

        const image =
          button.dataset.image || "images/wisata.jpg";

        const modalTitle = document.getElementById("modalTitle");
        const modalCategory = document.getElementById("modalCategory");
        const modalDescription =
          document.getElementById("modalDescription");
        const modalImage = document.getElementById("modalImage");

        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = category;
        if (modalDescription) {
          modalDescription.textContent = description;
        }

        if (modalImage) {
          modalImage.onerror = function () {
            this.onerror = null;
            this.src = "images/wisata.jpg";
          };

          modalImage.src = image;
          modalImage.alt = title;
        }

        if (
          window.bootstrap &&
          window.bootstrap.Modal
        ) {
          window.bootstrap.Modal
            .getOrCreateInstance(modalElement)
            .show();
        } else {
          // Fallback jika Bootstrap JavaScript tidak tersedia.
          window.alert(title + "\n\n" + description);
        }
      });
    });
  }

  // TOMBOL KEMBALI KE ATAS

  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle(
      "is-visible",
      window.scrollY > 450
    );
  }

  if (backToTop) {
    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    updateBackToTop();
  }

  // NAVIGASI MOBILE OTOMATIS MENUTUP SETELAH DIPILIH

  const navigation = document.getElementById("mainNavigation");

  if (
    navigation &&
    window.bootstrap &&
    window.bootstrap.Collapse
  ) {
    navigation.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth >= 992) return;

        const collapse = window.bootstrap.Collapse
          .getInstance(navigation);

        if (collapse && navigation.classList.contains("show")) {
          collapse.hide();
        }
      });
    });
  }

  // Jalankan filter saat halaman dibuka.
  filterDestinations();
});
/* ==========================================
   FILTER DAN PENCARIAN KARTU JELAJAH KEBUMEN
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".explore-filter");
    const cards = document.querySelectorAll(".explore-card");
    const searchInput = document.getElementById("exploreSearch");
    const resultCount = document.getElementById("exploreResultCount");
    const emptyMessage = document.getElementById("exploreEmpty");

    if (!cards.length || !filterButtons.length) return;

    let activeCategory = "semua";

    function updateCards() {
        const keyword = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        cards.forEach(function (card) {
            const category = card.dataset.category || "";
            const text = card.textContent.toLowerCase();
            const matchesCategory =
                activeCategory === "semua" || category === activeCategory;
            const matchesSearch = text.includes(keyword);
            const visible = matchesCategory && matchesSearch;

            card.hidden = !visible;

            if (visible) visibleCount++;
        });

        if (resultCount) {
            resultCount.textContent =
                "Menampilkan " + visibleCount + " dari " +
                cards.length + " koleksi";
        }

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activeCategory =
                button.dataset.category || button.dataset.filter || "semua";

            filterButtons.forEach(function (item) {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            updateCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", updateCards);
    }

    updateCards();
});
// ============================================
// LINK KARTU GALERI KE HALAMAN DETAIL
// Tambahkan di bagian paling bawah JS/script.js
// ============================================

document.addEventListener("DOMContentLoaded", function () {
    const detailIds = {
        "Pantai Menganti": "menganti",
        "Pantai Suwuk": "suwuk",
        "Goa Jatijajar": "jatijajar",
        "Waduk Sempor": "sempor",
        "Tari Cepetan Alas": "cepetan",
        "Tari Lawet": "lawet",
        "Batik Kebumen": "batik",
        "Ebleg": "ebleg",
        "Sate Ambal": "sate",
        "Lanting": "lanting",
        "Nasi Penggel": "penggel",
        "Jipang Kacang": "jipang",
        "Benteng Van der Wijck": "benteng",
        "Jejak Sejarah Kebumen": "sejarah",
        "Geopark Kebumen": "geopark",
        "Kebumen Hari Ini": "kebumen"
    };

    document.querySelectorAll(".explore-card").forEach(function (card) {
        const title = card.querySelector("h3");

        if (!title) return;

        const name = title.textContent.trim();
        const id = detailIds[name];

        if (!id) return;

        const detailUrl = "detail.html?id=" + encodeURIComponent(id);

        // Klik gambar dan tombol "Baca selengkapnya"
        card.querySelectorAll("a").forEach(function (link) {
            link.href = detailUrl;
        });
    });
});
