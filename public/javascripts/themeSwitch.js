console.log('themeSwitch.js loaded');

const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
  document.documentElement.classList.toggle('light');

  localStorage.setItem(
    'ChirpyTheme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
};

const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

const cookieTheme = localStorage.getItem('ChirpyTheme');
if (cookieTheme) {
  console.log('using cookie theme');
  document.documentElement.classList = [cookieTheme];
} else {
  // Check if the user prefers dark mode
  if (colorScheme.matches) {
    // Apply dark mode styles
    console.log('prefers dark mode');
    document.documentElement.classList = ['dark'];
  } else {
    // Apply light mode styles
    console.log('prefers light mode');

    document.documentElement.classList = ['light'];
  }
}
try {
  document.getElementById('themeSwitch').addEventListener('click', toggleTheme);
} catch (e) {
  console.log('themeSwitch.js: themeSwitch not found');
}
