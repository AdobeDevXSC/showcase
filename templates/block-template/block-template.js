export default function decorate(block) {
  const sections = block.querySelectorAll('.section');
  const mainWrapper = document.createElement('div');

  mainWrapper.classList.add('main-wrapper');

  sections.forEach((section) => {
    if (!section.classList.contains('nav-container')) {
      mainWrapper.appendChild(section);
      section.style.display = 'block';
    }
  });

  block.appendChild(mainWrapper);
}
