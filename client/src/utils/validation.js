/**
 * Utility functions for form validation
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password meets minimum requirements
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with success flag and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (!hasUpperCase) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  if (!hasLowerCase) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  if (!hasNumbers) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

/**
 * Validates a name field
 * @param {string} name - The name to validate
 * @returns {Object} - Validation result with success flag and message
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Name is required'
    };
  }
  
  if (name.length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters long'
    };
  }
  
  return {
    isValid: true,
    message: 'Name is valid'
  };
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {Object} - Validation result with success flag and message
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      message: 'Phone number is required'
    };
  }
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      message: 'Please enter a valid phone number (10-15 digits)'
    };
  }
  
  return {
    isValid: true,
    message: 'Phone number is valid'
  };
};

/**
 * Validates a form object with custom validation rules
 * @param {Object} formData - The form data to validate
 * @param {Object} validationRules - Rules for validation
 * @returns {Object} - Validation errors object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    // Required check
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      return;
    }
    
    // Min length check
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters long`;
      return;
    }
    
    // Max length check
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${field} must be less than ${rules.maxLength} characters long`;
      return;
    }
    
    // Pattern check
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || `${field} is invalid`;
      return;
    }
    
    // Custom validation
    if (rules.validate && typeof rules.validate === 'function') {
      const validationResult = rules.validate(value, formData);
      if (validationResult !== true) {
        errors[field] = validationResult;
        return;
      }
    }
  });
  
  return errors;
};