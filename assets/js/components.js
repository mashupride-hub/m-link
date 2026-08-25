// Shared site chrome. Existing markup remains as a no-JavaScript fallback.
window.siteComponentsReady = (async () => {
  async function replaceComponent(selector, url, expectedSelector) {
    const current = document.querySelector(selector);
    if (!current) return;

    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

      const template = document.createElement('template');
      template.innerHTML = await response.text();
      const replacement = template.content.querySelector(expectedSelector);
      if (!replacement) throw new Error(`Missing ${expectedSelector}`);

      if (selector === '.header') {
        const currentMobileNav = document.querySelector('.header__mobile-nav');
        const replacementMobileNav = template.content.querySelector('.header__mobile-nav');
        current.replaceWith(replacement);
        if (currentMobileNav && replacementMobileNav) currentMobileNav.replaceWith(replacementMobileNav);
      } else {
        current.replaceWith(replacement);
      }
    } catch (error) {
      console.warn(`Shared component could not be loaded: ${url}`, error);
    }
  }

  await Promise.all([
    replaceComponent('.header', '/components/header.html', '.header'),
    replaceComponent('.footer', '/components/footer.html', '.footer')
  ]);

  const path = window.location.pathname;
  const currentSection = path.startsWith('/products')
    ? 'products'
    : path.startsWith('/company')
      ? 'company'
      : '';

  if (currentSection) {
    document.querySelectorAll(`[data-nav="${currentSection}"]`).forEach(link => {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    });
  }
})();
