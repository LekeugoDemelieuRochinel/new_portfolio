// Utility Functions
const Utils = {
  // Debounce function for performance optimization
  debounce(func, wait, immediate) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func(...args)
    }
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth

    return (
      rect.top <= windowHeight * (1 - threshold) &&
      rect.bottom >= windowHeight * threshold &&
      rect.left <= windowWidth * (1 - threshold) &&
      rect.right >= windowWidth * threshold
    )
  },

  // Smooth scroll to element
  smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop - 80 // Account for fixed header
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    let startTime = null

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    requestAnimationFrame(animation.bind(this))
  },

  // Easing function for smooth animations
  easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  },

  // Generate random number between min and max
  random(min, max) {
    return Math.random() * (max - min) + min
  },

  // Format number with commas
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Get element by ID with error handling
  getElementById(id) {
    const element = document.getElementById(id)
    if (!element) {
      console.warn(`Element with ID '${id}' not found`)
    }
    return element
  },

  // Add event listener with error handling
  addEventListener(element, event, handler, options = {}) {
    if (element && typeof handler === "function") {
      element.addEventListener(event, handler, options)
    } else {
      console.warn("Invalid element or handler for event listener")
    }
  },

  // Remove event listener
  removeEventListener(element, event, handler, options = {}) {
    if (element && typeof handler === "function") {
      element.removeEventListener(event, handler, options)
    }
  },

  // Local storage helpers
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.warn("Failed to save to localStorage:", error)
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch (error) {
        console.warn("Failed to read from localStorage:", error)
        return defaultValue
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn("Failed to remove from localStorage:", error)
      }
    },
  },
}
