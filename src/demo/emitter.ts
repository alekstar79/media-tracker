/**
 * @interface EventHandler
 * @callback
 * @param {...any} args
 */
interface EventHandler {
  (...args: any[]): void
}

/**
 * High-performance event system for demo application
 * @class
 * @name Emitter
 */
export class Emitter
{
  /**
   * Map of events and their handlers
   * @type {Object.<string, EventHandler[]>}
   * @private
   */
  private events: Record<string, EventHandler[]> = {}

  /**
   * Registry for once event handlers
   * @type {WeakMap<Function, EventHandler>}
   * @private
   */
  private _onceRegistry: WeakMap<Function, EventHandler> = new WeakMap<Function, EventHandler>()

  /**
   * Creates an instance of Emitter for demo application
   * @constructor
   * @param {Object.<string, Function[]>} [events={}] - Predefined events
   */
  constructor(events: Record<string, EventHandler[]> = {})
  {
    this.events = events
  }

  /**
   * Subscribe handler to event
   * @method
   * @name Emitter#on
   * @param {string} id - Event identifier
   * @param {EventHandler} fn - Handler function
   * @returns {(function(): void)} Unsubscribe function
   */
  on(id: string, fn: EventHandler): () => void
  {
    if (typeof fn !== 'function') {
      throw new TypeError('The handler must be a function')
    }

    const handlers = this.events[id] ?? (this.events[id] = [])
    handlers.push(fn)

    // Return unsubscribe function
    return () => this.off(id, fn)
  }

  /**
   * Subscribe one-time handler to event
   * @method
   * @name Emitter#once
   * @param {string} id - Event identifier
   * @param {EventHandler} fn - Handler function
   * @returns {(function(): void)} Unsubscribe function
   */
  once(id: string, fn: EventHandler): () => void
  {
    if (typeof fn !== 'function') {
      throw new TypeError('The handler must be a function')
    }

    const onceWrapper = (...args: any[]) => {
      this.off(id, onceWrapper)
      return fn.apply(this, args)
    }

    // Mark wrapper as once handler for correct removal
    this._onceRegistry.set(onceWrapper, fn)

    return this.on(id, onceWrapper)
  }

  /**
   * Unsubscribe handler from event
   * @method
   * @name Emitter#off
   * @param {string} id - Event identifier
   * @param {EventHandler} fn - Handler function
   */
  off(id: string, fn: EventHandler): void
  {
    const handlers = this.events[id]

    if (!handlers || handlers.length === 0) return

    // Check if this is a once handler
    const originalFn = this._onceRegistry.get(fn) || fn
    let foundIndex = -1

    // Optimized search from end of array
    for (let i = handlers.length - 1; i >= 0; i--) {
      const handler = handlers[i]
      const handlerOriginal = this._onceRegistry.get(handler) || handler

      if (handlerOriginal === originalFn) {
        foundIndex = i
        break
      }
    }

    if (foundIndex > -1) {
      const removedHandler = handlers[foundIndex]
      handlers.splice(foundIndex, 1)

      // Clean up once handler registry
      if (this._onceRegistry.has(removedHandler)) {
        this._onceRegistry.delete(removedHandler)
      }
    }

    // Clean up empty handler arrays
    if (handlers.length === 0) {
      Reflect.deleteProperty(this.events, id)
    }
  }

  /**
   * Emit event with provided data
   * @method
   * @name Emitter#emit
   * @param {string} id - Event identifier
   * @param {...any} data - Data to pass to handlers
   * @returns {boolean} Whether handlers were called
   */
  emit(id: string, ...data: any[]): boolean
  {
    const handlers = this.events[id]

    if (!handlers || handlers.length === 0) return false

    // Create copy of array for safe iteration
    const handlersCopy = handlers.slice()
    let hasListeners = false

    for (let i = 0; i < handlersCopy.length; i++) {
      const handler = handlersCopy[i]

      // Check if handler still exists in original array
      if (handlers.includes(handler)) {
        try {
          handler.apply(this, data)
          hasListeners = true
        } catch (error) {
          console.error(`Error in event handler "${id}":`, error)
        }
      }
    }

    return hasListeners
  }

  /**
   * Get count of handlers for event
   * @method
   * @name Emitter#listenerCount
   * @param {string} id - Event identifier
   * @returns {number}
   */
  listenerCount(id: string): number
  {
    const handlers = this.events[id]

    return handlers ? handlers.length : 0
  }

  /**
   * Remove all handlers for event
   * @method
   * @name Emitter#removeAllListeners
   * @param {string} [id] - Event identifier (if not provided - clears all)
   */
  removeAllListeners(id?: string): void
  {
    if (id === undefined) {
      // Clear entire once handler registry
      this._onceRegistry = new WeakMap()

      // Clear all events
      for (const eventName of Object.keys(this.events)) {
        Reflect.deleteProperty(this.events, eventName)
      }
    } else if (Reflect.has(this.events, id)) {
      // Clear once handlers for specific event
      const handlers = this.events[id]

      if (handlers) {
        handlers.forEach(handler => {
          if (this._onceRegistry.has(handler)) {
            this._onceRegistry.delete(handler)
          }
        })
      }

      Reflect.deleteProperty(this.events, id)
    }
  }

  /**
   * Get array of event names with subscriptions
   * @method
   * @name Emitter#eventNames
   * @returns {string[]}
   */
  eventNames(): string[]
  {
    return Reflect.ownKeys(this.events) as string[]
  }

  /**
   * Check if event exists with handlers
   * @method
   * @name Emitter#hasListeners
   * @param {string} id - Event identifier
   * @returns {boolean}
   */
  hasListeners(id: string): boolean
  {
    return Reflect.has(this.events, id) && this.events[id].length > 0
  }
}
