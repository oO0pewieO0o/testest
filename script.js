
// Outfit Combo Quest - regenerated script
const state = {
  difficulty: 'beginner',
  score: 0,
  streak: 0,
  lives: 3,
  roundData: null,
  timer: null,
  timeLeft: 60
};

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
function safeEval(expr){ try{ return Function('"use strict"; return ('+expr+')')(); } catch(e){ return NaN; } }

const menuBtns = document.querySelectorAll('.menu button');
const views = {
  game: document.getElementById('view-game'),
  tutorial: document.getElementById('view-tutorial'),
  docs: document.getElementById('view-docs'),
  leaderboard: document.getElementById('view-leaderboard'),
  about: document.getElementById('view-about')
};
menuBtns.forEach(b=>{
  b.addEventListener('click', ()=>{
    menuBtns.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    Object.values(views).forEach(v=>v.style.display='none');
    views[b.dataset.view].style.display='block';
  });
});

const levelLabel = document.getElementById('level-label');
const drawBtn = document.getElementById('draw-btn');
const hintBtn = document.getElementById('hint-btn');
const submitBtn = document.getElementById('submit-btn');
const shirtItem = document.getElementById('shirt-item');
const pantsItem = document.getElementById('pants-item');
const shoesItem = document.getElementById('shoes-item');
const challengeTitle = document.getElementById('challenge-title');
const challengeDesc = document.getElementById('challenge-desc');
const answerInput = document.getElementById('answer-input');
const feedback = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const livesEl = document.getElementById('lives');
const diffSelect = document.getElementById('difficulty');
const lbList = document.getElementById('lb-list');
const playerName = document.getElementById('player-name');
const timeLimitEl = document.getElementById('time-limit');

diffSelect.addEventListener('change', ()=>{
  state.difficulty = diffSelect.value;
  levelLabel.textContent = state.difficulty.charAt(0).toUpperCase()+state.difficulty.slice(1);
  resetRound();
});

function generateScenario(){
  if(state.difficulty==='beginner'){
    const shirts = randInt(3,5);
    const pants = randInt(2,4);
    const shoes = randInt(1,3);
    return {
      type:'beginner',
      title:'School Presentation Outfit',
      desc:`Luna needs one top, one bottom, and one pair of shoes for a school presentation. She has ${shirts} tops, ${pants} bottoms, and ${shoes} pairs of shoes.`,
      counts:{shirts,pants,shoes},
      expected: shirts*pants*shoes
    };
  }
  if(state.difficulty==='intermediate'){
    const topsTotal = randInt(5,7);
    const topsValid = Math.max(1, Math.min(4, randInt(1, topsTotal)));
    const bottomsTotal = randInt(3,5);
    const bottomsValid = Math.max(1, Math.min(3, randInt(1, bottomsTotal)));
    const shoesTotal = randInt(2,4);
    const shoesValid = Math.max(1, Math.min(3, randInt(1, shoesTotal)));
    return {
      type:'intermediate',
      title:'Pastel-Themed Charity Event',
      desc:`For a pastel-themed event, Luna will only wear pastel items. She owns ${topsTotal} tops (${topsValid} are pastel), ${bottomsTotal} bottoms (${bottomsValid} are pastel), and ${shoesTotal} pairs of shoes (${shoesValid} match the theme). How many pastel outfits can she assemble?`,
      counts:{topsTotal,topsValid,bottomsTotal,bottomsValid,shoesTotal,shoesValid},
      expected: topsValid*bottomsValid*shoesValid
    };
  }
  // advanced
  const topsTotal = randInt(6,9);
  const topsWrinkle = randInt(1, Math.max(1, Math.floor(topsTotal*0.6)));
  const bottomsTotal = randInt(4,7);
  const bottomsWrinkle = randInt(0, Math.min(2, Math.floor(bottomsTotal*0.4)));
  const shoesTotal = randInt(3,5);
  return {
    type:'advanced',
    title:'Camp Packing — No Ironing Allowed',
    desc:`Luna is packing for a camp where ironing isn't available. She has ${topsTotal} tops (of which ${topsWrinkle} wrinkle easily), ${bottomsTotal} bottoms (of which ${bottomsWrinkle} wrinkle), and ${shoesTotal} pairs of shoes (none wrinkle). How many wrinkle-free outfits can she pack?`,
    counts:{topsTotal,topsWrinkle,bottomsTotal,bottomsWrinkle,shoesTotal},
    expected: (topsTotal - topsWrinkle) * (bottomsTotal - bottomsWrinkle) * shoesTotal
  };
}

function renderScenario(s){
  challengeTitle.textContent = s.title;
  challengeDesc.textContent = s.desc;
  if(s.type==='beginner'){
    shirtItem.textContent = s.counts.shirts + ' tops';
    pantsItem.textContent = s.counts.pants + ' bottoms';
    shoesItem.textContent = s.counts.shoes + ' shoes';
  } else if(s.type==='intermediate'){
    shirtItem.textContent = `${s.counts.topsValid} pastel / ${s.counts.topsTotal}`;
    pantsItem.textContent = `${s.counts.bottomsValid} pastel / ${s.counts.bottomsTotal}`;
    shoesItem.textContent = `${s.counts.shoesValid} pastel / ${s.counts.shoesTotal}`;
  } else {
    shirtItem.textContent = `${s.counts.topsTotal} total (${s.counts.topsWrinkle} wrinkle)`;
    pantsItem.textContent = `${s.counts.bottomsTotal} total (${s.counts.bottomsWrinkle} wrinkle)`;
    shoesItem.textContent = `${s.counts.shoesTotal} shoes`;
  }
  answerInput.value = '';
  feedback.textContent = '';
}

function computeExpected(s){ return s.expected; }

function startTimer(seconds){
  clearInterval(state.timer);
  state.timeLeft = seconds;
  timeLimitEl.textContent = seconds;
  state.timer = setInterval(()=>{
    state.timeLeft--;
    timeLimitEl.textContent = state.timeLeft;
    if(state.timeLeft<=0){
      clearInterval(state.timer);
      onTimeout();
    }
  },1000);
}
function onTimeout(){
  feedback.textContent = 'Time is up — round lost.';
  state.lives--;
  livesEl.textContent = state.lives;
  state.streak = 0;
  streakEl.textContent = state.streak;
  if(state.lives<=0) endGame(); else setTimeout(newRound,1200);
}

function newRound(){
  state.roundData = generateScenario();
  renderScenario(state.roundData);
  const t = state.difficulty==='beginner'?60: state.difficulty==='intermediate'?50:35;
  startTimer(t);
}
function resetRound(){
  clearInterval(state.timer);
  state.score = 0;
  state.streak = 0;
  state.lives = 3;
  scoreEl.textContent = state.score;
  streakEl.textContent = state.streak;
  livesEl.textContent = state.lives;
  newRound();
}

drawBtn.addEventListener('click', ()=>{ newRound(); });
hintBtn.addEventListener('click', ()=>{
  if(!state.roundData) return;
  const s = state.roundData;
  let hint = '';
  if(s.type==='beginner') hint = 'Use multiplication across categories: shirts × bottoms × shoes.';
  else if(s.type==='intermediate') hint = 'Filter by pastel items — use the pastel counts only.';
  else hint = 'Remove wrinkle-prone items from counts before multiplying.';
  feedback.innerHTML = `<div style="color:var(--aqua)">${hint}</div>`;
});

submitBtn.addEventListener('click', ()=>{
  if(!state.roundData) return;
  const raw = answerInput.value.trim();
  if(!raw){ feedback.textContent = 'Please enter an answer.'; return; }
  const guessed = safeEval(raw);
  const expected = computeExpected(state.roundData);
  if(Number.isNaN(guessed) || typeof guessed !== 'number'){ feedback.textContent = 'Invalid input. Enter a number or expression like 3*2*4.'; return; }
  clearInterval(state.timer);
  if(Math.floor(guessed) === Math.floor(expected)){
    const base = state.difficulty==='beginner'?100: state.difficulty==='intermediate'?200:350;
    const speedBonus = Math.max(1, Math.floor(state.timeLeft/5));
    const gained = Math.floor(base * speedBonus * (1 + state.streak*0.1));
    state.score += gained;
    state.streak += 1;
    feedback.innerHTML = `<div style="color:var(--aqua)">Correct! +${gained} points.</div>`;
    scoreEl.textContent = state.score;
    streakEl.textContent = state.streak;
  } else {
    state.lives -= 1;
    state.streak = 0;
    feedback.innerHTML = `<div style="color:#b00020">Wrong. The correct answer was ${expected}.</div>`;
    livesEl.textContent = state.lives;
    streakEl.textContent = state.streak;
  }
  if(state.lives<=0) endGame(); else setTimeout(newRound,1200);
});

function endGame(){
  feedback.innerHTML = `<div style="color:#b00020">Game over. Final score: ${state.score}.</div>`;
  saveScore();
  state.score = 0;
  scoreEl.textContent = 0;
}

function loadLeaderboard(){ const raw = localStorage.getItem('oc_leaderboard'); return raw? JSON.parse(raw): []; }
function saveLeaderboard(lb){ localStorage.setItem('oc_leaderboard', JSON.stringify(lb)); }
function saveScore(){ const name = (playerName.value||'Guest').slice(0,20); const lb = loadLeaderboard(); lb.push({name,score:state.score,when:new Date().toISOString()}); lb.sort((a,b)=>b.score-a.score); saveLeaderboard(lb.slice(0,10)); renderLB(); }
function renderLB(){ const lb = loadLeaderboard(); lbList.innerHTML = ''; if(lb.length===0) lbList.innerHTML = '<li style="color:var(--steel)">No entries yet.</li>'; else lb.forEach(e=>{ const li = document.createElement('li'); li.innerHTML = `<div>${e.name}</div><div style="color:var(--plum)">${e.score}</div>`; lbList.appendChild(li); }); }

renderLB();
resetRound();
document.addEventListener('keydown',(e)=>{ if(e.key==='Enter') submitBtn.click(); });
