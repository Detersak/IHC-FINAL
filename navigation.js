function navigateTo(url) {
  if (!url) return;
  const target = url.trim();
  if (!target) return;
  window.location.href = target;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-link]').forEach(function (element) {
    element.addEventListener('click', function (event) {
      event.preventDefault();
      navigateTo(element.dataset.link);
    });
  });

  document.querySelectorAll('.nav-item').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href !== '#' && href.trim() !== '') {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        navigateTo(href);
      });
    }
  });

  const loginForm = document.querySelector('.form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      navigateTo('home.html');
    });
  }

  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function updateSelectedTotal() {
    const totalElement = document.querySelector('#selectedTotalValue');
    if (!totalElement) return;

    const total = Array.from(document.querySelectorAll('.fee-checkbox')).reduce(function (sum, checkbox) {
      return checkbox.checked ? sum + parseFloat(checkbox.dataset.value || '0') : sum;
    }, 0);

    totalElement.textContent = formatCurrency(total);
  }

  document.querySelectorAll('.fee-checkbox').forEach(function (checkbox) {
    checkbox.addEventListener('change', updateSelectedTotal);
  });

  const selectAllButton = document.querySelector('.select-all-button');
  if (selectAllButton) {
    selectAllButton.addEventListener('click', function () {
      const checkboxes = Array.from(document.querySelectorAll('.fee-checkbox'));
      if (!checkboxes.length) return;

      const allSelected = checkboxes.every(function (checkbox) {
        return checkbox.checked;
      });

      checkboxes.forEach(function (checkbox) {
        checkbox.checked = !allSelected;
      });

      selectAllButton.textContent = allSelected ? 'Selecionar Tudo' : 'Desmarcar Tudo';
      updateSelectedTotal();
    });
  }

  const walletDocumentSummary = document.querySelector('#walletDocumentSummary');
  const walletButtons = document.querySelectorAll('.wallet-actions .secondary-button');
  const walletTexts = {
    cnh: {
      title: 'Carteira Nacional de Habilitação',
      description: 'CNH digital disponível para apresentar em fiscalizações e consultas.'
    },
    crlv: {
      title: 'Certificado de Registro e Licenciamento de Veículo',
      description: 'CRLV digital disponível para apresentar como documento do veículo em trânsito.'
    }
  };

  const walletDocumentCardLabel = document.querySelector('#walletDocumentCardLabel');
  const walletDocumentCardTitle = document.querySelector('#walletDocumentCardTitle');

  function setWalletDocumentType(type) {
    if (!walletDocumentSummary || !walletTexts[type]) return;
    walletDocumentSummary.querySelector('.wallet-summary-title').textContent = walletTexts[type].title;
    walletDocumentSummary.querySelector('.wallet-summary-text').textContent = walletTexts[type].description;
    walletDocumentCardLabel.textContent = type === 'cnh' ? 'Carteira Digital' : 'Documento Digital';
    walletDocumentCardTitle.textContent = type === 'cnh' ? 'CNH' : 'CRLV';
    walletButtons.forEach(function (button) {
      button.classList.toggle('active', button.dataset.document === type);
    });
  }

  walletButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setWalletDocumentType(button.dataset.document);
    });
  });

  setWalletDocumentType('cnh');

  const paymentConfirmButton = document.querySelector('.payment-confirm-button');
  const paymentModal = document.querySelector('.payment-confirm-modal');
  const modalCloseButton = document.querySelector('.modal-close');
  const modalOkButton = document.querySelector('.modal-ok-button');

  function closePaymentModal() {
    if (paymentModal) {
      paymentModal.classList.remove('active');
      paymentModal.setAttribute('aria-hidden', 'true');
    }
  }

  function openPaymentModal() {
    if (paymentModal) {
      paymentModal.classList.add('active');
      paymentModal.setAttribute('aria-hidden', 'false');
    }
  }

  if (paymentConfirmButton) {
    paymentConfirmButton.addEventListener('click', function (event) {
      event.preventDefault();
      openPaymentModal();
    });
  }

  if (modalCloseButton) modalCloseButton.addEventListener('click', closePaymentModal);
  if (modalOkButton) modalOkButton.addEventListener('click', closePaymentModal);
  if (paymentModal) {
    paymentModal.addEventListener('click', function (event) {
      if (event.target === paymentModal) {
        closePaymentModal();
      }
    });
  }
});
