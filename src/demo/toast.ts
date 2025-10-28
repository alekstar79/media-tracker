/**
 * Generate HTML markup for toast notification
 * @function
 * @name html
 * @param {string} text - Toast message text content
 * @param {string} icon - FontAwesome icon class name
 * @returns {string} HTML string for toast element
 */
export function html(text: string, icon: string): string
{
  return `
    <div class="column">
      <i class="fa-solid ${icon}"></i>
      <span>${text}</span>
    </div>
    <i class="icon fa-solid fa-xmark"></i>
  `;
}
