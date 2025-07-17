// Import or declare the Utils variable here
const Utils = {
  getElementById: (id) => document.getElementById(id),
  addEventListener: (element, event, listener) => element.addEventListener(event, listener),
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
}

// Contact Form Manager
class ContactManager {
  constructor() {
    this.contactForm = Utils.getElementById("contact-form")
    this.submitButton = this.contactForm?.querySelector(".submit-btn")
    this.successMessage = Utils.getElementById("form-success")

    this.formFields = {
      name: Utils.getElementById("name"),
      email: Utils.getElementById("email"),
      subject: Utils.getElementById("subject"),
      message: Utils.getElementById("message"),
    }

    this.errorElements = {
      name: Utils.getElementById("name-error"),
      email: Utils.getElementById("email-error"),
      subject: Utils.getElementById("subject-error"),
      message: Utils.getElementById("message-error"),
    }

    this.isSubmitting = false

    this.init()
  }

  init() {
    if (!this.contactForm) return

    this.bindEvents()
    this.initValidation()
  }

  bindEvents() {
    // Form submission
    Utils.addEventListener(this.contactForm, "submit", (e) => {
      e.preventDefault()
      this.handleSubmit()
    })

    // Real-time validation
    Object.keys(this.formFields).forEach((fieldName) => {
      const field = this.formFields[fieldName]
      if (field) {
        Utils.addEventListener(field, "blur", () => {
          this.validateField(fieldName)
        })

        Utils.addEventListener(field, "input", () => {
          this.clearError(fieldName)
        })
      }
    })

    // Close success message
    if (this.successMessage) {
      const closeButton = this.successMessage.querySelector(".close-btn")
      if (closeButton) {
        Utils.addEventListener(closeButton, "click", () => {
          this.hideSuccessMessage()
        })
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        this.hideSuccessMessage()
      }, 5000)
    }
  }

  initValidation() {
    // Add required attributes and ARIA labels
    Object.keys(this.formFields).forEach((fieldName) => {
      const field = this.formFields[fieldName]
      if (field) {
        field.setAttribute("aria-describedby", `${fieldName}-error`)
      }
    })
  }

  async handleSubmit() {
    if (this.isSubmitting) return

    // Validate all fields
    const isValid = this.validateForm()
    if (!isValid) return

    this.isSubmitting = true
    this.showLoadingState()

    try {
      // Simulate form submission (replace with actual API call)
      await this.submitForm()
      this.showSuccessMessage()
      this.resetForm()
    } catch (error) {
      this.showErrorMessage(error.message)
    } finally {
      this.isSubmitting = false
      this.hideLoadingState()
    }
  }

  async submitForm() {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
          // 90% success rate
          resolve({ success: true, message: "Message sent successfully!" })
        } else {
          reject(new Error("Failed to send message. Please try again."))
        }
      }, 2000)
    })

    // Real implementation would look like:
    /*
    const formData = new FormData(this.contactForm);
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
    */
  }

  validateForm() {
    let isValid = true

    Object.keys(this.formFields).forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isValid = false
      }
    })

    return isValid
  }

  validateField(fieldName) {
    const field = this.formFields[fieldName]
    const value = field?.value.trim()
    let isValid = true
    let errorMessage = ""

    if (!value) {
      errorMessage = `${this.getFieldLabel(fieldName)} is required.`
      isValid = false
    } else {
      switch (fieldName) {
        case "name":
          if (value.length < 2) {
            errorMessage = "Name must be at least 2 characters long."
            isValid = false
          }
          break

        case "email":
          if (!Utils.isValidEmail(value)) {
            errorMessage = "Please enter a valid email address."
            isValid = false
          }
          break

        case "subject":
          if (value.length < 5) {
            errorMessage = "Subject must be at least 5 characters long."
            isValid = false
          }
          break

        case "message":
          if (value.length < 10) {
            errorMessage = "Message must be at least 10 characters long."
            isValid = false
          }
          break
      }
    }

    if (isValid) {
      this.clearError(fieldName)
    } else {
      this.showError(fieldName, errorMessage)
    }

    return isValid
  }

  showError(fieldName, message) {
    const field = this.formFields[fieldName]
    const errorElement = this.errorElements[fieldName]

    if (field) {
      field.classList.add("error")
      field.setAttribute("aria-invalid", "true")
    }

    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
  }

  clearError(fieldName) {
    const field = this.formFields[fieldName]
    const errorElement = this.errorElements[fieldName]

    if (field) {
      field.classList.remove("error")
      field.setAttribute("aria-invalid", "false")
    }

    if (errorElement) {
      errorElement.textContent = ""
      errorElement.style.display = "none"
    }
  }

  showLoadingState() {
    if (this.submitButton) {
      this.submitButton.classList.add("loading")
      this.submitButton.disabled = true
    }
  }

  hideLoadingState() {
    if (this.submitButton) {
      this.submitButton.classList.remove("loading")
      this.submitButton.disabled = false
    }
  }

  showSuccessMessage() {
    if (this.successMessage) {
      this.successMessage.classList.add("show")
    }
  }

  hideSuccessMessage() {
    if (this.successMessage) {
      this.successMessage.classList.remove("show")
    }
  }

  showErrorMessage(message) {
    // You could implement a toast notification or modal here
    alert(`Error: ${message}`)
  }

  resetForm() {
    if (this.contactForm) {
      this.contactForm.reset()
    }

    // Clear all errors
    Object.keys(this.errorElements).forEach((fieldName) => {
      this.clearError(fieldName)
    })
  }

  getFieldLabel(fieldName) {
    const labels = {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
    }
    return labels[fieldName] || fieldName
  }
}
