const passwordForm = document.getElementById("password-form");
const modalOpenButton = document.querySelector(".modal__open");
const modalCloseButton = document.querySelector(".modal__close");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal__content");
const modalCopyButton = document.querySelector(".modal__copy");
const modalInput = document.querySelector(".modal__input");
const passwordCount = document.querySelector(".password__count");
const passwords = [];

const showErrorAlert = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message
  })
  throw new Error(message)

}

const showSuccessAlert = (message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message
  })
}

const generatePassword = ({
  count,
  words = true,
  symbols = false,
  numbers = false,
}) => {
  const wordsList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const symbolsList = "#$%&'()*+,;<=>?@";
  let password = "";

  if (!count) showErrorAlert("Error, you need to enter character number")
  if (!words && !symbols && !numbers)
    showErrorAlert("Error generating password, please select a checkbox");
  if (count < 6) showErrorAlert("Error, the password must be at least 6 characters long")

  for (let i = 0; i < count; i++) {
    let characterOptions = [];
    const optionType = {
      WORD: "words",
      NUMBER: "numbers",
      SYMBOL: "symbols",
    };
    if (words) characterOptions.push(optionType.WORD);
    if (numbers) characterOptions.push(optionType.NUMBER);
    if (symbols) characterOptions.push(optionType.SYMBOL);

    let selectedCharacterType =
      characterOptions[Math.floor(Math.random() * characterOptions.length)];

    if (selectedCharacterType === optionType.WORD) {
      password += wordsList.charAt(
        Math.floor(Math.random() * wordsList.length)
      );
    }
    if (selectedCharacterType === optionType.SYMBOL) {
      password += symbolsList.charAt(
        Math.floor(Math.random() * symbolsList.length)
      );
    }
    if (selectedCharacterType === optionType.NUMBER) {
      password += Math.floor(Math.random() * 10);
    }
  }

  return password;
};

passwordForm.onsubmit = (e) => {
  e.preventDefault();

  const form = new FormData(passwordForm);
  const data = {};

  data["count"] = form.get("count");
  data["words"] = form.get("words");
  data["numbers"] = form.get("numbers");
  data["symbols"] = form.get("symbols");

  const generatedPassword = generatePassword({
    count: data["count"],
    words: data["words"],
    symbols: data["symbols"],
    numbers: data["numbers"],
  });

  passwords.push(generatedPassword);

  modalContent.innerHTML = ""

  passwords.forEach((password) => {
    let generatedModalItem = document.createElement("p");
    generatedModalItem.classList.add("modal__item");
    let generatedModalInput = document.createElement("input");
    generatedModalInput.classList.add("modal__input");
    generatedModalInput.setAttribute("type", "text");
    generatedModalInput.setAttribute("value", password);
    let generatedModalCopy = document.createElement("button");
    generatedModalCopy.setAttribute("type", "button");
    generatedModalCopy.classList.add("modal__copy");
    generatedModalCopy.textContent = "copy"
    generatedModalCopy.addEventListener("click", () => {
      navigator.clipboard
        .writeText(generatedModalInput.value)
        .then(() => showSuccessAlert("copied successfully"));
    });

    generatedModalItem.appendChild(generatedModalInput)
    generatedModalItem.appendChild(generatedModalCopy)
    modalContent.appendChild(generatedModalItem)

  });

  if (passwords.length > 0) {
    passwordCount.textContent = passwords.length
    passwordCount.classList.add('active')
  }

  showSuccessAlert("Password generated successfully")
};

modalOpenButton.onclick = () => {
  modal.classList.add("active");
};

modalCloseButton.onclick = () => {
  modal.classList.remove("active");
};
