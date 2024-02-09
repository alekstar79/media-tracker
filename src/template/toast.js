/**
 * @function
 * @param {string} text
 * @param {string} icon
 * @returns {string}
 */
export function html(text, icon)
{
  return `
    <div class="column">
      <i class="fa-solid ${icon}"></i>
      <span>${text}</span>
    </div>
    <i class="icon fa-solid fa-xmark"></i>
  `
}
