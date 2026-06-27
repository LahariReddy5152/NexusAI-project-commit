/** Navigation routes and active sidebar state */

const NAV_MAP = {
  dashboardSection: "Dashboard",
  learnSection: "Learn",
  realProjectsSection: "Real Projects",
  interviewSection: "Interview Prep",
  jobModeSection: "Career",
  codingLabSection: "Code Lab",
  profileSection: "Profile",
  settingsSection: "Settings",
  adminSection: "Admin"
};

export function setActiveNav(sectionId) {
  document.querySelectorAll(".sidebar-nav .nav-btn[data-section]").forEach((btn) => {
    const active = btn.dataset.section === sectionId;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-current", active ? "page" : "false");
  });
}

export function navigateTo(sectionId) {
  if (typeof window.showSection === "function") {
    window.showSection(sectionId);
  }
  setActiveNav(sectionId);
  document.getElementById("sidebar")?.classList.remove("active");
}

export function initNavigation() {
  document.querySelectorAll(".sidebar-nav .nav-btn[data-section]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;
      if (section) navigateTo(section);
    });
  });
  setActiveNav("dashboardSection");
}

export { NAV_MAP };
