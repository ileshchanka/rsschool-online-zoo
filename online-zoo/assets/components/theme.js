const STORAGE_KEY = "oz-theme";
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function getSavedTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function setSavedTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors (private mode, disabled storage).
  }
}

function getCurrentTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "light" || current === "dark") {
    return current;
  }

  return mediaQuery.matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function updateToggleUi(button, theme) {
  const nextTheme = theme === "dark" ? "light" : "dark";
  button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  button.setAttribute("title", `Switch to ${nextTheme} theme`);

  const icon = button.querySelector(".theme-toggle__icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "☀" : "☾";
  }
}

function initThemeToggle() {
  const button = document.getElementById("themeToggle");
  if (!button) return;

  updateToggleUi(button, getCurrentTheme());

  button.addEventListener("click", () => {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setSavedTheme(nextTheme);
    updateToggleUi(button, nextTheme);
  });

  mediaQuery.addEventListener("change", (event) => {
    if (getSavedTheme()) return;

    const systemTheme = event.matches ? "dark" : "light";
    applyTheme(systemTheme);
    updateToggleUi(button, systemTheme);
  });
}

initThemeToggle();
