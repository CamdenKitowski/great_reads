document.getElementById('bookForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
});

function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const rating = document.getElementById('rating').value;
    const comp = document.getElementById('completed').checked ? 'Yes' : 'No';

    const book = { title, author, rating, comp };
    
    const table = document.getElementById('bookTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td>${title}</td>
        <td>${author}</td>
        <td>${rating}</td>
        <td class="center">${comp}</td>
        <td class="center"><button onclick="deleteBook(this)">Delete</button></td>
    `;
    
    saveBook(book);
    document.getElementById('bookForm').reset();
}

function deleteBook(button) {
    const row = button.parentElement.parentElement;
    const title = row.cells[0].innerText;
    row.remove();
    removeBook(title);
}

function sortTable(columnIndex) {
    
    const table = document.getElementById('bookTable');
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    
    const isNumeric = columnIndex === 2;
    const isBoolean = columnIndex === 3;

    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText;
        let cellB = rowB.cells[columnIndex].innerText;

        if (isNumeric) {
            return parseFloat(cellA) - parseFloat(cellB);
        } else if (isBoolean) {
            return (cellA === 'Yes' ? 1 : 0) - (cellB === 'Yes' ? 1 : 0);

        } else {
            return cellA.localeCompare(cellB);
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

function saveBook(book) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    books.forEach(book => {
        const table = document.getElementById('bookTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.rating}</td>
            <td class="center">${book.comp}</td>
            <td class="center"><button onclick="deleteBook(this)">Delete</button></td>
        `;

    });
}

function removeBook(title) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(book => book.title !== title);
    localStorage.setItem('books', JSON.stringify(books));
}

document.addEventListener('DOMContentLoaded', loadBooks);
