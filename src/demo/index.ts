import { W0, W240, W320, W480, W640, W768, W991, W1024, W1200, W1280, W1728, W1920, W1980, W3840, W4096 } from '@/lib'
import { MediaTracker } from '@/lib'

import { mediaHandler } from './media-handler.ts'
import { Emitter } from './emitter.ts'

/**
 * Demo application initialization function
 * @function start
 */
function start(): void
{
  // Create event emitter for demo application
  const emitter = new Emitter()

  // Subscribe to media match events
  emitter.on('match:media', mediaHandler)

  // Initialize media tracker with all breakpoints
  MediaTracker.create(
    [W0, W240, W320, W480, W640, W768, W991, W1024, W1200, W1280, W1728, W1920, W1980, W3840, W4096],
    (state) => {
      emitter.emit('match:media', state)
    }
  )

  // Set up resize observer for debugging
  const target = document.querySelector('.resize-me')
  const observer = new ResizeObserver(entries => {
    entries.forEach(entry => {
      console.log({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height)
      })
    })
  })

  // Start observing if target exists
  if (target) {
    observer.observe(target)
  }
}

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', start)
} else {
  start()
}
