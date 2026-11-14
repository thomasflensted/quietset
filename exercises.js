// Exercise library. Everything here is quiet: no jumping, no landing, no dropping weights.
// slot: which part of the workout it fills. Each workout takes one from every slot.
// eq:   KB = kettlebell (heavy), DB = dumbbell (medium), BW = bodyweight,
//       ANY = kettlebell or dumbbell, your choice
const EXERCISES = [
  // Squat / lunge: quads, glutes
  { id: "goblet-squat",      slot: "squat", eq: "KB", name: "Goblet squat",          reps: "12" },
  { id: "kb-split-squat",    slot: "squat", eq: "KB", name: "Goblet split squat",    reps: "8 / side" },
  { id: "cossack-squat",     slot: "squat", eq: "KB", name: "Cossack squat",         reps: "6 / side" },
  { id: "bulgarian-split",   slot: "squat", eq: "DB", name: "Bulgarian split squat", reps: "8 / side", note: "Rear foot on couch or chair" },
  { id: "db-reverse-lunge",  slot: "squat", eq: "DB", name: "Reverse lunge",         reps: "10 / side" },
  { id: "db-forward-lunge",  slot: "squat", eq: "DB", name: "Forward lunge",         reps: "10 / side", note: "Step down softly" },
  { id: "kb-front-squat",    slot: "squat", eq: "KB", name: "Front rack squat",      reps: "8 / side", note: "Kettlebell racked on one shoulder" },
  { id: "db-lateral-lunge",  slot: "squat", eq: "DB", name: "Lateral lunge",         reps: "8 / side" },
  { id: "wall-sit",          slot: "squat", eq: "BW", name: "Wall sit",              reps: "45 sec" },

  // Hinge: hamstrings, glutes, lower back
  { id: "kb-swing",          slot: "hinge", eq: "KB", name: "Kettlebell swing",      reps: "15" },
  { id: "kb-snatch",         slot: "hinge", eq: "KB", name: "Kettlebell snatch",     reps: "8 / side", note: "Lower it under control" },
  { id: "db-snatch",         slot: "hinge", eq: "DB", name: "Dumbbell snatch",       reps: "8 / side", note: "Lower it under control" },
  { id: "kb-deadlift",       slot: "hinge", eq: "KB", name: "Kettlebell deadlift",   reps: "12", note: "Set it down softly" },
  { id: "kb-sumo-deadlift",  slot: "hinge", eq: "KB", name: "Sumo deadlift",         reps: "12", note: "Set it down softly" },
  { id: "kb-glute-bridge",   slot: "hinge", eq: "KB", name: "Weighted glute bridge", reps: "15", note: "Kettlebell on hips" },
  { id: "db-rdl",            slot: "hinge", eq: "DB", name: "Romanian deadlift",     reps: "12" },
  { id: "db-sl-rdl",         slot: "hinge", eq: "DB", name: "Single-leg RDL",        reps: "8 / side" },
  { id: "db-good-morning",   slot: "hinge", eq: "DB", name: "Good morning",          reps: "12", note: "Dumbbell held at chest" },
  { id: "sl-glute-bridge",   slot: "hinge", eq: "BW", name: "Single-leg glute bridge", reps: "10 / side" },
  { id: "superman",          slot: "hinge", eq: "BW", name: "Superman",              reps: "12", note: "Hold 2 sec at the top" },

  // Push: chest, shoulders, triceps
  { id: "push-up",           slot: "push",  eq: "BW", name: "Push-up",               reps: "12" },
  { id: "close-push-up",     slot: "push",  eq: "BW", name: "Close-grip push-up",    reps: "10" },
  { id: "pike-push-up",      slot: "push",  eq: "BW", name: "Pike push-up",          reps: "8" },
  { id: "floor-press",       slot: "push",  eq: "ANY", name: "Single-arm floor press", reps: "8 / side" },
  { id: "db-ohp",            slot: "push",  eq: "DB", name: "Overhead press",        reps: "10 / side" },
  { id: "db-hk-press",       slot: "push",  eq: "DB", name: "Half-kneeling press",   reps: "8 / side" },

  // Pull: back, biceps, rear delts
  { id: "row",               slot: "pull",  eq: "ANY", name: "Single-arm row",        reps: "10 / side" },
  { id: "kb-high-pull",      slot: "pull",  eq: "KB", name: "High pull",             reps: "12" },
  { id: "db-plank-row",      slot: "pull",  eq: "DB", name: "Plank row",             reps: "8 / side" },
  { id: "db-hammer-curl",    slot: "pull",  eq: "DB", name: "Hammer curl",           reps: "10 / side" },

  // Core
  { id: "plank",             slot: "core",  eq: "BW", name: "Plank",                 reps: "45 sec" },
  { id: "sit-up",            slot: "core",  eq: "BW", name: "Sit-up",                reps: "15" },
  { id: "side-plank",        slot: "core",  eq: "BW", name: "Side plank",            reps: "30 sec / side" },
  { id: "hollow-hold",       slot: "core",  eq: "BW", name: "Hollow hold",           reps: "30 sec" },
  { id: "bird-dog",          slot: "core",  eq: "BW", name: "Bird dog",              reps: "10 / side" },
  { id: "bear-hold",         slot: "core",  eq: "BW", name: "Bear plank hold",       reps: "40 sec" },
  { id: "slow-climbers",     slot: "core",  eq: "BW", name: "Mountain climbers", reps: "10 / side" },
  { id: "db-russian-twist",  slot: "core",  eq: "DB", name: "Russian twist",         reps: "12 / side" },
  { id: "db-halo",           slot: "core",  eq: "DB", name: "Halo",                  reps: "8 / direction" },
  { id: "db-windmill",       slot: "core",  eq: "DB", name: "Windmill",              reps: "6 / side" },
];

const SLOTS = {
  squat: "Legs",
  hinge: "Posterior chain",
  push:  "Push",
  pull:  "Pull",
  core:  "Core",
};

// Orders alternate lower and upper body, and core always comes last.
const SLOT_ORDERS = [
  ["squat", "push", "hinge", "pull", "core"],
  ["hinge", "push", "squat", "pull", "core"],
  ["squat", "pull", "hinge", "push", "core"],
  ["hinge", "pull", "squat", "push", "core"],
];
