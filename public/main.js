// public/main.js
let currentUser = null;
const GRID_WIDTH = 50;
const GRID_HEIGHT = 30;
const DEFAULT_COLOR = '#7fc8ff'; // 기본 색 (부산대 하늘색 느낌)

document.addEventListener('DOMContentLoaded', async () => {
  await fetchMe();
  initAuthForms();
  buildGrid();
  await loadCells();
});

async function fetchMe() {
  const res = await fetch('/api/auth/me');
  currentUser = await res.json();

  const loggedOut = document.getElementById('logged-out');
  const loggedIn = document.getElementById('logged-in');
  const nicknameSpan = document.getElementById('me-nickname');

  if (currentUser) {
    loggedOut.style.display = 'none';
    loggedIn.style.display = 'block';
    nicknameSpan.textContent = currentUser.nickname;
  } else {
    loggedOut.style.display = 'block';
    loggedIn.style.display = 'none';
  }
}

function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const logoutBtn = document.getElementById('logout-btn');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const body = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || '로그인 실패');
      return;
    }
    currentUser = data;
    await fetchMe();
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const body = {
      email: formData.get('email'),
      password: formData.get('password'),
      nickname: formData.get('nickname'),
    };

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || '회원가입 실패');
      return;
    }
    currentUser = data;
    await fetchMe();
  });

  logoutBtn.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    currentUser = null;
    await fetchMe();
  });
}

function buildGrid() {
  const grid = document.getElementById('pixel-grid');
  grid.innerHTML = '';

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const div = document.createElement('div');
      div.className = 'pixel';
      div.dataset.x = x;
      div.dataset.y = y;
      div.style.backgroundColor = 'white';
      div.dataset.nickname = ''; // 나중에 set

      div.addEventListener('click', onPixelClick);
      div.addEventListener('mousemove', onPixelHover);
      div.addEventListener('mouseleave', onPixelLeave);

      grid.appendChild(div);
    }
  }
}

async function loadCells() {
  const res = await fetch('/api/cells');
  const cells = await res.json();

  const grid = document.getElementById('pixel-grid');
  cells.forEach((cell) => {
    const selector = `.pixel[data-x="${cell.x}"][data-y="${cell.y}"]`;
    const div = grid.querySelector(selector);
    if (div) {
      div.style.backgroundColor = cell.color;
      div.dataset.nickname = cell.nickname;
    }
  });
}

async function onPixelClick(e) {
  if (!currentUser) {
    alert('로그인 후 픽셀을 칠할 수 있습니다.');
    return;
  }

  const pixel = e.currentTarget;
  const x = pixel.dataset.x;
  const y = pixel.dataset.y;

  // 색은 임시로 랜덤 or 고정값
  const color = DEFAULT_COLOR;

  const res = await fetch('/api/cells', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y, color }),
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.message || '픽셀 저장 실패');
    return;
  }

  // 성공 시 화면 반영
  pixel.style.backgroundColor = color;
  pixel.dataset.nickname = currentUser.nickname;
}

function onPixelHover(e) {
  const pixel = e.currentTarget;
  const nickname = pixel.dataset.nickname;
  const tooltip = document.getElementById('tooltip');

  if (!nickname) {
    tooltip.style.display = 'none';
    return;
  }

  tooltip.textContent = nickname;
  tooltip.style.display = 'block';

  // 마우스 위치 기준으로 살짝 위에 표시
  const rect = e.currentTarget.getBoundingClientRect();
  const containerRect = document
    .getElementById('map-container')
    .getBoundingClientRect();

  tooltip.style.left = rect.left - containerRect.left + 'px';
  tooltip.style.top = rect.top - containerRect.top - 20 + 'px';
}

function onPixelLeave() {
  const tooltip = document.getElementById('tooltip');
  tooltip.style.display = 'none';
}
