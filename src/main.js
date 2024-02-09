import { W320, W480, W640, W768, W991, W1024, W1200, W1280, W1728, W1920, W1980 } from './js/constants.js'
import { maxmin, max, min } from './js/utils.js'

import { Notifications } from './js/notifications.js'
import { MediaTracker } from './js/media-tracker.js'
import { Emitter } from './js/emitter.js'

window.addEventListener('DOMContentLoaded', function() /* bounded scope */ {
  const notif = new Notifications(document.querySelector('.notifications'))
  const emitter = new Emitter()

  emitter.on('match:media', ({ maxWidth, minWidth, width }) => {
    switch (true) {
      case [maxWidth, minWidth].includes(undefined):
        notif.createToast(`width: ${width}px`, 'info')
        break

      case width < W320:
      case maxWidth === W320:
        notif.createToast(max(W320), 'info')
        break
      case width < W480 && width >= W320:
      case maxWidth === W480 && minWidth === W320:
        notif.createToast(maxmin(W480, W320), 'info')
        break
      case width < W640 && width >= W480:
      case maxWidth === W640 && minWidth === W480:
        notif.createToast(maxmin(W640, W480), 'info')
        break
      case width < W768 && width >= W640:
      case maxWidth === W768 && minWidth === W640:
        notif.createToast(maxmin(W768, W640), 'info')
        break
      case width < W991 && width >= W768:
      case maxWidth === W991 && minWidth === W768:
        notif.createToast(maxmin(W991, W768), 'info')
        break
      case width < W1024 && width >= W991:
      case maxWidth === W1024 && minWidth === W991:
        notif.createToast(maxmin(W1024, W991), 'info')
        break
      case width < W1200 && width >= W1024:
      case maxWidth === W1200 && minWidth === W1024:
        notif.createToast(maxmin(W1200, W1024), 'info')
        break
      case width < W1280 && width >= W1200:
      case maxWidth === W1280 && minWidth === W1200:
        notif.createToast(maxmin(W1280, W1200), 'info')
        break
      case width < W1728 && width >= W1280:
      case maxWidth === W1728 && minWidth === W1280:
        notif.createToast(maxmin(W1728, W1280), 'info')
        break
      case width < W1980 && width >= W1728:
      case maxWidth === W1980 && minWidth === W1728:
        notif.createToast(maxmin(W1980, W1728), 'info')
        break
      case width >= W1980:
      case minWidth === W1980:
        notif.createToast(min(W1980), 'info')
        break
    }
  })

  new MediaTracker([W320, W480, W640, W768, W991, W1024, W1200, W1280, W1728, W1920, W1980])
    .setHandler(screen => { emitter.emit('match:media', screen) })
    .onTrack()

})
