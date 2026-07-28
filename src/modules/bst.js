// bst.js
// Odin: Binary Search Trees project.

/**
 * A single node in the binary search tree. Holds one piece of data and
 * references to its left and right children (or null if absent).
 */
class Node {
  constructor(data = null, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

/**
 * A balanced binary search tree, built once from an initial array.
 */
class Tree {
  /**
   * @param {number[]} array - initial values to build the tree from.
   */
  constructor(array) {
    this.root = this.#prepareAndBuildTree(array);
  }

  /**
   * Sorts the array, removes duplicates, and delegates to
   * #buildBalancedTree() to recursively build a balanced tree from it.
   * Kept private: nothing outside this class needs to call it directly
   * after construction -- it's only ever used once, to set up `root`.
   * @param {number[]} array
   * @returns {Node|null} the level-0 root node.
   */
  #prepareAndBuildTree(array) {
    const sortedUniqueValues = [...new Set(array)].sort((a, b) => a - b);
    return this.#buildBalancedTree(
      sortedUniqueValues,
      0,
      sortedUniqueValues.length - 1,
    );
  }

  /**
   * Recursively builds a balanced tree from an ALREADY sorted,
   * duplicate-free array, by always picking the middle element of the
   * current range as the node, then recursing on the left half and the
   * right half. This is what guarantees balance: each half always gets
   * (roughly) the same number of elements as the other.
   * @param {number[]} sortedArray
   * @param {number} start - inclusive start index of the current range.
   * @param {number} end - inclusive end index of the current range.
   * @returns {Node|null} the root of the subtree built from this range,
   * or null if the range is empty (start > end).
   */
  #buildBalancedTree(sortedArray, start, end) {
    if (start > end) {
      return null;
    }

    const middleIndex = Math.floor((start + end) / 2);
    const node = new Node(sortedArray[middleIndex]);

    node.left = this.#buildBalancedTree(sortedArray, start, middleIndex - 1);
    node.right = this.#buildBalancedTree(sortedArray, middleIndex + 1, end);

    return node;
  }
}

export { Node, Tree };
