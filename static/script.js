const API = "http://localhost:3000";
let currentDS = "";  // Current data structure selected

// Handle selection change
function selectDS() {
  currentDS = document.getElementById("dsSelect").value;
  renderControls();
  clearVisualization();
}

// Render input fields and buttons dynamically
function renderControls() {
  const controls = document.getElementById("controls");
  controls.innerHTML = "";

  if (!currentDS) return;

  let html = "";
  if (currentDS === "linkedlist") {
    html = `<input type="text" id="valueInput" placeholder="Value">
            <button onclick="insertDS()">Insert</button>
            <button onclick="deleteDS()">Delete</button>`;
  } else if (currentDS === "stack") {
    html = `<input type="text" id="valueInput" placeholder="Value">
            <button onclick="insertDS()">Push</button>
            <button onclick="deleteDS()">Pop</button>`;
  } else if (currentDS === "queue") {
    html = `<input type="text" id="valueInput" placeholder="Value">
            <button onclick="insertDS()">Enqueue</button>
            <button onclick="deleteDS()">Dequeue</button>`;
  }else if (currentDS === "tree") {
  html = `
    <input type="number" id="valueInput" placeholder="Value">
    <button onclick="insertDS()">Insert</button>
    <button onclick="deleteDS()">Delete</button>
    <br><br>
    <button onclick="traverseTree('inorder')">Inorder</button>
    <button onclick="traverseTree('preorder')">Preorder</button>
    <button onclick="traverseTree('postorder')">Postorder</button>
  `;
  }

  controls.innerHTML = html;
}

// Clear SVG
function clearVisualization() {
  d3.select("#visualization").selectAll("*").remove();
}

// Generic API call based on selected DS
async function insertDS() {
  const value = document.getElementById("valueInput").value;
  if (!value) return;
  let endpoint = "";
  if (currentDS === "linkedlist") endpoint = "/linkedlist/insert";
  if (currentDS === "stack") endpoint = "/stack/push";
  if (currentDS === "queue") endpoint = "/queue/enqueue";
  if (currentDS === "tree") endpoint = "/tree/insert";

  const arr = await fetchAPI(endpoint, "POST", value);
  renderDS(arr);
}

async function deleteDS() {
  let value = document.getElementById("valueInput")?.value;
  let endpoint = "";
  if (currentDS === "linkedlist") endpoint = "/linkedlist/delete";
  if (currentDS === "stack") endpoint = "/stack/pop";
  if (currentDS === "queue") endpoint = "/queue/dequeue";
  if (currentDS === "tree") return; // No delete for tree 

  const arr = await fetchAPI(endpoint, "POST", value);
  renderDS(arr);
}

// Fetch API helper
async function fetchAPI(endpoint, method, value) {
  const body = value !== undefined ? { value } : undefined;
  const res = await fetch(API + endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body && JSON.stringify(body)
  });
  return await res.json();
}

// Render data structure dynamically
function renderDS(arr) {
  const svg = d3.select("#visualization");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  // Clear previous arrows (defs will be reused)
  svg.selectAll("line").remove();

  if (currentDS === "linkedlist") {
    // Data join for nodes
    const nodes = svg.selectAll("g.node")
      .data(arr, (d, i) => d + "-" + i);

    const nodeEnter = nodes.enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d, i) => `translate(${width + 50},50)`); // start offscreen

    nodeEnter.append("rect")
      .attr("width", 60)
      .attr("height", 40)
      .attr("fill", "lightblue")
      .attr("stroke", "black");

    nodeEnter.append("text")
      .attr("x", 30)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d);

    // Merge + animate to proper positions
    nodes.merge(nodeEnter)
      .transition()
      .duration(500)
      .attr("transform", (d, i) => `translate(${i * 100 + 20},50)`);

    // Remove old nodes with animation
    nodes.exit()
      .transition()
      .duration(500)
      .attr("transform", `translate(-100,50)`)
      .remove();

    // Draw arrows
    svg.selectAll("line.arrow").remove();
    for (let i = 0; i < arr.length - 1; i++) {
      svg.append("line")
        .attr("class", "arrow")
        .attr("x1", i * 100 + 80)
        .attr("y1", 70)
        .attr("x2", i * 100 + 100)
        .attr("y2", 70)
        .attr("stroke", "black")
        .attr("marker-end", "url(#arrow)");
    }

    // Arrow marker
    if (svg.select("defs").empty()) {
      svg.append("defs").append("marker")
        .attr("id","arrow")
        .attr("viewBox","0 0 10 10")
        .attr("refX",5)
        .attr("refY",5)
        .attr("markerWidth",5)
        .attr("markerHeight",5)
        .attr("orient","auto-start-reverse")
        .append("path")
        .attr("d","M 0 0 L 10 5 L 0 10 z")
        .attr("fill","black");
    }
  }

  // -------------------- Stack --------------------
  if (currentDS === "stack") {
    const nodes = svg.selectAll("g.node")
      .data(arr, (d, i) => d + "-" + i);

    const nodeEnter = nodes.enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d, i) => `translate(50,${height + 50})`); // start offscreen

    nodeEnter.append("rect")
      .attr("width", 100)
      .attr("height", 40)
      .attr("fill", "lightgreen")
      .attr("stroke", "black");

    nodeEnter.append("text")
      .attr("x", 50)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d);

    nodes.merge(nodeEnter)
      .transition()
      .duration(500)
      .attr("transform", (d, i) => `translate(50,${height - 50 - i*50})`);

    nodes.exit()
      .transition()
      .duration(500)
      .attr("transform", `translate(50,${height + 50})`)
      .remove();
  }

  // -------------------- Queue --------------------
  if (currentDS === "queue") {
    const nodes = svg.selectAll("g.node")
      .data(arr, (d, i) => d + "-" + i);

    const nodeEnter = nodes.enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d, i) => `translate(${width + 50},50)`); // start offscreen

    nodeEnter.append("rect")
      .attr("width", 60)
      .attr("height", 40)
      .attr("fill", "lightcoral")
      .attr("stroke", "black");

    nodeEnter.append("text")
      .attr("x", 30)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d);

    nodes.merge(nodeEnter)
      .transition()
      .duration(500)
      .attr("transform", (d, i) => `translate(${i*100 + 20},50)`);

    nodes.exit()
      .transition()
      .duration(500)
      .attr("transform", `translate(-100,50)`)
      .remove();
  }
  // -------------------- Binary Tree --------------------
  if (currentDS === "tree" && arr) {
  const svg = d3.select("#visualization");
  svg.selectAll("*").remove();

  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const root = d3.hierarchy(arr);
  const treeLayout = d3.tree().size([width - 40, height - 80]);
  treeLayout(root);

  // Links
  svg.selectAll("line.link")
    .data(root.links())
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("x1", d => d.source.x + 30)
    .attr("y1", d => d.source.y + 50)
    .attr("x2", d => d.source.x + 30)
    .attr("y2", d => d.source.y + 50)
    .attr("stroke", "black")
    .transition()
    .duration(500)
    .attr("x2", d => d.target.x + 30)
    .attr("y2", d => d.target.y + 50);

  // Nodes
  const nodes = svg.selectAll("g.node")
    .data(root.descendants(), d => d.data.name);

  const nodeEnter = nodes.enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x + 30},${d.y + 50})`);

  nodeEnter.append("circle")
    .attr("r", 0)
    .attr("fill", "lightblue")
    .transition()
    .duration(500)
    .attr("r", 20);

  nodeEnter.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text(d => d.data.name);
  }
}

async function traverseTree(type) {
  const res = await fetch(`${API}/tree/traverse/${type}`);
  const order = await res.json();
  highlightTraversal(order);
}

function highlightTraversal(order) {
  const svg = d3.select("#visualization");
  const nodes = svg.selectAll("circle");

  // Reset all colors
  nodes.transition().duration(300).attr("fill", "lightblue");

  let delay = 0;
  order.forEach((val, i) => {
    const node = svg.selectAll("g.node").filter(d => d.data.name == val);
    node.select("circle")
      .transition()
      .delay(delay)
      .duration(500)
      .attr("fill", "orange")
      .transition()
      .delay(500)
      .attr("fill", "lightblue");
    delay += 1000; // 1 second per step
  });
}

async function deleteDS() {
  const value = document.getElementById("valueInput").value;
  if (!value) return alert("Enter a value to delete!");

  const res = await fetch(`${API}/tree/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });

  const data = await res.json();
  renderDS(data);
}

