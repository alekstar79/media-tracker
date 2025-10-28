/**
 * Media state interface containing width information
 * @interface MediaState
 */
export interface MediaState {
  /** Current viewport width */
  width?: number
  /** Maximum breakpoint width for current range */
  maxWidth?: number
  /** Minimum breakpoint width for current range */
  minWidth?: number
}

/**
 * Media query match pair interface
 * @interface MediaMatch
 */
interface MediaMatch {
  /** MediaQueryList for max-width */
  max: MediaQueryList
  /** MediaQueryList for min-width */
  min: MediaQueryList
}

/**
 * Handler function type for media state changes
 * @callback MediaTracker._handler
 * @param {MediaState} state - Current media state
 * @returns {void}
 */

/**
 * Media query tracker for responsive design breakpoints
 * @class
 * @name MediaTracker
 */
export class MediaTracker
{
  /**
   * Array of width breakpoints to track
   * @type {number[]}
   */
  public widths: number[] = []

  /**
   * Media query list matches for each breakpoint
   * @type {MediaMatch[]}
   */
  public matches: MediaMatch[] = []

  /**
   * Debounce time in milliseconds for resize events
   * @type {number}
   */
  public debounceTime: number = 100

  /**
   * Current handler function for media state changes
   * @type {MediaTracker._handler}
   * @private
   */
  private _handler: (state: MediaState) => void = () => {}

  /**
   * Debounce timer reference
   * @type {number | null}
   * @private
   */
  private _debounceTimer: number | null = null

  /**
   * Numeric comparator for sorting and binary search
   * @static
   * @method
   * @name MediaTracker.comparator
   * @param {number} a - First number to compare
   * @param {number} b - Second number to compare
   * @returns {number} Comparison result (-1, 0, 1)
   */
  static comparator = (a: number, b: number): number => (a < b ? -1 : (a > b ? 1 : 0))

  /**
   * Factory method to create and initialize MediaTracker instance
   * @static
   * @method
   * @name MediaTracker.create
   * @param {number[]} widths - Array of width breakpoints to track
   * @param {MediaTracker._handler} handler - Callback function for media changes
   * @param {number} [debounceTime=100] - Debounce time in milliseconds for resize events
   * @returns {MediaTracker} Initialized MediaTracker instance
   * @throws {Error} When widths array is empty or invalid
   */
  static create = (widths: number[], handler: (state: MediaState) => void, debounceTime: number = 100): MediaTracker => {
    const tracker = new MediaTracker(widths, debounceTime)
    tracker.setHandler(handler)
    return tracker.onTrack()
  }

  /**
   * Creates a MediaTracker instance
   * @constructor
   * @param {number[]} widths - Array of width breakpoints to track
   * @param {number} [debounceTime=100] - Debounce time in milliseconds for resize events
   */
  constructor(widths: number[], debounceTime: number = 100)
  {
    this.debounceTime = debounceTime
    this.setWidths(widths)
    this.onResize = this.onResize.bind(this)

    // Create media query lists for all breakpoints
    this.matches = this.widths.map(width => ({
      max: window.matchMedia(`(max-width: ${width}px)`),
      min: window.matchMedia(`(min-width: ${width}px)`),
    }))
  }

  /**
   * Sets the width breakpoints and sorts them
   * @method
   * @name MediaTracker#setWidths
   * @param {number[]} widths - Array of width breakpoints
   * @returns {MediaTracker} Current instance for method chaining
   * @throws {Error} When widths array is empty or invalid
   */
  setWidths(widths: number[]): MediaTracker
  {
    if (!Array.isArray(widths) || widths.length === 0) {
      throw new Error('Breakpoints must be a non-empty array')
    }

    // Remove duplicates and sort in ascending order
    this.widths = [...new Set(widths)].sort((a, b) => a - b)

    return this
  }

  /**
   * Starts tracking media queries and window resize events
   * @method
   * @name MediaTracker#onTrack
   * @returns {MediaTracker} Current instance for method chaining
   */
  onTrack(): MediaTracker
  {
    // Add event listeners for media query changes
    this.matches.forEach(({ max, min }) => {
      max.addEventListener('change', e => e.matches && this.updateWrapper())
      min.addEventListener('change', e => e.matches && this.updateWrapper())
    })

    // Add resize event listener with debouncing
    window.addEventListener('resize', this.onResize)

    // Trigger initial state
    this._handler(this.nearestWidths())

    return this
  }

  /**
   * Window resize event handler with debouncing
   * @method
   * @name MediaTracker#onResize
   * @private
   */
  private onResize(): void
  {
    this.debouncedUpdate()
  }

  /**
   * Debounced update to prevent excessive handler calls during resize
   * @method
   * @name MediaTracker#debouncedUpdate
   * @param {number} [ms] - Optional custom debounce time
   * @private
   */
  private debouncedUpdate(ms?: number): void
  {
    const delay = ms !== undefined ? ms : this.debounceTime

    // Clear existing timer
    if (this._debounceTimer !== null) {
      clearTimeout(this._debounceTimer)
    }

    // Set new timer
    this._debounceTimer = window.setTimeout(() => {
      try {
        this._handler(this.nearestWidths())
      } catch (error) {
        console.error('Error in MediaTracker handler:', error)
      }
    }, delay)
  }

  /**
   * Calculates the nearest breakpoints based on current viewport width
   * @method
   * @name MediaTracker#nearestWidths
   * @returns {MediaState} Object containing current width and nearest breakpoints
   */
  nearestWidths(): MediaState
  {
    const width = window.innerWidth

    // Binary search to find the closest breakpoints
    let high = this.widths.length - 1
    let low = 0
    let mid: number
    let comparison: number

    while (low <= high) {
      mid = (low + high) >>> 1
      comparison = MediaTracker.comparator(this.widths[mid], width)

      if (comparison < 0) {
        low = mid + 1
      } else if (comparison > 0) {
        high = mid - 1
      } else {
        // Exact match found
        return {
          width: this.widths[mid]
        }
      }
    }

    // No exact match, return range
    return {
      maxWidth: this.widths[low],   // Next larger breakpoint
      minWidth: this.widths[high],  // Next smaller breakpoint
      width                         // Actual current width
    }
  }

  /**
   * Wrapper for updates using requestAnimationFrame for performance
   * @method
   * @name MediaTracker#updateWrapper
   * @returns {MediaTracker} Current instance for method chaining
   */
  updateWrapper(): MediaTracker
  {
    requestAnimationFrame(() => this._handler(this.nearestWidths()))

    return this
  }

  /**
   * Sets the handler function for media state changes
   * @method
   * @name MediaTracker#setHandler
   * @param {MediaTracker._handler} handler - Function to call on media changes
   * @returns {MediaTracker} Current instance for method chaining
   */
  setHandler(handler: (state: MediaState) => void): MediaTracker {
    if (typeof handler === 'function') {
      this._handler = handler
    }

    return this
  }
}
