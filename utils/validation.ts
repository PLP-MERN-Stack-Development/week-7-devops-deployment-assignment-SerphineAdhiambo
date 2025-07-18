export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []

  if (!email) {
    errors.push("Email is required")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Invalid email format")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []

  if (!password) {
    errors.push("Password is required")
  } else {
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters")
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateUser(userData: { email: string; password: string; name: string }): ValidationResult {
  const errors: string[] = []

  const emailValidation = validateEmail(userData.email)
  const passwordValidation = validatePassword(userData.password)

  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors)
  }

  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors)
  }

  if (!userData.name || userData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
