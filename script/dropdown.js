class CustomDropdown {
  constructor(dropdownElement) {
    this.dropdown = dropdownElement;
    this.toggle = dropdownElement.querySelector('.dropdown-toggle');
    this.text = dropdownElement.querySelector('.dropdown-text');
    this.list = dropdownElement.querySelector('.dropdown-list');
    this.items = [...dropdownElement.querySelectorAll('.dropdown-list-item')];
    this.hiddenInput = dropdownElement.querySelector('input[type="hidden"]');

    this.placeholder =
      this.toggle.dataset.placeholder || this.text.textContent.trim();

    this.init();
  }

  init() {
    this.syncFromHiddenInput();

    this.toggle.addEventListener('click', (event) => {
      event.stopPropagation();

      if (
        this.dropdown.classList.contains('disabled') ||
        this.dropdown.classList.contains('read-only')
      ) {
        return;
      }

      this.dropdown.classList.toggle('open');
    });

    this.items.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.stopPropagation();

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
        this.close();
      }
    });
  }

  syncFromHiddenInput() {
    const value = String(this.hiddenInput.value || '').trim();

    const selectedItem = this.items.find((item) => {
      return String(item.dataset.value || '').trim() === value;
    });

    if (selectedItem) {
      this.items.forEach((item) => {
        item.classList.toggle('selected', item === selectedItem);
      });

      this.text.textContent =
        selectedItem.dataset.text || selectedItem.textContent.trim();

      this.toggle.classList.remove('empty');
    } else {
      this.resetDisplay();
    }
  }

  select(item) {
    const value = String(item.dataset.value || '').trim();

    this.items.forEach((currentItem) => {
      currentItem.classList.toggle('selected', currentItem === item);
    });

    this.text.textContent = item.dataset.text || item.textContent.trim();

    this.hiddenInput.value = value;

    this.toggle.classList.toggle('empty', value === '');

    this.close();

    this.hiddenInput.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );
  }

  resetDisplay() {
    this.items.forEach((item) => {
      item.classList.remove('selected');
    });

    this.text.textContent = this.placeholder;
    this.hiddenInput.value = '';
    this.toggle.classList.add('empty');
  }

  close() {
    this.dropdown.classList.remove('open');
  }

  open() {
    if (
      this.dropdown.classList.contains('disabled') ||
      this.dropdown.classList.contains('read-only')
    ) {
      return;
    }

    this.dropdown.classList.add('open');
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

  getValue() {
    return this.hiddenInput.value;
  }

  reset() {
    this.resetDisplay();
    this.close();

    this.hiddenInput.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );
  }

  setDisabled(disabled) {
    this.dropdown.classList.toggle('disabled', disabled);
    this.toggle.disabled = disabled;

    if (disabled) {
      this.close();
    }
  }

  setReadOnly(readOnly) {
    this.dropdown.classList.toggle('read-only', readOnly);

    if (readOnly) {
      this.close();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown').forEach((dropdownElement) => {
    new CustomDropdown(dropdownElement);
  });
});
