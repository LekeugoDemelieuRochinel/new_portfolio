// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    this.animatedElements = new Set()
    this.init()
  }

  init() {
    this.setupIntersectionObserver()
    this.initScrollAnimations()
    this.initCounterAnimations()
    this.initTypingAnimation()
    this.initParticleSystem()
  }

  setupIntersectionObserver() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            this.animateElement(entry.target)
            this.animatedElements.add(entry.target)
          }
        })
      }, this.observerOptions)

      // Observe elements with animation classes
      const elementsToAnimate = document.querySelectorAll(`
        .animate-on-scroll,
        .skill-progress,
        .stat-number,
        .timeline-item,
        .project-card,
        .service-card,
        .certification-item
      `)

      elementsToAnimate.forEach((el) => {
        this.observer.observe(el)
      })
    } else {
      // Fallback for browsers without IntersectionObserver
      this.initFallbackAnimations()
    }
  }

  animateElement(element) {
    // Add base animation class
    element.classList.add("animated")

    // Specific animations based on element type
    if (element.classList.contains("skill-progress")) {
      this.animateSkillBar(element)
    } else if (element.classList.contains("stat-number")) {
      this.animateCounter(element)
    } else if (element.classList.contains("timeline-item")) {
      this.animateTimelineItem(element)
    } else if (element.classList.contains("project-card")) {
      this.animateProjectCard(element)
    } else {
      // Default fade in animation
      element.style.opacity = "0"
      element.style.transform = "translateY(30px)"

      requestAnimationFrame(() => {
        element.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      })
    }
  }

  animateSkillBar(skillBar) {
    const width = skillBar.getAttribute("data-width") || "0"
    skillBar.style.width = "0%"

    setTimeout(() => {
      skillBar.style.transition = "width 1.5s ease-in-out"
      skillBar.style.width = `${width}%`
    }, 200)
  }

  animateCounter(counter) {
    const target = Number.parseInt(counter.getAttribute("data-count")) || 0
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const updateCounter = () => {
      current += increment
      if (current < target) {
        counter.textContent = Math.floor(current)
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target
      }
    }

    updateCounter()
  }

  animateTimelineItem(item) {
    item.style.opacity = "0"
    item.style.transform = "translateX(-50px)"

    setTimeout(() => {
      item.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out"
      item.style.opacity = "1"
      item.style.transform = "translateX(0)"
    }, 100)
  }

  animateProjectCard(card) {
    card.style.opacity = "0"
    card.style.transform = "scale(0.8) translateY(30px)"

    setTimeout(() => {
      card.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
      card.style.opacity = "1"
      card.style.transform = "scale(1) translateY(0)"
    }, 150)
  }

  initScrollAnimations() {
    const scrollElements = document.querySelectorAll(".animate-on-scroll")

    scrollElements.forEach((el, index) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(50px)"
      el.style.transitionDelay = `${index * 0.1}s`
    })
  }

  initCounterAnimations() {
    // Initialize counter elements
    const counters = document.querySelectorAll(".stat-number")
    counters.forEach((counter) => {
      counter.textContent = "0"
    })
  }

  initTypingAnimation() {
    const typingElement = document.getElementById("typing-text")
    if (!typingElement) return

    const texts = ["Software Engineer", "Full Stack Developer", "Problem Solver", "Tech Enthusiast", "Code Craftsman"]

    let textIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typeSpeed = 100

    const typeText = () => {
      const currentText = texts[textIndex]

      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1)
        charIndex--
        typeSpeed = 50
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1)
        charIndex++
        typeSpeed = 100
      }

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000 // Pause at end
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length
        typeSpeed = 500 // Pause before next word
      }

      setTimeout(typeText, typeSpeed)
    }

    typeText()
  }

  initParticleSystem() {
    const particlesContainer = document.getElementById("particles")
    if (!particlesContainer) return

    const particleCount = 50
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"

      // Random position
      particle.style.left = `${this.random(0, 100)}%`
      particle.style.top = `${this.random(0, 100)}%`

      // Random animation delay
      particle.style.animationDelay = `${this.random(0, 6)}s`
      particle.style.animationDuration = `${this.random(4, 8)}s`

      particlesContainer.appendChild(particle)
      particles.push(particle)
    }

    // Animate particles
    particles.forEach((particle) => {
      this.animateParticle(particle)
    })
  }

  animateParticle(particle) {
    const moveParticle = () => {
      const currentX = Number.parseFloat(particle.style.left)
      const currentY = Number.parseFloat(particle.style.top)

      const newX = currentX + this.random(-0.5, 0.5)
      const newY = currentY + this.random(-0.5, 0.5)

      // Keep particles within bounds
      particle.style.left = `${Math.max(0, Math.min(100, newX))}%`
      particle.style.top = `${Math.max(0, Math.min(100, newY))}%`

      requestAnimationFrame(moveParticle)
    }

    moveParticle()
  }

  initFallbackAnimations() {
    // Simple fallback for browsers without IntersectionObserver
    const animateOnScroll = this.throttle(() => {
      const elements = document.querySelectorAll(".animate-on-scroll")

      elements.forEach((element) => {
        if (this.isInViewport(element) && !this.animatedElements.has(element)) {
          this.animateElement(element)
          this.animatedElements.add(element)
        }
      })
    }, 100)

    window.addEventListener("scroll", animateOnScroll)
    animateOnScroll() // Initial check
  }

  // Public method to trigger custom animations
  triggerAnimation(element, animationType = "fadeIn") {
    if (!element) return

    element.classList.add(`animate-${animationType}`)

    // Remove animation class after completion
    setTimeout(() => {
      element.classList.remove(`animate-${animationType}`)
    }, 1000)
  }

  // Utility methods
  random(min, max) {
    return Math.random() * (max - min) + min
  }

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

  isInViewport(el) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
}
