/* =========================================================
   CUADERNO POMODORO — lógica de la aplicación
   Persistencia: localStorage (clave "cuadernoPomodoroData")
   Privacidad: todos los datos quedan solo en este navegador,
   no se recolecta información personal ni se envía a servidor alguno.
   ========================================================= */

const STORAGE_KEY = 'cuadernoPomodoroData';

const QUOTES = [
  'Cada pomodoro completado es una prueba de que puedes con esto.',
  'No necesitas motivación infinita, solo el siguiente bloque de 25 minutos.',
  'El progreso de hoy es la confianza de mañana.',
  'Una tarea a la vez, un pomodoro a la vez.',
  'Tu yo del futuro te va a agradecer este bloque de enfoque.',
  'Descansar también es parte de estudiar bien.',
  'La constancia pequeña de cada día construye resultados grandes.'
];

/* Etapas de evolución de la mascota (búho), según el NIVEL del usuario.
   Cada 100 puntos = 1 nivel, y cada pomodoro completado suma 10 puntos,
   así que el búho literalmente "crece" con cada sesión de estudio.
   Diseño 100% original en SVG (sin depender de imágenes externas). */
const OWL_STAGES = {
  egg: `<svg viewBox="0 0 60 60"><ellipse cx="30" cy="36" rx="16" ry="20" fill="#443a63"/>
    <path d="M20 30 q10 -6 20 0" stroke="#7d7099" stroke-width="1.6" fill="none" opacity=".6"/>
    <path d="M18 40 q12 6 24 0" stroke="#7d7099" stroke-width="1.6" fill="none" opacity=".6"/>
    <circle cx="24" cy="30" r="2" fill="#f4eefb" opacity=".8"/></svg>`,

  hatchling: `<svg viewBox="0 0 60 60"><circle cx="30" cy="36" r="17" fill="#4d3f73"/>
    <circle cx="23" cy="33" r="5.4" fill="#f4eefb"/><circle cx="37" cy="33" r="5.4" fill="#f4eefb"/>
    <circle cx="23" cy="33" r="2.3" fill="#241934"/><circle cx="37" cy="33" r="2.3" fill="#241934"/>
    <path d="M27 40 L33 40 L30 44 Z" fill="#ffb454"/>
    <path d="M14 22 L22 27 L14 30 Z" fill="#4d3f73"/><path d="M46 22 L38 27 L46 30 Z" fill="#4d3f73"/>
    <path d="M22 16 q8 -6 16 0" stroke="#ffb454" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,

  young: `<svg viewBox="0 0 60 60"><circle cx="30" cy="34" r="20" fill="#443a63"/>
    <circle cx="22" cy="30" r="6" fill="#f4eefb"/><circle cx="38" cy="30" r="6" fill="#f4eefb"/>
    <circle cx="22" cy="30" r="2.6" fill="#241934"/><circle cx="38" cy="30" r="2.6" fill="#241934"/>
    <path d="M27 38 L33 38 L30 43 Z" fill="#ffb454"/>
    <path d="M8 20 L18 26 L8 30 Z" fill="#443a63"/><path d="M52 20 L42 26 L52 30 Z" fill="#443a63"/>
    <path d="M22 41 q8 5 16 0" stroke="#ffb454" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/></svg>`,

  wise: `<svg viewBox="0 0 60 60">
    <circle cx="30" cy="36" r="20" fill="#4d3f73"/>
    <circle cx="22" cy="32" r="6.4" fill="#f4eefb"/><circle cx="38" cy="32" r="6.4" fill="#f4eefb"/>
    <circle cx="22" cy="32" r="2.8" fill="#241934"/><circle cx="38" cy="32" r="2.8" fill="#241934"/>
    <circle cx="15" cy="40" r="3" fill="#ff8577" opacity=".5"/><circle cx="45" cy="40" r="3" fill="#ff8577" opacity=".5"/>
    <path d="M27 41 L33 41 L30 46 Z" fill="#ffb454"/>
    <path d="M6 22 L18 28 L6 32 Z" fill="#4d3f73"/><path d="M54 22 L42 28 L54 32 Z" fill="#4d3f73"/>
    <!-- birrete de graduación, encaja con el tema académico -->
    <path d="M12 16 L30 8 L48 16 L30 24 Z" fill="#241934"/>
    <rect x="27" y="16" width="6" height="6" fill="#241934"/>
    <line x1="45" y1="17" x2="48" y2="26" stroke="#ffb454" stroke-width="1.6"/>
    <circle cx="48" cy="27" r="1.8" fill="#ffb454"/></svg>`,

  master: `<svg viewBox="0 0 60 60">
    <circle cx="30" cy="36" r="21" fill="none" stroke="#ffb454" stroke-width="1.6" opacity=".65"/>
    <circle cx="30" cy="36" r="20" fill="#57457f"/>
    <circle cx="22" cy="32" r="6.8" fill="#f4eefb"/><circle cx="38" cy="32" r="6.8" fill="#f4eefb"/>
    <circle cx="22" cy="32" r="3" fill="#241934"/><circle cx="38" cy="32" r="3" fill="#241934"/>
    <circle cx="15" cy="40" r="3.2" fill="#ff8577" opacity=".6"/><circle cx="45" cy="40" r="3.2" fill="#ff8577" opacity=".6"/>
    <path d="M27 41 L33 41 L30 46 Z" fill="#ffb454"/>
    <path d="M4 20 L18 27 L4 31 Z" fill="#57457f"/><path d="M56 20 L42 27 L56 31 Z" fill="#57457f"/>
    <path d="M10 15 L30 6 L50 15 L30 24 Z" fill="#241934"/>
    <rect x="27" y="15" width="6" height="6" fill="#241934"/>
    <line x1="47" y1="16" x2="50" y2="26" stroke="#ffb454" stroke-width="1.6"/>
    <circle cx="50" cy="27" r="1.8" fill="#ffb454"/>
    <!-- pequeña aureola de "maestro" -->
    <path d="M30 2 q3 5 0 8 q-3 -3 0 -8 Z" fill="#ffb454"/>
    <path d="M16 6 q3 4 0 7 q-3 -3 0 -7 Z" fill="#ffb454" opacity=".7"/>
    <path d="M44 6 q3 4 0 7 q-3 -3 0 -7 Z" fill="#ffb454" opacity=".7"/></svg>`
};

const LEVEL_STAGE_NAMES = {
  egg:'Huevo', hatchling:'Buhíto recién nacido', young:'Búho joven',
  wise:'Búho sabio 🎓', master:'Búho maestro ✨'
};

function stageForLevel(level){
  if(level >= 16) return 'master';
  if(level >= 8) return 'wise';
  if(level >= 4) return 'young';
  if(level >= 2) return 'hatchling';
  return 'egg';
}

const POINTS_PER_LEVEL = 50; // cada 5 pomodoros subes de nivel — progreso visible y frecuente
function levelFromPoints(points){
  return Math.floor(points / POINTS_PER_LEVEL) + 1;
}

/* ---------------------------------------------------------
   ESTADO
   --------------------------------------------------------- */
const defaultState = {
  durations: { focus: 25, short: 5, long: 15, cyclesUntilLong: 4 },
  mode: 'focus',
  secondsLeft: 25 * 60,
  running: false,
  completedFocusInCycle: 0,
  tasks: [],          // { id, name, pomosEstimated, pomosDone, done, priority, dueDate }
  activeTaskId: null,
  points: 0,
  level: 1,
  streak: 0,
  bestStreak: 0,
  lastStudyDate: null,        // 'YYYY-MM-DD'
  history: {},                // { 'YYYY-MM-DD': { pomos: n, minutes: n } }
  sessionHistory: [],         // [{ date, time, task }] — historial detallado de sesiones
  focusMode: false,
  lastReminderShownDate: null // para no repetir el aviso de recordatorios de forma excesiva
};

let state = loadState();
let timerInterval = null;

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...parsed };
  }catch(e){
    console.error('No se pudo leer el almacenamiento local:', e);
    return structuredClone(defaultState);
  }
}

function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }catch(e){
    console.error('No se pudo guardar el almacenamiento local:', e);
  }
}

function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/* ---------------------------------------------------------
   ELEMENTOS DEL DOM
   --------------------------------------------------------- */
const el = {
  timeDisplay: document.getElementById('time-display'),
  phaseLabel: document.getElementById('phase-label'),
  ringProgress: document.getElementById('ring-progress'),
  startBtn: document.getElementById('start-btn'),
  resetBtn: document.getElementById('reset-btn'),
  skipBtn: document.getElementById('skip-btn'),
  modeTabs: document.querySelectorAll('.mode-tab'),
  durFocus: document.getElementById('dur-focus'),
  durShort: document.getElementById('dur-short'),
  durLong: document.getElementById('dur-long'),
  durCycles: document.getElementById('dur-cycles'),
  quoteBox: document.getElementById('quote-box'),
  streakValue: document.getElementById('streak-value'),
  pointsValue: document.getElementById('points-value'),
  levelValue: document.getElementById('level-value'),
  levelToast: document.getElementById('level-toast'),
  levelToastSub: document.getElementById('level-toast-sub'),
  mascot: document.getElementById('mascot'),
  focusModeBtn: document.getElementById('focus-mode-btn'),
  reminderBanner: document.getElementById('reminder-banner'),
  taskForm: document.getElementById('task-form'),
  taskName: document.getElementById('task-name'),
  taskPriority: document.getElementById('task-priority'),
  taskDue: document.getElementById('task-due'),
  taskPomos: document.getElementById('task-pomos'),
  taskList: document.getElementById('task-list'),
  emptyHint: document.getElementById('empty-hint'),
  statToday: document.getElementById('stat-today'),
  statTotalTime: document.getElementById('stat-total-time'),
  statBestStreak: document.getElementById('stat-best-streak'),
  weekChart: document.getElementById('week-chart'),
  historyList: document.getElementById('history-list'),
  historyEmptyHint: document.getElementById('history-empty-hint'),
  exportBtn: document.getElementById('export-btn'),
  importInput: document.getElementById('import-input'),
  ioStatus: document.getElementById('io-status')
};

const RING_CIRCUMFERENCE = 2 * Math.PI * 100; // r=100
const PRIORITY_ORDER = { alta:0, media:1, baja:2 };
const PRIORITY_LABEL = { alta:'Alta', media:'Media', baja:'Baja' };

/* ---------------------------------------------------------
   AUDIO: beep simple con Web Audio API (sin archivos externos)
   --------------------------------------------------------- */
function playBeep(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }catch(e){ /* audio no disponible, se ignora silenciosamente */ }
}

/* Las notificaciones se reservan solo para el cambio de fase del temporizador
   (el evento realmente importante). En Modo concentración se suprime incluso
   esa notificación del sistema operativo, para minimizar distracciones. */
function notifyPhaseChange(message){
  playBeep();
  if(state.focusMode) return;
  if('Notification' in window && Notification.permission === 'granted'){
    new Notification('Cuaderno Pomodoro', { body: message });
  }
}

if('Notification' in window && Notification.permission === 'default'){
  document.addEventListener('click', () => Notification.requestPermission(), { once:true });
}

/* ---------------------------------------------------------
   TEMPORIZADOR
   --------------------------------------------------------- */
function durationInSeconds(mode){
  const d = state.durations;
  if(mode === 'focus') return d.focus * 60;
  if(mode === 'short') return d.short * 60;
  return d.long * 60;
}

function setMode(mode, resetSeconds = true){
  state.mode = mode;
  if(resetSeconds) state.secondsLeft = durationInSeconds(mode);
  el.modeTabs.forEach(tab => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
  });
  const labels = { focus:'bloque de enfoque', short:'descanso corto', long:'descanso largo' };
  el.phaseLabel.textContent = labels[mode];

  const isFocus = mode === 'focus';
  el.ringProgress.style.stroke = isFocus ? 'var(--lamp)' : 'var(--mint)';
  el.ringProgress.style.filter = isFocus
    ? 'drop-shadow(0 0 12px rgba(255,180,84,.65))'
    : 'drop-shadow(0 0 12px rgba(95,214,189,.6))';

  renderTimer();
  saveState();
}

function renderTimer(){
  const total = durationInSeconds(state.mode);
  const mins = Math.floor(state.secondsLeft / 60);
  const secs = state.secondsLeft % 60;
  el.timeDisplay.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  const progressRatio = total > 0 ? (total - state.secondsLeft) / total : 0;
  el.ringProgress.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - progressRatio);

  el.startBtn.textContent = state.running ? '⏸ Pausar' : '▶ Iniciar';
}

function tick(){
  if(state.secondsLeft > 0){
    state.secondsLeft -= 1;
    renderTimer();
  } else {
    completePhase();
  }
}

function toggleTimer(){
  state.running = !state.running;
  if(state.running){
    timerInterval = setInterval(tick, 1000);
  } else {
    clearInterval(timerInterval);
  }
  renderTimer();
  saveState();
}

function resetTimer(){
  state.running = false;
  clearInterval(timerInterval);
  state.secondsLeft = durationInSeconds(state.mode);
  renderTimer();
  saveState();
}

function skipPhase(){
  clearInterval(timerInterval);
  state.running = false;
  advancePhase(false);
}

function completePhase(){
  clearInterval(timerInterval);
  state.running = false;

  if(state.mode === 'focus'){
    registerCompletedPomodoro();
    notifyPhaseChange('¡Pomodoro completado! Hora de un descanso.');
  } else {
    notifyPhaseChange('Descanso terminado. Volvamos al enfoque.');
  }
  advancePhase(true);
}

function advancePhase(wasNaturalCompletion){
  if(state.mode === 'focus'){
    state.completedFocusInCycle += 1;
    const needsLong = state.completedFocusInCycle >= state.durations.cyclesUntilLong;
    setMode(needsLong ? 'long' : 'short');
    if(needsLong) state.completedFocusInCycle = 0;
  } else {
    setMode('focus');
  }
  if(wasNaturalCompletion){
    el.quoteBox.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }
  saveState();
}

/* ---------------------------------------------------------
   GAMIFICACIÓN + HISTORIAL
   --------------------------------------------------------- */
function registerCompletedPomodoro(){
  const key = todayKey();
  if(!state.history[key]) state.history[key] = { pomos:0, minutes:0 };
  state.history[key].pomos += 1;
  state.history[key].minutes += state.durations.focus;

  state.points += 10;

  updateStreak(key);
  applyToActiveTask();
  logSessionHistory();

  const newLevel = levelFromPoints(state.points);
  const leveledUp = newLevel > state.level;
  state.level = newLevel;

  renderGamification(leveledUp);
  renderStats();
  renderTasks();
  renderHistory();

  if(leveledUp) showLevelUp(newLevel);
}

function updateStreak(key){
  if(state.lastStudyDate === key){
    /* ya contabilizado hoy, no se repite */
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;

    if(state.lastStudyDate === yKey){
      state.streak += 1;
    } else {
      state.streak = 1;
    }
    state.lastStudyDate = key;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
  }
}

function applyToActiveTask(){
  const task = state.tasks.find(t => t.id === state.activeTaskId && !t.done);
  if(task){
    task.pomosDone += 1;
    if(task.pomosDone >= task.pomosEstimated){
      task.done = true;
    }
  }
}

function logSessionHistory(){
  const task = state.tasks.find(t => t.id === state.activeTaskId);
  const now = new Date();
  state.sessionHistory.unshift({
    date: todayKey(),
    time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    task: task ? task.name : 'Sin tarea asignada'
  });
  // se conservan solo las últimas 50 sesiones para no inflar el almacenamiento
  state.sessionHistory = state.sessionHistory.slice(0, 50);
}

function renderGamification(justLeveledUp = false){
  el.streakValue.textContent = `${state.streak} 🔥`;
  el.pointsValue.textContent = `${state.points} ⭐`;
  el.levelValue.textContent = state.level;
  renderMascot(justLeveledUp);
}

function renderMascot(animateEvolution = false){
  const stage = stageForLevel(state.level);
  el.mascot.innerHTML = OWL_STAGES[stage];
  el.mascot.title = `${LEVEL_STAGE_NAMES[stage]} — Nivel ${state.level}`;

  if(animateEvolution){
    el.mascot.classList.remove('evolve');
    // forzar reflow para poder relanzar la animación aunque ya tuviera la clase
    void el.mascot.offsetWidth;
    el.mascot.classList.add('evolve');
    spawnSparkles();
  }
}

/* Pequeñas chispas decorativas alrededor de la mascota al subir de nivel */
function spawnSparkles(){
  const icons = ['✨','⭐','🎉'];
  for(let i = 0; i < 6; i++){
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = icons[i % icons.length];
    const angle = (Math.PI * 2 * i) / 6;
    const dist = 34;
    s.style.setProperty('--sparkle-end', `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`);
    s.style.left = '50%';
    s.style.top = '50%';
    s.style.animationDelay = `${i * 0.03}s`;
    el.mascot.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

/* Notificación de subida de nivel: aparece unos segundos y se retira sola */
let levelToastTimeout = null;
function showLevelUp(newLevel){
  const stage = stageForLevel(newLevel);
  el.levelToastSub.textContent = `Nivel ${newLevel} — ${LEVEL_STAGE_NAMES[stage]}`;
  el.levelToast.classList.add('show');
  clearTimeout(levelToastTimeout);
  levelToastTimeout = setTimeout(() => {
    el.levelToast.classList.remove('show');
  }, 3600);
}

/* ---------------------------------------------------------
   TAREAS (con prioridad, fecha de entrega y recordatorios)
   --------------------------------------------------------- */
function addTask(name, pomosEstimated, priority, dueDate){
  const task = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name, pomosEstimated, priority, dueDate: dueDate || null,
    pomosDone: 0, done: false
  };
  state.tasks.push(task);
  if(!state.activeTaskId) state.activeTaskId = task.id;
  saveState();
  renderTasks();
  checkReminders();
}

function toggleTaskDone(id){
  const task = state.tasks.find(t => t.id === id);
  if(task) task.done = !task.done;
  saveState();
  renderTasks();
  checkReminders();
}

function setActiveTask(id){
  state.activeTaskId = id;
  saveState();
  renderTasks();
}

function deleteTask(id){
  state.tasks = state.tasks.filter(t => t.id !== id);
  if(state.activeTaskId === id) state.activeTaskId = state.tasks[0]?.id ?? null;
  saveState();
  renderTasks();
  checkReminders();
}

function dueDateStatus(dueDate){
  if(!dueDate) return null;
  const today = todayKey();
  if(dueDate < today) return 'overdue';
  if(dueDate === today) return 'today';
  return 'upcoming';
}

function formatDueDate(dueDate){
  const [y,m,d] = dueDate.split('-');
  return `${d}/${m}`;
}

function sortedTasks(){
  return [...state.tasks].sort((a,b) => {
    if(a.done !== b.done) return a.done ? 1 : -1;
    const pa = PRIORITY_ORDER[a.priority] ?? 1;
    const pb = PRIORITY_ORDER[b.priority] ?? 1;
    if(pa !== pb) return pa - pb;
    if(a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if(a.dueDate) return -1;
    if(b.dueDate) return 1;
    return 0;
  });
}

function renderTasks(){
  el.taskList.innerHTML = '';
  el.emptyHint.style.display = state.tasks.length ? 'none' : 'block';

  sortedTasks().forEach(task => {
    const status = dueDateStatus(task.dueDate);
    const li = document.createElement('li');
    li.className = 'task-item'
      + (task.done ? ' done' : '')
      + (task.id === state.activeTaskId ? ' active-task' : '')
      + (status === 'overdue' && !task.done ? ' overdue' : '');

    const check = document.createElement('button');
    check.className = 'task-check' + (task.done ? ' checked' : '');
    check.type = 'button';
    check.setAttribute('aria-label', task.done ? 'Marcar como pendiente' : 'Marcar como completada');
    check.textContent = task.done ? '✓' : '';
    check.addEventListener('click', () => toggleTaskDone(task.id));

    const name = document.createElement('span');
    name.className = 'task-name';
    name.textContent = task.name;
    name.title = 'Clic para fijar como tarea activa del temporizador';
    name.addEventListener('click', () => setActiveTask(task.id));

    const priority = document.createElement('span');
    priority.className = `task-priority ${task.priority}`;
    priority.textContent = PRIORITY_LABEL[task.priority] ?? 'Media';

    const count = document.createElement('span');
    count.className = 'task-pomo-count';
    count.textContent = `${task.pomosDone}/${task.pomosEstimated} 🍅`;

    li.append(check, name, priority);

    if(task.dueDate){
      const due = document.createElement('span');
      due.className = 'task-due' + (status === 'overdue' ? ' due-overdue' : status === 'today' ? ' due-today' : '');
      due.textContent = status === 'today' ? `Hoy` : status === 'overdue' ? `Venció ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate);
      li.appendChild(due);
    }

    li.appendChild(count);

    const del = document.createElement('button');
    del.className = 'task-delete';
    del.type = 'button';
    del.setAttribute('aria-label', 'Eliminar tarea');
    del.textContent = '✕';
    del.addEventListener('click', () => deleteTask(task.id));
    li.appendChild(del);

    el.taskList.appendChild(li);
  });
}

/* ---------------------------------------------------------
   RECORDATORIOS
   Se muestran solo cuando hay algo relevante (vencido o para hoy),
   y como un aviso pasivo en pantalla — no como notificaciones
   emergentes repetidas, para no saturar al usuario.
   --------------------------------------------------------- */
function checkReminders(){
  const pending = state.tasks.filter(t => !t.done && t.dueDate);
  const overdue = pending.filter(t => dueDateStatus(t.dueDate) === 'overdue');
  const dueToday = pending.filter(t => dueDateStatus(t.dueDate) === 'today');

  if(overdue.length === 0 && dueToday.length === 0){
    el.reminderBanner.hidden = true;
    return;
  }

  const parts = [];
  if(overdue.length) parts.push(`${overdue.length} tarea${overdue.length>1?'s':''} vencida${overdue.length>1?'s':''}`);
  if(dueToday.length) parts.push(`${dueToday.length} para hoy`);

  el.reminderBanner.textContent = `Tienes ${parts.join(' y ')}. Revisa tu lista de tareas.`;
  el.reminderBanner.hidden = false;

  // Notificación del sistema: como máximo una vez por día, para no ser invasivo
  const today = todayKey();
  if(state.lastReminderShownDate !== today && !state.focusMode){
    if('Notification' in window && Notification.permission === 'granted'){
      new Notification('Cuaderno Pomodoro', { body: el.reminderBanner.textContent });
    }
    state.lastReminderShownDate = today;
    saveState();
  }
}

/* ---------------------------------------------------------
   MODO CONCENTRACIÓN
   --------------------------------------------------------- */
function setFocusMode(active){
  state.focusMode = active;
  document.body.classList.toggle('focus-mode', active);
  el.focusModeBtn.setAttribute('aria-pressed', String(active));
  el.focusModeBtn.textContent = active ? '🧘 Concentración activa' : '🧘 Modo concentración';
  saveState();
}

/* ---------------------------------------------------------
   HISTORIAL DE SESIONES
   --------------------------------------------------------- */
function renderHistory(){
  el.historyList.innerHTML = '';
  const items = state.sessionHistory.slice(0, 8);
  el.historyEmptyHint.style.display = items.length ? 'none' : 'block';

  items.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const task = document.createElement('span');
    task.className = 'history-task';
    task.textContent = `🍅 ${entry.task}`;

    const date = document.createElement('span');
    date.className = 'history-date';
    date.textContent = `${entry.date} · ${entry.time}`;

    li.append(task, date);
    el.historyList.appendChild(li);
  });
}

/* ---------------------------------------------------------
   ESTADÍSTICAS
   --------------------------------------------------------- */
function renderStats(){
  const key = todayKey();
  const todayData = state.history[key] || { pomos:0, minutes:0 };
  el.statToday.textContent = todayData.pomos;

  const totalMinutes = Object.values(state.history).reduce((sum, d) => sum + d.minutes, 0);
  el.statTotalTime.textContent = `${Math.floor(totalMinutes/60)}h ${totalMinutes%60}m`;

  el.statBestStreak.textContent = state.bestStreak;

  drawWeekChart();
}

function drawWeekChart(){
  const ctx = el.weekChart.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = el.weekChart.clientWidth || 400;
  const height = 140;
  el.weekChart.width = width * dpr;
  el.weekChart.height = height * dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,width,height);

  const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const days = [];
  for(let i = 6; i >= 0; i--){
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    days.push({ label: dayNames[d.getDay()], pomos: state.history[key]?.pomos || 0 });
  }

  const maxPomos = Math.max(4, ...days.map(d => d.pomos));
  const barWidth = width / days.length * 0.5;
  const gap = width / days.length;

  days.forEach((day, i) => {
    const barHeight = (day.pomos / maxPomos) * (height - 30);
    const x = gap * i + (gap - barWidth) / 2;
    const y = height - 22 - barHeight;

    ctx.fillStyle = i === days.length - 1 ? '#ffb454' : '#5fd6bd';
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight || 2, 6);
    ctx.fill();

    ctx.fillStyle = '#b3a7c9';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(day.label, x + barWidth/2, height - 6);
  });
}

/* ---------------------------------------------------------
   CONFIGURACIÓN DE DURACIONES
   --------------------------------------------------------- */
function bindSettingsInputs(){
  el.durFocus.value = state.durations.focus;
  el.durShort.value = state.durations.short;
  el.durLong.value = state.durations.long;
  el.durCycles.value = state.durations.cyclesUntilLong;

  const update = () => {
    state.durations.focus = Number(el.durFocus.value) || 25;
    state.durations.short = Number(el.durShort.value) || 5;
    state.durations.long = Number(el.durLong.value) || 15;
    state.durations.cyclesUntilLong = Number(el.durCycles.value) || 4;
    if(!state.running) state.secondsLeft = durationInSeconds(state.mode);
    renderTimer();
    saveState();
  };

  [el.durFocus, el.durShort, el.durLong, el.durCycles].forEach(input => {
    input.addEventListener('change', update);
  });
}

/* ---------------------------------------------------------
   EXPORTAR / IMPORTAR DATOS
   --------------------------------------------------------- */
function showIoStatus(message, isError = false){
  el.ioStatus.textContent = message;
  el.ioStatus.classList.toggle('error', isError);
}

function exportData(){
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fecha = todayKey();
  a.href = url;
  a.download = `pomodoro-datos-${fecha}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showIoStatus('Datos exportados correctamente ✓');
}

function importData(file){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const parsed = JSON.parse(reader.result);
      if(typeof parsed !== 'object' || !parsed.durations || !Array.isArray(parsed.tasks)){
        throw new Error('El archivo no tiene el formato esperado.');
      }

      state = { ...structuredClone(defaultState), ...parsed };
      state.level = levelFromPoints(state.points); // recalcula por si el archivo es de una versión anterior
      saveState();

      clearInterval(timerInterval);
      state.running = false;
      bindSettingsInputs();
      setMode(state.mode, false);
      setFocusMode(!!state.focusMode);
      renderTimer();
      renderTasks();
      renderGamification();
      renderStats();
      renderHistory();
      checkReminders();

      showIoStatus('Datos importados correctamente ✓');
    }catch(err){
      console.error('Error al importar datos:', err);
      showIoStatus('El archivo seleccionado no es válido. Debe ser un .json exportado desde esta misma app.', true);
    }
  };
  reader.onerror = () => showIoStatus('No se pudo leer el archivo.', true);
  reader.readAsText(file);
}

/* ---------------------------------------------------------
   EVENTOS
   --------------------------------------------------------- */
el.startBtn.addEventListener('click', toggleTimer);
el.resetBtn.addEventListener('click', resetTimer);
el.skipBtn.addEventListener('click', skipPhase);

el.modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    clearInterval(timerInterval);
    state.running = false;
    setMode(tab.dataset.mode);
  });
});

el.taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = el.taskName.value.trim();
  const pomos = Number(el.taskPomos.value) || 1;
  const priority = el.taskPriority.value;
  const dueDate = el.taskDue.value;
  if(!name) return;
  addTask(name, pomos, priority, dueDate);
  el.taskForm.reset();
  el.taskPomos.value = 1;
  el.taskPriority.value = 'media';
  el.taskName.focus();
});

el.focusModeBtn.addEventListener('click', () => setFocusMode(!state.focusMode));

el.exportBtn.addEventListener('click', exportData);

el.importInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(file) importData(file);
  el.importInput.value = '';
});

/* ---------------------------------------------------------
   INICIALIZACIÓN
   --------------------------------------------------------- */
function init(){
  state.level = levelFromPoints(state.points);
  bindSettingsInputs();
  setMode(state.mode, false);
  setFocusMode(!!state.focusMode);
  renderTimer();
  renderTasks();
  renderGamification();
  renderStats();
  renderHistory();
  checkReminders();
  window.addEventListener('resize', drawWeekChart);
}

init();

/* Registro del service worker: habilita el uso offline y la opción
   de "Instalar app" / "Agregar a pantalla de inicio" en el celular. */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((err) => {
      console.error('No se pudo registrar el service worker:', err);
    });
  });
}
