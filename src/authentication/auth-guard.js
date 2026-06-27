/** @module authentication/auth-guard */
import { syncUserData, getToken, clearSession } from "../shared/api-client.js";

export async function enforceAuth() {
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

  try {
    await syncUserData();
    window.dispatchEvent(new Event("nexusUserSynced"));
  } catch {
    /* keep session if sync fails transiently */
  }
  return true;
}
