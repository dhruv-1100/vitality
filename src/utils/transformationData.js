// Authoritative Data for the Transformation Plan (Aug 2026 - Dec 2026)

export const USER_PROFILE = {
  name: "User",
  age: 23,
  heightCm: 175,
  startWeightKg: 59.0,
  targetWeightKg: 66.0,
  targetWeightRange: "65 - 68 kg",
  targetCalories: 2800,
  targetProteinG: 150,
  dietType: "Lacto-Vegetarian (Indian Focus)",
  gymSchedule: "5x/week Push/Pull/Legs (PPL)",
  gymTimeWindow: "8:10 AM - 9:40 AM (~90 mins)",
  weighInFrequency: "Weekly (Every Sunday Morning)"
};

export const PHASES = [
  {
    id: "phase1",
    name: "Phase 1 — Foundation",
    dates: "Aug (Weeks 1–5)",
    goal: "Re-groove movement patterns, get connective tissue & CNS reacclimated after 6-8 month layoff.",
    effort: "RPE 6-7 (Wk 1) → RPE 8-9 (Wk 5)",
    focus: "Muscle memory window. Expect fast initial strength returns without rushing.",
    targetWeightKg: 60.5,
    status: "active"
  },
  {
    id: "phase2",
    name: "Phase 2 — Hypertrophy Push",
    dates: "Sep–Oct (Weeks 6–13)",
    goal: "Push volume and loads progressively. Primary size builder block.",
    effort: "RPE 8–9 (Consistently progressive)",
    focus: "Increase calories slightly if weight gain stalls. Maximum muscle growth phase.",
    targetWeightKg: 63.5,
    status: "upcoming"
  },
  {
    id: "phase3",
    name: "Phase 3 — Intensification",
    dates: "Nov (Weeks 14–17)",
    goal: "Convert new muscle size to peak raw strength on compound lifts.",
    effort: "RPE 8–9.5 (Heavy compound focus)",
    focus: "Lower rep range (5–6 reps) on main lifts (Squat, Bench, Row, OHP). Accessories stay high reps.",
    targetWeightKg: 64.5,
    status: "upcoming"
  },
  {
    id: "phase4",
    name: "Phase 4 — Consolidate & Deload",
    dates: "Dec (Weeks 18–21)",
    goal: "Consolidate gains, joint/CNS recovery deload, prepare for 2027.",
    effort: "50% volume deload mid-month",
    focus: "Full reassessment for next phase into 2027.",
    targetWeightKg: 66.0,
    status: "upcoming"
  }
];

export const WEIGHT_CHECKPOINTS = [
  { week: "Week 1", month: "Late July / Early Aug", targetKg: 59.3, note: "Baseline weigh-in & reacclimation setup" },
  { week: "Week 5", month: "End of August", targetKg: 60.5, note: "Strength visibly higher on main compound lifts" },
  { week: "Week 9", month: "End of September", targetKg: 62.0, note: "Visible muscle fullness returning across chest & back" },
  { week: "Week 13", month: "End of October", targetKg: 63.5, note: "Approaching old peak weight, but significantly leaner & stronger" },
  { week: "Week 17", month: "End of November", targetKg: 64.5, note: "Solid lean muscle frame, waist stable" },
  { week: "Week 21", month: "End of December", targetKg: 66.0, note: "Target transformation benchmark achieved!" }
];

export const WORKOUT_ROUTINES = {
  "Push A": {
    name: "Push A (Chest, Shoulders, Triceps)",
    type: "Push",
    note: "Week 1 Buffer: Drop top set range by 1 (do 3 sets instead of 4) and treat rep range ceiling as limit.",
    exercises: [
      { id: "bench_press", name: "Barbell Bench Press", sets: "3-4", reps: "6-8", rest: "2-3 min", targetRpe: "7-8", notes: "Primary chest compound. Keep elbows at 45 deg." },
      { id: "inc_db_press", name: "Incline Dumbbell Press", sets: "3", reps: "8-10", rest: "90 sec", targetRpe: "8", notes: "Set bench to 30 deg incline." },
      { id: "db_ohp", name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "8-10", rest: "90 sec", targetRpe: "8", notes: "Full range of motion down to ear level." },
      { id: "cable_lat_raise", name: "Cable Lateral Raise", sets: "3", reps: "12-15", rest: "60 sec", targetRpe: "8-9", notes: "Control the eccentric phase." },
      { id: "rope_pushdown", name: "Triceps Rope Pushdown", sets: "3", reps: "10-12", rest: "60 sec", targetRpe: "8-9", notes: "Spread rope at the bottom peak contraction." },
      { id: "overhead_tri_ext", name: "Overhead Triceps Extension", sets: "2", reps: "12-15", rest: "60 sec", targetRpe: "9", notes: "Deep stretch on long head of triceps." }
    ]
  },
  "Pull A": {
    name: "Pull A (Back, Biceps, Rear Delts)",
    type: "Pull",
    note: "Seated Cable Row and Machine Row build thickness in place of conventional deadlifts.",
    exercises: [
      { id: "seated_cable_row", name: "Seated Cable Row", sets: "3-4", reps: "8-10", rest: "2 min", targetRpe: "7-8", notes: "Pull to lower sternum, squeeze shoulder blades." },
      { id: "lat_pulldown", name: "Pull-ups / Lat Pulldown", sets: "3-4", reps: "8-10", rest: "2 min", targetRpe: "8", notes: "Focus on driving elbows down to ribcage." },
      { id: "machine_row", name: "Chest-Supported Machine Row", sets: "3", reps: "10-12", rest: "90 sec", targetRpe: "8", notes: "Zero lower back strain, pure upper back." },
      { id: "face_pull", name: "Face Pull", sets: "3", reps: "15", rest: "60 sec", targetRpe: "8", notes: "High pulley, pull to forehead, external rotate." },
      { id: "ez_curl", name: "Barbell / EZ Bar Curl", sets: "3", reps: "10-12", rest: "60 sec", targetRpe: "8-9", notes: "Strict form, no hip swing." },
      { id: "hammer_curl", name: "Hammer Curl", sets: "2", reps: "12", rest: "60 sec", targetRpe: "9", notes: "Targets brachialis for arm thickness." }
    ]
  },
  "Legs A": {
    name: "Legs A (Quads, Hamstrings, Calves)",
    type: "Legs",
    note: "RDL covers hip-hinge hamstring pattern structurally.",
    exercises: [
      { id: "back_squat", name: "Barbell Back Squat", sets: "3-4", reps: "6-8", rest: "3 min", targetRpe: "7-8", notes: "Hit parallel depth with chest upright." },
      { id: "rdl", name: "Romanian Deadlift (RDL)", sets: "3", reps: "8-10", rest: "2 min", targetRpe: "8", notes: "Hinge at hips, stretch hamstrings, slight knee bend." },
      { id: "leg_press", name: "Leg Press", sets: "3", reps: "10-12", rest: "90 sec", targetRpe: "8", notes: "Medium stance, avoid tailbone tuck." },
      { id: "lunges", name: "Walking Lunges", sets: "2", reps: "12/leg", rest: "90 sec", targetRpe: "8", notes: "Upright torso for quad bias." },
      { id: "leg_curl", name: "Leg Curl (Lying or Seated)", sets: "3", reps: "12", rest: "60 sec", targetRpe: "8-9", notes: "Squeeze hamstrings at full flexion." },
      { id: "calf_raise", name: "Standing Calf Raise", sets: "4", reps: "15", rest: "45 sec", targetRpe: "9", notes: "Full stretch at bottom, 1s pause at peak." }
    ]
  },
  "Push B": {
    name: "Push B (Shoulder & Chest Focus)",
    type: "Push",
    note: "Overhead Press is main compound lift.",
    exercises: [
      { id: "ohp_barbell", name: "Overhead Barbell Press (OHP)", sets: "3-4", reps: "6-8", rest: "2-3 min", targetRpe: "7-8", notes: "Strict press from collarbone, brace core." },
      { id: "flat_db_press", name: "Flat Dumbbell Press", sets: "3", reps: "8-10", rest: "90 sec", targetRpe: "8", notes: "Full stretch at bottom." },
      { id: "cable_fly", name: "Cable Fly", sets: "3", reps: "12-15", rest: "60 sec", targetRpe: "8-9", notes: "Cross hands at peak contraction for chest." },
      { id: "db_lat_raise", name: "Dumbbell Lateral Raise", sets: "3", reps: "15", rest: "60 sec", targetRpe: "8-9", notes: "Slight forward tilt, lead with elbows." },
      { id: "cg_bench", name: "Close-Grip Bench Press", sets: "3", reps: "8-10", rest: "90 sec", targetRpe: "8", notes: "Hands shoulder-width apart." },
      { id: "diamond_pushups", name: "Diamond Push-ups (or Cable)", sets: "2", reps: "AMRAP", rest: "60 sec", targetRpe: "10", notes: "Burnout set to full fatigue." }
    ]
  },
  "Pull B": {
    name: "Pull B (Thickness & Bicep Focus)",
    type: "Pull",
    note: "Barbell Row is main compound lift.",
    exercises: [
      { id: "barbell_row", name: "Barbell Row", sets: "3-4", reps: "6-8", rest: "2 min", targetRpe: "7-8", notes: "Torso bent at 45 deg, pull to navel." },
      { id: "chinups", name: "Chin-ups (Underhand Grip)", sets: "3", reps: "8-10", rest: "90 sec", targetRpe: "8", notes: "Great bicep & lat overload." },
      { id: "single_arm_row", name: "Single-Arm Cable / DB Row", sets: "3", reps: "10/side", rest: "90 sec", targetRpe: "8", notes: "Drive elbow back into hip pocket." },
      { id: "lat_pullover", name: "Lat Pullover (Cable or DB)", sets: "3", reps: "12-15", rest: "60 sec", targetRpe: "8", notes: "Keep arms slightly bent, isolate lats." },
      { id: "rear_delt_fly", name: "Rear Delt Fly (Pec Deck or DB)", sets: "3", reps: "15", rest: "60 sec", targetRpe: "8-9", notes: "Squeeze rear delts, avoid traps." },
      { id: "incline_curl", name: "Incline Dumbbell Curl", sets: "3", reps: "10-12", rest: "60 sec", targetRpe: "8-9", notes: "Deep stretch on long head of bicep." }
    ]
  },
  "Legs B": {
    name: "Legs B (Quad & Single-Leg Focus)",
    type: "Legs",
    note: "Front Squat / Hack Squat primary quad builder.",
    exercises: [
      { id: "front_squat", name: "Front Squat or Hack Squat", sets: "3-4", reps: "8", rest: "2-3 min", targetRpe: "7-8", notes: "High quad tension, vertical torso." },
      { id: "bulgarian_split", name: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "90 sec", targetRpe: "8", notes: "Back foot elevated on bench." },
      { id: "leg_ext", name: "Leg Extension", sets: "3", reps: "12-15", rest: "60 sec", targetRpe: "8-9", notes: "Peak squeeze at top for 1s." },
      { id: "seated_leg_curl", name: "Seated Leg Curl", sets: "3", reps: "12-15", rest: "60 sec", targetRpe: "8-9", notes: "Better hamstring stretch than lying curl." },
      { id: "seated_calf", name: "Seated Calf Raise", sets: "4", reps: "15", rest: "45 sec", targetRpe: "9", notes: "Targets soleus muscle." },
      { id: "hanging_leg_raise", name: "Hanging Leg Raise (Core)", sets: "3", reps: "12-15", rest: "60 sec", targetRpe: "8-9", notes: "Posterior pelvic tilt at peak raise." }
    ]
  }
};

// Starting from July 29 (Today - Rest Day)
export const AUGUST_CALENDAR = [
  { date: "2026-07-29", dayName: "Wed", session: "Rest", weekNum: 1, rpe: "-", notes: "Rest day & recovery. Hydrate and prepare for tomorrow." },
  { date: "2026-07-30", dayName: "Thu", session: "Push A", weekNum: 1, rpe: "RPE 6-7 (Re-acclimation)", notes: "Push A session. Leave 3-4 reps in reserve on every set." },
  { date: "2026-07-31", dayName: "Fri", session: "Pull A", weekNum: 1, rpe: "RPE 6-7", notes: "Form priority, focus on driving elbows down." },
  { date: "2026-08-01", dayName: "Sat", session: "Push B", weekNum: 1, rpe: "RPE 6-7", notes: "OHP & Chest focus reacclimation." },
  { date: "2026-08-02", dayName: "Sun", session: "Rest", weekNum: 1, rpe: "-", notes: "Weekly Weigh-In Day & Batch Cook Session 1." },
  
  { date: "2026-08-03", dayName: "Mon", session: "Push A", weekNum: 2, rpe: "RPE 7", notes: "Small load increase if form felt solid." },
  { date: "2026-08-04", dayName: "Tue", session: "Pull A", weekNum: 2, rpe: "RPE 7", notes: "Anchor session. Still 2-3 reps in reserve." },
  { date: "2026-08-05", dayName: "Wed", session: "Legs A", weekNum: 2, rpe: "RPE 7", notes: "Anchor session. Full set ranges starting now." },
  { date: "2026-08-06", dayName: "Thu", session: "Rest", weekNum: 2, rpe: "-", notes: "Batch Cook Session 2 (Thu Prep)." },
  { date: "2026-08-07", dayName: "Fri", session: "Legs B", weekNum: 2, rpe: "RPE 7", notes: "Bulgarian split squats & Hack squat focus." },
  { date: "2026-08-08", dayName: "Sat", session: "Push B", weekNum: 2, rpe: "RPE 7", notes: "OHP compound focus." },
  { date: "2026-08-09", dayName: "Sun", session: "Rest", weekNum: 2, rpe: "-", notes: "Weekly Weigh-In Day & Batch Cook Session 1." },

  { date: "2026-08-10", dayName: "Mon", session: "Push A", weekNum: 3, rpe: "RPE 7-8", notes: "Start pushing loads on main compounds." },
  { date: "2026-08-11", dayName: "Tue", session: "Pull A", weekNum: 3, rpe: "RPE 7-8", notes: "Push Cable Row & Lat Pulldown." },
  { date: "2026-08-12", dayName: "Wed", session: "Legs A", weekNum: 3, rpe: "RPE 7-8", notes: "Push Back Squat & RDL." },
  { date: "2026-08-13", dayName: "Thu", session: "Rest", weekNum: 3, rpe: "-", notes: "Recovery & batch cook top-up." },
  { date: "2026-08-14", dayName: "Fri", session: "Push B", weekNum: 3, rpe: "RPE 7-8", notes: "Heavy OHP focus." },
  { date: "2026-08-15", dayName: "Sat", session: "Pull B", weekNum: 3, rpe: "RPE 7-8", notes: "Heavy Barbell Row focus." },
  { date: "2026-08-16", dayName: "Sun", session: "Rest", weekNum: 3, rpe: "-", notes: "Weekly Weigh-In Day & Batch Cook Session 1." },

  { date: "2026-08-17", dayName: "Mon", session: "Push A", weekNum: 4, rpe: "RPE 8", notes: "Normal working intensity now. Add weight/reps!" },
  { date: "2026-08-18", dayName: "Tue", session: "Pull A", weekNum: 4, rpe: "RPE 8", notes: "Add weight or rep over last week." },
  { date: "2026-08-19", dayName: "Wed", session: "Legs A", weekNum: 4, rpe: "RPE 8", notes: "Push Squat and RDL hard." },
  { date: "2026-08-20", dayName: "Thu", session: "Rest", weekNum: 4, rpe: "-", notes: "Batch Cook Session 2." },
  { date: "2026-08-21", dayName: "Fri", session: "Legs B", weekNum: 4, rpe: "RPE 8", notes: "Quads & calves intensity." },
  { date: "2026-08-22", dayName: "Sat", session: "Push B", weekNum: 4, rpe: "RPE 8", notes: "Push diamond push-ups to failure." },
  { date: "2026-08-23", dayName: "Sun", session: "Rest", weekNum: 4, rpe: "-", notes: "Weekly Weigh-In Day & Batch Cook Session 1." },

  { date: "2026-08-24", dayName: "Mon", session: "Push A", weekNum: 5, rpe: "RPE 8-9", notes: "Final week before Sep hypertrophy block!" },
  { date: "2026-08-25", dayName: "Tue", session: "Pull A", weekNum: 5, rpe: "RPE 8-9", notes: "Push it hard." },
  { date: "2026-08-26", dayName: "Wed", session: "Legs A", weekNum: 5, rpe: "RPE 8-9", notes: "Maximum effort squat session." },
  { date: "2026-08-27", dayName: "Thu", session: "Rest", weekNum: 5, rpe: "-", notes: "Batch Cook Session 2." },
  { date: "2026-08-28", dayName: "Fri", session: "Push B", weekNum: 5, rpe: "RPE 8-9", notes: "Peak Push B weight." },
  { date: "2026-08-29", dayName: "Sat", session: "Pull B", weekNum: 5, rpe: "RPE 8-9", notes: "Peak Pull B weight." },
  { date: "2026-08-30", dayName: "Sun", session: "Rest", weekNum: 5, rpe: "-", notes: "Weekly Weigh-In Day." },
  { date: "2026-08-31", dayName: "Mon", session: "Push A", weekNum: 5, rpe: "RPE 8-9", notes: "Rolls straight into September Hypertrophy Block!" }
];

export const MEAL_TIMETABLE_SCENARIO_A = [
  { time: "7:30 AM", meal: "Wake Up", detail: "Water, banana + black coffee", protein: "0g", cals: "100" },
  { time: "8:10-9:40 AM", meal: "Gym Training", detail: "Hydrate with water (1L)", protein: "0g", cals: "0" },
  { time: "10:20 AM", meal: "Breakfast", detail: "Whey Shake (32g) + Poha or Chilla (~15g fresh cooked)", protein: "45g", cals: "550" },
  { time: "1:00 PM", meal: "Lunch (Biggest)", detail: "Reheated Rice container + Soy Curry / Tofu / Dal", protein: "40g", cals: "750" },
  { time: "5:00 PM", meal: "Afternoon Snack", detail: "Whey shake or Hummus + Pita (before 6:30 class)", protein: "20g", cals: "350" },
  { time: "8:20 PM", meal: "Dinner", detail: "Reheated Rice container + Tofu Stir-Fry / Paneer", protein: "35g", cals: "700" },
  { time: "11:15 PM", meal: "Before Bed", detail: "Warm Milk (250ml) + Handful of nuts (almonds/walnuts)", protein: "10g", cals: "350" }
];

export const MEAL_TIMETABLE_SCENARIO_B = [
  { time: "7:30 AM", meal: "Wake Up", detail: "Water, banana + black coffee", protein: "0g", cals: "100" },
  { time: "8:10-9:40 AM", meal: "Gym Training", detail: "Hydrate with water (1L)", protein: "0g", cals: "0" },
  { time: "10:20 AM", meal: "Breakfast", detail: "Whey Shake (32g) + Chilla / Poha", protein: "45g", cals: "550" },
  { time: "11:15 AM", meal: "Pre-Class Quick Lunch", detail: "Reheated Rice + Moong Dal (before 12:30 class)", protein: "35g", cals: "650" },
  { time: "2:15 PM", meal: "Post-Class Snack", detail: "Hummus + Pita right after class", protein: "15g", cals: "350" },
  { time: "7:30 PM", meal: "Dinner", detail: "Reheated Rice container + Soy Curry / Paneer Bhurji", protein: "40g", cals: "750" },
  { time: "11:15 PM", meal: "Before Bed", detail: "Milk + Almonds / Walnuts", protein: "10g", cals: "350" }
];

export const MEAL_TIMETABLE_WEEKEND = [
  { time: "8:00 AM", meal: "Wake Up & Hydrate", detail: "Water + 1 banana & black coffee", protein: "0g", cals: "100" },
  { time: "8:30-10:00 AM", meal: "Gym / Training Window", detail: "Weekend session & 1L water hydration", protein: "0g", cals: "0" },
  { time: "10:30 AM", meal: "Post-Workout Breakfast", detail: "Whey Shake (32g) + Besan Chilla / Paneer Toast", protein: "45g", cals: "550" },
  { time: "1:30 PM", meal: "Weekend Batch Prep Lunch", detail: "Reheated Pasta or Rice + Rajma / Chana / Paneer", protein: "40g", cals: "750" },
  { time: "5:30 PM", meal: "Evening Snack", detail: "Greek Yogurt Bowl or Hummus + Pita", protein: "20g", cals: "350" },
  { time: "8:30 PM", meal: "Dinner", detail: "Reheated Rice container + Tofu Stir-Fry / Dal", protein: "35g", cals: "700" },
  { time: "11:15 PM", meal: "Bedtime Fuel", detail: "Warm Milk (250ml) + Handful of nuts", protein: "10g", cals: "350" }
];

export const MEAL_TIMETABLES_MAP = {
  "Scenario A (Mon/Wed Class)": MEAL_TIMETABLE_SCENARIO_A,
  "Scenario B (Tue/Thu Class)": MEAL_TIMETABLE_SCENARIO_B,
  "Weekend / Non-Class Prep": MEAL_TIMETABLE_WEEKEND
};

export const TIME_SLOT_ALTERNATIVES = {
  "Wake Up": [
    { name: "Banana + Coffee", detail: "1 large banana + black coffee", protein: "0g", cals: "100" },
    { name: "Toast with Jam", detail: "2 slices whole wheat toast + jam", protein: "4g", cals: "180" },
    { name: "Granola Bar", detail: "1 granola bar + 500ml water", protein: "4g", cals: "140" },
    { name: "2 Bananas + Coffee", detail: "For heavy volume sessions", protein: "2g", cals: "200" }
  ],
  "Breakfast": [
    { name: "Whey + Poha / Chilla", detail: "Whey Shake (32g) + Poha or Besan Chilla", protein: "45g", cals: "550" },
    { name: "Whey + Paneer Toast", detail: "Whey Shake (32g) + 2 Paneer toasts", protein: "48g", cals: "580" },
    { name: "Greek Yogurt Bowl", detail: "200g Greek Yogurt + granola + sliced banana", protein: "25g", cals: "420" },
    { name: "High-Protein Oatmeal", detail: "Oats cooked in milk + 1 scoop Whey + almonds", protein: "40g", cals: "520" }
  ],
  "Lunch": [
    { name: "Rice + Soy Chunk Curry", detail: "Reheated Rice + Soy Curry (Sunday Prep)", protein: "40g", cals: "750" },
    { name: "Rice + Tofu Stir-Fry", detail: "Reheated Rice + Tofu & Peppers (Sunday Prep)", protein: "38g", cals: "720" },
    { name: "Rice + Moong Dal", detail: "Reheated Rice + Spinach Moong Dal", protein: "35g", cals: "680" },
    { name: "Pasta + Paneer Bhurji", detail: "Whole Wheat Pasta + Paneer Bhurji (Thu Prep)", protein: "42g", cals: "760" },
    { name: "Rajma Masala + Rice", detail: "Instant Pot Rajma + Reheated Rice (Thu Prep)", protein: "38g", cals: "730" },
    { name: "Chana Masala + Rice", detail: "Chickpea Curry + Reheated Rice (Thu Prep)", protein: "36g", cals: "710" }
  ],
  "Snack": [
    { name: "Whey Shake + Milk", detail: "1 scoop Whey in 300ml milk", protein: "30g", cals: "250" },
    { name: "Hummus + Whole Wheat Pita", detail: "3 tbsp hummus + 1 whole wheat pita", protein: "18g", cals: "350" },
    { name: "PB Bread + Whole Milk", detail: "2 slices toast with peanut butter + milk", protein: "18g", cals: "380" },
    { name: "Greek Yogurt + Almonds", detail: "Greek yogurt cup + 15 almonds", protein: "20g", cals: "280" }
  ],
  "Dinner": [
    { name: "Rice + Tofu Stir-Fry / Paneer", detail: "Reheated Rice + Tofu Stir-Fry or Paneer", protein: "35g", cals: "700" },
    { name: "Rice + Soy Chunk Curry", detail: "Reheated Rice + Soy Curry", protein: "40g", cals: "750" },
    { name: "Pasta + Paneer / Tofu", detail: "Whole Wheat Pasta + Paneer & frozen broccoli", protein: "38g", cals: "720" },
    { name: "Rajma Masala + Rice", detail: "Reheated Rice + Rajma Masala", protein: "36g", cals: "710" },
    { name: "Paneer Bhurji + Rotis", detail: "Paneer Bhurji + 2 Whole Wheat Rotis", protein: "35g", cals: "680" }
  ],
  "Bedtime": [
    { name: "Warm Milk + Nuts", detail: "250ml Warm Milk + almonds & walnuts", protein: "10g", cals: "350" },
    { name: "Greek Yogurt Bowl", detail: "200g Greek Yogurt + chia seeds", protein: "18g", cals: "220" },
    { name: "Double Whey Shake", detail: "500ml milk + 2 scoops Whey (Quick 60g hit)", protein: "60g", cals: "480" },
    { name: "Cottage Cheese / Paneer Cube", detail: "100g raw paneer / cottage cheese", protein: "18g", cals: "260" }
  ]
};

export const BATCH_COOKING_SESSIONS = [
  {
    id: "sun_prep",
    title: "Session 1: Sunday Main Batch (Cooks Mon–Wed)",
    timeEst: "60-75 min",
    recipes: [
      { name: "Instant Pot Rice (5 servings)", activeTime: "2 min", totalTime: "20 min", ingredients: "3 cups rice, 3.5 cups water, 1 tsp salt. Manual/High 4-5 min." },
      { name: "Soy Chunk Curry (5 servings, ~150g protein)", activeTime: "10 min", totalTime: "20 min", ingredients: "150g dry soy chunks, 2 onions, 2 tomatoes, ginger-garlic, turmeric, chili, coriander, garam masala." },
      { name: "Moong Dal (5 servings)", activeTime: "5 min", totalTime: "25 min", ingredients: "1.5 cups dry moong dal, 3.5 cups water, cumin, garlic, tomato, spinach." },
      { name: "Tofu Stir-Fry (5 servings)", activeTime: "10 min", totalTime: "15 min", ingredients: "2 blocks firm tofu (cubed), bell pepper, onion, garlic, soy sauce, sesame oil." },
      { name: "Chilla Batter (Bulk Batch)", activeTime: "5 min", totalTime: "5 min", ingredients: "2 cups besan (chickpea flour), chopped onion/tomato, spices, water. Keeps 3-4 days in fridge." }
    ]
  },
  {
    id: "thu_prep",
    title: "Session 2: Wed or Thu Top-Up (Cooks Thu–Sun)",
    timeEst: "60-75 min",
    recipes: [
      { name: "Whole Wheat Pasta (5 servings)", activeTime: "2 min", totalTime: "15 min", ingredients: "400g pasta, olive oil. Reheat daily with frozen broccoli & protein." },
      { name: "Rajma or Chana Masala (5 servings, No Soak IP)", activeTime: "10 min", totalTime: "40 min", ingredients: "1.5 cups dry unsoaked rajma/chickpeas, onion-tomato masala, spices, 3.5 cups water. Manual/High 35-40 min." },
      { name: "Paneer Bhurji (5 servings)", activeTime: "8 min", totalTime: "12 min", ingredients: "400g paneer (crumbled), 2 onions, 2 tomatoes, cumin, turmeric, chili powder, cilantro." },
      { name: "Homemade Hummus (Optional)", activeTime: "5 min", totalTime: "5 min", ingredients: "2 cups chickpeas, 1/4 cup tahini, olive oil, lemon juice, garlic." }
    ]
  }
];

export const PROTEIN_ROTATIONS = [
  {
    weekLabel: "Week A",
    session1: "Soy Curry, Moong Dal, Tofu Stir-Fry",
    session2: "Paneer Bhurji, Rajma Masala"
  },
  {
    weekLabel: "Week B",
    session1: "Tofu Stir-Fry, Chana Masala, Soy Curry",
    session2: "Paneer Bhurji, Moong Dal"
  },
  {
    weekLabel: "Week C",
    session1: "Soy Curry, Rajma Masala, Tofu Stir-Fry",
    session2: "Chana Masala, Paneer Bhurji"
  }
];

export const GROCERY_LIST = [
  { category: "Batch Cooking Staples", items: ["Rice (1 bag)", "Whole wheat pasta (1-2 boxes)", "Soy chunks (dry, 150-200g/wk)", "Moong dal (dry)", "Rajma (kidney beans, dry)", "Chickpeas (chana, dry)", "Tofu (2 blocks firm)", "Paneer (400-500g)", "Besan (chickpea flour)", "Onions, Tomatoes, Garlic, Ginger, Bell Peppers"] },
  { category: "No-Cook Staples (Always Stocked)", items: ["Whole Milk (for shakes & night)", "Greek Yogurt / Curd", "Hummus & Pita Bread", "Kirkland Mexican Shredded Cheese", "Avocados", "Peanut Butter & Almonds/Walnuts", "Bananas & Apples", "Poha (flattened rice, buy in bulk)"] },
  { category: "Frozen Veggie Hacks (Zero Prep)", items: ["Frozen Mixed Vegetables (carrots, peas, corn)", "Frozen Broccoli & Spinach (dump straight into reheats)"] },
  { category: "Spices & Pantry Restock", items: ["Turmeric powder", "Chili powder", "Coriander powder", "Garam masala", "Cumin seeds & Mustard seeds", "Olive oil & Sesame oil"] }
];

export const SUPPLEMENTS = [
  { name: "Whey Protein (ON)", dose: "1-2 scoops/day", timing: "Post-workout & morning/snack", purpose: "Fills daily 150g protein gap effortlessly." },
  { name: "Creatine Monohydrate", dose: "5g/day every day", timing: "Anytime consistently", purpose: "Increases strength, power output, and muscle cell hydration." },
  { name: "Vitamin B12", dose: "500-1000 mcg", timing: "Few times/week with meals", purpose: "Essential for vegetarians to maintain nerve & blood health." },
  { name: "Vitamin D3", dose: "1000-2000 IU/day", timing: "Daily with fat-containing meal", purpose: "Supports testosterone, immunity, and bone density." },
  { name: "Omega-3 (Algae-based)", dose: "1 capsule/day", timing: "With meal", purpose: "Vegetarian EPA/DHA source for joint health & recovery." }
];

export const EMERGENCY_MEALS = [
  { title: "Greek Yogurt Bowl", desc: "Greek yogurt + granola + 1 sliced banana" },
  { title: "PB & Milk Classic", desc: "2 slices bread with peanut butter + 1 tall glass whole milk" },
  { title: "Hummus Pita Wrap", desc: "Whole wheat pita + 3 tbsp hummus + shredded cheese + raw veg" },
  { title: "Double Whey Shake", desc: "500ml milk + 2 scoops whey + 1 banana (Quick 60g protein hit)" }
];

export const PRE_WORKOUT_CARBS = [
  "1 Large Banana + Black Coffee (Standard baseline)",
  "2 Slices Toast with Jam",
  "1 Granola Bar",
  "2 Bananas + Coffee (For high-volume sessions)"
];
