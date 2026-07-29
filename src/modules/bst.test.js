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
