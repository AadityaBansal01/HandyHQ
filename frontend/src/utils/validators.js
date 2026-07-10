// utils/validators.js — small, reusable checks shared across every form
// each function returns an error message STRING if invalid, or an empty string '' if valid
// this way a form can just do: const error = validatePhone(phone); if (error) { show it }

// Indian phone numbers: exactly 10 digits, no spaces/dashes/country code
// (kept simple on purpose — matches what your backend already expects as "phone")
export function validatePhone(phone) {
    if (!phone.trim()) return 'Phone number is required'
    if (!/^[0-9]{10}$/.test(phone)) return 'Enter a valid 10-digit phone number'
    return ''
  }
  
  // password just needs a sane minimum length — not a full "strength" checker,
  // keeping this simple matches your MVP's own philosophy
  export function validatePassword(password) {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return ''
  }
  
  // name just needs to not be empty/whitespace-only
  export function validateName(name) {
    if (!name.trim()) return 'Name is required'
    return ''
  }
  
  // simple email check — used only by AdminLoginForm, which is email-based, not phone-based
  export function validateEmail(email) {
    if (!email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address'
    return ''
  }