export default function decorate(block) {
  const link = block.querySelector('a');
  let data = [];
  block.innerHTML = '';

  function modifyHTML() {
    const ul = document.createElement('ul');

    data.forEach((item) => {
      const createdLi = document.createElement('li');
      createdLi.innerHTML = `<a href="${item.url}" class="nav-block-item" aria-label="${item.name.toLowerCase()}">${item.name}</a>`;
      ul.append(createdLi);
    });

    block.append(ul);
  }

  function setActiveTab() {
    const activeBlock = window.location.pathname.split('/').pop();
    // console.log("activeBlock: ", activeBlock);

    const targetedList = block.querySelector('ul');
    const targetedListItem = targetedList.querySelector(`li a[aria-label="${activeBlock}"]`);
    console.log(targetedListItem);
    targetedListItem.classList.add('active');
  }

  async function initialize() {
    const response = await fetch(link?.href);

    if (response.ok) {
      const jsonData = await response.json();
      data = jsonData?.data;
      modifyHTML();
      setActiveTab();
    }
  }

  initialize();
}
