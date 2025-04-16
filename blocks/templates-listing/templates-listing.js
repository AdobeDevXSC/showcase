import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const spreadsheetLink = block.querySelector('a')?.href;
  block.textContent = '';

  async function fetchJson(link) {
    const response = await fetch(link);

    if (response.ok) {
      const jsonData = await response.json();
      const data = jsonData?.data;
      return data;
    }
    return 'an error occurred';
  }

  function createCards(data) {
    const ul = document.createElement('ul');
    data.forEach((item) => {
      const hasDisplayAd = item.DisplayAd === 'true';
      const hasEmail = item.Email === 'true';
      const hasMetaAd = item.MetaAd === 'true';

      const optimizedMainImage = createOptimizedPicture(item.MainImage, item.Opportunity, true, [{ width: '350' }]);
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="cards-card-image">
          <div class="resources">
            <div><a href="${item.GitHub}" title="GitHub" target="_blank"><img src="/icons/github-logo.svg"></img></a></div>
          </div>
          ${optimizedMainImage.outerHTML}
        </div>
        <div class="cards-card-body">
          <p>${item.Opportunity}</p>
          <div class="tags">
            ${hasEmail ? '<span class="tag tag-email">Email</span>' : ''}
            ${hasDisplayAd ? '<span class="tag tag-display">Display Ad</span>' : ''}
            ${hasMetaAd ? '<span class="tag tag-meta">Meta Ad</span>' : ''}
          </div>
        </div>
        </div>
      `;
      ul.append(li);
    });

    block.append(ul);
  }

  if (spreadsheetLink) {
    const payload = await fetchJson(spreadsheetLink);
    createCards(payload);
  }
}
