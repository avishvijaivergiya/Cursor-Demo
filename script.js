class Accordion {
  constructor(config = {}, id) {
    this.config = {
      showButton: config.showButton ?? false,
      showIcon: config.showIcon ?? true,
      showSubheading: config.showSubheading ?? false,
      heading: config.heading ?? 'Accordion Heading',
      subheading: config.subheading ?? 'Accordion Subheading',
      buttonLabel: config.buttonLabel ?? 'label',
      content: config.content ?? 'This is the content inside the accordion.',
    };
    this.id = id;
  }

  render() {
    return `
      <div class="accordion" id="${this.id}">
        <div class="accordion-header">
          <div class="header-main" onclick="Accordion.toggleAccordion('${this.id}')">
            ${this.config.showIcon ? `
              <div class="icon-container">
                <span class="material-icons">account_circle</span>
              </div>
            ` : ''}
            <div class="text">
              <h3>${this.config.heading}</h3>
              ${this.config.showSubheading ? `
                <p>${this.config.subheading}</p>
              ` : ''}
            </div>
          </div>
          <div class="accordion-header-right">
            ${this.config.showButton ? `
              <button class="label-button" onclick="event.stopPropagation()">${this.config.buttonLabel}</button>
            ` : ''}
            <div class="icon" onclick="Accordion.toggleAccordion('${this.id}')">
              <span class="material-symbols-rounded">expand_more</span>
            </div>
          </div>
        </div>
        <div class="accordion-content">
          <p>${this.config.content}</p>
        </div>
      </div>
    `;
  }

  static toggleAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    const content = accordion.querySelector('.accordion-content');
    
    if (accordion.classList.contains('open')) {
      content.style.height = '0px';
      accordion.classList.remove('open');
    } else {
      content.style.height = content.scrollHeight + 'px';
      accordion.classList.add('open');
    }
  }
}

class AccordionGroup {
  constructor(config = {}) {
    this.config = {
      numberOfAccordions: config.numberOfAccordions ?? 3,
      containerId: config.containerId ?? 'accordion-container',
      accordionConfigs: config.accordionConfigs ?? [],
      showIcon: config.showIcon ?? true
    };
    
    this.init();
  }

  init() {
    const container = document.getElementById(this.config.containerId);
    if (!container) {
      console.error(`Container with id "${this.config.containerId}" not found`);
      return;
    }

    let accordionsHTML = '';
    
    for (let i = 0; i < this.config.numberOfAccordions; i++) {
      const accordionConfig = this.config.accordionConfigs[i] ?? {};
      const accordion = new Accordion({
        ...accordionConfig,
        showIcon: this.config.showIcon,
        heading: accordionConfig.heading ?? `Accordion ${i + 1}`,
        subheading: accordionConfig.subheading ?? `Subheading ${i + 1}`,
        content: accordionConfig.content ?? `Content for accordion ${i + 1}`
      }, `accordion-${i}`);
      
      accordionsHTML += accordion.render();
    }

    container.innerHTML = accordionsHTML;
  }
}

let currentConfig = {
  numberOfAccordions: 3,
  showIcon: true,
  accordionConfigs: [
    {
      heading: 'First Accordion',
      subheading: 'First Subheading',
      buttonLabel: 'label',
      showButton: true,
      showSubheading: true
    },
    {
      heading: 'Second Accordion',
      subheading: 'Second Subheading',
      buttonLabel: 'label',
      showButton: true,
      showSubheading: true
    },
    {
      heading: 'Third Accordion',
      subheading: 'Third Subheading',
      buttonLabel: 'label',
      showButton: true,
      showSubheading: true
    }
  ]
};

function renderTextControls() {
  const container = document.querySelector('.accordion-text-controls');
  container.innerHTML = currentConfig.accordionConfigs.map((config, index) => `
    <div class="accordion-text-group">
      <h4>Accordion ${index + 1}</h4>
      <input 
        type="text" 
        class="text-input" 
        value="${config.heading}"
        placeholder="Heading"
        onchange="updateAccordionText(${index}, 'heading', this.value)"
      />
      <div class="toggle-controls">
        <button 
          class="toggle-button ${config.showSubheading ? 'active' : ''}" 
          onclick="toggleAccordionFeature(${index}, 'showSubheading')"
        >
          Subheading
        </button>
        <button 
          class="toggle-button ${config.showButton ? 'active' : ''}" 
          onclick="toggleAccordionFeature(${index}, 'showButton')"
        >
          Button
        </button>
      </div>
      ${config.showSubheading ? `
        <input 
          type="text" 
          class="text-input" 
          value="${config.subheading}"
          placeholder="Subheading"
          onchange="updateAccordionText(${index}, 'subheading', this.value)"
        />
      ` : ''}
      ${config.showButton ? `
        <input 
          type="text" 
          class="text-input" 
          value="${config.buttonLabel}"
          placeholder="Button Label"
          onchange="updateAccordionText(${index}, 'buttonLabel', this.value)"
        />
      ` : ''}
    </div>
  `).join('');
}

function toggleAccordionFeature(index, feature) {
  currentConfig.accordionConfigs[index][feature] = !currentConfig.accordionConfigs[index][feature];
  renderAccordions();
}

function toggleFeature(feature) {
  if (feature === 'showIcon') {
    currentConfig.showIcon = !currentConfig.showIcon;
    const button = document.querySelector(`[onclick="toggleFeature('showIcon')"]`);
    button.classList.toggle('active');
    renderAccordions();
  }
}

function updateAccordionCount(change) {
  const newCount = Math.max(1, currentConfig.numberOfAccordions + change);
  currentConfig.numberOfAccordions = newCount;
  
  if (newCount > currentConfig.accordionConfigs.length) {
    for (let i = currentConfig.accordionConfigs.length; i < newCount; i++) {
      currentConfig.accordionConfigs.push({
        heading: `Accordion ${i + 1}`,
        subheading: `Subheading ${i + 1}`,
        buttonLabel: 'label',
        showButton: true,
        showSubheading: true
      });
    }
  } else if (newCount < currentConfig.accordionConfigs.length) {
    currentConfig.accordionConfigs = currentConfig.accordionConfigs.slice(0, newCount);
  }
  
  document.getElementById('accordion-count').textContent = newCount;
  renderAccordions();
}

function renderAccordions() {
  new AccordionGroup({
    numberOfAccordions: currentConfig.numberOfAccordions,
    accordionConfigs: currentConfig.accordionConfigs,
    showIcon: currentConfig.showIcon
  });
  renderTextControls();
}

function updateAccordionText(index, field, value) {
  currentConfig.accordionConfigs[index][field] = value;
  renderAccordions();
}

// Initial render
renderAccordions();