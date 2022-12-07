const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function makeBook(titleBook, authorBook, yearBook, isCompletedBook) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = titleBook;

    const textAuthor = document.createElement("p");
    textAuthor.setAttribute("id", "author");
    textAuthor.innerText = authorBook;

    const textYear = document.createElement("p");
    textYear.setAttribute("id", "year");
    textYear.innerText = yearBook;

    const container = document.createElement("article");
    container.classList.add("book_item")
    container.append(textTitle, textAuthor, textYear);

    if (isCompletedBook) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    return container;
}

function createUndoButton() {
    return createButton("Belum selesai dibaca", "green", function (event) {
        undoTaskFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("Hapus buku", "red", function (event) {
        removeTaskFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("Selesai dibaca", "green", function (event) {
        addTaskToCompleted(event.target.parentElement);
    });
}

function createButton(buttonText, buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function addBook() {
    const incompletedBOOKList = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    const completedBOOKList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const titleBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const yearBook = document.getElementById("inputBookYear").value;
    const isCompleteBook = document.getElementById("inputBookIsComplete").checked;
    let status = false;
    if (isCompleteBook) {
        status = true;
    } else {
        status = false;
    }

    const book = makeBook(titleBook, authorBook, yearBook, status);
    const bookObject = composeBookObject(titleBook, authorBook, yearBook, status);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isCompleteBook) {
        completedBOOKList.append(book);
    } else {
        incompletedBOOKList.append(book);
    }
    updateDataToStorage();
}

function addTaskToCompleted(taskElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const bookTitle = taskElement.querySelector("h3").innerText;
    const bookAuthor = taskElement.querySelectorAll("p")[0].innerText;
    const bookYear = taskElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function removeTaskFromCompleted(taskElement) {
    answer = window.confirm("Apakah anda yakin ingin menghapus buku tersebut?");
    if(answer) {
        const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
        books.splice(bookPosition, 1);

        taskElement.remove();
        updateDataToStorage();    
    }
}

function undoTaskFromCompleted(taskElement) {
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    const bookTitle = taskElement.querySelector("h3").innerText;
    const bookAuthor = taskElement.querySelectorAll("p")[0].innerText;
    const bookYear = taskElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listIncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function refreshDataFromBooks() {
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if(book.isCompleted){
            listCompleted.append(newBook);
        } else {
            listIncompleted.append(newBook);
        }
    }
}

function isChecked() {
    if(document.getElementById("inputBookIsComplete").checked) {
        document.getElementById("status").innerHTML = "Selesai dibaca";
    } else {
        document.getElementById("status").innerHTML = "Belum selesai dibaca";
    }
}

function searchBook() {
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const titleBook = document.getElementById("searchBookTitle").value;

    while(listIncompleted.firstChild) {
        listIncompleted.removeChild(listIncompleted.lastChild);
    }

    while(listCompleted.firstChild) {
        listCompleted.removeChild(listCompleted.lastChild);
    }

    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if(book.title.includes(titleBook)) {
            if(book.isCompleted){
                listCompleted.append(newBook);
            } else {
                listIncompleted.append(newBook);
            }
        }
    }
}