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

  /**
   * Checks whether `value` exists anywhere in the tree, by walking down
   * from the root -- at each node, the BST property tells us which
   * single branch could possibly contain it, so we never need to check
   * the whole tree (O(log n) for a balanced tree, not O(n)).
   * @param {number} value
   * @returns {boolean} true if `value` is found, false otherwise.
   */
  includes(value) {
    let current = this.root;

    while (current) {
      if (value === current.data) {
        return true;
      }
      current = value < current.data ? current.left : current.right;
    }

    return false;
  }

  /**
   * Inserts a new node containing `value`, preserving the BST property
   * (everything to a node's left is smaller, everything to its right
   * is larger). Walks down from the root -- same idea as includes(),
   * following the single branch where `value` belongs -- until it finds
   * the empty spot (null) where the new node should attach.
   *
   * If `value` already exists in the tree, this does nothing (no
   * duplicate node is created).
   * @param {number} value
   */
  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value === current.data) {
        // Already in the tree -- do nothing, per the assignment.
        return;
      }

      if (value < current.data) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  /**
   * Removes the node containing `value` from the tree, preserving the
   * BST property. Handles three cases, depending on how many children
   * the target node has:
   *
   *  - No children (leaf): just detach it from its parent.
   *  - One child: the parent adopts that child directly, skipping over
   *    the removed node.
   *  - Two children: can't just detach it (both subtrees would need a
   *    new home). Instead, find the in-order SUCCESSOR -- the smallest
   *    value in the right subtree (i.e. keep going left from
   *    `current.right` until there's no more `left`) -- copy its data
   *    into the node being "deleted", then remove the successor node
   *    itself from its original spot (which is simple: a successor
   *    found this way can only ever have a right child, never a left
   *    one, since we walked left until we couldn't anymore).
   *
   * If `value` isn't in the tree, this does nothing.
   * @param {number} value
   */
  deleteItem(value) {
    let parent = null;
    let current = this.root;

    // Search for the node to delete, remembering its parent along the
    // way (needed later to reattach whatever replaces it).
    while (current && current.data !== value) {
      parent = current;
      current = value < current.data ? current.left : current.right;
    }

    if (!current) {
      return; // value not found -- nothing to do.
    }

    if (current.left && current.right) {
      // Two children: find the in-order successor and its parent.
      let successorParent = current;
      let successor = current.right;
      while (successor.left) {
        successorParent = successor;
        successor = successor.left;
      }

      current.data = successor.data;

      // Detach the successor from its original spot. It has no left
      // child (we walked left until we couldn't), so its right child
      // (possibly null) simply takes its place.
      if (successorParent.left === successor) {
        successorParent.left = successor.right;
      } else {
        successorParent.right = successor.right;
      }
      return;
    }

    // Zero or one child: whatever child exists (or null, if none)
    // takes the deleted node's place directly.
    const child = current.left || current.right;

    if (!parent) {
      this.root = child;
    } else if (parent.left === current) {
      parent.left = child;
    } else {
      parent.right = child;
    }
  }
}

export { Node, Tree };
