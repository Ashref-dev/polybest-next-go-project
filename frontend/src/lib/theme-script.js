// This script runs before React initializes to prevent theme flash
export function setInitialTheme() {
  const script = document.createElement('script');
  script.innerHTML = `
    (function() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    })();
  `;
  document.head.appendChild(script);
} 