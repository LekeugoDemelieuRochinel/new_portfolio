// Loading Screen Manager
class LoadingManager {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen")
    this.minimumLoadTime = 1000 // Minimum loading time in ms
    this.startTime = Date.now()

    this.init()
  }

  init() {
    // Hide loading screen when page is fully loaded
    if (document.readyState === "complete") {
      this.hideLoadingScreen()
    } else {
      window.addEventListener("load", () => {
        this.hideLoadingScreen()
      })
    }

    // Fallback: hide loading screen after maximum time
    setTimeout(() => {
      this.hideLoadingScreen()
    }, 5000)
  }

  hideLoadingScreen() {
    if (!this.loadingScreen) return

    const elapsedTime = Date.now() - this.startTime
    const remainingTime = Math.max(0, this.minimumLoadTime - elapsedTime)

    setTimeout(() => {
      this.loadingScreen.classList.add("hidden")

      // Remove from DOM after transition
      setTimeout(() => {
        if (this.loadingScreen.parentNode) {
          this.loadingScreen.parentNode.removeChild(this.loadingScreen)
        }
      }, 500)
    }, remainingTime)
  }

  // Public method to show loading for async operations
  showLoading(message = "Loading...") {
    const loader = document.createElement("div")
    loader.className = "loading-overlay"
    loader.innerHTML = `
      <div class="loader">
        <div class="loader-circle"></div>
        <p>${message}</p>
      </div>
    `

    document.body.appendChild(loader)
    return loader
  }

  // Public method to hide custom loading
  hideLoading(loader) {
    if (loader && loader.parentNode) {
      loader.classList.add("hidden")
      setTimeout(() => {
        loader.parentNode.removeChild(loader)
      }, 300)
    }
  }
}

// Utility functions
const Utils = {
  getElementById: (id) => document.getElementById(id),
  addEventListener: (element, event, listener) => {
    element.addEventListener(event, listener)
  },
}
