/**
 * Utility functions for error handling
 */

/**
 * Checks if an error is a network/connection error
 * This typically occurs when fetch fails to execute (no internet, server down, etc.)
 * 
 * @param {Error} error - The error object to check
 * @returns {boolean} True if this is a network error, false otherwise
 */
export const isNetworkError = (error) => {
  return error.name === 'TypeError' && 
         error.message.toLowerCase().includes('failed to fetch');
};

