// Theme Management
const Utils = {
  getElementById: (id) => document.getElementById(id),
  addEventListener: (element, event, callback) => {
    element.addEventListener(event, callback)
  },
  storage: {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => {
      localStorage.setItem(key, value)
    },
  },
}

class ThemeManager {
  constructor() {
    this.currentTheme = "light"
    this.themeToggle = Utils.getElementById("theme-toggle")
    this.init()
  }

  init() {
    // Load saved theme or detect system preference
    this.loadTheme()
    this.bindEvents()
    this.updateThemeIcon()
  }

  loadTheme() {
    const savedTheme = Utils.storage.get("theme")
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

    this.currentTheme = savedTheme || systemTheme
    this.applyTheme(this.currentTheme)
  }

  bindEvents() {
    // Theme toggle button
    if (this.themeToggle) {
      Utils.addEventListener(this.themeToggle, "click", () => {
        this.toggleTheme()
      })
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    Utils.addEventListener(mediaQuery, "change", (e) => {
      if (!Utils.storage.get("theme")) {
        this.currentTheme = e.matches ? "dark" : "light"
        this.applyTheme(this.currentTheme)
        this.updateThemeIcon()
      }
    })

    // Keyboard shortcut (Ctrl/Cmd + Shift + T)
    Utils.addEventListener(document, "keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault()
        this.toggleTheme()
      }
    })
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
    this.applyTheme(this.currentTheme)
    this.updateThemeIcon()
    Utils.storage.set("theme", this.currentTheme)

    // Add transition class for smooth theme change
    document.body.classList.add("theme-transition")
    setTimeout(() => {
      document.body.classList.remove("theme-transition")
    }, 300)
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    document.body.classList.toggle("dark-theme", theme === "dark")
  }

  updateThemeIcon() {
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector("i")
      if (icon) {
        icon.className = this.currentTheme === "light" ? "fas fa-moon" : "fas fa-sun"
      }
    }
  }

  getCurrentTheme() {
    return this.currentTheme
  }
}
