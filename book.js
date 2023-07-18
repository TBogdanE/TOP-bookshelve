//GETTING DOM ELEMENTS
//main
const main = document.querySelector('main');
//book card
const cardReadBtn = document.getElementById('card-read-book-btn');
//const cardDeleteBtn = document.getElementById('card-delete-book-btn');

//overlay
const overlayBox = document.getElementById('overlay');
const newBookBtn = document.getElementById('add-new-book-btn');
const overlayAddBtn = document.getElementById('overlay-card-add-book-btn');
const overlayCancelBtn = document.getElementById('overlay-card-cancel-book-btn');
const overlayReadBtn = document.getElementById('overlay-card-read-book-btn');
let overlayReadStatus = false;
//right menu
const numBooks = document.getElementById('numbooks');
const numPages = document.getElementById('numpages');
const numReadedBooks = document.getElementById('numbooks-read');



//INITIALISE VARIABLES

let bookCollection = [];

//EVENT LISTENERS
newBookBtn.addEventListener('click', overlayToggle);
overlayAddBtn.addEventListener('click', overlayCheckInput);
overlayCancelBtn.addEventListener('click', overlayToggle);
overlayReadBtn.addEventListener('click', readBookCheck);
//cardReadBtn.addEventListener('click', none);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && checkOverflowStatus() === 'flex') {
        overlayToggle();
        resetReadStatus();
    } else if (event.key === 'Enter' && checkOverflowStatus() === 'flex') {
        if (event.target.tagName !== 'INPUT') {
            event.preventDefault();
            overlayCheckInput();
        }
    }
});


//FUNCTIONS

function createAddBookBox() {
    console.log('2');
    let addBookBox = document.createElement('div');
    addBookBox.setAttribute('id', 'card-add-book-box');
    let addBookBtn = document.createElement('button');
    addBookBtn.setAttribute('type', 'button');
    addBookBtn.setAttribute('id', 'add-new-book-btn');
    addBookBtn.textContent = '+';
    main.appendChild(addBookBox);
    addBookBox.appendChild(addBookBtn);
}

//checks if the overlay is shown or not
function checkOverflowStatus() {
    return window.getComputedStyle(overlayBox).display;
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

function overlayCheckInput() {
    const titleInput = document.getElementById('overlay-title');
    const authorInput = document.getElementById('overlay-author');
    const pagesInput = document.getElementById('overlay-pages');
    if (!titleInput.checkValidity() || !authorInput.checkValidity() || !pagesInput.checkValidity()) {
        console.log('Error: check validity');
    } else {
        submitOverlayBook();
    }
}

function readBookCheck() {
    if (overlayReadBtn.textContent === 'Read it? Yes') {
        overlayReadBtn.textContent = 'Read it? No';
        overlayReadBtn.setAttribute('class', 'card-read-book-btn');
        overlayReadStatus = false;
    } else {
        overlayReadBtn.textContent = 'Read it? Yes';
        overlayReadBtn.setAttribute('class', 'card-read-book-btn-active');
        overlayReadStatus = true;
    }
}

function resetReadStatus() {
    overlayReadBtn.textContent = 'Read it? No';
    overlayReadBtn.setAttribute('class', 'read-book-btn');
    overlayReadStatus = false;
}

//clears the input boxes in the overlay menu
function overlayClearInputs() {
    document.getElementById('overlay-title').value = '';
    document.getElementById('overlay-author').value = '';
    document.getElementById('overlay-pages').value = '';
    resetReadStatus();
}

//saves the info of the new added book
function submitOverlayBook() {
    let bookInfo = {
        title: document.getElementById('overlay-title').value,
        author: document.getElementById('overlay-author').value,
        page: document.getElementById('overlay-pages').value,
        read: overlayReadStatus,
        date: new Date(),
        id: generateID()
    }
    console.log(bookCollection);
    console.log(`title: ${bookInfo.title}\n author: ${bookInfo.author}\n page: ${bookInfo.page}\n read?: ${bookInfo.read}\n date: ${bookInfo.date}\n id: ${bookInfo.id}`);
    bookCollection.push(bookInfo);
    createBookCard(bookInfo);
    statusMenu();
    overlayToggle();
    resetReadStatus();
}

function generateID() {
    const length = 15;
    let randomNumber = '';
    for (let i = 0; i < length; i++) {
        randomNumber += Math.floor(Math.random() * 10);
    }
    return randomNumber;
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
    cardDate.textContent = book.date;

    let cardButtons = document.createElement('div');
    cardButtons.setAttribute('class', 'card-book-box-buttons');

    let cardReadBtn = document.createElement('button');
    cardReadBtn.textContent = 'Read';
    cardReadBtn.setAttribute('class', 'card-read-book-btn');
    cardReadBtn.setAttribute('type', 'button');

    let cardDeleteBtn = document.createElement('button');
    cardDeleteBtn.setAttribute('id', 'card-delete-book-btn');
    cardDeleteBtn.setAttribute('class', 'card-delete-book-btn');
    cardDeleteBtn.textContent = 'Delete';
    cardDeleteBtn.setAttribute('type', 'button');
    cardDeleteBtn.addEventListener('click', function() {
        deleteBook(book.id);
    });

    main.appendChild(card);
    card.appendChild(cardTextBox);
    card.appendChild(cardButtons);
    cardTextBox.appendChild(cardTitle);
    cardTextBox.appendChild(cardAuthor);
    cardTextBox.appendChild(cardPages);
    cardTextBox.appendChild(cardDate);
    cardButtons.appendChild(cardReadBtn);
    cardButtons.appendChild(cardDeleteBtn);
    
    return card;
}

function deleteBook(bookId) {
    bookCollection = bookCollection.filter(book => book.id !== bookId); // Remove book from the collection by ID
    updateCards(); // Update the UI to reflect the changes
}

function updateCards() {
    main.innerHTML = ''; // Clear the existing cards
    bookCollection.forEach(book => {
        const card = createBookCard(book);
        main.appendChild(card); // Append the new card
    });

    statusMenu(); // Update the right menu statistics
}


//check and update the numbers in the right panel
function statusMenu() {
    let totalBooks = bookCollection.length;
    let totalPageCount = 0;
    let totalReadBooks = 0;

    for (let i = 0; i < totalBooks; i++) {
        totalPageCount += Number(bookCollection[i].page);
        if (bookCollection[i].read === true) {
            totalReadBooks++;
        }
    }

    numBooks.textContent = totalBooks;
    numPages.textContent = totalPageCount;
    numReadedBooks.textContent = totalReadBooks;

}


document.addEventListener('DOMContentLoaded', function () {
    console.log('1');
    createAddBookBox();
  });


/*
NEXT:
- delete button on overlay card
- DONE - fix bug with enter key on overlay card
- DONE - make the info panel work
- readed books edit after adding them
*/