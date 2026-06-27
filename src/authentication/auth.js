/** NexusAI auth — real backend */
import {
  signup as apiSignup,
  login as apiLogin,
  forgotPassword as apiForgot,
  resetPassword as apiReset,
  logoutApi,
  syncUserData,
  uploadFile
} from "../shared/api-client.js";

export async function signup() {
  const name = document.getElementById("name")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;
  const avatar = typeof getAvatarFromForm === "function" ? getAvatarFromForm() : { type: "male" };

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  const avatarFile = document.getElementById("avatarUpload")?.files?.[0];
  let avatarPayload = avatar;

  const { ok, data } = await apiSignup({ name, email, password, avatar: avatarPayload });
  if (!ok) {
    alert(data.message || "Signup failed");
    return;
  }

  const loginResult = await apiLogin({ email, password, rememberMe: true });
  if (!loginResult.ok) {
    alert("Account created — please log in.");
    return;
  }

  if (avatarFile && loginResult.data?.user) {
    const up = await uploadFile("avatar", avatarFile);
    if (up.ok) avatarPayload = { type: "custom", url: up.data.url };
  }

  alert("Signup successful");
  window.location.href = "dashboard.html";
}

export async function login() {
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value;
  const rememberMe = document.getElementById("rememberMe")?.checked ?? false;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const { ok, data } = await apiLogin({ email, password, rememberMe });
  if (!ok) {
    alert(data.message || "Invalid credentials");
    return;
  }

  await syncUserData();
  alert("Login successful");
  window.location.href = "dashboard.html";
}

export async function forgotPassword() {
  const email = document.getElementById("email")?.value?.trim();
  if (!email) {
    alert("Enter your email to reset password.");
    return;
  }

  const { ok, data } = await apiForgot(email);
  if (!ok) {
    alert(data.message || "Request failed");
    return;
  }

  if (data.resetToken) {
    const newPassword = prompt("Dev mode: enter new password (reset token received)");
    if (newPassword) {
      const reset = await apiReset(data.resetToken, newPassword);
      alert(reset.data?.message || "Password updated");
      if (reset.ok) window.location.href = "index.html";
      return;
    }
  }
  alert(data.message || `Password reset link sent to ${email}`);
}

export async function logout() {
  await logoutApi();
  window.location.href = "index.html";
}

export function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const token = localStorage.getItem("nexusToken");
  const role = localStorage.getItem("userRole");

  if (!isLoggedIn || !token) {
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(localStorage.getItem("nexusUser") || "null");
  if (user?.name) {
    const welcome = document.getElementById("welcomeText");
    if (welcome) welcome.innerText = `Welcome Back, ${user.name}`;
  }

  if (role === "admin") {
    document.querySelectorAll(".admin-only").forEach((el) => el.classList.remove("hidden"));
    document.querySelectorAll(".user-only").forEach((el) => el.classList.add("hidden"));
  } else {
    document.querySelectorAll(".admin-only").forEach((el) => el.classList.add("hidden"));
    document.querySelectorAll(".user-only").forEach((el) => el.classList.remove("hidden"));
  }
}

window.signup = signup;
window.login = login;
window.forgotPassword = forgotPassword;
window.logout = logout;
window.checkAuth = checkAuth;
