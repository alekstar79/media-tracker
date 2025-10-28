/**
 * Format max-min width message for display
 * @function
 * @name maxmin
 * @param {number} max - Maximum width breakpoint
 * @param {number} min - Minimum width breakpoint
 * @param {number} width - Current viewport width
 * @returns {string} Formatted message string
 */
export const maxmin = (max: number, min: number, width: number): string =>
  `max-width: ${max}px, min-width: ${min}px, width: ${width}px`

/**
 * Format maximum width message for display
 * @function
 * @name max
 * @param {number} max - Maximum width breakpoint
 * @param {number} width - Current viewport width
 * @returns {string} Formatted message string
 */
export const max = (max: number, width: number): string =>
  `max-width: ${max}px, width: ${width}px`

/**
 * Format minimum width message for display
 * @function
 * @name min
 * @param {number} min - Minimum width breakpoint
 * @param {number} width - Current viewport width
 * @returns {string} Formatted message string
 */
export const min = (min: number, width: number): string =>
  `min-width: ${min}px, width: ${width}px`
