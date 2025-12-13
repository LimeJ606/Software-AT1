document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('theme-toggle');
  console.log('Button element:', button); // Check if button is found

  if (!button) {
    console.error('Theme toggle button not found!');
  } else {
    const themes = ['', 'strawberry', 'blueberry']; // '' for default
    let currentIndex = 0;

    button.addEventListener('click', () => {
      console.log('Button clicked!'); // Confirm click event
      const html = document.documentElement;
      currentIndex = (currentIndex + 1) % themes.length;
      const newTheme = themes[currentIndex];
      console.log('New theme:', newTheme); // Log the theme being set
      if (newTheme) {
        html.setAttribute('data-theme', newTheme);
      } else {
        html.removeAttribute('data-theme');
      }
      console.log('Current data-theme attribute:', html.getAttribute('data-theme')); // Confirm attribute set
    });
  }
});