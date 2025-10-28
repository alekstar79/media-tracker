import { Notifications } from './notifications'
import { maxmin, min } from './utils'

import {
  W0,
  W240,
  W320,
  W480,
  W640,
  W768,
  W991,
  W1024,
  W1200,
  W1280,
  W1728,
  W1920,
  W1980,
  W3840,
  W4096,
} from '@/lib/constants'

// Initialize notifications system
const notif = new Notifications(document.querySelector('.notifications')!)

/**
 * Media state structure for handler processing
 * @interface MediaHandlerState
 */
interface MediaHandlerState {
  maxWidth?: number
  minWidth?: number
  width?: number
}

/**
 * Processes media state changes and displays appropriate notifications
 * @function
 * @name mediaHandler
 * @param {MediaHandlerState} state - Current media state from MediaTracker
 */
export const mediaHandler = ({ maxWidth, minWidth, width }: MediaHandlerState): void => {
  // Handle edge case where only width is available
  if ([maxWidth, minWidth].includes(undefined)) {
    if (width !== undefined) {
      notif.createToast(`width: ${width}px`, 'info')
    }

    return
  }

  // Process all breakpoint ranges with exact matches
  switch (true) {
    case width! < W240 && width! >= W0:
    case maxWidth === W240 && minWidth === W0:
      notif.createToast(maxmin(W240, W0, width!), 'info')
      break;
    case width! < W320 && width! >= W240:
    case maxWidth === W320 && minWidth === W240:
      notif.createToast(maxmin(W320, W240, width!), 'info')
      break;
    case width! < W480 && width! >= W320:
    case maxWidth === W480 && minWidth === W320:
      notif.createToast(maxmin(W480, W320, width!), 'info')
      break;
    case width! < W640 && width! >= W480:
    case maxWidth === W640 && minWidth === W480:
      notif.createToast(maxmin(W640, W480, width!), 'info')
      break;
    case width! < W768 && width! >= W640:
    case maxWidth === W768 && minWidth === W640:
      notif.createToast(maxmin(W768, W640, width!), 'info')
      break;
    case width! < W991 && width! >= W768:
    case maxWidth === W991 && minWidth === W768:
      notif.createToast(maxmin(W991, W768, width!), 'info')
      break;
    case width! < W1024 && width! >= W991:
    case maxWidth === W1024 && minWidth === W991:
      notif.createToast(maxmin(W1024, W991, width!), 'info')
      break;
    case width! < W1200 && width! >= W1024:
    case maxWidth === W1200 && minWidth === W1024:
      notif.createToast(maxmin(W1200, W1024, width!), 'info')
      break;
    case width! < W1280 && width! >= W1200:
    case maxWidth === W1280 && minWidth === W1200:
      notif.createToast(maxmin(W1280, W1200, width!), 'info')
      break;
    case width! < W1728 && width! >= W1280:
    case maxWidth === W1728 && minWidth === W1280:
      notif.createToast(maxmin(W1728, W1280, width!), 'info')
      break;
    case width! < W1920 && width! >= W1728:
    case maxWidth === W1920 && minWidth === W1728:
      notif.createToast(maxmin(W1920, W1728, width!), 'info')
      break;
    case width! < W1980 && width! >= W1920:
    case maxWidth === W1980 && minWidth === W1920:
      notif.createToast(maxmin(W1980, W1920, width!), 'info')
      break;
    case width! < W3840 && width! >= W1980:
    case maxWidth === W3840 && minWidth === W1980:
      notif.createToast(maxmin(W3840, W1980, width!), 'info')
      break;
    case width! < W4096 && width! >= W3840:
    case maxWidth === W4096 && minWidth === W3840:
      notif.createToast(maxmin(W4096, W3840, width!), 'info')
      break;
    case width! >= W4096:
    case minWidth === W4096:
      notif.createToast(min(W4096, width!), 'info')
      break;
  }
}
