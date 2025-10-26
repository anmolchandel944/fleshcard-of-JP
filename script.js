 const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let savedCards = JSON.parse(localStorage.getItem("flashcards")) || [];
let currentIndex = savedCards.length - 1;

// 🖼️ Resize Canvas dynamically
function resizeCanvas() {
  const container = canvas.parentElement;
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width * 0.95;
  canvas.height = rect.height * 0.95;

  if (savedCards[currentIndex]) {
    const img = new Image();
    img.src = savedCards[currentIndex];
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

// ✏️ Drawing functions
function startDraw(e) {
  drawing = true;
  draw(e);
}
function endDraw() {
  drawing = false;
  ctx.beginPath();
}
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x, y };
}
function draw(e) {
  if (!drawing) return;
  const { x, y } = getPos(e);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#fff";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// 💾 Save card
function saveCard() {
  const data = canvas.toDataURL();
  savedCards.push(data);
  localStorage.setItem("flashcards", JSON.stringify(savedCards));
  currentIndex = savedCards.length - 1;
  alert("✅ Card saved successfully!");
}

// 📜 Show previous
function showPreviousCard() {
  if (savedCards.length === 0) {
    alert("No saved cards yet!");
    return;
  }
  currentIndex = (currentIndex - 1 + savedCards.length) % savedCards.length;
  const img = new Image();
  img.src = savedCards[currentIndex];
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

// 🧹 Clear current canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 🗑️ Delete current card
function deleteCard() {
  if (savedCards.length === 0) {
    alert("No saved cards to delete!");
    return;
  }

  if (confirm("⚠️ Are you sure you want to delete this card?")) {
    savedCards.splice(currentIndex, 1);
    localStorage.setItem("flashcards", JSON.stringify(savedCards));

    if (savedCards.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      currentIndex = -1;
    } else {
      currentIndex = Math.max(0, currentIndex - 1);
      const img = new Image();
      img.src = savedCards[currentIndex];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
    alert("🗑️ Card deleted successfully!");
  }
}

// ✨ Event Listeners
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchend", endDraw);
canvas.addEventListener("touchmove", draw);

document.getElementById("saveBtn").addEventListener("click", saveCard);
document.getElementById("prevBtn").addEventListener("click", showPreviousCard);
document.getElementById("clearBtn").addEventListener("click", clearCanvas);
document.getElementById("deleteBtn").addEventListener("click", deleteCard);
