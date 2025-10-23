// Linked List Implementation
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = newNode;
    }
    return this.toArray();
  }

  delete(value) {
    if (!this.head) return [];
    if (this.head.value == value) {
      this.head = this.head.next;
      return this.toArray();
    }
    let curr = this.head;
    while (curr.next && curr.next.value != value) {
      curr = curr.next;
    }
    if (curr.next) curr.next = curr.next.next;
    return this.toArray();
  }

  toArray() {
    const result = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.value);
      curr = curr.next;
    }
    return result;
  }
}

// Stack Implementation
class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
    return [...this.items];
  }

  pop() {
    this.items.pop();
    return [...this.items];
  }

  peek() {
    return this.items[this.items.length - 1];
  }
}

// Queue Implementation
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
    return [...this.items];
  }

  dequeue() {
    this.items.shift();
    return [...this.items];
  }
}

// Binary Tree Implementation
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    value = Number(value);
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return this.toArray();
    }

    let curr = this.root;
    while (true) {
      if (value < curr.value) {
        if (!curr.left) { curr.left = newNode; break; }
        curr = curr.left;
      } else {
        if (!curr.right) { curr.right = newNode; break; }
        curr = curr.right;
      }
    }
    return this.toArray();
  }

  delete(value) {
    value = Number(value);
    this.root = this._deleteRec(this.root, value);
    return this.toArray();
  }

  _deleteRec(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._deleteRec(node.left, value);
    } else if (value > node.value) {
      node.right = this._deleteRec(node.right, value);
    } else {
      // Found node to delete

      // Case 1: No child
      if (!node.left && !node.right) return null;

      // Case 2: One child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Two children
      const minNode = this._findMin(node.right);
      node.value = minNode.value;
      node.right = this._deleteRec(node.right, minNode.value);
    }

    return node;
  }

  _findMin(node) {
    while (node.left) node = node.left;
    return node;
  }

  toArray() {
    function traverse(node) {
      if (!node) return null;
      return {
        name: node.value,
        children: [traverse(node.left), traverse(node.right)].filter(Boolean),
      };
    }
    return traverse(this.root);
  }
}

module.exports = { LinkedList, Stack, Queue, BinaryTree };
