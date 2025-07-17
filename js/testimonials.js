// Testimonials Slider Manager
const Utils = {
  getElementById: (id) => document.getElementById(id),
  addEventListener: (element, event, listener, options) => {
    element.addEventListener(event, listener, options)
  },
  isInViewport: (element, offset) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= offset &&
      rect.left >= offset &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) - offset
    )
  },
}

class TestimonialsManager {
  constructor() {
    this.testimonialItems = document.querySelectorAll(".testimonial-item")
    this.dots = document.querySelectorAll(".dot")
    this.prevButton = Utils.getElementById("testimonial-prev")
    this.nextButton = Utils.getElementById("testimonial-next")

    this.currentSlide = 0
    this.totalSlides = this.testimonialItems.length
    this.autoPlayInterval = null
    this.autoPlayDelay = 5000
    this.isAutoPlaying = true

    this.init()
  }

  init() {
    if (this.totalSlides === 0) return

    this.bindEvents()
    this.showSlide(0)
    this.startAutoPlay()
  }

  bindEvents() {
    // Navigation buttons
    if (this.prevButton) {
      Utils.addEventListener(this.prevButton, "click", () => {
        this.previousSlide()
      })
    }

    if (this.nextButton) {
      Utils.addEventListener(this.nextButton, "click", () => {
        this.nextSlide()
      })
    }

    // Dot navigation
    this.dots.forEach((dot, index) => {
      Utils.addEventListener(dot, "click", () => {
        this.goToSlide(index)
      })
    })

    // Keyboard navigation
    Utils.addEventListener(document, "keydown", (e) => {
      if (this.isInView()) {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault()
            this.previousSlide()
            break
          case "ArrowRight":
            e.preventDefault()
            this.nextSlide()
            break
        }
      }
    })

    // Pause auto-play on hover
    const testimonialSection = document.querySelector(".testimonials-slider")
    if (testimonialSection) {
      Utils.addEventListener(testimonialSection, "mouseenter", () => {
        this.pauseAutoPlay()
      })

      Utils.addEventListener(testimonialSection, "mouseleave", () => {
        this.resumeAutoPlay()
      })
    }

    // Touch/swipe support
    this.initTouchSupport()
  }

  initTouchSupport() {
    let startX = 0
    let startY = 0
    let endX = 0
    let endY = 0

    const slider = document.querySelector(".testimonials-slider")
    if (!slider) return

    Utils.addEventListener(
      slider,
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      },
      { passive: true },
    )

    Utils.addEventListener(
      slider,
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX
        endY = e.changedTouches[0].clientY
        this.handleSwipe()
      },
      { passive: true },
    )

    const handleSwipe = () => {
      const deltaX = endX - startX
      const deltaY = endY - startY
      const minSwipeDistance = 50

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.previousSlide()
        } else {
          this.nextSlide()
        }
      }
    }

    this.handleSwipe = handleSwipe
  }

  showSlide(index) {
    // Hide all slides
    this.testimonialItems.forEach((item) => {
      item.classList.remove("active")
    })

    // Show current slide
    if (this.testimonialItems[index]) {
      this.testimonialItems[index].classList.add("active")
    }

    // Update dots
    this.dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index)
    })

    this.currentSlide = index
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides
    this.goToSlide(nextIndex)
  }

  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides
    this.goToSlide(prevIndex)
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index)
      this.resetAutoPlay()
    }
  }

  startAutoPlay() {
    if (this.isAutoPlaying && this.totalSlides > 1) {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide()
      }, this.autoPlayDelay)
    }
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
      this.autoPlayInterval = null
    }
  }

  resumeAutoPlay() {
    if (this.isAutoPlaying) {
      this.startAutoPlay()
    }
  }

  resetAutoPlay() {
    this.pauseAutoPlay()
    this.resumeAutoPlay()
  }

  isInView() {
    const testimonialSection = document.querySelector(".testimonials-section")
    return testimonialSection && Utils.isInViewport(testimonialSection, 0.3)
  }

  // Public methods
  enableAutoPlay() {
    this.isAutoPlaying = true
    this.startAutoPlay()
  }

  disableAutoPlay() {
    this.isAutoPlaying = false
    this.pauseAutoPlay()
  }

  getCurrentSlide() {
    return this.currentSlide
  }

  getTotalSlides() {
    return this.totalSlides
  }
}
