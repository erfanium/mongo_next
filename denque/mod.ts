export class Denque<T = any> {
  #head = 0;
  #tail = 0;
  #capacity = undefined;
  #capacityMask = 0x3;
  #list = new Array<T | undefined>(4);

  constructor(array: T[] = []) {
    const options: any = {};

    this.#capacity = options.capacity;
    this._fromArray(array);
  }

  get length() {
    return this.size();
  }

  /**
   * Returns the item at the specified index from the list.
   * 0 is the first element, 1 is the second, and so on...
   * Elements at negative values are that many from the end: -1 is one before the end
   * (the last element), -2 is two before the end (one before last), etc.
   * @param index
   * @returns {*}
   */
  peekAt(index: number): T | undefined {
    let i = index;
    // expect a number or return undefined
    if (i !== (i | 0)) {
      return;
    }
    const len = this.size();
    if (i >= len || i < -len) return undefined;
    if (i < 0) i += len;
    i = (this.#head + i) & this.#capacityMask;
    return this.#list[i];
  }
  /**
   * Alias for peekAt()
   * @param i
   * @returns {*}
   */
  get(i: number): T | undefined {
    return this.peekAt(i);
  }

  peek(): T | undefined {
    if (this.#head === this.#tail) return undefined;
    return this.#list[this.#head];
  }
  /**
   * Alias for peek()
   * @returns {*}
   */
  peekFront(): T | undefined {
    return this.peek();
  }
  /**
   * Returns the item that is at the back of the queue without removing it.
   * Uses peekAt(-1)
   */
  peekBack() {
    return this.peekAt(-1);
  }
  /**
   * Return the number of items on the list, or 0 if empty.
   * @returns {number}
   */
  size() {
    if (this.#head === this.#tail) return 0;
    if (this.#head < this.#tail) return this.#tail - this.#head;
    else return this.#capacityMask + 1 - (this.#head - this.#tail);
  }
  /**
   * Add an item at the beginning of the list.
   */
  unshift(item: T): number {
    if (arguments.length === 0) return this.size();
    const len = this.#list.length;
    this.#head = (this.#head - 1 + len) & this.#capacityMask;
    this.#list[this.#head] = item;
    if (this.#tail === this.#head) this._growArray();
    if (this.#capacity && this.size() > this.#capacity) this.pop();
    if (this.#head < this.#tail) return this.#tail - this.#head;
    else return this.#capacityMask + 1 - (this.#head - this.#tail);
  }
  /**
   * Remove and return the first item on the list,
   * Returns undefined if the list is empty.
   * @returns {*}
   */
  shift() {
    const head = this.#head;
    if (head === this.#tail) return undefined;
    const item = this.#list[head];
    this.#list[head] = undefined;
    this.#head = (head + 1) & this.#capacityMask;
    if (
      head < 2 && this.#tail > 10000 && this.#tail <= this.#list.length >>> 2
    ) {
      this._shrinkArray();
    }
    return item;
  }
  /**
   * Add an item to the bottom of the list.
   */
  push(item: T) {
    if (arguments.length === 0) return this.size();
    const tail = this.#tail;
    this.#list[tail] = item;
    this.#tail = (tail + 1) & this.#capacityMask;
    if (this.#tail === this.#head) {
      this._growArray();
    }
    if (this.#capacity && this.size() > this.#capacity) {
      this.shift();
    }
    if (this.#head < this.#tail) return this.#tail - this.#head;
    else return this.#capacityMask + 1 - (this.#head - this.#tail);
  }
  /**
   * Remove and return the last item on the list.
   * Returns undefined if the list is empty.
   * @returns {*}
   */
  pop(): T | undefined {
    const tail = this.#tail;
    if (tail === this.#head) return undefined;
    const len = this.#list.length;
    this.#tail = (tail - 1 + len) & this.#capacityMask;
    const item = this.#list[this.#tail];
    this.#list[this.#tail] = undefined;
    if (this.#head < 2 && tail > 10000 && tail <= len >>> 2) {
      this._shrinkArray();
    }
    return item;
  }
  /**
   * Remove and return the item at the specified index from the list.
   * Returns undefined if the list is empty.
   */
  removeOne(index: number): T | undefined {
    let i = index;
    // expect a number or return undefined
    if (i !== (i | 0)) {
      return undefined;
    }
    if (this.#head === this.#tail) return;
    const size = this.size();
    const len = this.#list.length;
    if (i >= size || i < -size) return;
    if (i < 0) i += size;
    i = (this.#head + i) & this.#capacityMask;
    const item = this.#list[i];
    let k;
    if (index < size / 2) {
      for (k = index; k > 0; k--) {
        this.#list[i] = this.#list[i = (i - 1 + len) & this.#capacityMask];
      }
      this.#list[i] = undefined;
      this.#head = (this.#head + 1 + len) & this.#capacityMask;
    } else {
      for (k = size - 1 - index; k > 0; k--) {
        this.#list[i] = this.#list[i = (i + 1 + len) & this.#capacityMask];
      }
      this.#list[i] = undefined;
      this.#tail = (this.#tail - 1 + len) & this.#capacityMask;
    }
    return item;
  }
  /**
   * Remove number of items from the specified index from the list.
   * Returns array of removed items.
   * Returns undefined if the list is empty.
   */
  remove(index: number, count: number): T[] | undefined {
    let i = index;
    let removed: T[];
    let del_count = count;
    // expect a number or return undefined
    if (i !== (i | 0)) {
      return;
    }
    if (this.#head === this.#tail) return;
    const size = this.size();
    const len = this.#list.length;
    if (i >= size || i < -size || count < 1) return;
    if (i < 0) i += size;
    if (count === 1 || !count) {
      removed = [this.removeOne(i)!];
      return removed;
    }
    if (i === 0 && i + count >= size) {
      removed = this.toArray();
      this.clear();
      return removed;
    }
    if (i + count > size) count = size - i;
    let k;
    removed = new Array(count);
    for (k = 0; k < count; k++) {
      removed[k] = this.#list[(this.#head + i + k) & this.#capacityMask]!;
    }
    i = (this.#head + i) & this.#capacityMask;
    if (index + count === size) {
      this.#tail = (this.#tail - count + len) & this.#capacityMask;
      for (k = count; k > 0; k--) {
        this.#list[i = (i + 1 + len) & this.#capacityMask] = undefined;
      }
      return removed;
    }
    if (index === 0) {
      this.#head = (this.#head + count + len) & this.#capacityMask;
      for (k = count - 1; k > 0; k--) {
        this.#list[i = (i + 1 + len) & this.#capacityMask] = undefined;
      }
      return removed;
    }
    if (i < size / 2) {
      this.#head = (this.#head + index + count + len) & this.#capacityMask;
      for (k = index; k > 0; k--) {
        this.unshift(this.#list[i = (i - 1 + len) & this.#capacityMask]!);
      }
      i = (this.#head - 1 + len) & this.#capacityMask;
      while (del_count > 0) {
        this.#list[i = (i - 1 + len) & this.#capacityMask] = undefined;
        del_count--;
      }
      if (index < 0) this.#tail = i;
    } else {
      this.#tail = i;
      i = (i + count + len) & this.#capacityMask;
      for (k = size - (count + index); k > 0; k--) {
        this.push(this.#list[i++]!);
      }
      i = this.#tail;
      while (del_count > 0) {
        this.#list[i = (i + 1 + len) & this.#capacityMask] = undefined;
        del_count--;
      }
    }
    if (this.#head < 2 && this.#tail > 10000 && this.#tail <= len >>> 2) {
      this._shrinkArray();
    }
    return removed;
  }
  /**
   * Native splice implementation.
   * Remove number of items from the specified index from the list and/or add new elements.
   * Returns array of removed items or empty array if count == 0.
   * Returns undefined if the list is empty.
   */
  splice(index: number, count: number): T[] | undefined {
    let i = index;
    // expect a number or return undefined
    if (i !== (i | 0)) {
      return;
    }
    const size = this.size();
    if (i < 0) i += size;
    if (i > size) return;
    if (arguments.length > 2) {
      let k;
      let temp;
      let removed;
      let arg_len = arguments.length;
      const len = this.#list.length;
      let arguments_index = 2;
      if (!size || i < size / 2) {
        temp = new Array(i);
        for (k = 0; k < i; k++) {
          temp[k] = this.#list[(this.#head + k) & this.#capacityMask];
        }
        if (count === 0) {
          removed = [];
          if (i > 0) {
            this.#head = (this.#head + i + len) & this.#capacityMask;
          }
        } else {
          removed = this.remove(i, count);
          this.#head = (this.#head + i + len) & this.#capacityMask;
        }
        while (arg_len > arguments_index) {
          this.unshift(arguments[--arg_len]);
        }
        for (k = i; k > 0; k--) {
          this.unshift(temp[k - 1]);
        }
      } else {
        temp = new Array(size - (i + count));
        const leng = temp.length;
        for (k = 0; k < leng; k++) {
          temp[k] =
            this.#list[(this.#head + i + count + k) & this.#capacityMask];
        }
        if (count === 0) {
          removed = [];
          if (i != size) {
            this.#tail = (this.#head + i + len) & this.#capacityMask;
          }
        } else {
          removed = this.remove(i, count);
          this.#tail = (this.#tail - leng + len) & this.#capacityMask;
        }
        while (arguments_index < arg_len) {
          this.push(arguments[arguments_index++]);
        }
        for (k = 0; k < leng; k++) {
          this.push(temp[k]);
        }
      }
      return removed;
    } else {
      return this.remove(i, count);
    }
  }
  /**
   * Soft clear - does not reset capacity.
   */
  clear() {
    this.#head = 0;
    this.#tail = 0;
  }
  /**
   * Returns true or false whether the list is empty.
   * @returns {boolean}
   */
  isEmpty() {
    return this.#head === this.#tail;
  }
  /**
   * Returns an array of all queue items.
   * @returns {Array}
   */
  toArray() {
    return this._copyArray(false);
  }

  _fromArray(array: T[]) {
    for (let i = 0; i < array.length; i++) this.push(array[i]);
  }

  _copyArray(fullCopy?: boolean): T[] {
    const newArray: T[] = [];
    const list = this.#list;
    const len = list.length;
    let i;
    if (fullCopy || this.#head > this.#tail) {
      for (i = this.#head; i < len; i++) newArray.push(list[i]!);
      for (i = 0; i < this.#tail; i++) newArray.push(list[i]!);
    } else {
      for (i = this.#head; i < this.#tail; i++) newArray.push(list[i]!);
    }
    return newArray;
  }
  /**
   * Grows the internal list array.
   * @private
   */
  _growArray() {
    if (this.#head) {
      // copy existing data, head to end, then beginning to tail.
      this.#list = this._copyArray(true);
      this.#head = 0;
    }

    // head is at 0 and array is now full, safe to extend
    this.#tail = this.#list.length;

    this.#list.length <<= 1;
    this.#capacityMask = (this.#capacityMask << 1) | 1;
  }
  /**
   * Shrinks the internal list array.
   * @private
   */
  _shrinkArray() {
    this.#list.length >>>= 1;
    this.#capacityMask >>>= 1;
  }
}
