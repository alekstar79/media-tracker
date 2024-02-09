import { html } from '../template/toast.js'

/**
 * @class
 * @name Notifications
 * @property {HTMLElement} container
 * @property {Object} toastDetails
 */
export class Notifications
{
  /**
   * @constructor
   * @param {HTMLElement} container
   */
  constructor(container)
  {
    this.container = container

    this.toastDetails = {
      timer: 4000,

      success: {
        icon: 'fa-circle-check'
      },
      info: {
        icon: 'fa-circle-info'
      },
      warning: {
        icon: 'fa-triangle-exclamation'
      },
      error: {
        icon: 'fa-circle-xmark'
      }
    }
  }

  /**
   * @method
   * @name Notifications#createToast
   * @param {String} text
   * @param {String} id
   */
  createToast(text, id)
  {
    const { [id]: { icon }, timer } = this.toastDetails
    const toast = document.createElement('li')
    const remove = this.removeToast.bind(this, toast)

    toast.innerHTML = html(text, icon)
    toast.classList.add('toast', id)

    toast.timeoutId = setTimeout(remove, timer)
    toast.querySelector('i.icon')
      .addEventListener('click', remove)

    this.container.appendChild(toast)
  }

  /**
   * @method
   * @name Notifications#removeToast
   * @param {HTMLElement} toast
   */
  removeToast(toast)
  {
    toast.classList.add('hide')
    toast.timeoutId && clearTimeout(toast.timeoutId)
    toast.remove()
  }
}
