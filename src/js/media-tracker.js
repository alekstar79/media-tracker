/**
 * @class
 * @name MediaTracker
 * @property {Array<{max: MediaQueryList, min: MediaQueryList}>} matches
 * @property {number[]} widths
 */
export class MediaTracker
{
  static comparator = (a, b) => (a < b ? -1 : (a > b ? 1 : 0))

  /**
   * @constructor
   * @param {Number[]} widths
   */
  constructor(widths)
  {
    this.setWidths(widths)

    this.matches = this.widths.map(width => ({
      max: window.matchMedia(`(max-width: ${width}px)`),
      min: window.matchMedia(`(min-width: ${width}px)`)
    }))
  }

  /**
   * @method
   * @name MediaTracker#setWidths
   * @param {Number[]} widths
   */
  setWidths(widths)
  {
    this.widths = [...new Set(widths)].sort((a, b) => a - b)

    this.widths.push(Number.MAX_VALUE)
    this.widths.unshift(0)
  }

  /**
   * @method
   * @name MediaTracker#onTrack
   * @returns {MediaTracker}
   */
  onTrack()
  {
    this.matches.forEach(({ max, min }) => {
      max.addEventListener('change', e => e.matches && this.updateWrapper())
      min.addEventListener('change', e => e.matches && this.updateWrapper())
    })

    this.handler(this.nearestWidths())

    return this
  }

  /**
   * @method
   * @name MediaTracker#nearestWidths
   * @returns {{minWidth: number?, maxWidth: number?, width: number}}
   */
  nearestWidths()
  {
    const width = window.innerWidth

    let h = this.widths.length - 1,
      l = 0,
      m, comparison

    while (l <= h) {
      m = (l + h) >>> 1

      comparison = MediaTracker.comparator(this.widths[m], width)

      if (comparison < 0) {
        l = m + 1
      } else if (comparison > 0) {
        h = m - 1
      } else {
        return {
          width: this.widths[m]
        }
      }
    }

    return {
      maxWidth: this.widths[l],
      minWidth: this.widths[h],
      width
    }
  }

  /**
   * @method
   * @name MediaTracker#updateWrapper
   * @param {number} ms
   * @returns {Promise<void>}
   */
  async updateWrapper(ms = 250)
  {
    await new Promise(resolve => setTimeout(resolve, ms))

    this.handler(this.nearestWidths())
  }

  /**
   * @method
   * @name MediaTracker#setHandler
   * @param {(function(): void)?} handler
   * @return MediaTracker
   */
  setHandler(handler)
  {
    if (typeof handler === 'function') {
      this.handler = handler
    }

    return this
  }

  /**
   * @method
   * @name MediaTracker#handler
   * @param {Object} param
   * @returns void
   */
  handler(param)
  {
  }
}
