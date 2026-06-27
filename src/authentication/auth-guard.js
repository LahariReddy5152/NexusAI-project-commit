/** @module authentication/auth-guard */
import { syncUserData, getToken, clearSession } from "../shared/api-client.js";

export function enforceAuth() {
  if (!getToken() || !localStorage.getItem("isLoggedIn")) {
    clearSession();
    window.location.href = "index.html";
    return false;
  }

  const user = JSON.parse(localStorage.getItem("nexusUser") || "null");
  if (user?.name) {
    const welcome = document.getElementById("welcomeText");
    if (welcome) welcome.innerText = `Welcome Back, ${user.name}`;
  }

  syncUserData().catch(() => {});
  return true;
}
