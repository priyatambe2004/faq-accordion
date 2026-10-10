const $ = (id) => document.getElementById(id);

const items = document.querySelectorAll(".faq-item");
const searchInput = $("search");
const multipleToggle = $("multiple");
const statusEl = $("status");
const noResults = $("no-results");

/* ---------- Open and close ---------- */

// Opens or closes one item and keeps aria-expanded in sync for screen readers
function setOpen(item, open) {
  item.classList.toggle("active", open);   // classList.toggle(name, force) adds or removes the class
  item.querySelector(".faq-question").setAttribute("aria-expanded", String(open));
}

function closeOthers(current) {
  items.forEach((item) => {
    if (item !== current) setOpen(item, false);
  });
}

// Click handler: toggles the clicked question
function handleClick(item) {
  const willOpen = !item.classList.contains("active");

  // By default only one answer stays open. The switch allows several.
  if (willOpen && !multipleToggle.checked) closeOthers(item);

  setOpen(item, willOpen);
  updateStatus();
}

items.forEach((item) => {
  item.querySelector(".faq-question").addEventListener("click", () => handleClick(item));
});

/* ---------- Switch: one open or many open ---------- */

multipleToggle.addEventListener("change", () => {
  if (!multipleToggle.checked) {
    // Back to single mode: keep only the first open answer
    const open = [...items].filter((item) => item.classList.contains("active"));
    open.slice(1).forEach((item) => setOpen(item, false));
    updateStatus();
  }
});

/* ---------- Expand all / Collapse all ---------- */

$("expand-all").addEventListener("click", () => {
  multipleToggle.checked = true; // several open answers need multiple mode
  items.forEach((item) => { if (!item.hidden) setOpen(item, true); });
  updateStatus();
});

$("collapse-all").addEventListener("click", () => {
  items.forEach((item) => setOpen(item, false));
  updateStatus();
});

/* ---------- Search ---------- */

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;

  items.forEach((item) => {
    const match = item.textContent.toLowerCase().includes(term);
    item.hidden = !match;
    if (match) visible++;
  });

  noResults.hidden = visible > 0;
  updateStatus();
});

/* ---------- Status text ---------- */

function updateStatus() {
  const shown = [...items].filter((item) => !item.hidden).length;
  const open = [...items].filter((item) => item.classList.contains("active")).length;
  statusEl.textContent = `Showing ${shown} of ${items.length} · ${open} open`;
}

/* ---------- Keyboard: arrow keys move between questions ---------- */

document.addEventListener("keydown", (event) => {
  const buttons = [...document.querySelectorAll(".faq-item:not([hidden]) .faq-question")];
  const index = buttons.indexOf(document.activeElement);
  if (index === -1) return;

  let next = null;
  if (event.key === "ArrowDown") next = buttons[(index + 1) % buttons.length];
  else if (event.key === "ArrowUp") next = buttons[(index - 1 + buttons.length) % buttons.length];
  else if (event.key === "Home") next = buttons[0];
  else if (event.key === "End") next = buttons[buttons.length - 1];

  if (next) {
    event.preventDefault();
    next.focus();
  }
});

updateStatus();
