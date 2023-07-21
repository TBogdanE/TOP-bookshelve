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
        overlayClearInputs();
    } else if (event.key === 'Enter' && checkOverflowStatus() === 'flex') {
        if (event.target.tagName !== 'INPUT') {
            event.preventDefault();
            overlayCheckInput();
        }
    }
});


//FUNCTIONS 

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

//check the inputs
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

//checks if the book is read or not
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

//resets the read status of the book, so, everytime when we acces the overlay, the read status to be the same
function resetReadStatus() {
    overlayReadBtn.textContent = 'Read it? No';
    overlayReadBtn.setAttribute('class', 'card-read-book-btn');
    overlayReadStatus = false;
}

//clears the input boxes in the overlay menu
function overlayClearInputs() {
    document.getElementById('overlay-title').value = '';
    document.getElementById('overlay-author').value = '';
    document.getElementById('overlay-pages').value = '';
    resetReadStatus();
}

//returns today date
function getDate() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
}

//saves the info of the new added book
function submitOverlayBook() {
    let bookInfo = {
        title: document.getElementById('overlay-title').value,
        author: `- ${document.getElementById('overlay-author').value} -`,
        page: document.getElementById('overlay-pages').value,
        read: overlayReadStatus,
        date: getDate(),
        id: generateID()
    }
    console.log(bookCollection);
    console.log(`title: ${bookInfo.title}\n author: ${bookInfo.author}\n page: ${bookInfo.page}\n read?: ${bookInfo.read}\n date: ${bookInfo.date}\n id: ${bookInfo.id}`);
    bookCollection.push(bookInfo);
    createBookCard(bookInfo);
    statusMenu();
    overlayToggle();
    overlayClearInputs();
}

//generates a random number, that will be the ID of the card
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
    card.setAttribute('data-book-id', book.id);

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
    if (book.read === true) {
        cardReadBtn.textContent = 'Read it';
        cardReadBtn.setAttribute('class', 'card-read-book-btn-active');
    } else {
        cardReadBtn.textContent = 'Didn\'t read it';
        cardReadBtn.setAttribute('class', 'card-read-book-btn');
    }
    cardReadBtn.setAttribute('type', 'button');
    cardReadBtn.addEventListener('click', function () {
        cardReadButton(book.id, cardReadBtn);
    });

    let cardDeleteBtn = document.createElement('button');
    cardDeleteBtn.setAttribute('id', 'card-delete-book-btn');
    cardDeleteBtn.setAttribute('class', 'card-delete-book-btn');
    cardDeleteBtn.textContent = 'Delete';
    cardDeleteBtn.setAttribute('type', 'button');
    cardDeleteBtn.addEventListener('click', function () {
        cardDeleteBook(book.id);
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

//updates the read status of the book
function cardReadButton(bookId, cardReadBtn) {
    const bookSelector = bookCollection.find(book => book.id === bookId);
    if (bookSelector.read === true) {
        cardReadBtn.setAttribute('class', 'card-read-book-btn');
        cardReadBtn.textContent = 'Not readed';
        bookSelector.read = false;
        statusMenu();
    } else {
        cardReadBtn.setAttribute('class', 'card-read-book-btn-active');
        bookSelector.read = true;
        cardReadBtn.textContent = 'Read it';
        statusMenu();
    }


}

//delete button will remove the book from the main section and from the bookCollection=[]
function cardDeleteBook(bookId) {
    bookCollection = bookCollection.filter(book => book.id !== bookId);
    // Find the corresponding card based on the bookId
    const cardToDelete = main.querySelector(`[data-book-id="${bookId}"]`);
    if (cardToDelete) {
        main.removeChild(cardToDelete); // Remove the card from the DOM
        statusMenu();
    }
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
    console.log(bookCollection);

}


/*
NEXT:
- DONE - delete button on overlay card
- DONE - fix bug with enter key on overlay card
- DONE - make the info panel work
- DONE - readed books edit after adding them
*/