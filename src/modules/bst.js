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
    this.root = this.#buildTree(array);
  }

  /**
   * Sorts the array, removes duplicates, and delegates to
   * #buildBalancedTree() to recursively build a balanced tree from it.
   * Kept private: nothing outside this class needs to call it directly
   * after construction -- it's only ever used once, to set up `root`.
   * @param {number[]} array
   * @returns {Node|null} the level-0 root node.
   */
  #buildTree(array) {
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
   * Walks down from the root following the BST property (same idea
   * used by includes()/insert()/deleteItem()) to find the actual Node
   * object matching `value`, not just whether it exists.
   * @param {number} value
   * @returns {Node|null} the matching node, or null if not found.
   */
  #findNode(value) {
    let current = this.root;

    while (current) {
      if (value === current.data) {
        return current;
      }
      current = value < current.data ? current.left : current.right;
    }

    return null;
  }

  /**
   * Checks whether `value` exists anywhere in the tree.
   * @param {number} value
   * @returns {boolean} true if `value` is found, false otherwise.
   */
  includes(value) {
    return this.#findNode(value) !== null;
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

  /**
   * Traverses the tree breadth-first (level by level, left to right
   * within each level) and calls `callback` with each node's VALUE
   * (not the node itself) -- similar to Array.prototype.forEach().
   *
   * Uses an array as a queue: start with the root queued up, then
   * repeatedly take the front of the queue, visit it, and queue up its
   * children (left before right) for later. Nodes get visited in the
   * exact order they were queued, which is what produces level-by-level
   * order instead of diving deep into one branch first.
   * @param {function(*): void} callback
   * @throws {Error} if `callback` isn't a function.
   */
  levelOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('levelOrderForEach() requires a callback function.');
    }

    if (!this.root) {
      return;
    }

    const queue = [this.root];

    while (queue.length > 0) {
      const current = queue.shift();
      callback(current.data);

      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
    }
  }

  /**
   * Depth-first traversal in IN-ORDER (left, node, right). For a valid
   * BST, this happens to visit every value in ascending sorted order --
   * a nice side effect of the BST property, not something the
   * traversal itself has to work for.
   * @param {function(*): void} callback
   * @throws {Error} if `callback` isn't a function.
   */
  inOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('inOrderForEach() requires a callback function.');
    }

    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      callback(node.data);
      traverse(node.right);
    };

    traverse(this.root);
  }

  /**
   * Depth-first traversal in PRE-ORDER (node, left, right) -- visits
   * each node BEFORE its children. Useful for tasks like copying a
   * tree, since parents are always processed before the children that
   * depend on them.
   * @param {function(*): void} callback
   * @throws {Error} if `callback` isn't a function.
   */
  preOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('preOrderForEach() requires a callback function.');
    }

    const traverse = (node) => {
      if (!node) return;
      callback(node.data);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);
  }

  /**
   * Depth-first traversal in POST-ORDER (left, right, node) -- visits
   * each node AFTER its children. Useful for tasks like deleting a
   * tree bottom-up, since children are always processed before the
   * parent that "owns" them.
   * @param {function(*): void} callback
   * @throws {Error} if `callback` isn't a function.
   */
  postOrderForEach(callback) {
    if (typeof callback !== 'function') {
      throw new Error('postOrderForEach() requires a callback function.');
    }

    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      callback(node.data);
    };

    traverse(this.root);
  }

  /**
   * Height is the number of EDGES in the longest path from a node down
   * to a leaf. A leaf itself has height 0 (no edges needed to reach a
   * leaf from itself). Computed recursively: a node's height is
   * 1 + the taller of its two children's heights, where a missing
   * child (null) contributes -1 -- that's what makes an actual leaf
   * (both children null) come out to 1 + max(-1, -1) = 0.
   * @param {number} value
   * @returns {number|undefined} the height of the node containing
   * `value`, or `undefined` if `value` isn't in the tree.
   */
  height(value) {
    const node = this.#findNode(value);
    if (!node) {
      return undefined;
    }

    const calculateHeight = (current) => {
      if (!current) {
        return -1;
      }
      return (
        1 +
        Math.max(calculateHeight(current.left), calculateHeight(current.right))
      );
    };

    return calculateHeight(node);
  }
}

export { Node, Tree };
