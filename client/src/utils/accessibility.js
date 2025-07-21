/**
 * Utility functions for accessibility improvements
 */

/**
 * Adds appropriate ARIA attributes to a form field
 * @param {string} id - The field ID
 * @param {string} label - The field label
 * @param {boolean} isRequired - Whether the field is required
 * @param {string} errorMessage - Error message if validation fails
 * @returns {Object} - ARIA attributes to spread onto the input
 */
export const getAriaAttributes = (id, label, isRequired = false, errorMessage = '') => {
  const baseAttributes = {
    'id': id,
    'aria-label': label,
    'aria-required': isRequired,
  };
  
  if (errorMessage) {
    return {
      ...baseAttributes,
      'aria-invalid': true,
      'aria-describedby': `${id}-error`,
    };
  }
  
  return baseAttributes;
};

/**
 * Creates an accessible error message ID for a form field
 * @param {string} id - The field ID
 * @returns {string} - The error message ID
 */
export const getErrorMessageId = (id) => `${id}-error`;

/**
 * Enhances a button with proper accessibility attributes
 * @param {Object} props - Button properties
 * @returns {Object} - Enhanced button properties with accessibility attributes
 */
export const getAccessibleButtonProps = (props) => {
  const { onClick, disabled, label, icon, ...rest } = props;
  
  return {
    onClick,
    disabled,
    'aria-label': label,
    'aria-disabled': disabled,
    role: 'button',
    tabIndex: disabled ? -1 : 0,
    ...rest,
  };
};

/**
 * Creates keyboard navigation handlers for custom components
 * @param {Function} onEnter - Handler for Enter key
 * @param {Function} onSpace - Handler for Space key
 * @param {Function} onEscape - Handler for Escape key
 * @param {Function} onArrowUp - Handler for Arrow Up key
 * @param {Function} onArrowDown - Handler for Arrow Down key
 * @param {Function} onArrowLeft - Handler for Arrow Left key
 * @param {Function} onArrowRight - Handler for Arrow Right key
 * @returns {Function} - Keyboard event handler
 */
export const createKeyboardHandler = ({
  onEnter,
  onSpace,
  onEscape,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
}) => {
  return (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter(event);
        }
        break;
      case ' ':
        if (onSpace) {
          event.preventDefault();
          onSpace(event);
        }
        break;
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft(event);
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight(event);
        }
        break;
      default:
        break;
    }
  };
};

/**
 * Creates an accessible announcement for screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - The politeness level ('polite' or 'assertive')
 */
export const announceToScreenReader = (message, politeness = 'polite') => {
  // Create or find the live region element
  let liveRegion = document.getElementById(`sr-${politeness}`);
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = `sr-${politeness}`;
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.margin = '-1px';
    liveRegion.style.padding = '0';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clipPath = 'inset(100%)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
  }
  
  // Update the content to trigger the announcement
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
};