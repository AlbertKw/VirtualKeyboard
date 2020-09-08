const Keyboard = {
  domElements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
  },

  init() {
    //Create DOM elements
    this.domElements.main = document.createElement("div");
    this.domElements.keysContainer = document.createElement("div");

    //Assign classes
    this.domElements.main.classList.add("keyboard", "keyboard-hidden");
    this.domElements.keysContainer.classList.add("keyboard-keys");
    this.domElements.keysContainer.appendChild(this._createKeys());

    //Add keyboard to DOM
    this.domElements.main.appendChild(this.domElements.keysContainer);
    document.body.appendChild(this.domElements.main);

    this.domElements.keys = document.querySelectorAll(".keyboard-key");

    //Use keyboard for elements with .keyboard-text
    document.querySelectorAll(".keyboard-text").forEach(el => {
      el.addEventListener("focus", () => {
        this.open(el.value, currentValue => {
          el.value = currentValue;
        });
      })
    })
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "space"
    ];

    const createIcon = (name) => {
      const iconElement = document.createElement("i");
      iconElement.classList.add("material-icons");
      iconElement.innerHTML = `${name}`;
      return iconElement;
    };

    keyLayout.forEach((key) => {
      const insertBr = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

      const keyElement = document.createElement("button");
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard-key");

      switch (key) {
        case "backspace":
          keyElement.appendChild(createIcon("backspace"));
          keyElement.classList.add("keyboard-key-wide");
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1
            );
            this._triggerEvent("oninput");
          });
          break;

        case "caps":
          keyElement.appendChild(createIcon("keyboard_capslock"));
          keyElement.classList.add(
            "keyboard-key-activatable",
            "keyboard-key-wide"
          );

          keyElement.addEventListener("click", () => {
            keyElement.classList.toggle("keyboard-key-active");
            this._toggleCapsLock();
          });
          break;

        case "enter":
          keyElement.appendChild(createIcon("keyboard_return"));
          keyElement.classList.add("keyboard-key-wide");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });
          break;

        case "done":
          keyElement.appendChild(createIcon("check_circle"));
          keyElement.classList.add("keyboard-key-done", "keyboard-key-wide");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });
          break;

        case "space":
          keyElement.appendChild(createIcon("space_bar"));
          keyElement.classList.add("keyboard-key-extra-wide");
          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });
          break;

        default:
          keyElement.innerHTML = key;
          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this._triggerEvent("oninput");
          });
          break;
      }

      fragment.appendChild(keyElement);
      if (insertBr) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.domElements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    }
  },

  _triggerEvent(handlerName) {
    if(typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.domElements.main.classList.remove("keyboard-hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = null;
    this.eventHandlers.onclose = null;
    this.domElements.main.classList.add("keyboard-hidden");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  Keyboard.init();
});
