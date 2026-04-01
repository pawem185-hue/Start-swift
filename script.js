const app = document.getElementById('app');
const pageLabel = document.getElementById('pageLabel');

const state = {
  step: 'landing',
  readiness: '',
  businessType: '',
  industry: '',
  structure: 'LLC'
};

const pageNumbers = {
  landing: 1,
  businessType: 2,
  industry: 3,
  structure: 4,
  register: 5,
  ein: 6,
  launch: 7
};

const readinessLabels = {
  launching: 'Already had a plan and needed help launching',
  solidifying: 'Needed help solidifying the plan and launching',
  idea: 'Starting from the idea stage'
};

const structureData = {
  'LLC': {
    url: 'https://dos.ny.gov/forming-limited-liability-company-new-york',
    checklist: [
      'Submit your business name',
      'File your LLC with the state',
      'Pay the $200 filing fee',
      'Receive confirmation of your business'
    ]
  },
  'Sole Proprietorship': {
    url: 'https://www.nyc.gov/site/business/plan/plan-your-business.page',
    checklist: [
      'Confirm whether you need a DBA or assumed name',
      'Check licensing requirements for your industry',
      'Set up tax and banking basics',
      'Prepare to separate personal and business finances'
    ]
  },
  'Partnership': {
    url: 'https://dos.ny.gov/form-corporation-or-business',
    checklist: [
      'Agree on ownership terms with partners',
      'Draft a partnership agreement',
      'Register the business if required',
      'Get tax and compliance documents in place'
    ]
  },
  'S Corp': {
    url: 'https://dos.ny.gov/form-corporation-or-business',
    checklist: [
      'Form your business entity first',
      'Confirm S Corp eligibility',
      'File the proper tax election',
      'Coordinate with an accountant on payroll and compliance'
    ]
  },
  'C Corp': {
    url: 'https://dos.ny.gov/form-corporation-or-business',
    checklist: [
      'Incorporate with the state',
      'Prepare governing documents',
      'Issue founder shares properly',
      'Set up tax, payroll, and annual compliance workflows'
    ]
  }
};

function render() {
  pageLabel.textContent = `Page ${pageNumbers[state.step] || 1}`;
  const tplMap = {
    landing: 'landing-template',
    businessType: 'business-type-template',
    industry: 'industry-template',
    structure: 'structure-template',
    register: 'register-template',
    ein: 'ein-template',
    launch: 'launch-template'
  };
  app.innerHTML = document.getElementById(tplMap[state.step]).innerHTML;

  if (state.step === 'industry') {
    document.getElementById('typeHeadline').textContent = state.businessType || 'This';
  }

  if (state.step === 'structure') {
    document.getElementById('industryHeadline').textContent = capitalizeWords(state.industry || 'Your business');
  }

  if (state.step === 'register') {
    const name = document.getElementById('structureName');
    const list = document.getElementById('registrationChecklist');
    const link = document.getElementById('officialRegistrationLink');
    const data = structureData[state.structure] || structureData['LLC'];
    name.textContent = state.structure;
    list.innerHTML = data.checklist.map(item => `<li>${item}</li>`).join('');
    link.href = data.url;
  }

  if (state.step === 'launch') {
    document.getElementById('summaryReadiness').textContent = readinessLabels[state.readiness] || 'Not selected';
    document.getElementById('summaryType').textContent = state.businessType || 'Not selected';
    document.getElementById('summaryIndustry').textContent = capitalizeWords(state.industry || 'Not entered');
    document.getElementById('summaryStructure').textContent = state.structure || 'Not selected';
    document.getElementById('nextStepsList').innerHTML = getNextSteps().map(item => `<li>${item}</li>`).join('');
  }
}

function getNextSteps() {
  const common = [
    'Create your brand basics: name, logo, domain, and social handles.',
    'Set up a simple bookkeeping system before your first sales come in.',
    'Confirm any local permits, sales tax, or industry-specific requirements.'
  ];

  if (state.businessType === 'Online / e-commerce') {
    common.unshift('Choose your online storefront and payment platform.');
  } else if (state.businessType === 'Brick-and-mortar') {
    common.unshift('Compare locations, lease terms, and foot-traffic needs.');
  } else if (state.businessType === 'Service-based') {
    common.unshift('Package your offer clearly and define pricing, scope, and contracts.');
  } else if (state.businessType === 'Hybrid') {
    common.unshift('Map what happens online versus in person so operations stay clear.');
  }

  return common;
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function showModal() {
  const modal = document.getElementById('modal-template').content.cloneNode(true);
  document.body.appendChild(modal);
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-action]');
  if (!trigger) return;
  const action = trigger.dataset.action;
  const value = trigger.dataset.value;

  if (action === 'select-readiness') {
    state.readiness = value;
    state.step = 'businessType';
    render();
  }

  if (action === 'select-type') {
    state.businessType = value;
    state.step = 'industry';
    render();
  }

  if (action === 'save-industry') {
    const val = document.getElementById('industryInput').value.trim();
    if (!val) {
      document.getElementById('industryInput').focus();
      return;
    }
    state.industry = val;
    state.step = 'structure';
    render();
  }

  if (action === 'select-structure') {
    state.structure = value;
    state.step = 'register';
    render();
  }

  if (action === 'already-registered') {
    state.step = 'ein';
    render();
  }

  if (action === 'next-after-registration') {
    state.step = 'ein';
    render();
  }

  if (action === 'next-after-ein') {
    state.step = 'launch';
    render();
  }

  if (action === 'restart') {
    state.step = 'landing';
    state.readiness = '';
    state.businessType = '';
    state.industry = '';
    state.structure = 'LLC';
    render();
  }

  if (action === 'download-summary') {
    const text = `StartSwift Summary\n\nStarting point: ${readinessLabels[state.readiness]}\nBusiness type: ${state.businessType}\nIndustry: ${capitalizeWords(state.industry)}\nStructure: ${state.structure}\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startswift-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (action === 'open-structure-help') {
    showModal();
  }

  if (action === 'close-modal') {
    document.getElementById('modalBackdrop')?.remove();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('modalBackdrop')?.remove();
  }
});

render();
