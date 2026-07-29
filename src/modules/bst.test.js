// bst.test.js
// Odin: Binary Search Trees project.

import { Node, Tree } from './bst.js';

describe('Node', () => {
  it('defaults left and right to null', () => {
    const node = new Node(5);
    expect(node.data).toBe(5);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });
});

describe('Tree / buildTree', () => {
  it('builds a root from a small sorted array (middle element)', () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.root.data).toBe(2);
    expect(tree.root.left.data).toBe(1);
    expect(tree.root.right.data).toBe(3);
  });

  it('sorts the input before building the tree', () => {
    const tree = new Tree([3, 1, 2]);
    // Same shape as the sorted case above, regardless of input order.
    expect(tree.root.data).toBe(2);
    expect(tree.root.left.data).toBe(1);
    expect(tree.root.right.data).toBe(3);
  });

  it('removes duplicates before building the tree', () => {
    const tree = new Tree([1, 1, 2, 2, 3, 3]);
    // Duplicates collapsed -> same 3-node tree as [1, 2, 3].
    expect(tree.root.data).toBe(2);
    expect(tree.root.left.data).toBe(1);
    expect(tree.root.right.data).toBe(3);
  });

  it('produces a valid binary search tree (left < node < right, everywhere)', () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

    const isValidBst = (node, min = -Infinity, max = Infinity) => {
      if (node === null) return true;
      if (node.data <= min || node.data >= max) return false;
      return (
        isValidBst(node.left, min, node.data) &&
        isValidBst(node.right, node.data, max)
      );
    };

    expect(isValidBst(tree.root)).toBe(true);
  });

  it('produces a BALANCED tree (height difference at most 1 at every node)', () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

    const height = (node) => {
      if (node === null) return -1;
      return 1 + Math.max(height(node.left), height(node.right));
    };

    const isBalanced = (node) => {
      if (node === null) return true;
      const diff = Math.abs(height(node.left) - height(node.right));
      return diff <= 1 && isBalanced(node.left) && isBalanced(node.right);
    };

    expect(isBalanced(tree.root)).toBe(true);
  });

  it('builds an empty tree (null root) from an empty array', () => {
    const tree = new Tree([]);
    expect(tree.root).toBeNull();
  });
});

describe('includes functionality', () => {
  it('returns false for an empty tree', () => {
    const tree = new Tree([]);
    expect(tree.includes(5)).toBe(false);
  });

  it('returns true for every value used to build the tree', () => {
    const values = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
    const tree = new Tree(values);

    values.forEach((value) => {
      expect(tree.includes(value)).toBe(true);
    });
  });

  it('returns false for a value not in the tree', () => {
    const tree = new Tree([1, 7, 4, 23, 8]);
    expect(tree.includes(999)).toBe(false);
  });
});

describe('insert functionality', () => {
  it('sets the root when inserting into an empty tree', () => {
    const tree = new Tree([]);
    tree.insert(5);
    expect(tree.root.data).toBe(5);
  });

  it('makes a newly inserted value findable with includes()', () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.includes(10)).toBe(false);

    tree.insert(10);
    expect(tree.includes(10)).toBe(true);
  });

  it('inserts to the left when the value is smaller than the root', () => {
    const tree = new Tree([10]);
    tree.insert(5);
    expect(tree.root.left.data).toBe(5);
  });

  it('inserts to the right when the value is larger than the root', () => {
    const tree = new Tree([10]);
    tree.insert(15);
    expect(tree.root.right.data).toBe(15);
  });

  it('does nothing when inserting a value that already exists', () => {
    const tree = new Tree([1, 2, 3]);

    const countNodes = (node) =>
      node === null ? 0 : 1 + countNodes(node.left) + countNodes(node.right);

    const before = countNodes(tree.root);
    tree.insert(2); // already in the tree
    const after = countNodes(tree.root);

    expect(after).toBe(before);
  });

  it('keeps the BST property valid after several inserts', () => {
    const tree = new Tree([10, 5, 15]);
    tree.insert(3);
    tree.insert(7);
    tree.insert(12);
    tree.insert(20);

    const isValidBst = (node, min = -Infinity, max = Infinity) => {
      if (node === null) return true;
      if (node.data <= min || node.data >= max) return false;
      return (
        isValidBst(node.left, min, node.data) &&
        isValidBst(node.right, node.data, max)
      );
    };

    expect(isValidBst(tree.root)).toBe(true);
    [3, 5, 7, 10, 12, 15, 20].forEach((value) => {
      expect(tree.includes(value)).toBe(true);
    });
  });
});

describe('deleteItem functionality', () => {
  // Shared helpers for validating tree shape after deletion.
  const isValidBst = (node, min = -Infinity, max = Infinity) => {
    if (node === null) return true;
    if (node.data <= min || node.data >= max) return false;
    return (
      isValidBst(node.left, min, node.data) &&
      isValidBst(node.right, node.data, max)
    );
  };

  const countNodes = (node) =>
    node === null ? 0 : 1 + countNodes(node.left) + countNodes(node.right);

  it('does nothing when the value is not in the tree', () => {
    const tree = new Tree([1, 2, 3]);
    const before = countNodes(tree.root);

    tree.deleteItem(999);

    expect(countNodes(tree.root)).toBe(before);
    expect(isValidBst(tree.root)).toBe(true);
  });

  it('does nothing when called on an empty tree', () => {
    const tree = new Tree([]);
    tree.deleteItem(5);
    expect(tree.root).toBeNull();
  });

  it('deletes a leaf node (no children)', () => {
    // Balanced tree from [1,2,3,4,5,6,7]: root 4, leaves 1,3,5,7.
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    tree.deleteItem(1);

    expect(tree.includes(1)).toBe(false);
    [2, 3, 4, 5, 6, 7].forEach((value) => {
      expect(tree.includes(value)).toBe(true);
    });
    expect(isValidBst(tree.root)).toBe(true);
  });

  it('deletes a node with only one child', () => {
    // Root 10, left child 5 which has a single left child 3.
    const tree = new Tree([10, 5, 3]);
    tree.deleteItem(5);

    expect(tree.includes(5)).toBe(false);
    expect(tree.includes(10)).toBe(true);
    expect(tree.includes(3)).toBe(true);
    // 3 should now hang directly off the root.
    expect(tree.root.left.data).toBe(3);
    expect(isValidBst(tree.root)).toBe(true);
  });

  it('deletes a node with two children using the in-order successor', () => {
    const tree = new Tree([10, 5, 15, 3, 7, 12, 20]);
    tree.deleteItem(5); // has two children: 3 and 7

    expect(tree.includes(5)).toBe(false);
    [3, 7, 10, 12, 15, 20].forEach((value) => {
      expect(tree.includes(value)).toBe(true);
    });
    expect(isValidBst(tree.root)).toBe(true);
  });

  it('deletes the root when it has two children', () => {
    const tree = new Tree([10, 5, 15, 3, 7, 12, 20]);
    tree.deleteItem(10);

    expect(tree.includes(10)).toBe(false);
    [3, 5, 7, 12, 15, 20].forEach((value) => {
      expect(tree.includes(value)).toBe(true);
    });
    expect(isValidBst(tree.root)).toBe(true);
  });

  it('deletes the root when the tree has only one node', () => {
    const tree = new Tree([42]);
    tree.deleteItem(42);
    expect(tree.root).toBeNull();
  });

  it('keeps the tree valid after deleting every value one by one', () => {
    const values = [1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324];
    const tree = new Tree(values);

    values.forEach((value) => {
      tree.deleteItem(value);
      expect(isValidBst(tree.root)).toBe(true);
      expect(tree.includes(value)).toBe(false);
    });

    expect(tree.root).toBeNull();
  });
});

describe('levelOrderForEach functionality', () => {
  it('throws an Error when no callback is given', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.levelOrderForEach()).toThrow(Error);
  });

  it('throws an Error when the argument is not a function', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.levelOrderForEach('not a function')).toThrow(Error);
  });

  it('does not call the callback on an empty tree', () => {
    const tree = new Tree([]);
    const callback = jest.fn();
    tree.levelOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('visits nodes level by level, left to right within each level', () => {
    // Balanced tree from [1..7]: level 0 -> 4, level 1 -> 2, 6, level 2 -> 1, 3, 5, 7.
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);

    const visited = [];
    tree.levelOrderForEach((value) => visited.push(value));

    expect(visited).toEqual([4, 2, 6, 1, 3, 5, 7]);
  });

  it('passes VALUES to the callback, not Node objects', () => {
    const tree = new Tree([1, 2, 3]);

    tree.levelOrderForEach((value) => {
      expect(typeof value).toBe('number');
    });
  });

  it('visits every value exactly once', () => {
    const values = [1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324];
    const tree = new Tree(values);

    const visited = [];
    tree.levelOrderForEach((value) => visited.push(value));

    expect(visited.sort((a, b) => a - b)).toEqual(
      [...values].sort((a, b) => a - b),
    );
  });
});

describe('inOrderForEach functionality', () => {
  it('throws an Error when no callback is given', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.inOrderForEach()).toThrow(Error);
  });

  it('throws an Error when the argument is not a function', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.inOrderForEach('nope')).toThrow(Error);
  });

  it('does not call the callback on an empty tree', () => {
    const tree = new Tree([]);
    const callback = jest.fn();
    tree.inOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('visits every value in ascending sorted order (BST property)', () => {
    const values = [1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324];
    const tree = new Tree(values);

    const visited = [];
    tree.inOrderForEach((value) => visited.push(value));

    expect(visited).toEqual([...new Set(values)].sort((a, b) => a - b));
  });
});

describe('preOrderForEach functionality', () => {
  it('throws an Error when no callback is given', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.preOrderForEach()).toThrow(Error);
  });

  it('throws an Error when the argument is not a function', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.preOrderForEach('nope')).toThrow(Error);
  });

  it('does not call the callback on an empty tree', () => {
    const tree = new Tree([]);
    const callback = jest.fn();
    tree.preOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('visits node, then left subtree, then right subtree', () => {
    // Balanced tree from [1..7]: root 4, left subtree {2,1,3}, right subtree {6,5,7}.
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);

    const visited = [];
    tree.preOrderForEach((value) => visited.push(value));

    expect(visited).toEqual([4, 2, 1, 3, 6, 5, 7]);
  });

  it('visits every value exactly once', () => {
    const values = [1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324];
    const tree = new Tree(values);

    const visited = [];
    tree.preOrderForEach((value) => visited.push(value));

    expect(visited.sort((a, b) => a - b)).toEqual(
      [...values].sort((a, b) => a - b),
    );
  });
});

describe('postOrderForEach functionality', () => {
  it('throws an Error when no callback is given', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.postOrderForEach()).toThrow(Error);
  });

  it('throws an Error when the argument is not a function', () => {
    const tree = new Tree([1, 2, 3]);
    expect(() => tree.postOrderForEach('nope')).toThrow(Error);
  });

  it('does not call the callback on an empty tree', () => {
    const tree = new Tree([]);
    const callback = jest.fn();
    tree.postOrderForEach(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('visits left subtree, then right subtree, then node', () => {
    // Balanced tree from [1..7]: root 4, left subtree {2,1,3}, right subtree {6,5,7}.
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);

    const visited = [];
    tree.postOrderForEach((value) => visited.push(value));

    expect(visited).toEqual([1, 3, 2, 5, 7, 6, 4]);
  });

  it('visits every value exactly once', () => {
    const values = [1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324];
    const tree = new Tree(values);

    const visited = [];
    tree.postOrderForEach((value) => visited.push(value));

    expect(visited.sort((a, b) => a - b)).toEqual(
      [...values].sort((a, b) => a - b),
    );
  });
});

describe('height functionality', () => {
  it('returns undefined for a value not in the tree', () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.height(999)).toBeUndefined();
  });

  it('returns undefined when called on an empty tree', () => {
    const tree = new Tree([]);
    expect(tree.height(5)).toBeUndefined();
  });

  it('returns 0 for a leaf node', () => {
    // Balanced tree from [1..7]: root 4, leaves 1, 3, 5, 7.
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.height(1)).toBe(0);
    expect(tree.height(7)).toBe(0);
  });

  it('returns the correct height for an internal node', () => {
    // Balanced tree from [1..7]: root 4 (height 2), 2 and 6 (height 1).
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.height(2)).toBe(1);
    expect(tree.height(6)).toBe(1);
  });

  it('returns the height of the whole tree when called on the root', () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.height(4)).toBe(2);
  });

  it('returns a taller height for an unbalanced single-branch chain', () => {
    // Inserting in increasing order into a single-node tree creates a
    // straight chain to the right: 1 -> 2 -> 3 -> 4 -> 5 (height 4).
    const tree = new Tree([1]);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5);

    expect(tree.height(1)).toBe(4);
    expect(tree.height(5)).toBe(0);
  });
});

describe('depth functionality', () => {
  it('returns undefined for a value not in the tree', () => {
    const tree = new Tree([1, 2, 3]);
    expect(tree.depth(999)).toBeUndefined();
  });

  it('returns undefined when called on an empty tree', () => {
    const tree = new Tree([]);
    expect(tree.depth(5)).toBeUndefined();
  });

  it('returns 0 for the root', () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.depth(4)).toBe(0);
  });

  it('returns the correct depth for nodes at deeper levels', () => {
    // Balanced tree from [1..7]: root 4, level 1 -> 2, 6, level 2 -> 1, 3, 5, 7.
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    expect(tree.depth(2)).toBe(1);
    expect(tree.depth(6)).toBe(1);
    expect(tree.depth(1)).toBe(2);
    expect(tree.depth(7)).toBe(2);
  });

  it('is consistent with height(): depth(root) + height(leaf) matches path length', () => {
    const tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
    // From root (4) to leaf (1): depth(1) should equal 2 edges.
    expect(tree.depth(1)).toBe(2);
  });
});

describe('isBalanced functionality', () => {
  it('returns true for an empty tree', () => {
    const tree = new Tree([]);
    expect(tree.isBalanced()).toBe(true);
  });

  it('returns true for a single-node tree', () => {
    const tree = new Tree([1]);
    expect(tree.isBalanced()).toBe(true);
  });

  it('returns true for a tree built with buildTree() (always balanced)', () => {
    const tree = new Tree([1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324]);
    expect(tree.isBalanced()).toBe(true);
  });

  it('returns false for an unbalanced chain built via repeated insert()', () => {
    const tree = new Tree([1]);
    tree.insert(2);
    tree.insert(3);
    tree.insert(4);
    tree.insert(5); // straight chain 1->2->3->4->5, clearly unbalanced
    expect(tree.isBalanced()).toBe(false);
  });

  it('catches an imbalance buried deep in the tree, even when the root itself looks balanced (the pitfall the assignment warns about)', () => {
    // Build a deliberately unbalanced left branch (height 2, right side empty):
    //   nodeA (height 2)
    //   └── nodeB (height 1)
    //       └── nodeC (leaf, height 0)
    const nodeC = new Node(1);
    const nodeB = new Node(2, nodeC, null);
    const nodeA = new Node(3, nodeB, null);

    // L is unbalanced on its own: left height 2, right height -1 (null) -> diff 3.
    const nodeL = new Node(20, nodeA, null);

    // A perfectly balanced subtree of height 3 (15 nodes), used as the
    // root's right side so the ROOT-level check (left vs right height)
    // comes out equal (3 vs 3) -- "looks balanced" if you only check the root.
    const balancedRightSubtree = new Tree(
      Array.from({ length: 15 }, (_, i) => 100 + i),
    ).root;

    const tree = new Tree([]); // start empty, then wire the root manually
    tree.root = new Node(50, nodeL, balancedRightSubtree);

    // Root-level check alone (heights 3 vs 3) would wrongly say "balanced".
    expect(tree.isBalanced()).toBe(false);
  });
});
