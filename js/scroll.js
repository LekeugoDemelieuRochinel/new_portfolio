// Scroll Management
class ScrollManager {
  constructor() {
    this.backToTopButton = document.getElementById("back-to-top")
    this.scrollThreshold = 300

    this.init()
  }

  init() {
    this.bindEvents()
    this.updateBackToTopVisibility()
  }

  bindEvents() {
    // Back to top button
    if (this.backToTopButton) {
      this.backToTopButton.addEventListener("click", () => {
        this.scrollToTop()
      })
    }

    // Scroll events
    const throttledScroll = this.throttle(() => {
      this.handleScroll()
    }, 16)

    window.addEventListener("scroll", throttledScroll)

    // Smooth scroll for all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href")
        if (href === "#" || href === "#top") {
          e.preventDefault()
          this.scrollToTop()
        } else {
          const target = document.querySelector(href)
          if (target) {
            e.preventDefault()
            this.smoothScrollTo(target)
          }
        }
      })
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Home key - scroll to top
      if (e.key === "Home" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        this.scrollToTop()
      }

      // End key - scroll to bottom
      if (e.key === "End" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        this.scrollToBottom()
      }
    })
  }

  handleScroll() {
    this.updateBackToTopVisibility()
    this.updateScrollDirection()
  }

  updateBackToTopVisibility() {
    if (this.backToTopButton) {
      const shouldShow = window.pageYOffset > this.scrollThreshold
      this.backToTopButton.classList.toggle("visible", shouldShow)
    }
  }

  updateScrollDirection() {
    const currentScroll = window.pageYOffset

    if (this.lastScrollTop === undefined) {
      this.lastScrollTop = currentScroll
      return
    }

    const isScrollingDown = currentScroll > this.lastScrollTop
    const scrollDelta = Math.abs(currentScroll - this.lastScrollTop)

    // Only update if scroll delta is significant (avoid micro-scrolls)
    if (scrollDelta > 5) {
      document.body.classList.toggle("scrolling-down", isScrollingDown)
      document.body.classList.toggle("scrolling-up", !isScrollingDown)
    }

    this.lastScrollTop = currentScroll
  }

  scrollToTop(duration = 800) {
    const startPosition = window.pageYOffset
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easeProgress = this.easeInOutQuad(progress, 0, 1, 1)

      window.scrollTo(0, startPosition * (1 - easeProgress))

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  scrollToBottom(duration = 800) {
    const startPosition = window.pageYOffset
    const targetPosition = document.documentElement.scrollHeight - window.innerHeight
    const distance = targetPosition - startPosition
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easeProgress = this.easeInOutQuad(progress, 0, 1, 1)

      window.scrollTo(0, startPosition + distance * easeProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // Public method to scroll to specific element
  scrollToElement(element, offset = 80) {
    if (!element) return

    const elementPosition = element.offsetTop - offset
    const startPosition = window.pageYOffset
    const distance = elementPosition - startPosition
    const duration = Math.min(Math.abs(distance) * 0.5, 1000) // Dynamic duration
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easeProgress = this.easeInOutQuad(progress, 0, 1, 1)

      window.scrollTo(0, startPosition + distance * easeProgress)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // Throttle function
  throttle(func, limit) {
    let lastFunc
    let lastRan
    return function () {
      
      const args = arguments
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
  }

  // EaseInOutQuad function
  easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }
}
