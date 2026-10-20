// Config
const STORAGE_KEY = "markdownSlides";
const DEFAULT_MARKDOWN = `# This is Slide 01
## This is Heading 02 in slide 01

This is your content on slide 01
---
# This is Slide 02
## This is Heading 02 in slide 02

This is your content on slide 02
---
# Slide 03
## This is Heading 02 in slide 03

This is your content on slide 03
- 
`;

// Elements 
const editor = document.getElementById("editor");
const slideEl = document.getElementById("slideView");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");
const slideCount = document.getElementById("slideCount"); 
const prevBtn = document.getElementById("prevBtn");       
const nextBtn = document.getElementById("nextBtn");  

// State
let slides = [];
let currentIndex = 0;

// Functions
function splitSlides(text) {
  const parts = text
    .split(/^\s*---\s*$/m)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  return parts.length > 0 ? parts : [""];
}

function renderSlide() {
  if (currentIndex > slides.length - 1) currentIndex = slides.length - 1;
  if (currentIndex < 0) currentIndex = 0;

  slideEl.innerHTML = marked.parse(slides[currentIndex]);
  slideCount.textContent = (currentIndex + 1) + " / " + slides.length;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === slides.length - 1;
}

function update() {
  slides = splitSlides(editor.value);
  renderSlide();
}

//previous slide
function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    renderSlide();
  }
}

// next slide
function goNext() {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
    renderSlide();
  }
}

//Saving and loading
function saveSlides() {
  localStorage.setItem(STORAGE_KEY, editor.value);
  showStatus("Saved!");
}

function loadSlides() {
  const saved = localStorage.getItem(STORAGE_KEY);
  editor.value = saved !== null ? saved : DEFAULT_MARKDOWN;
}

let statusTimer;
function showStatus(message) {
  statusEl.textContent = message;
  statusEl.classList.add("visible");
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => statusEl.classList.remove("visible"), 1500);
}

//Events
editor.addEventListener("input", update);

saveBtn.addEventListener("click", saveSlides);
prevBtn.addEventListener("click", goPrev); // NAYA
nextBtn.addEventListener("click", goNext); // NAYA

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveSlides();
  }
  if (document.activeElement !== editor) {
    if (event.key === "ArrowRight") goNext();
    if (event.key === "ArrowLeft") goPrev();
  }
});

//start
loadSlides();
update();
