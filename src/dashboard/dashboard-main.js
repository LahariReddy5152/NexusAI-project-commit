/** NexusAI dashboard application entry */
import { enforceAuth } from "../authentication/auth-guard.js";
import "../dashboard/analytics-overlay.js";
import { initAppPlatform } from "../app/app-init.js";
import { refreshAdminPanel } from "../admin/admin-panel.js";
import { syncProfilePage } from "../profile/profile-ui.js";
import { initTheme } from "../settings/settings-ui.js";
import { restoreRecruiterHistory, clearRecruiterHistory } from "../virtual-recruiter/vr-chat.js";
import * as AppNav from "../app/app-navigation.js";
import * as AppPlatform from "../app/app-platform.js";
import * as CodingLab from "../coding-lab/coding-lab.js";
import * as CodeLabChat from "../coding-lab/code-lab-chat.js";
import * as InterviewPrep from "../interview/interview-prep.js";
import * as InterviewTracks from "../interview/interview-tracks.js";
import * as Career from "../career/career-panels.js";
import * as Projects from "../projects/projects-ui.js";
import * as Github from "../projects/github-integration.js";
import * as LearnCode from "../learn/learn-code.js";
import * as LearnNav from "../learn/learn-navigation.js";
import * as LearnWorkspace from "../learn/learn-workspace.js";
import * as LearnLessons from "../learn/learn-lessons.js";
import * as LearnAssessment from "../learn/learn-assessment.js";
import { LEARNING_PATHS } from "../learn/learn-data.js";
import { isPathUnlocked } from "../learn/learn-progression.js";
import * as DashboardSync from "../dashboard/dashboard-sync.js";
import * as DashboardGreeting from "../dashboard/dashboard-greeting.js";
import { pullDashboardStats } from "../dashboard/dashboard-stats-store.js";
import * as Notifications from "../notifications/notifications.js";
import * as Settings from "../settings/settings-ui.js";
import * as VrChat from "../virtual-recruiter/vr-chat.js";
import * as VrUi from "../virtual-recruiter/vr-ui.js";
import { initNavigation, setActiveNav, navigateTo } from "../ui/navigation-routes.js";
import { renderCareerHubCards, renderInterviewHubCards, openInterviewHubTrack } from "../ui/hub-sections.js";

const globals = {
  ...AppNav,
  ...AppPlatform,
  ...CodingLab,
  ...CodeLabChat,
  ...InterviewPrep,
  ...InterviewTracks,
  ...Career,
  ...Projects,
  ...Github,
  ...LearnCode,
  ...LearnNav,
  ...LearnWorkspace,
  ...LearnLessons,
  ...LearnAssessment,
  ...DashboardSync,
  ...DashboardGreeting,
  ...Notifications,
  ...Settings,
  ...VrChat,
  ...VrUi,
  setActiveNav,
  navigateTo,
  openInterviewHubTrack
};

Object.entries(globals).forEach(([name, fn]) => {
  if (typeof fn === "function") window[name] = fn;
});

window.LEARNING_PATHS = LEARNING_PATHS;
window.isPathUnlocked = isPathUnlocked;
window.buildPlacementAssessment = LearnAssessment.buildPlacementAssessment;
window.setLearnFilter = LearnWorkspace.setLearnFilter;

const baseShowSection = window.showSection;
window.showSection = function (id) {
  baseShowSection(id);
  if (id === "dashboardSection") DashboardSync.syncDashboardFromProgress();
  if (id === "profileSection") syncProfilePage();
  if (id === "adminSection") refreshAdminPanel();
  if (id === "realProjectsSection") Projects.renderProjectsGrid?.();
  if (id === "jobModeSection") {
    Career.showCareerPanel?.("resume");
    renderCareerHubCards();
  }
  if (id === "interviewSection") {
    renderInterviewHubCards();
    if (typeof window.initInterviewSection === "function") window.initInterviewSection();
  }
  if (id === "codingLabSection") CodingLab.initCodeLab?.();
  if (id === "learnSection") LearnWorkspace.initLearnToolbar?.();
};

async function bootDashboard() {
  await enforceAuth();
  await initTheme();

  function onReady() {
    initNavigation();
    initAppPlatform();
    LearnNav.initializeLearningPortal();
    Projects.renderProjectsGrid?.();
    DashboardSync.syncDashboardFromProgress();
    pullDashboardStats()
      .then(() => DashboardSync.syncDashboardFromProgress())
      .catch(() => {});
    window.addEventListener("nexusDashboardUpdate", () => DashboardSync.syncDashboardFromProgress());
    window.addEventListener("nexusUserSynced", () => DashboardSync.syncDashboardFromProgress());
    DashboardGreeting.startGreetingClock();
    Notifications.initNotifications();
    VrUi.renderMentorModeOptions();
    VrUi.renderVirtualRecruiterGreeting();
    restoreRecruiterHistory();
    VrUi.renderRecruiterClock();
    renderCareerHubCards();
    renderInterviewHubCards();
    CodingLab.initCodeLab?.();
    setInterval(() => {
      VrUi.renderRecruiterClock();
    }, 30000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
}

bootDashboard().catch(() => {
  window.location.href = "index.html";
});
