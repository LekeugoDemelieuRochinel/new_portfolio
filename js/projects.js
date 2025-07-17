// Project Filter and Display Manager
class ProjectManager {
  constructor() {
    this.filterButtons = document.querySelectorAll(".filter-btn")
    this.projectCards = document.querySelectorAll(".project-card")
    this.currentFilter = "all"

    this.init()
  }

  init() {
    this.bindEvents()
    this.showAllProjects()
  }

  bindEvents() {
    this.filterButtons.forEach((button) => {
      window.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter")
        this.filterProjects(filter)
        this.updateActiveFilter(button)
      })
    })

    // Keyboard navigation for filters
    this.filterButtons.forEach((button) => {
      window.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          button.click()
        }
      })
    })
  }

  filterProjects(filter) {
    this.currentFilter = filter

    this.projectCards.forEach((card, index) => {
      const category = card.getAttribute("data-category")
      const shouldShow = filter === "all" || category === filter

      if (shouldShow) {
        this.showProject(card, index)
      } else {
        this.hideProject(card)
      }
    })
  }

  showProject(card, index) {
    card.classList.remove("hidden")

    // Stagger animation
    setTimeout(() => {
      card.style.opacity = "1"
      card.style.transform = "scale(1) translateY(0)"
    }, index * 100)
  }

  hideProject(card) {
    card.style.opacity = "0"
    card.style.transform = "scale(0.8) translateY(20px)"

    setTimeout(() => {
      card.classList.add("hidden")
    }, 300)
  }

  showAllProjects() {
    this.projectCards.forEach((card, index) => {
      this.showProject(card, index)
    })
  }

  updateActiveFilter(activeButton) {
    this.filterButtons.forEach((button) => {
      button.classList.remove("active")
    })
    activeButton.classList.add("active")
  }

  // Public method to get current filter
  getCurrentFilter() {
    return this.currentFilter
  }

  // Public method to get visible projects count
  getVisibleProjectsCount() {
    return Array.from(this.projectCards).filter((card) => !card.classList.contains("hidden")).length
  }
}

// Declare Utils variable
const Utils = {
  addEventListener: (element, event, callback) => {
    element.addEventListener(event, callback)
  },
}
