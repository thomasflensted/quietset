const STORAGE_KEY = "quietset.history.v1";
const MAX_HISTORY = 5;
const ROUNDS = 5;

const byId = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
let history = load();
let currentId = history[0]?.id ?? null;

// ---------- storage ----------

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // Exercises that were merged into one keep working in saved workouts.
    const renamed = { "kb-floor-press": "floor-press", "db-floor-press": "floor-press", "kb-row": "row", "db-row": "row" };
    raw.forEach((w) => (w.exercises = w.exercises.map((id) => renamed[id] ?? id)));
    // Drop workouts that use exercises no longer in the library.
    return raw.filter((w) => w.exercises.every((id) => byId[id]));
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
  } catch {
    // Private mode or storage full: the app still works for this session.
  }
}

// ---------- generation ----------

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generate() {
  const recent = new Set(history[0]?.exercises ?? []);
  const order = pick(SLOT_ORDERS);
  let best = null;

  // Try a few times to get a workout that uses both the kettlebell and the dumbbell
  // and doesn't repeat anything from the previous workout.
  for (let i = 0; i < 60; i++) {
    const ids = order.map((slot) => {
      const options = EXERCISES.filter((e) => e.slot === slot);
      const fresh = options.filter((e) => !recent.has(e.id));
      return pick(fresh.length ? fresh : options).id;
    });
    best = ids;
    if (usesBoth(ids)) break;
  }

  const workout = {
    id: Date.now().toString(36),
    createdAt: new Date().toISOString(),
    exercises: best,
    rounds: 0,
  };
  history = [workout, ...history].slice(0, MAX_HISTORY);
  currentId = workout.id;
  save();
  render();
}

function setRounds(n) {
  const w = current();
  if (!w) return;
  w.rounds = w.rounds === n ? n - 1 : n;
  save();
  render();
}

// True if the workout can use both the kettlebell and the dumbbell.
// An ANY exercise can be done with either, so it fills whichever is missing.
function usesBoth(ids) {
  const n = { KB: 0, DB: 0, ANY: 0, BW: 0 };
  ids.forEach((id) => n[byId[id].eq]++);
  return n.KB + n.ANY >= 1 && n.DB + n.ANY >= 1 && n.KB + n.DB + n.ANY >= 2;
}

const current = () => history.find((w) => w.id === currentId) ?? null;

// ---------- rendering ----------

const $ = (sel) => document.querySelector(sel);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function render() {
  const w = current();
  $("#empty").hidden = !!w;
  $("#workout").hidden = !w;

  if (w) {
    $("#exercise-list").innerHTML = w.exercises
      .map((id, i) => {
        const e = byId[id];
        return `
        <li class="ex">
          <span class="ex-name">${esc(e.name)}</span>
        </li>`;
      })
      .join("");

    $("#rounds").innerHTML = Array.from({ length: ROUNDS }, (_, i) => {
      const n = i + 1;
      const done = n <= w.rounds;
      return `<button class="round ${done ? "done" : ""}" data-round="${n}" aria-pressed="${done}" aria-label="Round ${n}">${n}</button>`;
    }).join("");
  }

  $("#history-section").hidden = history.length === 0;
  $("#history").innerHTML = history
    .map((h) => {
      const names = h.exercises.map((id) => byId[id].name).join(", ");
      return `
      <li>
        <button class="hist ${h.id === currentId ? "active" : ""}" data-open="${h.id}">
          <span class="hist-names">${esc(names)}</span>
        </button>
      </li>`;
    })
    .join("");
}

// ---------- events ----------

$("#generate").addEventListener("click", generate);

document.addEventListener("click", (ev) => {
  const t = ev.target.closest("[data-round],[data-open]");
  if (!t) return;
  if (t.dataset.round != null) setRounds(Number(t.dataset.round));
  else if (t.dataset.open != null) {
    currentId = t.dataset.open;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.addEventListener("keydown", (ev) => {
  if (ev.key === "g" && !ev.metaKey && !ev.ctrlKey && !ev.altKey && ev.target === document.body) generate();
});

render();
