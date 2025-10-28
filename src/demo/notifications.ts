/**
 * Toast type variants for different notification styles
 */
type ToastType = 'info' | 'success' | 'warning' | 'error'

/**
 * Configuration for individual toast type
 * @interface ToastConfig
 */
interface ToastConfig {
  /** FontAwesome icon class name */
  icon: string
}

/**
 * Complete toast configuration details
 * @interface ToastDetails
 */
interface ToastDetails {
  /** Auto-dismiss timer in milliseconds */
  timer: number
  /** Info toast configuration */
  info: ToastConfig
  /** Success toast configuration */
  success: ToastConfig
  /** Warning toast configuration */
  warning: ToastConfig
  /** Error toast configuration */
  error: ToastConfig
}

/**
 * Toast notification management system for demo application
 * @class
 * @name Notifications
 */
export class Notifications
{
  /**
   * Container element for all toast notifications
   * @type {HTMLElement}
   */
  public container: HTMLElement

  /**
   * Configuration details for all toast types
   * @type {ToastDetails}
   */
  public toastDetails: ToastDetails

  /**
   * Creates a Notifications instance for managing toast displays
   * @constructor
   * @param {HTMLElement} container - DOM element to contain toast notifications
   */
  constructor(container: HTMLElement)
  {
    this.container = container

    this.toastDetails = {
      timer: 4000,
      info: { icon: 'fa-circle-info' },
      success: { icon: 'fa-circle-check' },
      warning: { icon: 'fa-triangle-exclamation' },
      error: { icon: 'fa-circle-xmark' }
    }
  }

  /**
   * Creates and displays a new toast notification
   * @method
   * @name Notifications#createToast
   * @param {string} text - Message text to display in toast
   * @param {ToastType} id - Type of toast (affects styling and icon)
   */
  createToast(text: string, id: ToastType): void
  {
    const { [id]: { icon }, timer } = this.toastDetails
    const toast = document.createElement('li')
    const remove = this.removeToast.bind(this, toast)

    // Set toast content and attributes
    import('./toast.js').then(({ html }) => {
      toast.innerHTML = html(text, icon)
      toast.classList.add('toast', id);

      // Set auto-remove timer
      (toast as any).timeoutId = setTimeout(remove, timer)

      // Add click handler for manual dismiss
      toast.querySelector('i.icon')!.addEventListener('click', remove)

      // Add to container
      this.container.appendChild(toast)
    })
  }

  /**
   * Removes a toast notification with animation
   * @method
   * @name Notifications#removeToast
   * @param {HTMLLIElement} toast - Toast element to remove
   */
  removeToast(toast: HTMLLIElement): void
  {
    // Trigger hide animation
    toast.classList.add('hide')

    // Clear auto-dismiss timer
    clearTimeout((toast as any).timeoutId)

    // Remove after animation completes
    const handleTransitionEnd = () => {
      toast.remove()
      toast.removeEventListener('transitionend', handleTransitionEnd)
    }

    toast.addEventListener('transitionend', handleTransitionEnd)

    // Fallback removal if transitionend doesn't fire
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove()
      }
    }, 300)
  }
}
