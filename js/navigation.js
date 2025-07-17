// Navigation Management
const Utils = {
  getElementById: (id) => document.getElementById(id),
  addEventListener: (element, event, handler) => {
    element.addEventListener(event, handler)
  },
  throttle: (func, limit) => {
    let lastFunc
    let lastRan
    return function (...args) {
      if (!lastRan) {
        func.apply(this, args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(
          () => {
            if (Date.now() - lastRan >= limit) {
              func.apply(this, args)
              lastRan = Date.now()
            }
          },
          limit - (Date.now() - lastRan),
        )
      }
    }
  },
  debounce: (func, wait) => {
    let timeout
    return function (...args) {
      
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  },
  smoothScrollTo: (element, duration) => {
    const start = window.pageYOffset
    const change = element.getBoundingClientRect().top
    const startTime = performance.now()

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    const animateScroll = () => {
      const now = performance.now()
      const timeElapsed = now - startTime
      window.scrollTo(0, easeInOutQuad(timeElapsed, start, change, duration))
      if (timeElapsed < duration) requestAnimationFrame(animateScroll)
    }

    requestAnimationFrame(animateScroll)
  },
}

class NavigationManager {
  constructor() {
    this.navbar = Utils.getElementById("navbar")
    this.navMenu = Utils.getElementById("nav-menu")
    this.hamburger = Utils.getElementById("hamburger")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.progressBar = Utils.getElementById("progress-bar")
    this.sections = document.querySelectorAll(".section")

    this.isMenuOpen = false
    this.currentSection = "home"

    this.init()
  }

  init() {
    this.bindEvents()
    this.updateActiveSection()
    this.updateScrollProgress()
  }

  bindEvents() {
    // Hamburger menu toggle
    if (this.hamburger) {
      Utils.addEventListener(this.hamburger, "click", () => {
        this.toggleMobileMenu()
      })
    }

    // Navigation links
    this.navLinks.forEach((link) => {
      Utils.addEventListener(link, "click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetSection = Utils.getElementById(targetId)

        if (targetSection) {
          this.navigateToSection(targetSection)
          this.closeMobileMenu()
        }
      })
    })

    // Scroll events
    const throttledScroll = Utils.throttle(() => {
      this.handleScroll()
    }, 16) // ~60fps

    Utils.addEventListener(window, "scroll", throttledScroll)

    // Resize events
    const debouncedResize = Utils.debounce(() => {
      this.handleResize()
    }, 250)

    Utils.addEventListener(window, "resize", debouncedResize)

    // Close mobile menu when clicking outside
    Utils.addEventListener(document, "click", (e) => {
      if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
        this.closeMobileMenu()
      }
    })

    // Keyboard navigation
    Utils.addEventListener(document, "keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.closeMobileMenu()
      }
    })
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen

    if (this.hamburger) {
      this.hamburger.classList.toggle("active", this.isMenuOpen)
    }

    if (this.navMenu) {
      this.navMenu.classList.toggle("active", this.isMenuOpen)
    }

    // Prevent body scroll when menu is open
    document.body.classList.toggle("no-scroll", this.isMenuOpen)

    // Update ARIA attributes
    if (this.hamburger) {
      this.hamburger.setAttribute("aria-expanded", this.isMenuOpen)
    }
  }

  closeMobileMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false

      if (this.hamburger) {
        this.hamburger.classList.remove("active")
        this.hamburger.setAttribute("aria-expanded", "false")
      }

      if (this.navMenu) {
        this.navMenu.classList.remove("active")
      }

      document.body.classList.remove("no-scroll")
    }
  }

  navigateToSection(targetSection) {
    Utils.smoothScrollTo(targetSection, 800)

    // Update active link immediately for better UX
    const targetId = targetSection.id
    this.updateActiveLink(targetId)
  }

  handleScroll() {
    this.updateScrollProgress()
    this.updateActiveSection()
    this.updateNavbarStyle()
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu()
    }
  }

  updateScrollProgress() {
    if (this.progressBar) {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100

      this.progressBar.style.width = `${Math.min(scrollPercent, 100)}%`
    }
  }

  updateActiveSection() {
    let currentSection = "home"

    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionHeight = rect.height

      // Consider section active if it's in the upper half of viewport
      if (sectionTop <= window.innerHeight * 0.5 && sectionTop + sectionHeight > window.innerHeight * 0.5) {
        currentSection = section.id
      }
    })

    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection
      this.updateActiveLink(currentSection)
    }
  }

  updateActiveLink(sectionId) {
    this.navLinks.forEach((link) => {
      const isActive = link.getAttribute("data-section") === sectionId
      link.classList.toggle("active", isActive)
    })
  }

  updateNavbarStyle() {
    if (this.navbar) {
      const scrolled = window.pageYOffset > 50
      this.navbar.classList.toggle("scrolled", scrolled)
    }
  }
}
