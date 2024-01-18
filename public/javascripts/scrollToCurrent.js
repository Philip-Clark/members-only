try {
  console.log('⬇️⬇️ SCROLLING');
  const element = document.getElementById('chirps');
  element.scrollTop = element.scrollHeight;
  console.log('element.scrollTop', element.scrollTop);
} catch (e) {
  console.log('scrollToCurrent.js: element not found');
}
