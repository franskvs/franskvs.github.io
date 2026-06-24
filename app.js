// ===============================
// GITHUB CONFIGURATION
// ===============================
// Ganti username ini dengan username GitHub milik kamu.
// Contoh: const GITHUB_USERNAME = "franskvs";
const GITHUB_USERNAME = "franskvs";

const repoList = document.getElementById("repoList");
const githubProfile = document.getElementById("githubProfile");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

// Mobile navigation
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Active link on scroll
const sections = [...document.querySelectorAll("section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

window.addEventListener("scroll", () => {
  const current = sections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 160 && rect.bottom >= 160;
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", current && item.getAttribute("href") === `#${current.id}`);
  });
});

// Reveal animation
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// GitHub API integration
async function loadGitHubData() {
  if (!GITHUB_USERNAME || GITHUB_USERNAME === "your-github-username") {
    renderGitHubFallback("Masukkan username GitHub di file app.js pada variabel GITHUB_USERNAME.");
    return;
  }

  try {
    const [userResponse, repoResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`),
    ]);

    if (!userResponse.ok || !repoResponse.ok) {
      throw new Error("GitHub profile atau repository tidak ditemukan.");
    }

    const user = await userResponse.json();
    const repos = await repoResponse.json();

    renderGitHubProfile(user);
    renderRepositories(repos);
  } catch (error) {
    renderGitHubFallback(error.message);
  }
}

function renderGitHubProfile(user) {
  githubProfile.innerHTML = `
    <img src="${user.avatar_url}" alt="Avatar GitHub ${user.login}" />
    <div>
      <h3>${user.name || user.login}</h3>
      <p>${user.bio || "GitHub profile connected successfully."}</p>
      <div class="github-meta">
        <span>${user.public_repos} repos</span>
        <span>${user.followers} followers</span>
        <span>${user.following} following</span>
        <a href="${user.html_url}" target="_blank" rel="noreferrer">Open GitHub →</a>
      </div>
    </div>
  `;
}

function renderRepositories(repos) {
  if (!repos.length) {
    repoList.innerHTML = `<article class="repo-card"><h3>No public repositories</h3><p>Repository publik belum tersedia.</p></article>`;
    return;
  }

  repoList.innerHTML = repos
    .map((repo) => {
      const description = repo.description || "No description added yet.";
      const language = repo.language || "Code";
      const updatedDate = new Date(repo.updated_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return `
        <article class="repo-card">
          <h3><a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a></h3>
          <p>${description}</p>
          <div class="repo-footer">
            <span>${language}</span>
            <span>★ ${repo.stargazers_count}</span>
            <span>Updated ${updatedDate}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderGitHubFallback(message) {
  githubProfile.innerHTML = `
    <div class="avatar-ring" style="width:84px;height:84px;margin:0;">
      <span style="font-size:1.4rem;">GH</span>
    </div>
    <div>
      <h3>GitHub belum tersambung</h3>
      <p>${message}</p>
      <div class="github-meta">
        <span>Edit app.js</span>
        <span>Isi GITHUB_USERNAME</span>
      </div>
    </div>
  `;

  repoList.innerHTML = [
    "Automatic Boiler Control",
    "PLC Practice Project",
    "Arduino Monitoring System",
  ]
    .map(
      (title) => `
      <article class="repo-card">
        <h3>${title}</h3>
        <p>Contoh kartu project. Setelah username GitHub diganti, bagian ini otomatis menampilkan repository dari GitHub.</p>
        <div class="repo-footer">
          <span>Demo</span>
          <span>GitHub API</span>
        </div>
      </article>
    `
    )
    .join("");
}

loadGitHubData();

// Futuristic particle background
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(80, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.6 + 0.5,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.5 + 0.25,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(45, 248, 255, ${particle.alpha})`;
    ctx.fill();

    for (let j = index + 1; j < particles.length; j++) {
      const other = particles[j];
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

      if (distance < 110) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(138, 92, 255, ${0.14 * (1 - distance / 110)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  animationFrame = requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawParticles();
});
