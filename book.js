//GETTING DOM ELEMENTS
let overlayBox = document.getElementById('overlay');
let newBookBtn = document.getElementById('add-new-book-btn');
let overlayAddBtn = document.getElementById('overlay-card-add-book-btn')
let overlayCancelBtn = document.getElementById('overlay-card-cancel-book-btn');

//INITIALISE VARIABLES

let bookCollection = [];

//EVENT LISTENERS
newBookBtn.addEventListener('click', overlayToggle);
overlayAddBtn.addEventListener('click', submitOverlayBook);
overlayCancelBtn.addEventListener('click', overlayToggle);

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if(checkOverflowStatus() === 'flex') {
        overlayToggle();
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
function overlayClearInputs () {
    document.getElementById('overlay-title').value = '';
    document.getElementById('overlay-author').value ='';
    document.getElementById('overlay-pages').value = '';
}

//saves the info of the new added book
function submitOverlayBook() {
    let bookInfo = {
        title: document.getElementById('overlay-title').value,
        author: document.getElementById('overlay-author').value,
        pages: document.getElementById('overlay-pages').value,
        date: new Date()
    }
    bookCollection.push(bookInfo);
    console.log(bookCollection);
    console.log(bookInfo);
    overlayToggle();
}