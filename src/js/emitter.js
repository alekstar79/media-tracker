/**
 * @class
 * @name Emitter
 * @property {Object} events
 */
export class Emitter
{
  /**
   * @constructor
   * @param {Object=} events
   */
  constructor(events = {})
  {
    this.events = events
  }

  /**
   * @method
   * @name Emitter#on
   * @param {string} id
   * @param {(function(): void)} fn
   * @returns {(function(): void)}
   */
  on(id, fn)
  {
    (this.events[id] ||= []).push(fn)

    return () => {
      this.off(id, fn)
    }
  }

  /**
   * @method
   * @name Emitter#off
   * @param {string} id
   * @param {(function(): void)} fn
   */
  off(id, fn)
  {
    if (typeof this.events[id] === 'undefined') return

    const idx = this.events[id].indexOf(fn)

    if (idx > -1) {
      this.events[id].splice(idx, 1)
    }
  }

  /**
   * @method
   * @name Emitter#emit
   * @param {string} id
   * @param {any} data
   */
  emit(id, ...data)
  {
    (this.events[id] || []).forEach(
      fn => fn.apply(this, data)
    )
  }
}
