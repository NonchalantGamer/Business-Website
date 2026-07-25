const siteRoutes = {
  home: { label: 'Home', href: 'index.html' },
  features: { label: 'Features', href: 'features.html' },
  pricing: { label: 'Pricing', href: 'pricing.html' },
  useCases: { label: 'Use Cases', href: 'use-cases.html' },
  blog: { label: 'Blog', href: 'blog.html' },
  about: { label: 'About', href: 'about.html' },
  contact: { label: 'Contact', href: 'contact.html' },
};

function getCurrentPage() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path.replace('.html', '') || 'home';
}

function renderHeader() {
  const host = document.querySelector('[data-site-header]');
  if (!host) return;
  const page = getCurrentPage();
  const user = (typeof window !== 'undefined' && window.readCurrentUser) ? window.readCurrentUser() : null;
  const isLoggedIn = Boolean(user);
  const authActions = isLoggedIn
    ? `<a class="btn btn-primary" href="profile.html" aria-label="Open profile"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.2 0-7 2.2-7 5v1h14v-1c0-2.8-2.8-5-7-5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`
    : `<a class="btn btn-ghost" href="login.html">Login</a><a class="btn btn-primary" href="signup.html">Sign Up</a>`;

  host.innerHTML = `
    <header class="site-header">
      <div class="container navbar">
        <a class="brand" href="index.html" aria-label="Lumen AI home">
          <span class="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M9 12.8 11.3 15l4-4.2" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span>Lumen AI</span>
        </a>
        <nav class="nav-links" aria-label="Primary navigation">
          ${Object.entries(siteRoutes).map(([key, item]) => {
            const isActive = page === key || (page === 'home' && key === 'home');
            return `<a class="nav-link ${isActive ? 'active' : ''}" href="${item.href}" ${isActive ? 'aria-current="page"' : ''}>${item.label}</a>`;
          }).join('')}
        </nav>
        <div class="nav-actions">
          ${authActions}
        </div>
      </div>
    </header>
  `;
}

function renderFooter() {
  const host = document.querySelector('[data-site-footer]');
  if (!host) return;
  host.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html" aria-label="Lumen AI home">
              <span class="brand-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4Z" stroke="white" stroke-width="1.8" stroke-linejoin="round"/>
                  <path d="M9 12.8 11.3 15l4-4.2" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span>Lumen AI</span>
            </a>
            <p style="margin-top: 0.85rem; max-width: 340px;">Turn every product video into an immersive 3D story that sells faster and feels more real.</p>
            <div class="socials" aria-label="Social links">
              <a href="#" aria-label="X"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18.9 3H22l-6.6 7.6L23 21h-5.4l-4.2-5.5L8.8 21H5.6l7.1-8.1L1 3h5.5l3.8 5L18.9 3Z" stroke="currentColor" stroke-width="1.6"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.5h2.88V18H5.5zM10.7 9.5h2.76v1.16h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.44 1.91 3.44 4.39V18h-2.88v-7.62c0-1.81-.03-4.15-2.53-4.15-2.53 0-2.92 1.98-2.92 4.03V18H10.7z" fill="currentColor"/></svg></a>
              <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.3" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/></svg></a>
            </div>
          </div>
          <div>
            <h3>Product</h3>
            <div class="footer-links">
              <a href="features.html">Features</a>
              <a href="pricing.html">Pricing</a>
              <a href="use-cases.html">Use Cases</a>
            </div>
          </div>
          <div>
            <h3>Company</h3>
            <div class="footer-links">
              <a href="about.html">About</a>
              <a href="blog.html">Blog</a>
              <a href="contact.html">Contact</a>
            </div>
          </div>
          <div>
            <h3>Resources</h3>
            <div class="footer-links">
              <a href="login.html">Login</a>
              <a href="signup.html">Sign Up</a>
              <a href="contact.html">Support</a>
            </div>
          </div>
        </div>
        <p style="margin-top: 1.2rem; color: var(--muted);">© <span id="year"></span> Lumen AI. All rights reserved.</p>
      </div>
    </footer>
  `;
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
  });
}
