export const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    key: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    caret: 0,
  },

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      '.keyboard__key',
    );

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    document.querySelectorAll('.input-list').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          const elem = element;
          elem.value = currentValue;
        });
      });
    });
  },

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      'backspace',
      'caps',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      'enter',
      'done',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      'shift',
      'space',
      'left',
      'right',
    ];

    const createIconHTML = (iconName) => `<i class='material-icons'>${iconName}</i>`;

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'enter', 'shift'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.caret - 1)
              + this.properties.value.substring(
                this.properties.caret,
                this.properties.value.length,
              );
            this.triggerEvent('oninput');
            this.setCaretPosition(-1);

            const inp = document.querySelector('.input-list');
            const event = new Event('input');
            inp.dispatchEvent(event);
          });

          break;

        case 'caps':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
          );
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle(
              'keyboard__key--active',
              this.properties.capsLock,
            );
          });

          break;

        case 'shift':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
          );
          keyElement.innerHTML = createIconHTML('arrow_circle_up');

          keyElement.addEventListener('click', () => {
            this.toggleShift();
            keyElement.classList.toggle(
              'keyboard__key--active',
              this.properties.shift,
            );
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this.properties.value = `${this.properties.value.substring(0, this.properties.caret)
            }\n${
              this.properties.value.substring(
                this.properties.caret,
                this.properties.value.length,
              )}`;
            this.triggerEvent('oninput');
            this.setCaretPosition(1);
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');
          keyElement.addEventListener('click', () => {
            this.properties.value = `${this.properties.value.substring(0, this.properties.caret)
            } ${
              this.properties.value.substring(
                this.properties.caret,
                this.properties.value.length,
              )}`;
            this.triggerEvent('oninput');
            this.setCaretPosition(1);

            const inp = document.querySelector('.input-list');
            const event = new Event('input');
            inp.dispatchEvent(event);
          });

          break;

        case 'left':
          keyElement.classList.add('keyboard__key');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');
          keyElement.addEventListener('click', () => {
            this.setCaretPosition(-1);
          });

          break;

        case 'right':
          keyElement.classList.add('keyboard__key');
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');
          keyElement.addEventListener('click', () => {
            this.setCaretPosition(1);
          });

          break;

        case 'done':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--dark',
          );
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this.triggerEvent('onclose');
          });

          break;

        default:
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(0, this.properties.caret)
              + keyElement.textContent
              + this.properties.value.substring(
                this.properties.caret,
                this.properties.value.length,
              );
            this.triggerEvent('oninput');
            this.setCaretPosition(1);

            const inp = document.querySelector('.input-list');
            const event = new Event('input');
            inp.dispatchEvent(event);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  setCaretPosition(pos) {
    const area = document.querySelector('.input-list');
    if (area != null) {
      if (
        this.properties.caret + pos >= 0
        && this.properties.caret + pos <= this.properties.value.length
      ) {
        this.properties.caret += pos;
      }
      area.setSelectionRange(this.properties.caret, this.properties.caret);
      area.focus();
    }
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this.elements.keys.forEach((key) => {
      const keyReplacement = key;
      if (key.childElementCount === 0) {
        if (
          (this.properties.capsLock && this.properties.shift)
          || (!this.properties.capsLock && !this.properties.shift)
        ) {
          keyReplacement.textContent = key.textContent.toLowerCase();
        } else {
          keyReplacement.textContent = key.textContent.toUpperCase();
        }
      }
    });
  },

  toggleShift() {
    this.properties.shift = !this.properties.shift;
    this.elements.keys.forEach((key) => {
      const keyReplacement = key;
      if (key.childElementCount === 0) {
        if (
          (this.properties.capsLock && this.properties.shift)
          || (!this.properties.capsLock && !this.properties.shift)
        ) {
          keyReplacement.textContent = key.textContent.toLowerCase();
        } else {
          keyReplacement.textContent = key.textContent.toUpperCase();
        }
      }
    });
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  },
};

document.addEventListener('keydown', (e) => {
  if (e.key.length === 1) {
    e.preventDefault();
    const kbdKey = document.querySelectorAll('.keyboard__key');
    kbdKey.forEach((i) => {
      if (i.textContent === e.key) {
        i.classList.add('pressed');
        i.click();
        setTimeout(() => i.classList.remove('pressed'), 100);
      }
    });
  }

  if (e.key === 'CapsLock') {
    e.preventDefault();
    const kbdKey = document.querySelectorAll('.keyboard__key--activatable');
    kbdKey.forEach((i) => {
      if (i.firstChild.textContent === 'keyboard_capslock') {
        i.classList.add('pressed');
        i.click();
        setTimeout(() => i.classList.remove('pressed'), 100);
      }
    });
  }

  if (e.key === 'Shift') {
    e.preventDefault();
    const kbdKey = document.querySelectorAll('.keyboard__key--wide');
    kbdKey.forEach((i) => {
      if (i.firstChild.textContent === 'arrow_circle_up') {
        i.classList.add('pressed');
        i.click();
        setTimeout(() => i.classList.remove('pressed'), 100);
      }
    });
  }

  if (e.key === 'Backspace') {
    const kbdKey = document.querySelectorAll('.keyboard__key--wide');
    kbdKey.forEach((i) => {
      if (i.firstChild.textContent === 'backspace') {
        e.preventDefault();
        i.classList.add('pressed');
        i.click();
        setTimeout(() => i.classList.remove('pressed'), 100);
      }
    });
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    const kbdKey = document.querySelectorAll('.keyboard__key--wide');
    kbdKey.forEach((i) => {
      if (i.firstChild.textContent === 'keyboard_return') {
        i.classList.add('pressed');
        i.click();
        setTimeout(() => i.classList.remove('pressed'), 100);
      }
    });
  }

  if (e.key === ' ') {
    e.preventDefault();
    const kbdKey = document.querySelector('.keyboard__key--extra-wide');
    kbdKey.classList.add('pressed');
    kbdKey.click();
    setTimeout(() => kbdKey.classList.remove('pressed'), 100);
  }

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const kbdKey = document.querySelectorAll('.keyboard__key');
    kbdKey.forEach((i) => {
      if (i.firstChild.textContent === 'keyboard_arrow_left') {
        i.classList.add('pressed');
        i.click();
        setTimeout(() => i.classList.remove('pressed'), 100);
      }
    });
  }

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    const kbdKey = document.querySelectorAll('.keyboard__key');
    kbdKey.forEach((i) => {
      if (i.firstChild.textContent === 'keyboard_arrow_right') {
        i.classList.add('pressed');
        i.click();
        setTimeout(() => i.classList.remove('pressed'), 100);
      }
    });
  }
});


