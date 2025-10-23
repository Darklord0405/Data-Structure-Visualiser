const express = require("express");
const cors = require("cors");
const { LinkedList, Stack, Queue, BinaryTree } = require("./backend/structures");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("static")); // serve frontend

// Initialize structures
const linkedList = new LinkedList();
const stack = new Stack();
const queue = new Queue();
const tree = new BinaryTree();

// Linked List Routes
app.post("/linkedlist/insert", (req, res) => {
  res.json(linkedList.insert(req.body.value));
});

app.post("/linkedlist/delete", (req, res) => {
  res.json(linkedList.delete(req.body.value));
});

// Stack Routes
app.post("/stack/push", (req, res) => {
  res.json(stack.push(req.body.value));
});

app.post("/stack/pop", (req, res) => {
  res.json(stack.pop());
});

// Queue Routes
app.post("/queue/enqueue", (req, res) => {
  res.json(queue.enqueue(req.body.value));
});

app.post("/queue/dequeue", (req, res) => {
  res.json(queue.dequeue());
});

// Tree Routes
app.post("/tree/insert", (req, res) => {
  const treeData = tree.insert(req.body.value);
  res.json(treeData);
});

app.post("/tree/delete", (req, res) => {
  const treeData = tree.delete(req.body.value);
  res.json(treeData);
});


app.get("/tree/traverse/:type", (req, res) => {
  const type = req.params.type;
  let result = [];

  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    result.push(node.value);
    inorder(node.right);
  }

  function preorder(node) {
    if (!node) return;
    result.push(node.value);
    preorder(node.left);
    preorder(node.right);
  }

  function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    result.push(node.value);
  }

  if (type === "inorder") inorder(tree.root);
  if (type === "preorder") preorder(tree.root);
  if (type === "postorder") postorder(tree.root);

  res.json(result);
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
