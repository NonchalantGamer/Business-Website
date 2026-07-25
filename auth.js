const AUTH_STORAGE_KEYS = {
  users: 'lumen_users',
  currentUser: 'lumen_current_user',
};

function readUsers() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.users);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (typeof globalThis.localStorage !== 'undefined') {
    const raw = globalThis.localStorage.getItem(AUTH_STORAGE_KEYS.users);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function persistUsers(users) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.users, JSON.stringify(users));
  }
  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.setItem(AUTH_STORAGE_KEYS.users, JSON.stringify(users));
  }
}

function readCurrentUser() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  }
  if (typeof globalThis.localStorage !== 'undefined') {
    const raw = globalThis.localStorage.getItem(AUTH_STORAGE_KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}

function isAuthenticated() {
  return Boolean(readCurrentUser());
}

function writeCurrentUser(user) {
  const payload = user ? JSON.stringify(user) : null;
  if (typeof window !== 'undefined' && window.localStorage) {
    if (payload) window.localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, payload);
    else window.localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
  }
  if (typeof globalThis.localStorage !== 'undefined') {
    if (payload) globalThis.localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, payload);
    else globalThis.localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
  }
}

function signupUser({ name, email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedName = String(name || '').trim();
  const normalizedPassword = String(password || '').trim();

  if (!normalizedEmail || !normalizedName || !normalizedPassword) {
    return null;
  }

  const users = readUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    return null;
  }

  const user = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: normalizedName,
    email: normalizedEmail,
    password: normalizedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  persistUsers(users);
  writeCurrentUser(user);
  return user;
}

function loginUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();
  const users = readUsers();
  const user = users.find((entry) => entry.email === normalizedEmail && entry.password === normalizedPassword);

  if (!user) {
    writeCurrentUser(null);
    return null;
  }

  const sessionUser = { id: user.id, name: user.name, email: user.email };
  writeCurrentUser(sessionUser);
  return sessionUser;
}

function logoutUser() {
  writeCurrentUser(null);
}

function clearAuthData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.users);
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
  }
  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.removeItem(AUTH_STORAGE_KEYS.users);
    globalThis.localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
  }
}

if (typeof window !== 'undefined') {
  window.signupUser = signupUser;
  window.loginUser = loginUser;
  window.logoutUser = logoutUser;
  window.clearAuthData = clearAuthData;
  window.readCurrentUser = readCurrentUser;
}

if (typeof module !== 'undefined') {
  module.exports = {
    signupUser,
    loginUser,
    logoutUser,
    clearAuthData,
    readCurrentUser,
    isAuthenticated,
  };
}
