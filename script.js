const stage = document.getElementById("productStage");
const packet = document.getElementById("packet3d");
const frontButton = document.getElementById("frontButton");
const backButton = document.getElementById("backButton");
const resetButton = document.getElementById("resetButton");
const toast = document.getElementById("toast");

let rotationX = 3;
let rotationY = -12;
let dragging = false;
let lastX = 0;
let lastY = 0;
let toastTimer;

function applyRotation(x, y, smooth = false) {
  rotationX = Math.max(-25, Math.min(25, x));
  rotationY = y;
  packet.style.transition = smooth ? "transform .7s cubic-bezier(.2,.8,.2,1)" : "transform .08s linear";
  packet.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  frontButton.classList.toggle("active", Math.abs(((rotationY % 360) + 360) % 360) < 90 || Math.abs(((rotationY % 360) + 360) % 360) > 270);
  backButton.classList.toggle("active", !frontButton.classList.contains("active"));
}
function showFront() { applyRotation(3, -12, true); }
function showBack() { applyRotation(3, -192, true); }
frontButton.addEventListener("click", showFront);
backButton.addEventListener("click", showBack);
resetButton.addEventListener("click", showFront);

stage.addEventListener("pointerdown", event => {
  dragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  stage.setPointerCapture?.(event.pointerId);
});
stage.addEventListener("pointermove", event => {
  const rect = stage.getBoundingClientRect();
  if (dragging) {
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    applyRotation(rotationX - dy * 0.6, rotationY + dx * 0.75);
  } else if (event.pointerType === "mouse") {
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    applyRotation(8 - py * 16, -12 + (px - 0.5) * 32);
  }
});
function finishDrag() { dragging = false; }
stage.addEventListener("pointerup", finishDrag);
stage.addEventListener("pointercancel", finishDrag);
stage.addEventListener("pointerleave", () => { if (!dragging) showFront(); });
stage.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") { event.preventDefault(); applyRotation(rotationX, rotationY - 8); }
  if (event.key === "ArrowRight") { event.preventDefault(); applyRotation(rotationX, rotationY + 8); }
  if (event.key === "ArrowUp") { event.preventDefault(); applyRotation(rotationX - 5, rotationY); }
  if (event.key === "ArrowDown") { event.preventDefault(); applyRotation(rotationX + 5, rotationY); }
  if (event.key === "Home") { event.preventDefault(); showFront(); }
});

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}
document.getElementById("showIngredients").addEventListener("click", () => {
  showToast("Verify every ingredient and the permitted use of shilajit extract with a qualified food-compliance professional before publishing.");
});
document.getElementById("showNutrition").addEventListener("click", () => {
  showToast("Use nutrition values only after they are confirmed for the final recipe and compliant pack label.");
});

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent("MARWA LO G website enquiry");
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nReply contact: ${data.get("reply")}\n\nMessage:\n${data.get("message")}`
  );
  window.location.href = `mailto:marwalog827242@gmail.com?subject=${subject}&body=${body}`;
});