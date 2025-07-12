/**
 * Utility functions for performance optimization
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to invoke the function immediately
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle invocations to
 * @returns {Function} - The throttled function
 */
export const throttle = (func, wait = 300) => {
  let inThrottle;
  let lastFunc;
  let lastTime;
  
  return function() {
    const context = this;
    const args = arguments;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      
      lastFunc = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          func.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

/**
 * Measures the execution time of a function
 * 
 * @param {Function} fn - The function to measure
 * @param {string} name - The name of the function (for logging)
 * @returns {Function} - The wrapped function
 */
export const measurePerformance = (fn, name = 'Function') => {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(`${name} execution time: ${end - start} ms`);
    return result;
  };
};