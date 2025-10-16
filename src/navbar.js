document.addEventListener("DOMContentLoaded", function() {
  // Hamburger menu toggle
  const hamburgerBtn = document.getElementById("hamburger_btn");
  const hamburgerMenu = document.getElementById("navbar-hamburger-menu");
  if (hamburgerBtn && hamburgerMenu) {
    hamburgerBtn.addEventListener("click", function() {
      hamburgerMenu.classList.toggle("hidden");
    });
    // Hide menu when clicking outside
    document.addEventListener("click", function(e) {
      if (!hamburgerMenu.contains(e.target) && e.target !== hamburgerBtn) {
        hamburgerMenu.classList.add("hidden");
      }
    });
  }

  // Mobile navbar button logic (sync with desktop)
  const mobileNavConfig = [
    {
      button: "connect_rpi_button_mobile",
      title: "connect_rpi_title",
      content: "connect_rpi_content"
    },
    {
      button: "view_mission_button_mobile",
      title: "view_mission_title",
      content: "view_mission_content"
    },
    {
      button: "view_result_button_mobile",
      title: "view_result_title",
      content: "view_result_content"
    },
    {
      button: "load_result_button_mobile",
      title: "load_result_tile",
      content: "load_result_content"
    }
  ];

  mobileNavConfig.forEach(cfg => {
    const btn = document.getElementById(cfg.button);
    if (btn) {
      btn.addEventListener("click", function() {
        hideAll();
        setActiveButton(cfg.button); // This will not style mobile buttons, but keeps logic consistent
        const title = document.getElementById(cfg.title);
        const content = document.getElementById(cfg.content);
        if (title) title.classList.remove("hidden");
        if (content) content.classList.remove("hidden");
        // Map initialization logic
        if (cfg.content === "view_result_content") {
          setTimeout(initializeMap1, 100);
        }
        if (cfg.content === "load_result_content") {
          setTimeout(initializeMap2, 100);
        }
        // Hide hamburger menu after selection
        if (hamburgerMenu) hamburgerMenu.classList.add("hidden");
      });
    }
  });
  // Disease data upload and map pinning
  function handleDiseaseJsonUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error("Invalid format");
        if (!window.map2) {
          // If map2 isn't initialized yet, initialize it
          initializeMap2();
        }
        // Remove previous markers if any
        if (!window.diseaseMarkers) window.diseaseMarkers = [];
        window.diseaseMarkers.forEach(m => m.remove());
        window.diseaseMarkers = [];

        // Collect all coordinates for bounds
        const latlngs = [];
        data.forEach(entry => {
          if (typeof entry.lat === "number" && typeof entry.lng === "number") {
            latlngs.push([entry.lat, entry.lng]);
            const marker = L.marker([entry.lat, entry.lng]).addTo(map2);
            marker.bindPopup(
              `<b>Disease:</b> ${entry.disease || "Unknown"}<br>` +
              `<b>Confidence:</b> ${typeof entry.confidence === "number" ? (entry.confidence * 100).toFixed(1) + "%" : "N/A"}`
            );
            window.diseaseMarkers.push(marker);
          }
        });
        // Recenter map to fit all markers
        if (latlngs.length > 0) {
          map2.fitBounds(latlngs, { padding: [50, 50] });
        }
      } catch (err) {
        alert("Error parsing JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // Attach event listener when load_result_content is shown
  const diseaseInput = document.getElementById("disease_json");
  if (diseaseInput) {
    diseaseInput.addEventListener("change", handleDiseaseJsonUpload);
  }

  // Button and content/title mapping
  const navConfig = [
    {
      button: "connect_rpi_button",
      title: "connect_rpi_title",
      content: "connect_rpi_content"
    },
    {
      button: "view_mission_button",
      title: "view_mission_title",
      content: "view_mission_content"
    },
    {
      button: "view_result_button",
      title: "view_result_title",
      content: "view_result_content"
    },
    {
      button: "load_result_button",
      title: "load_result_tile",
      content: "load_result_content"
    }
  ];

  // Map initialization
  let map1 = null;
  let map2 = null;
  function initializeMap1() {
    if (!map1) {
      map1 = L.map('map1').setView([51.505, -0.09], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map1);
    } else {
      map1.invalidateSize();
    }
  }
  function initializeMap2() {
    if (!map2) {
      map2 = L.map('map2').setView([51.505, -0.09], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map2);
    } else {
      map2.invalidateSize();
    }
  }

  // Hide all title and content blocks
  function hideAll() {
    navConfig.forEach(cfg => {
      const title = document.getElementById(cfg.title);
      const content = document.getElementById(cfg.content);
      if (title) title.classList.add("hidden");
      if (content) content.classList.add("hidden");
    });
  }

  // Set active button style
  function setActiveButton(activeId) {
    navConfig.forEach(cfg => {
      const btn = document.getElementById(cfg.button);
      if (btn) {
        if (cfg.button === activeId) {
          btn.classList.add("bg-black");
          btn.classList.remove("bg-cardBackground");
        } else {
          btn.classList.remove("bg-black");
          btn.classList.add("bg-cardBackground");
        }
      }
    });
  }

  // Add event listeners
  navConfig.forEach(cfg => {
    const btn = document.getElementById(cfg.button);
    if (btn) {
      btn.addEventListener("click", function() {
        hideAll();
        setActiveButton(cfg.button);
        const title = document.getElementById(cfg.title);
        const content = document.getElementById(cfg.content);
        if (title) title.classList.remove("hidden");
        if (content) content.classList.remove("hidden");
        // Map initialization logic
        if (cfg.content === "view_result_content") {
          setTimeout(initializeMap1, 100);
        }
        if (cfg.content === "load_result_content") {
          setTimeout(initializeMap2, 100);
        }
      });
    }
  });

  // Initialize: show first section
  hideAll();
  setActiveButton(navConfig[0].button);
  document.getElementById(navConfig[0].title).classList.remove("hidden");
  document.getElementById(navConfig[0].content).classList.remove("hidden");
});