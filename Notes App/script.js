let deletedNotes = JSON.parse(localStorage.getItem("deletedNotes")) || [];
let savedNotes = JSON.parse(localStorage.getItem("savedNotes")) || [];

function saveNote() {
  const headingInput = document.querySelector(".notehead");
  const noteInput = document.querySelector(".notetext");
  const errorElement = document.getElementById("err");

  const heading = headingInput.value.trim();
  const note = noteInput.value.trim();

  if (heading === "" || note === "") {
    errorElement.style.display = "block";
    errorElement.textContent = "Please fill in all fields.";
    errorElement.style.margin = '0';
    errorElement.style.color = "red";
    return; // Do not save empty data
  }

  const newNote = {
    heading,
    note,
  };

  savedNotes.push(newNote);

  localStorage.setItem("savedNotes", JSON.stringify(savedNotes));

  headingInput.value = "";
  noteInput.value = "";

  renderDeletedNotes();
  renderNotes();
}

function renderNotes() {
  const notesContainer = document.getElementById("notecontainer");
  notesContainer.innerHTML = "";

  savedNotes.forEach((note, index) => {
    const noteCard = document.createElement("div");
    noteCard.className = "note";
    noteCard.style.backgroundColor = getRandomLightColor();

    const note1Element = document.createElement("h3");
    note1Element.textContent = `${note.heading}`;
    note1Element.classList = "heading";

    const note2Element = document.createElement("h4");
    note2Element.textContent = `${note.note}`;
    note2Element.classList = "notetxt";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editNote(index);
      document.getElementById("openForm").style.width = "300px";
      document.getElementById("openTrash").style.width = "0";
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => movetodelete(index));

    const notebtns = document.createElement("div");
    notebtns.className = "notebtns";

    noteCard.appendChild(note1Element);
    noteCard.appendChild(note2Element);
    noteCard.appendChild(notebtns);
    notebtns.appendChild(editButton);
    notebtns.appendChild(deleteButton);

    notesContainer.appendChild(noteCard);
  });
}

function getRandomLightColor() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 6)]; // Using only light colors
  }
  return color;
}

function editNote(index) {
  const noteToEdit = savedNotes[index];

  const headingInput = document.querySelector(".notehead");
  const noteInput = document.querySelector(".notetext");

  headingInput.value = noteToEdit.heading;
  noteInput.value = noteToEdit.note;

  savedNotes.splice(index, 1);

  localStorage.setItem("savedNotes", JSON.stringify(savedNotes));

  renderDeletedNotes();
  renderNotes();
}

function movetodelete(index) {
  const deletedNote = savedNotes.splice(index, 1)[0];

  deletedNotes.push(deletedNote);
  localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

  localStorage.setItem("savedNotes", JSON.stringify(savedNotes));

  renderDeletedNotes();
  renderNotes();
}

function renderDeletedNotes() {
  const notesContainer = document.getElementById("trashnotes"); // Update to the appropriate ID
  notesContainer.innerHTML = "";

  deletedNotes.forEach((note, index) => {
    const noteCard = document.createElement("div");
    noteCard.className = "note";

    const note1Element = document.createElement("h3");
    note1Element.textContent = `${note.heading}`;
    note1Element.classList = "heading";

    const note2Element = document.createElement("h4");
    note2Element.textContent = `${note.note}`;
    note2Element.classList = "notetxt";

    const restoreButton = document.createElement("button");
    restoreButton.textContent = "Restore";
    restoreButton.addEventListener("click", () => restoreNoteToSaved(index));

    const permanentlyDeleteButton = document.createElement("button");
    permanentlyDeleteButton.textContent = "Permanently Delete";
    permanentlyDeleteButton.addEventListener("click", () =>
      permanentlyDeleteNoteFromTrash(index)
    );

    const notebtns = document.createElement("div");
    notebtns.className = "notebtns";

    noteCard.appendChild(note1Element);
    noteCard.appendChild(note2Element);
    noteCard.appendChild(notebtns);
    notebtns.appendChild(restoreButton);
    notebtns.appendChild(permanentlyDeleteButton);

    notesContainer.appendChild(noteCard);
  });
}

function restoreNoteToSaved(index) {

  const noteToRestore = deletedNotes.splice(index, 1)[0];
  savedNotes.push(noteToRestore);

  localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
  localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

  renderDeletedNotes();
  renderNotes();
}

function permanentlyDeleteNoteFromTrash(index) {
  deletedNotes.splice(index, 1);

  localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));

  renderDeletedNotes();
  renderNotes();
}

// Initial rendering
renderNotes();
renderDeletedNotes();

function searchNotes() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase(); // Assuming you have an input element with id 'searchInput'
  const notesContainer = document.getElementById("notecontainer");
  const notes = notesContainer.getElementsByClassName("note");

  Array.from(notes).forEach((note) => {
    const headingElement = note.querySelector(".heading");
    const noteText = headingElement.textContent.toLowerCase();

    if (noteText.includes(searchTerm)) {
      note.style.display = "flex";
    } else {
      note.style.display = "none";
    }
  });
}


function openForm() {
  document.getElementById("openForm").style.width = "300px";
  document.getElementById("openTrash").style.width = "0";
}

/* Set the width of the side navigation to 0 */
function closeForm() {
  document.getElementById("openForm").style.width = "0";
}

function openTrash() {
  document.getElementById("openTrash").style.width = "300px";
  document.getElementById("openForm").style.width = "0";
}

/* Set the width of the side navigation to 0 */
function closeTrash() {
  document.getElementById("openTrash").style.width = "0";
}

function autoResize(textarea) {
  textarea.style.height = "auto"; // Reset height to auto to get the actual scroll height
  textarea.style.height = textarea.scrollHeight + 2 + "px"; // Set the new height
}

function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

/**
* Utility function to update the button text and aria-label.
*/
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "Light" : "Dark";
  // use an aria-label if you are omitting text on the button
  // and using a sun/moon icon, for example
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

/**
* Utility function to update the theme setting on the html tag
*/
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}


/**
* On page load:
*/

/**
* 1. Grab what we need from the DOM and system settings on page load
*/
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
* 2. Work out the current site settings
*/
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

/**
* 3. Update the theme setting and button text accoridng to current settings
*/
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
* 4. Add an event listener to toggle the theme
*/
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });

  currentThemeSetting = newTheme;
}); 
