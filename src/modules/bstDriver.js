// bstDriver.js
// Odin: Binary Search Trees project -- "Tie it all together" driver script.
// Run directly with: node bstDriver.js

import { Tree } from './bst.js';

/**
 * Returns a fresh array of random integers, each less than `max`, every
 * time it's called.
 * @param {number} count - how many numbers to generate.
 * @param {number} max - exclusive upper bound for each number.
 * @returns {number[]}
 */
function randomNumbersArray(count = 15, max = 100) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * max));
}

/**
 * Prints all four traversal orders for a given tree, one line each.
 * @param {Tree} tree
 */
function printAllTraversals(tree) {
  const levelOrder = [];
  tree.levelOrderForEach((value) => levelOrder.push(value));
  console.log('Level order:', levelOrder.join(', '));

  const preOrder = [];
  tree.preOrderForEach((value) => preOrder.push(value));
  console.log('Pre order:  ', preOrder.join(', '));

  const postOrder = [];
  tree.postOrderForEach((value) => postOrder.push(value));
  console.log('Post order: ', postOrder.join(', '));

  const inOrder = [];
  tree.inOrderForEach((value) => inOrder.push(value));
  console.log('In order:   ', inOrder.join(', '));
}

// 1. Build a tree from random numbers, each under 100.
const tree = new Tree(randomNumbersArray());
console.log('=== Initial tree (random numbers < 100) ===');

// 2. Confirm it's balanced.
console.log('Is balanced?', tree.isBalanced());

// 3. Print every traversal order.
printAllTraversals(tree);

// 4. Unbalance it by inserting several numbers over 100 -- insert()
// doesn't rebalance on its own, so a run of large values (all landing
// on the right side of the tree) will skew it.
console.log('\n=== Unbalancing the tree (inserting values > 100) ===');
[150, 200, 250, 300, 350, 400].forEach((value) => tree.insert(value));

// 5. Confirm it's now unbalanced.
console.log('Is balanced?', tree.isBalanced());

// 6. Rebalance it.
console.log('\n=== Rebalancing ===');
tree.rebalance();

// 7. Confirm it's balanced again.
console.log('Is balanced?', tree.isBalanced());

// 8. Print every traversal order again.
printAllTraversals(tree);
