export default function decorate(block) {
  const link = block.querySelector('a');
  let data = [];
  block.innerHTML = '';

  function modifyHTML() {
    const ul = document.createElement('ul');

    data.forEach((item) => {
      const createdLi = document.createElement('li');
      createdLi.innerHTML = `<a href="${item.url}" class="nav-block-item" aria-label="${item.name}">${item.name}</a>`;
      ul.append(createdLi);
    });

    block.append(ul);
  }

  async function initialize() {
    const response = await fetch(link?.href);

    if (response.ok) {
      const jsonData = await response.json();
      data = jsonData?.data;
      modifyHTML();
    }
  }

  initialize();
}
