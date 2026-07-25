const test = require('node:test');
const assert = require('node:assert/strict');

class MemoryStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new MemoryStorage();

const { signupUser, loginUser, logoutUser, clearAuthData } = require('./auth.js');

test('signup creates a user account', () => {
  clearAuthData();
  const user = signupUser({ name: 'Ada', email: 'ada@example.com', password: 'secret123' });

  assert.ok(user);
  assert.equal(user.email, 'ada@example.com');
  assert.equal(user.name, 'Ada');
});

test('login authenticates a registered user', () => {
  clearAuthData();
  signupUser({ name: 'Grace', email: 'grace@example.com', password: 'pass123' });

  const session = loginUser('grace@example.com', 'pass123');
  assert.ok(session);
  assert.equal(session.email, 'grace@example.com');
});

test('login rejects invalid credentials', () => {
  clearAuthData();
  signupUser({ name: 'Linus', email: 'linus@example.com', password: 'root123' });

  const session = loginUser('linus@example.com', 'wrong');
  assert.equal(session, null);
});

test('logout clears the active session', () => {
  clearAuthData();
  signupUser({ name: 'Nina', email: 'nina@example.com', password: 'abc123' });
  loginUser('nina@example.com', 'abc123');

  logoutUser();
  assert.equal(globalThis.localStorage.getItem('lumen_current_user'), null);
});
