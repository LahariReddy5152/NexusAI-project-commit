const GITHUB_API = "https://api.github.com";

async function ghFetch(path, token, options = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: token ? `Bearer ${token}` : undefined,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }
  if (!res.ok) {
    throw new Error(data.message || `GitHub API error ${res.status}`);
  }
  return data;
}

export async function verifyConnection(username, token) {
  const user = await ghFetch("/user", token);
  if (username && user.login?.toLowerCase() !== username.toLowerCase()) {
    throw new Error("Token does not match the provided username");
  }
  return { login: user.login, id: user.id, avatar: user.avatar_url };
}

export async function createRepository(token, name, description = "", isPrivate = false) {
  return ghFetch("/user/repos", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, private: isPrivate, auto_init: true })
  });
}

export async function listRepositories(token) {
  return ghFetch("/user/repos?per_page=20&sort=updated", token);
}

export async function listCommits(token, owner, repo, perPage = 5) {
  return ghFetch(`/repos/${owner}/${repo}/commits?per_page=${perPage}`, token);
}

export async function pushProgressCommit(token, owner, repo, message, content) {
  const repoData = await ghFetch(`/repos/${owner}/${repo}`, token);
  const defaultBranch = repoData.default_branch || "main";
  const filePath = "NEXUSAI_PROGRESS.md";
  const encoded = Buffer.from(content, "utf8").toString("base64");

  let sha;
  try {
    const existing = await ghFetch(`/repos/${owner}/${repo}/contents/${filePath}`, token);
    sha = existing.sha;
  } catch {
    sha = undefined;
  }

  return ghFetch(`/repos/${owner}/${repo}/contents/${filePath}`, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: encoded,
      branch: defaultBranch,
      ...(sha ? { sha } : {})
    })
  });
}

export function parseRepoUrl(url) {
  const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}
