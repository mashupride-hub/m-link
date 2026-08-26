// Shared site chrome. Existing markup remains as a no-JavaScript fallback.
window.siteComponentsReady = (async () => {
  const componentScript = document.currentScript;
  const siteRoot = componentScript?.src
    ? new URL('../../', componentScript.src)
    : new URL('./', window.location.href);

  function resolveSiteLinks(root) {
    root.querySelectorAll('a[href^="/"]').forEach(link => {
      link.href = new URL(link.getAttribute('href').slice(1), siteRoot).href;
    });
  }

  // Keep the inline no-JavaScript fallback usable in local and subdirectory builds.
  resolveSiteLinks(document);

  async function replaceComponent(selector, url, expectedSelector) {
    const current = document.querySelector(selector);
    if (!current) return;

    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

      const template = document.createElement('template');
      template.innerHTML = await response.text();
      resolveSiteLinks(template.content);
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
    replaceComponent('.header', new URL('components/header.html', siteRoot), '.header'),
    replaceComponent('.footer', new URL('components/footer.html', siteRoot), '.footer')
  ]);

  const relativePath = window.location.href.slice(siteRoot.href.length);
  const currentSection = relativePath.startsWith('products')
    ? 'products'
    : relativePath.startsWith('company')
      ? 'company'
      : '';

  if (currentSection) {
    document.querySelectorAll(`[data-nav="${currentSection}"]`).forEach(link => {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    });
  }
})();
