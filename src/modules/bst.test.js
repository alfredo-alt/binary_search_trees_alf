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
