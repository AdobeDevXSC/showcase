import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const spreadsheetLink = block.querySelector('a')?.href;
  block.textContent = '';

  async function fetchJson(link) {
    const response = await fetch(link);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData?.data;
    }
    return 'an error occurred';
  }

  function attachCategorizedAssets(data) {
    return data.map((item) => {
      const emailAssets = [];
      const displayAdAssets = [];
      const metaAdAssets = [];

      // Email assets
      if (item.Email1Pod) emailAssets.push({ key: 'Email1Pod', value: item.Email1Pod });
      if (item.Email2Pod) emailAssets.push({ key: 'Email2Pod', value: item.Email2Pod });
      if (item.Email3Pod) emailAssets.push({ key: 'Email3Pod', value: item.Email3Pod });

      // Display Ad assets
      if (item.DisplayAd300x600) displayAdAssets.push({ key: 'DisplayAd300x600', value: item.DisplayAd300x600 });
      if (item.DisplayAd300x250) displayAdAssets.push({ key: 'DisplayAd300x250', value: item.DisplayAd300x250 });
      if (item.DisplayAd970x250) displayAdAssets.push({ key: 'DisplayAd970x250', value: item.DisplayAd970x250 });

      // Meta Ad assets
      if (item.MetaAd1x1) metaAdAssets.push({ key: 'MetaAd1x1', value: item.MetaAd1x1 });
      if (item.MetaAd4x5) metaAdAssets.push({ key: 'MetaAd4x5', value: item.MetaAd4x5 });
      if (item.MetaAd9x16) metaAdAssets.push({ key: 'MetaAd9x16', value: item.MetaAd9x16 });

      return {
        ...item,
        emailAssets,
        displayAdAssets,
        metaAdAssets,
      };
    });
  }

  function createCards(data) {
    const ul = document.createElement('ul');

    console.log("data: ", data);

    data.forEach((item) => {
      const hasDisplayAd = item.DisplayAd === 'true';
      const hasEmail = item.Email === 'true';
      const hasMetaAd = item.MetaAd === 'true';

      const optimizedMainImage = createOptimizedPicture(
        item.MainImage,
        item.Opportunity,
        true,
        [{ width: '350' }],
      );

      const li = document.createElement('li');
      li.innerHTML = `
        <div class="cards-card-image-flip">
          <div class="flip-inner">
            <div class="flip-front">
              ${optimizedMainImage.outerHTML}
            </div>
            <div class="flip-back">
              <div class="resources">
                <a href="${item.GitHub}" title="GitHub" target="_blank">
                  <img src="/icons/github-logo.svg" alt="GitHub">
                </a>
                <div class="templates-container">
                  ${item.emailAssets.length ? `
                    <div class="template-type">
                      Email
                      <div class="tags">
                        ${item.emailAssets.map((asset) => `<span class="tag tag-email" title="${asset.key}" data-src="${asset.value}">${asset.key}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${item.displayAdAssets.length ? `
                    <div template-type>
                      Display Ad
                      <div class="tags">
                        ${item.displayAdAssets.map((asset) => `<span class="tag tag-display" title="${asset.key}" data-src="${asset.value}">${asset.key}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}

                  ${item.metaAdAssets.length ? `
                    <div template-type>
                      Meta Ad
                      <div class="tags">
                        ${item.metaAdAssets.map((asset) => `<span class="tag tag-meta" title="${asset.key}" data-src="${asset.value}">${asset.key}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="cards-card-body">
          <p>${item.Opportunity}</p>
          <div class="tags">
            ${hasEmail ? '<span class="tag tag-email">Email</span>' : ''}
            ${hasDisplayAd ? '<span class="tag tag-display">Display Ad</span>' : ''}
            ${hasMetaAd ? '<span class="tag tag-meta">Meta Ad</span>' : ''}
          </div>
        </div>
      `;

      li.addEventListener('click', () => {
        // Unflip any currently flipped cards
        const allFlipped = ul.querySelectorAll('.flip-inner.flipped');
        allFlipped.forEach((flipped) => {
          if (flipped !== li.querySelector('.flip-inner')) {
            flipped.classList.remove('flipped');
          }
        });

        // Toggle flip on the current card
        const flipContainer = li.querySelector('.flip-inner');
        flipContainer.classList.toggle('flipped');
      });

      ul.append(li);
    });

    block.append(ul);
  }

  if (spreadsheetLink) {
    const payload = await fetchJson(spreadsheetLink);
    const enhancedData = attachCategorizedAssets(payload);
    createCards(enhancedData);
  }
}
