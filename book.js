//GETTING DOM ELEMENTS
let overlayBox = document.getElementById('overlay');
let newBookBtn = document.getElementById('add-new-book-btn');
let overlayAddBtn = document.getElementById('overlay-card-add-book-btn')
let overlayCancelBtn = document.getElementById('overlay-card-cancel-book-btn');
let main = document.querySelector('main');

//INITIALISE VARIABLES

let bookCollection = [];

//EVENT LISTENERS
newBookBtn.addEventListener('click', overlayToggle);
overlayAddBtn.addEventListener('click', submitOverlayBook);
overlayCancelBtn.addEventListener('click', overlayToggle);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (checkOverflowStatus() === 'flex') {
            overlayToggle();
        }
    } else if (event.key === 'Enter') {
        if (checkOverflowStatus() === 'flex') {
            if (event.target.tagName !== 'INPUT') {
                submitOverlayBook();
                event.preventDefault();
            }
        }
    }
})


//FUNCTIONS

//checks if the overlay is shown or no
function checkOverflowStatus() {
    let status = window.getComputedStyle(overlayBox).display;
    return status;
}

//shows or hides the overlay
function overlayToggle() {
    if (checkOverflowStatus() === 'none') {
        overlayBox.style.display = 'flex';
    } else {
        overlayBox.style.display = 'none';
        overlayClearInputs();
    }
}

//clears the input boxes in the overlay menu
function overlayClearInputs() {
    document.getElementById('overlay-title').value = '';
    document.getElementById('overlay-author').value = '';
    document.getElementById('overlay-pages').value = '';
}

//saves the info of the new added book
function submitOverlayBook() {
    let bookInfo = {
        title: document.getElementById('overlay-title').value,
        author: document.getElementById('overlay-author').value,
        page: document.getElementById('overlay-pages').value,
        date: new Date()
    }
    bookCollection.push(bookInfo);
    overlayToggle();
    createBookCard(bookInfo);
}

// creates the book card with the info given
function createBookCard(book) {
    let card = document.createElement('div');
    card.setAttribute('class', 'card-book-box');

    let cardTextBox = document.createElement('div');
    cardTextBox.setAttribute('class', 'card-book-box-text');

    let cardTitle = document.createElement('div');
    cardTitle.setAttribute('class', 'card-title');
    cardTitle.textContent = book.title;

    let cardAuthor = document.createElement('div')
    cardAuthor.setAttribute('class', 'card-author');
    cardAuthor.textContent = book.author;

    let cardPages = document.createElement('div');
    cardPages.setAttribute('class', 'card-pages');
    cardPages.textContent = book.page;

    let cardDate = document.createElement('div');
    cardDate.setAttribute('class', 'card-date');

    let cardButtons = document.createElement('div');
    cardButtons.setAttribute('class', 'card-book-box-buttons');

    let readBtn = document.createElement('button');
    readBtn.textContent = 'Read';
    readBtn.setAttribute('class', 'read-book-btn');
    readBtn.setAttribute('type', 'submit');

    let deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class', 'delete-book-btn');
    deleteBtn.textContent = 'Delete';

    main.appendChild(card);
    card.appendChild(cardTextBox);
    card.appendChild(cardButtons);
    cardTextBox.appendChild(cardTitle);
    cardTextBox.appendChild(cardAuthor);
    cardTextBox.appendChild(cardPages);
    cardTextBox.appendChild(cardDate);
    cardButtons.appendChild(readBtn);
    cardButtons.appendChild(deleteBtn);
}

/*
NEXT:
- delete button on overlay card
- fix bug with enter key on overlay card
- make the info panel work

*/