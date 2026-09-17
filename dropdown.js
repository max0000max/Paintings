class CustomDropdown {
  constructor(dropdownElement) {
    this.dropdown = dropdownElement;
    this.toggle = dropdownElement.querySelector('.dropdown-toggle');
    this.text = dropdownElement.querySelector('.dropdown-text');
    this.list = dropdownElement.querySelector('.dropdown-list');
    this.items = [...dropdownElement.querySelectorAll('.dropdown-item')];
    this.hiddenInput = dropdownElement.querySelector('input[type="hidden"]');
    this.errorMessage = dropdownElement.querySelector('.error-message');
    this.label = this.getLabelElement();

    // Текст по умолчанию можно указать через data-placeholder
    this.placeholder = this.toggle.dataset.placeholder || 'Выберите город';

    this.init();
  }

  getLabelElement() {
    const dropdownId = this.dropdown.id;

    if (dropdownId) {
      const labelWithFor = document.querySelector(
        `label[for="${CSS.escape(dropdownId)}"]`,
      );

      if (labelWithFor) {
        return labelWithFor;
      }
    }

    const parentLabel = this.dropdown.closest('label');

    if (parentLabel) {
      return parentLabel;
    }

    const prevSibling = this.dropdown.previousElementSibling;

    if (prevSibling && prevSibling.tagName === 'LABEL') {
      return prevSibling;
    }

    return null;
  }

  init() {
    // Сначала приводим dropdown в соответствие со значением hidden input
    this.syncFromHiddenInput();

    this.syncLabelDisabledState();

    this.toggle.addEventListener('click', () => {
      if (
        this.dropdown.classList.contains('disabled') ||
        this.dropdown.classList.contains('read-only')
      ) {
        return;
      }

      this.dropdown.classList.toggle('open');
      this.dropdown.classList.add('focus');
    });

    this.toggle.addEventListener('focus', () => {
      this.dropdown.classList.add('focus');
    });

    this.toggle.addEventListener('blur', () => {
      this.dropdown.classList.remove('focus');
      this.updateEmptyState();
    });

    this.items.forEach((item) => {
      item.addEventListener('click', () => {
        if (
          item.classList.contains('disabled') ||
          this.dropdown.classList.contains('disabled') ||
          this.dropdown.classList.contains('read-only')
        ) {
          return;
        }

        this.select(item);
      });
    });

    document.addEventListener('click', (event) => {
      if (!this.dropdown.contains(event.target)) {
        this.dropdown.classList.remove('open');
      }
    });

    // Если значение hidden input изменяется другим скриптом
    this.hiddenInput.addEventListener('change', () => {
      this.syncFromHiddenInput();
    });
  }

  syncFromHiddenInput() {
    const value = String(this.hiddenInput.value || '').trim();

    const selectedItem = this.items.find((item) => {
      return String(item.dataset.value || '').trim() === value;
    });

    if (value && selectedItem) {
      this.items.forEach((item) => {
        item.classList.toggle('selected', item === selectedItem);
      });

      this.text.textContent =
        selectedItem.dataset.text || selectedItem.textContent.trim();

      this.toggle.classList.remove('empty');
    } else {
      // Значение отсутствует или ему не соответствует ни один пункт
      this.hiddenInput.value = '';

      this.items.forEach((item) => {
        item.classList.remove('selected');
      });

      this.text.textContent = this.placeholder;
      this.toggle.classList.add('empty');
    }

    this.dropdown.classList.remove('error');

    if (this.errorMessage) {
      this.errorMessage.style.display = 'none';
    }
  }

  syncLabelDisabledState() {
    if (!this.label) {
      return;
    }

    this.label.classList.toggle(
      'disabled',
      this.dropdown.classList.contains('disabled'),
    );
  }

  updateEmptyState() {
    const value = String(this.hiddenInput.value || '').trim();

    this.toggle.classList.toggle('empty', value === '');
  }

  select(item) {
    const value = String(item.dataset.value || '').trim();

    this.items.forEach((currentItem) => {
      currentItem.classList.toggle('selected', currentItem === item);
    });

    this.text.textContent = item.dataset.text || item.textContent.trim();

    this.hiddenInput.value = value;

    this.dropdown.classList.remove('open');
    this.dropdown.classList.remove('error');

    this.toggle.classList.toggle('empty', value === '');

    if (this.errorMessage) {
      this.errorMessage.style.display = 'none';
    }
  }

  validate() {
    const value = String(this.hiddenInput.value || '').trim();

    if (
      !value &&
      !this.dropdown.classList.contains('disabled') &&
      !this.dropdown.classList.contains('read-only')
    ) {
      this.setError(true);
      return false;
    }

    this.setError(false);
    return true;
  }

  setError(isError) {
    this.dropdown.classList.toggle('error', isError);

    if (isError) {
      this.toggle.classList.add('empty');
    } else {
      this.updateEmptyState();
    }

    if (this.errorMessage) {
      this.errorMessage.style.display = isError ? 'block' : 'none';
    }
  }

  setDisabled(disabled) {
    this.dropdown.classList.toggle('disabled', disabled);
    this.toggle.disabled = disabled;

    if (disabled) {
      this.dropdown.classList.remove('open');
    }

    this.syncLabelDisabledState();
  }

  setReadOnly(readOnly) {
    this.dropdown.classList.toggle('read-only', readOnly);

    if (readOnly) {
      this.dropdown.classList.remove('open');
    }
  }

  getValue() {
    return this.hiddenInput.value;
  }

  setValue(value) {
    const normalizedValue = String(value || '').trim();

    const item = this.items.find((currentItem) => {
      return String(currentItem.dataset.value || '').trim() === normalizedValue;
    });

    if (item) {
      this.select(item);
    } else {
      this.reset();
    }
  }

  reset() {
    this.items.forEach((item) => {
      item.classList.remove('selected');
    });

    this.text.textContent = this.placeholder;
    this.hiddenInput.value = '';

    this.dropdown.classList.remove('open');
    this.dropdown.classList.remove('error');

    this.toggle.classList.add('empty');

    if (this.errorMessage) {
      this.errorMessage.style.display = 'none';
    }

    this.hiddenInput.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown').forEach((element) => {
    new CustomDropdown(element);
  });
});
