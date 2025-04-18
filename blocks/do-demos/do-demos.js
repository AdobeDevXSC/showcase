/* eslint-disable */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { formatDate, replaceDoubleQuotesWithSingle } from './helper-functions.js';

export default function CardsPortfolio(block) {
  const link = block.querySelector('a');
  let data = [];
  let currentOption = 'All';
  let currentVertical = 'All';
  let totalCardsCount = 0;

  block.textContent = '';

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  function isDevelopmentMode() {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const url = window.location.href;

    const isLocalhost = (hostname === 'localhost' && port === '3000');
    const isPageDomain = url.endsWith('.page') || url.includes('.page/');

    return isLocalhost || isPageDomain;
  }

  function createCards(groups) {
    const updatedCards = [];

    const createSelectOptions = () => {
      return `
        <label for="options-vertical">Verticals: </label>
        <select id="options-vertical">
          <option value="All" ${currentVertical === 'All' ? 'selected' : ''}>All</option>
          <option value="CPG" ${currentVertical === 'CPG' ? 'selected' : ''}>CPG</option>
          <option value="FSI" ${currentVertical === 'FSI' ? 'selected' : ''}>FSI</option>
          <option value="High Tech" ${currentVertical === 'High Tech' ? 'selected' : ''}>High Tech</option>
          <option value="M&E" ${currentVertical === 'M&E' ? 'selected' : ''}>M&E</option>
          <option value="T&H" ${currentVertical === 'T&H' ? 'selected' : ''}>T&H</option>
          <option value="Healthcare" ${currentVertical === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
          <option value="Manufacturing" ${currentVertical === 'Manufacturing' ? 'selected' : ''}>Manufacturing</option>
          <option value="Retail" ${currentVertical === 'Retail' ? 'selected' : ''}>Retail</option>
          <option value="Services" ${currentVertical === 'Services' ? 'selected' : ''}>Services</option>
        </select>

        <label for="options">Filter By: </label>
        <select id="options">
          <option value="All" ${currentOption === 'All' ? 'selected' : ''}>All</option>
          <option value="Microsoft" ${currentOption === 'Microsoft' ? 'selected' : ''}>DocBased - SharePoint</option>
          <option value="Google" ${currentOption === 'Google' ? 'selected' : ''}>DocBased - Google Drive</option>
          <option value="Document Author" ${currentOption === 'Document Author' ? 'selected' : ''}>DocBased - Document Author</option>
          <option value="Experimentation" ${currentOption === 'Experimentation' ? 'selected' : ''}>Experimentation</option>
          <option value="Commerce" ${currentOption === 'Commerce' ? 'selected' : ''}>Commerce</option>
          <option value="Forms" ${currentOption === 'Forms' ? 'selected' : ''}>Forms</option>
          <option value="Crosswalk" ${currentOption === 'Crosswalk' ? 'selected' : ''}>Crosswalk</option>
        </select>
      `;
    };

    const createCardHTML = (item, isFeatured) => {
      const optimizedDemoImage = createOptimizedPicture(item.AccountLogoURL, item.Opportunity, true, [{ width: '350' }]);
      const demoNotes = replaceDoubleQuotesWithSingle(item.DemoNotes);

      return `
        <div class="small-card">
          <div class="card-flip wrapper">
            <div class="card card-images ${isFeatured ? 'featured' : ''}">
              ${isFeatured ? '<span>Featured</span>' : ''}
              <a class="demo-title" href="${item.DemoURL}" target="_blank">${item.Opportunity}</a>
              ${optimizedDemoImage.outerHTML}
            </div>
            <div class="card card-info">
              <div class="date-live-wrapper">
                <span>
                  ${item.Win ?
                    `<div class="icon">
                      <img src="/icons/win.svg" alt="Opportunity Win"/>
                    </div>`
                  : ""}
                  ${formatDate(item.Added)} </span>
                <span>XSC: <a href="mailto:${item.XSCEmail}?Subject=${item.Opportunity} Door Opener"> ${item.XSC}</a> (${item.Region})</span>
              </div>
              <div class="github-drive-wrapper">
                ${item.DemoGit ?
                `<div class="icon">
                  <a class="github-link" href="${item.DemoGit}" target="_blank"><img src="/icons/github-logo.svg" alt="GitHub Logo"/></a>
                </div>`
                : ""}
                ${item.DocBased ?
                  `<div class="icon">
                    <img src="${item.DocBased === "Google" ? "/icons/google-drive-logo.svg" : item.DocBased === "Microsoft" ? "/icons/sharepoint-logo.svg" : item.DocBased === "Document Author" ? "/icons/adobe-logo-placeholder.svg" : "" }" alt="" />
                  </div>`
                : ""}
                ${isDevelopmentMode() ?
                  `<div class="demo-info-wrapper">
                    <button class="demo-info-btn" type="button" title="Click to learn more" data-demo-notes="${demoNotes}" data-demo-title="${item.Opportunity}">Demo Notes</button>
                  </div>`
                : ""}
              </div>
              <div class="related-wrapper">
                ${item.Experimentation ? `<span class="pill experimentation">Experimentation</span>`: ""}
                ${item.Commerce ? `<span class="pill commerce">Commerce</span>` : ""}
                ${item.Forms ?`<span class="pill forms">Forms</span>` : ""}
                ${item.Crosswalk ? `<span class="pill crosswalk">Crosswalk</span>` : ""}
              </div>
              <div class="links-wrapper">
                  ${item.OpportunityURL || item.DemoHub ? `<span>Links: </span>` : "" }
                  ${item.OpportunityURL ? `<a href="${item.OpportunityURL}" target="_blank">Opportunity URL</a>` : ""}
                  ${item.OpportunityURL && item.DemoHub ? ", " : ""}
                  ${item.DemoHub ? `<a href="${item.DemoHub}" target="_blank">DemoHub</a>` : ""}
              </div>
              <div class="site-xsc-wrapper">
                <a class="demo-site-link" href="${item.DemoURL}" target="_blank">Live Demo Site</a>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    groups.forEach((group) => {
      group.forEach((item) => {
        const xsc = getParameterByName('xsc'); 
        const closed = getParameterByName('closed');

        if (((!xsc) || (item.XSC.toLowerCase() == xsc.toLowerCase())) && ((!closed) || (item.Win))) {
          const isFeatured = item.Featured === 'true';
          updatedCards.push(createCardHTML(item, isFeatured));
        }
      });
    });

    block.innerHTML = `
      <div class="portfolio-card-container">
        <div class="filter-container"><div class="count">${totalCardsCount} demos</div>${createSelectOptions()}</div>
        <div class="small-card-container">
          ${groups.length === 0 || groups[0].length === 0 ? '<p>No results</p>' : updatedCards.join('')}
        </div>
      </div>
      <div class="modal" id="demoModal">
        <div class="modal-content">
          <div class="modal-header">
            <div>Demo Notes</div>
            <span class="close">&times;</span>
          </div>
          <div id="demo-notes-content"></div>
        </div>
      </div>`;

    initEventHandlers();
  }

  function sortData(data) {
    let result = [];
    let temp = [];

    for (let i = 0; i < data.length; i++) {
      temp.push(data[i]);
      if (temp.length === 8) { //groups of 8
        result.push(temp);
        temp = [];
      }
    }

    if (temp.length > 0) {
      result.push(temp);
    }

    return result;
  }

  function filterData() {
    let filteredArray = [...data].filter((i) => {

      // Filter only for Vertical
      if (currentOption === 'All' && currentVertical !== 'All' ) {
        return i.Vertical === currentVertical;
      }

      // Filter only for currentOption
      if (currentOption !== 'All' && currentVertical == 'All') {
        if (currentOption === 'Microsoft' || currentOption === 'Google' || currentOption === 'Document Author') {
          return i.DocBased === currentOption;
        } else {
          return i[currentOption] === 'true';
        }
      }

      // Filter by both currentOption and currentVertical
      if (currentOption !== 'All' && currentVertical !== 'All') {
        if (currentOption === 'Microsoft' || currentOption === 'Google' || currentOption === 'Document Author') {
          return i.Vertical === currentVertical && i.DocBased === currentOption;
        } else {
          return i.Vertical === currentVertical && i[currentOption] === 'true';
        }
      }

      // Filter for both
      if (currentOption === 'All' && currentVertical === 'All') {
        return i;
      }
    });

    // Create dynamic cards
    createCards([filteredArray]);

    //need to clear the filteredArray after creating the cards
    filteredArray = [];
  }

  function handleSelectChange(event) {
    currentOption = event.target.value;
    filterData();
  }

  function handleSelectChangeVertical(event) {
    currentVertical = event.target.value;
    filterData();
  }

  function initEventHandlers() {
    const selectElement = block.querySelector('#options');
    selectElement.addEventListener('change', handleSelectChange);

    const selectElementVirtical = block.querySelector('#options-vertical');
    selectElementVirtical.addEventListener('change', handleSelectChangeVertical);

    // Add card-flip animation
    const cards = block.querySelectorAll('.card-flip');
    [...cards].forEach((card) => {
      card.addEventListener('click', function() {
        // Unflip all other cards
        cards.forEach(c => {
          if (c !== card && c.classList.contains('is-flipped')) {
            c.classList.remove('is-flipped');
          }
        });
        // Toggle the current card
        card.classList.toggle('is-flipped');
      });

      // Prevent the card from flipping when clicking on a link or button
      const linksAndButtons = card.querySelectorAll('a, button');
      [...linksAndButtons].forEach((el) => {
        el.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      });
    });

    // Add onclick event to demo-info-btn buttons
    const demoInfoButtons = block.querySelectorAll('.demo-info-btn');
    demoInfoButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const demoNotes = button.getAttribute('data-demo-notes');
        const demoTitle = button.getAttribute('data-demo-title');
        const modal = document.getElementById('demoModal');
        const modalContent = document.getElementById('demo-notes-content');
        const modalHeader = modal.querySelector('.modal-header div');

        modalContent.innerHTML = demoNotes;
        modalHeader.textContent = `${demoTitle}`;
        modal.style.display = 'block';
      });
    });

    // Close the modal
    const modal = document.getElementById('demoModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  async function initialize() {
    var sheet = getParameterByName('sheet'); 
    var sheetParm = ""
    
    if (sheet) {
      sheetParm = sheetParm.concat("sheet=", sheet);
    } else {
      sheetParm = sheetParm.concat("sheet=filtered");
    }

    const response = await fetch(link?.href.concat("?", sheetParm));

    if (response.ok) {
      const jsonData = await response.json();
      data = jsonData.data;
      totalCardsCount = data.length;
      createCards(sortData(data));
    }
  }

  initialize();
}