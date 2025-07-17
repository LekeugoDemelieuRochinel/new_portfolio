// Main Application Controller
class PortfolioApp {
  constructor() {
    this.managers = {}
    this.isInitialized = false
    
    this.init()
  }

  // init() {
  //   // Wait for DOM to be ready
  //   if (document.readyState === "loading") {
  //     window.addEventListener("DOMContentLoaded", () => {
  //       this.initializeApp()
  //     })
  //   } else {
  //     this.initializeApp()
  //   }
  // }

  // initializeApp() {
  //   try {
  //     // Initialize all managers
  //     this.managers.loading = new window.LoadingManager()
  //     this.managers.theme = new window.ThemeManager()
  //     this.managers.navigation = new window.NavigationManager()
  //     this.managers.animation = new window.AnimationManager()
  //     this.managers.projects = new window.ProjectManager()
  //     this.managers.testimonials = new window.TestimonialsManager()
  //     this.managers.contact = new window.ContactManager()
  //     this.managers.scroll = new window.ScrollManager()

  //     this.bindGlobalEvents()
  //     this.initializeAccessibility()
  //     this.initializePerformanceOptimizations()

  //     this.isInitialized = true

  //     // Dispatch custom event for initialization complete
  //     const initEvent = new CustomEvent("portfolioInitialized", {
  //       detail: { app: this },
  //     })
  //     document.dispatchEvent(initEvent)

  //     console.log("Portfolio app initialized successfully")
  //   } catch (error) {
  //     console.error("Failed to initialize portfolio app:", error)
  //     this.handleInitializationError(error)
  //   }
  // }

  bindGlobalEvents() {
    // Global error handling
    window.addEventListener("error", (e) => {
      console.error("Global error:", e.error)
      this.handleError(e.error)
    })

    // Unhandled promise rejections
    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason)
      this.handleError(e.reason)
    })

    // Visibility change (tab switching)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.onPageHidden()
      } else {
        this.onPageVisible()
      }
    })

    // Online/offline status
    window.addEventListener("online", () => {
      this.onOnline()
    })

    window.addEventListener("offline", () => {
      this.onOffline()
    })

    // Resize events
    const debouncedResize = ((func, wait) => {
      let timeout
      return function (...args) {
        
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
      }
    })(() => {
      this.onResize()
    }, 250)

    window.addEventListener("resize", debouncedResize)

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleGlobalKeyboard(e)
    })
  }

  initializeAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement("a")
    skipLink.href = "#main-content"
    skipLink.className = "skip-to-content"
    skipLink.textContent = "Skip to main content"
    document.body.insertBefore(skipLink, document.body.firstChild)

    // Add main landmark if not present
    const mainContent = document.querySelector(".main-content")
    if (mainContent && !mainContent.getAttribute("role")) {
      mainContent.setAttribute("role", "main")
      mainContent.id = "main-content"
    }

    // Enhance focus management
    this.initializeFocusManagement()

    // Add ARIA live region for announcements
    const liveRegion = document.createElement("div")
    liveRegion.setAttribute("aria-live", "polite")
    liveRegion.setAttribute("aria-atomic", "true")
    liveRegion.className = "sr-only"
    liveRegion.id = "live-region"
    document.body.appendChild(liveRegion)
  }

  initializeFocusManagement() {
    // Track focus for keyboard navigation
    let isUsingKeyboard = false

    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        isUsingKeyboard = true
        document.body.classList.add("keyboard-navigation")
      }
    })

    document.addEventListener("mousedown", () => {
      isUsingKeyboard = false
      document.body.classList.remove("keyboard-navigation")
    })

    // Focus trap for modals (if any)
    this.initializeFocusTrap()
  }

  initializeFocusTrap() {
    const focusableElements = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",")

    // This would be used for modals or other focus-trapped elements
    this.focusableElements = focusableElements
  }

  initializePerformanceOptimizations() {
    // Lazy load images
    this.initializeLazyLoading()

    // Preload critical resources
    this.preloadCriticalResources()

    // Initialize service worker (if available)
    this.initializeServiceWorker()
  }

  initializeLazyLoading() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute("data-src")
              imageObserver.unobserve(img)
            }
          }
        })
      })

      // Observe all images with data-src attribute
      const lazyImages = document.querySelectorAll("img[data-src]")
      lazyImages.forEach((img) => imageObserver.observe(img))
    }
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const criticalFonts = ["https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"]

    criticalFonts.forEach((fontUrl) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "style"
      link.href = fontUrl
      document.head.appendChild(link)
    })
  }

  initializeServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration)
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error)
        })
    }
  }

  handleGlobalKeyboard(e) {
    // Global keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "k":
          e.preventDefault()
          this.focusSearch()
          break
        case "/":
          e.preventDefault()
          this.showKeyboardShortcuts()
          break
      }
    }

    // Escape key handling
    if (e.key === "Escape") {
      this.handleEscape()
    }
  }

  focusSearch() {
    // Focus search input if available
    const searchInput = document.querySelector('input[type="search"]')
    if (searchInput) {
      searchInput.focus()
    }
  }

  showKeyboardShortcuts() {
    // Show keyboard shortcuts modal/tooltip
    this.announce("Keyboard shortcuts: Ctrl+K for search, Ctrl+/ for help, Escape to close")
  }

  handleEscape() {
    // Close any open modals, menus, etc.
    if (this.managers.navigation?.isMenuOpen) {
      this.managers.navigation.closeMobileMenu()
    }
  }

  onPageHidden() {
    // Pause animations, videos, etc. when tab is hidden
    if (this.managers.testimonials) {
      this.managers.testimonials.disableAutoPlay()
    }
  }

  onPageVisible() {
    // Resume animations when tab becomes visible
    if (this.managers.testimonials) {
      this.managers.testimonials.enableAutoPlay()
    }
  }

  onOnline() {
    this.announce("Connection restored")
    document.body.classList.remove("offline")
  }

  onOffline() {
    this.announce("Connection lost. Some features may not work.")
    document.body.classList.add("offline")
  }

  onResize() {
    // Handle responsive changes
    const width = window.innerWidth

    // Update CSS custom property for JavaScript access
    document.documentElement.style.setProperty("--viewport-width", `${width}px`)

    // Trigger resize event for managers
    Object.values(this.managers).forEach((manager) => {
      if (typeof manager.onResize === "function") {
        manager.onResize()
      }
    })
  }

  handleError(error) {
    // Log error for debugging
    console.error("Application error:", error)

    // Show user-friendly error message
    this.announce("An error occurred. Please refresh the page if problems persist.")

    // Send error to analytics (if implemented)
    this.trackError(error)
  }

  handleInitializationError(error) {
    // Show fallback content if initialization fails
    const fallbackMessage = document.createElement("div")
    fallbackMessage.className = "initialization-error"
    fallbackMessage.innerHTML = `
      <h2>Loading Error</h2>
      <p>There was a problem loading the page. Please refresh to try again.</p>
      <button onclick="window.location.reload()">Refresh Page</button>
    `

    document.body.appendChild(fallbackMessage)
  }

  trackError(error) {
    // Implement error tracking (Google Analytics, Sentry, etc.)
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: false,
      })
    }
  }

  announce(message) {
    // Announce message to screen readers
    const liveRegion = document.getElementById("live-region")
    if (liveRegion) {
      liveRegion.textContent = message

      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = ""
      }, 1000)
    }
  }

  // Public API methods
  getManager(name) {
    return this.managers[name]
  }

  isReady() {
    return this.isInitialized
  }

  destroy() {
    // Cleanup method for SPA navigation
    Object.values(this.managers).forEach((manager) => {
      if (typeof manager.destroy === "function") {
        manager.destroy()
      }
    })

    this.managers = {}
    this.isInitialized = false
  }
}

// Initialize the application
const portfolioApp = new PortfolioApp()

// Make app globally accessible for debugging
window.portfolioApp = portfolioApp

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = PortfolioApp
}
