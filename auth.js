/**
 * Authentication Module - Supabase-based
 * Handles user signup, login, logout, and session management
 */

// ============================================================================
// CONSTANTS & STATE
// ============================================================================

const AUTH_STORAGE_KEYS = {
  currentUser: 'lumen_current_user',
  sessionToken: 'lumen_session_token',
};

let currentUser = null;
let authListeners = [];

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initAuth() {
  const supabase = await initSupabase();
  
  if (!supabase) {
    console.error('Supabase not initialized');
    return;
  }

  // Restore session from localStorage or Supabase
  await restoreSession();

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      currentUser = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email,
        createdAt: session.user.created_at,
      };
      localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
      notifyListeners({ type: 'LOGIN', user: currentUser });
    } else {
      currentUser = null;
      localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
      notifyListeners({ type: 'LOGOUT' });
    }
  });

  return subscription;
}

async function restoreSession() {
  const supabase = await initSupabase();
  if (!supabase) return;

  try {
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      currentUser = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email,
        createdAt: session.user.created_at,
      };
      localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
      notifyListeners({ type: 'SESSION_RESTORED', user: currentUser });
    } else {
      // Try to restore from localStorage (fallback)
      const stored = localStorage.getItem(AUTH_STORAGE_KEYS.currentUser);
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
        } catch {
          currentUser = null;
        }
      }
    }
  } catch (error) {
    console.error('Error restoring session:', error);
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
}

function validatePassword(password) {
  const minLength = 6;
  return String(password || '').length >= minLength;
}

function validateSignupData({ name, email, password, passwordConfirm }) {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (password !== passwordConfirm) {
    errors.passwordConfirm = 'Passwords do not match';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateLoginData({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Sign up a new user with email and password
 * @param {Object} data - { name, email, password, passwordConfirm }
 * @returns {Object} - { success, user, error }
 */

/**
 * Log in or Sign up with Google OAuth
 */
async function loginWithGoogle() {
  const supabase = await initSupabase();
  if (!supabase) return { success: false, error: 'Auth not initialized' };

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/index.html`
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Google Auth Error:', error);
    return { success: false, error: error.message };
  }
}
async function signupUser({ name, email, password, passwordConfirm }) {
  const supabase = await initSupabase();
  if (!supabase) return { success: false, error: 'Auth not initialized' };

  // Validate input
  const { isValid, errors } = validateSignupData({ name, email, password, passwordConfirm });
  if (!isValid) {
    return { success: false, error: Object.values(errors)[0], fieldErrors: errors };
  }

  try {
    // Sign up with Supabase
    const { data, error: signupError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (signupError) {
      let errorMessage = signupError.message;
      if (errorMessage.includes('already registered')) {
        errorMessage = 'This email is already registered. Please log in instead.';
      } else if (errorMessage.includes('invalid')) {
        errorMessage = 'Please check your email and password.';
      }
      return { success: false, error: errorMessage };
    }

    if (data?.user) {
      currentUser = {
        id: data.user.id,
        email: data.user.email,
        name: name.trim(),
        createdAt: data.user.created_at,
      };
      localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
      notifyListeners({ type: 'SIGNUP', user: currentUser });

      return {
        success: true,
        user: currentUser,
        message: 'Account created! Check your email to confirm.',
      };
    }

    return { success: false, error: 'Signup failed. Please try again.' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: error.message || 'An error occurred during signup.' };
  }
}

/**
 * Log in a user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Object} - { success, user, error }
 */
async function loginUser(email, password) {
  const supabase = await initSupabase();
  if (!supabase) return { success: false, error: 'Auth not initialized' };

  // Validate input
  const { isValid, errors } = validateLoginData({ email, password });
  if (!isValid) {
    return { success: false, error: Object.values(errors)[0], fieldErrors: errors };
  }

  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (loginError) {
      let errorMessage = loginError.message;
      if (errorMessage.includes('invalid') || errorMessage.includes('credentials')) {
        errorMessage = 'Invalid email or password.';
      }
      return { success: false, error: errorMessage };
    }

    if (data?.user) {
      currentUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
        createdAt: data.user.created_at,
      };
      localStorage.setItem(AUTH_STORAGE_KEYS.currentUser, JSON.stringify(currentUser));
      notifyListeners({ type: 'LOGIN', user: currentUser });

      return { success: true, user: currentUser };
    }

    return { success: false, error: 'Login failed. Please try again.' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message || 'An error occurred during login.' };
  }
}

/**
 * Log out the current user
 * @returns {Object} - { success, error }
 */
async function logoutUser() {
  const supabase = await initSupabase();
  if (!supabase) return { success: false, error: 'Auth not initialized' };

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }

    currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
    notifyListeners({ type: 'LOGOUT' });

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message || 'An error occurred during logout.' };
  }
}

// ============================================================================
// SESSION & STATE MANAGEMENT
// ============================================================================

function getCurrentUser() {
  return currentUser;
}

function isAuthenticated() {
  return Boolean(currentUser);
}

function getAuthState() {
  return {
    isAuthenticated: isAuthenticated(),
    user: currentUser,
  };
}

function onAuthChange(callback) {
  authListeners.push(callback);
  return () => {
    authListeners = authListeners.filter(listener => listener !== callback);
  };
}

function notifyListeners(event) {
  authListeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('Auth listener error:', error);
    }
  });
}

function readCurrentUser() {
  return getCurrentUser();
}

function clearAuthData() {
  currentUser = null;
  localStorage.removeItem(AUTH_STORAGE_KEYS.currentUser);
}

// ============================================================================
// AUTO-INITIALIZATION & EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
  window.signupUser = signupUser;
  window.loginUser = loginUser;
  window.logoutUser = logoutUser;
  window.clearAuthData = clearAuthData;
  window.readCurrentUser = readCurrentUser;
  window.isAuthenticated = isAuthenticated;
  window.getCurrentUser = getCurrentUser;
  window.getAuthState = getAuthState;
  window.onAuthChange = onAuthChange;
  window.initAuth = initAuth;
  window.loginWithGoogle = loginWithGoogle;

  document.addEventListener('DOMContentLoaded', () => {
    initAuth().catch(error => console.error('Auth init error:', error));
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    loginWithGoogle,
    signupUser,
    loginUser,
    logoutUser,
    clearAuthData,
    readCurrentUser,
    isAuthenticated,
    getCurrentUser,
    getAuthState,
    onAuthChange,
    initAuth,
  };
}
