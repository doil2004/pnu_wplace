class AuthCard {
  constructor(id) {
    this.user = null;

    this.element = document.getElementById(id);
    this.loggedOut = document.querySelector('.logged-out');
    this.loggedIn = document.querySelector('.logged-in');
    this.tabs = this.element.querySelectorAll(".auth-tab");
    
    this.loginForm = this.element.querySelector(".login-form");
    this.registerForm = this.element.querySelector(".register-form");

    this.nicknameSpan = document.querySelector('.me-nickname');
    this.logoutBtn = this.element.querySelector(".logout-btn");


    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => { this.onTabClick(tab) });
    });

    this.loginForm.addEventListener('submit', event => { 
      event.preventDefault();
      this.login();
    });

    this.registerForm.addEventListener('submit', event => { 
      event.preventDefault();
      this.register();
    });

    this.logoutBtn.addEventListener('click', () => { this.logout() });
  }

  onTabClick(tab) {
    const mode = tab.dataset.mode;
    this.element.dataset.mode = mode;
    this.tabs.forEach(t => t.classList.toggle('active', t === tab));
  }

  async login() {
    const formData = new FormData(this.loginForm);
    const body = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    const res = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || '로그인 실패');
      return;
    }
    await this.fetchMe();
  }

  async register() {
    const formData = new FormData(this.registerForm);
    const body = {
      email: formData.get('email'),
      password: formData.get('password'),
      nickname: formData.get('nickname'),
    };
    const res = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || '회원가입 실패');
      return;
    }
    await this.fetchMe();
  }

  async fetchMe() {
    const res = await fetch('/api/auth/me');
    this.user = await res.json();
    this.element.dataset.loggedIn = this.user != null;
    this.nicknameSpan.textContent = this.user.nickname;
  }

  async logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    this.user = null;
    await this.fetchMe();
  }
}