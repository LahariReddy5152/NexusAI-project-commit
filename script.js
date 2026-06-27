let selectedAvatar = { type: "male", url: null };

function selectAvatar(type) {
  selectedAvatar = { type, url: null };
  document.querySelectorAll(".avatar-opt").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.avatar === type);
  });
  const preview = document.getElementById("avatarPreview");
  if (preview) {
    preview.classList.add("hidden");
    preview.removeAttribute("src");
  }
}

function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    selectedAvatar = { type: "custom", url: reader.result };
    document.querySelectorAll(".avatar-opt").forEach((btn) => btn.classList.remove("selected"));
    const preview = document.getElementById("avatarPreview");
    if (preview) {
      preview.src = reader.result;
      preview.classList.remove("hidden");
    }
  };
  reader.readAsDataURL(file);
}

function getAvatarFromForm() {
  return { ...selectedAvatar };
}

function setSession(token, user, rememberMe) {
  localStorage.setItem("nexusToken", token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", user.role || "user");
  localStorage.setItem(
    "nexusUser",
    JSON.stringify({ ...user, progress: user.progress || { points: 0, streak: 0, hours: 0 } })
  );
  if (rememberMe) localStorage.setItem("nexusRememberMe", "1");
}

async function apiAuth(path, body) {
  const res = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  const data = await apiAuth("signup", { name, email, password, avatar: getAvatarFromForm() });
  if (!data.success) {
    alert(data.message || "Signup failed");
    return;
  }

  const loginData = await apiAuth("login", { email, password, rememberMe: true });
  if (loginData.success && loginData.token) {
    setSession(loginData.token, loginData.user, true);
    alert("Signup successful");
    window.location.href = "dashboard.html";
  } else {
    alert("Account created — please log in.");
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe")?.checked ?? false;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const data = await apiAuth("login", { email, password, rememberMe });
  if (!data.success) {
    alert(data.message || "Invalid credentials");
    return;
  }

  setSession(data.token, data.user, rememberMe);
  alert("Login successful");
  window.location.href = "dashboard.html";
}

async function forgotPassword() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Enter your email to reset password.");
    return;
  }

  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();

  if (data.resetToken) {
    const newPassword = prompt("Dev mode: enter new password");
    if (newPassword) {
      const reset = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.resetToken, newPassword })
      });
      const resetData = await reset.json();
      alert(resetData.message || "Password updated");
      if (resetData.success) window.location.href = "index.html";
      return;
    }
  }
  alert(data.message || `Password reset link sent to ${email}`);
}

function logout() {
  localStorage.removeItem("nexusToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
}

function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const token = localStorage.getItem("nexusToken");
  const role = localStorage.getItem("userRole");

  if (!isLoggedIn || !token) {
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(localStorage.getItem("nexusUser"));
  if (user) {
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
window.selectAvatar = selectAvatar;
window.handleAvatarUpload = handleAvatarUpload;

if (document.body.classList.contains("login-body")) {
  document.addEventListener("DOMContentLoaded", () => selectAvatar("male"));
}

console.log("Created by LR_NexusAI_2026");
