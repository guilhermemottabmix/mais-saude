/**
 * + SAÚDE - SCRIPT FRONT-END PRINCIPAL
 * Funcionalidades: Scroll suave, Seleção automática de planos, Máscara de Telefone, Validação local.
 * IMPORTANTE: 100% Front-End (Sem fetch, sem API, sem back-end).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do Formulário
  const simulationForm = document.getElementById('simulationForm');
  const userNameInput = document.getElementById('userName');
  const userPhoneInput = document.getElementById('userPhone');
  const userEmailInput = document.getElementById('userEmail');
  const userAgeInput = document.getElementById('userAge');
  const userCityInput = document.getElementById('userCity');
  const planTypeSelect = document.getElementById('planType');
  const formSuccessFeedback = document.getElementById('formSuccessFeedback');

  // =======================================================
  // 1. SCROLL SUAVE PARA LINKS INTERNOS E BOTÕES CTA
  // =======================================================
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =======================================================
  // 2. BOTÕES "CONHECER" DOS CARDS DE PLANO
  // Comportamento: Rola até o formulário e seleciona o plano
  // =======================================================
  const planSelectButtons = document.querySelectorAll('.btn-plan-select');

  planSelectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedPlan = button.getAttribute('data-plan');

      if (planTypeSelect && selectedPlan) {
        planTypeSelect.value = selectedPlan;
        
        // Remove erro caso estivesse marcado
        clearFieldError('planType');
      }

      // Rola suavemente até o formulário
      const simulationSection = document.getElementById('simule');
      if (simulationSection) {
        const headerOffset = 80;
        const elementPosition = simulationSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Foco sutil no select após o scroll
        setTimeout(() => {
          if (planTypeSelect) {
            planTypeSelect.focus();
          }
        }, 500);
      }
    });
  });

  // =======================================================
  // 3. MÁSCARA VISUAL BRASILEIRA DE TELEFONE/WHATSAPP
  // Formato: (11) 99999-9999
  // =======================================================
  if (userPhoneInput) {
    userPhoneInput.addEventListener('input', (e) => {
      let value = e.target.value;

      // Mantém somente dígitos numéricos
      value = value.replace(/\D/g, '');

      // Limita a 11 dígitos (DDD + 9 dígitos)
      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      // Aplica a formatação progressiva
      if (value.length > 10) {
        // (11) 99999-9999
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        // (11) 9999-9999 ou enquanto digita
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        // (11) 9999...
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        // (11...
        value = value.replace(/^(\d*)$/, '($1');
      }

      e.target.value = value;
      clearFieldError('userPhone');
    });
  }

  // =======================================================
  // 4. LIMPEZA DINÂMICA DE ERROS AO DIGITAR/SELECIONAR
  // =======================================================
  const formInputs = [userNameInput, userPhoneInput, userEmailInput, userAgeInput, userCityInput, planTypeSelect];

  formInputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      clearFieldError(input.id);
    });
    input.addEventListener('change', () => {
      clearFieldError(input.id);
    });
  });

  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (field) {
      field.classList.add('input-error');
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    if (field) {
      field.classList.remove('input-error');
    }
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  function clearAllErrors() {
    formInputs.forEach(input => {
      if (input) clearFieldError(input.id);
    });
  }

  // =======================================================
  // 5. VALIDAÇÃO E SUBMIT DO FORMULÁRIO (100% FRONT-END)
  // =======================================================
  if (simulationForm) {
    simulationForm.addEventListener('submit', (e) => {
      // PREVINE RECARREGAMENTO DA PÁGINA
      e.preventDefault();

      clearAllErrors();
      if (formSuccessFeedback) {
        formSuccessFeedback.hidden = true;
      }

      let isValid = true;
      let firstInvalidInput = null;

      // Validação 1: Nome (Obrigatório)
      const nameVal = userNameInput ? userNameInput.value.trim() : '';
      if (!nameVal) {
        setFieldError('userName', 'Informe seu nome.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userNameInput;
      }

      // Validação 2: Telefone/WhatsApp (Obrigatório e formato com DDD)
      const phoneDigits = userPhoneInput ? userPhoneInput.value.replace(/\D/g, '') : '';
      if (!phoneDigits) {
        setFieldError('userPhone', 'Informe seu telefone/WhatsApp.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userPhoneInput;
      } else if (phoneDigits.length < 10) {
        setFieldError('userPhone', 'Informe um telefone válido com DDD.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userPhoneInput;
      }

      // Validação 3: E-mail (Obrigatório e formato válido)
      const emailVal = userEmailInput ? userEmailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        setFieldError('userEmail', 'Informe seu e-mail.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userEmailInput;
      } else if (!emailRegex.test(emailVal)) {
        setFieldError('userEmail', 'Informe um e-mail válido.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userEmailInput;
      }

      // Validação 4: Idade (Obrigatória e numérica)
      const ageVal = userAgeInput ? userAgeInput.value.trim() : '';
      const parsedAge = parseInt(ageVal, 10);
      if (!ageVal) {
        setFieldError('userAge', 'Informe sua idade.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userAgeInput;
      } else if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
        setFieldError('userAge', 'Informe uma idade válida.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userAgeInput;
      }

      // Validação 5: Cidade (Obrigatória)
      const cityVal = userCityInput ? userCityInput.value.trim() : '';
      if (!cityVal) {
        setFieldError('userCity', 'Informe sua cidade.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = userCityInput;
      }

      // Validação 6: Tipo de Plano (Obrigatório)
      const planVal = planTypeSelect ? planTypeSelect.value : '';
      if (!planVal) {
        setFieldError('planType', 'Selecione um tipo de plano.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = planTypeSelect;
      }

      // Caso existam erros, foca no primeiro campo com erro
      if (!isValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Se tudo estiver válido: Exibe mensagem temporária de validação visual de Front-End
      if (formSuccessFeedback) {
        formSuccessFeedback.hidden = false;

        // Limpa o formulário após validação bem-sucedida
        simulationForm.reset();

        // Oculta a mensagem automaticamente após 5 segundos
        setTimeout(() => {
          formSuccessFeedback.hidden = true;
        }, 5000);
      }
    });
  }
});
