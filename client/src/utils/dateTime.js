/**
 * Utility functions for date and time formatting
 */

/**
 * Formats a date string to a human-readable format
 * @param {string|Date} dateString - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

/**
 * Formats a time string to a human-readable format
 * @param {string|Date} timeString - The time to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted time string
 */
export const formatTime = (timeString, options = {}) => {
  try {
    const date = new Date(timeString);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid time:', timeString);
      return 'Invalid time';
    }
    
    const defaultOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Time error';
  }
};

/**
 * Formats a date and time string to a human-readable format
 * @param {string|Date} dateTimeString - The date and time to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateTimeString, options = {}) => {
  try {
    const date = new Date(dateTimeString);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date and time:', dateTimeString);
      return 'Invalid date and time';
    }
    
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date and time:', error);
    return 'Date and time error';
  }
};

/**
 * Gets a relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} dateString - The date to format
 * @returns {string} - Relative time string
 */
export const getRelativeTimeString = (dateString) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date for relative time:', dateString);
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((date - now) / 1000);
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    
    if (Math.abs(diffInSeconds) < 60) {
      return formatter.format(Math.round(diffInSeconds), 'second');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return formatter.format(diffInMinutes, 'minute');
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return formatter.format(diffInHours, 'hour');
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return formatter.format(diffInDays, 'day');
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return formatter.format(diffInMonths, 'month');
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return formatter.format(diffInYears, 'year');
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Time error';
  }
};

/**
 * Checks if a date is in the past
 * @param {string|Date} dateString - The date to check
 * @returns {boolean} - Whether the date is in the past
 */
export const isDateInPast = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    return date < now;
  } catch (error) {
    console.error('Error checking if date is in past:', error);
    return false;
  }
};

/**
 * Calculates the duration between two dates
 * @param {string|Date} startDate - The start date
 * @param {string|Date} endDate - The end date
 * @returns {Object} - Duration object with days, hours, minutes, seconds
 */
export const calculateDuration = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('Invalid dates for duration calculation:', { startDate, endDate });
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const durationMs = Math.abs(end - start);
    const seconds = Math.floor(durationMs / 1000) % 60;
    const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
    const hours = Math.floor(durationMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    
    return { days, hours, minutes, seconds };
  } catch (error) {
    console.error('Error calculating duration:', error);
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
};