function Book(bookId, title, author, pages, isRead) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.isRead = isRead;
	this.bookId = bookId;
}

let myLibrary = restoreLocal();

const addBookToLibrary = (props) => {
	if (myLibrary.some((book) => book.title === props.title)) return false;
	myLibrary.push(props);
	saveLocal();
	return true;
};

const createBook = (book) => {
	const img = document.createElement('img');
	img.setAttribute('src', 'circle.png');
	img.classList.add('book-card-img');
	const title = document.createElement('span');
	title.innerHTML = `<h3>Title<i class="fas fa-book"></i> </h3> <p>${book.title}</p>`;
	const author = document.createElement('span');
	author.innerHTML = `<h3>Author<i class="fas fa-user-edit"></i> </h3> <p>${book.author}</p>`;
	const pages = document.createElement('span');
	pages.innerHTML = `<h3>Pages<i class="fas fa-file-alt"></i></h3> <p>${book.pages}</p>`;
	const isRead = document.createElement('span');
	isRead.innerHTML = `<h3>Completed<i class="fa fa-check-square"></i></h3> <p class="isReadStatus">${book.isRead}</p>`;
	const toggle = document.createElement('label');
	toggle.innerHTML = `
  <input type="checkbox" ${book.isRead === 'yes' ? 'checked' : ''} class="toggleStatus"\>
  <span class="slider round"></span>`;
	const removeBtn = document.createElement('a');
	removeBtn.innerText = 'Remove Book';
	removeBtn.classList.add('remove');
	title.classList.add('title');
	author.classList.add('author');
	pages.classList.add('pages');
	isRead.classList.add('isRead');
	toggle.classList.add('switch');
	const div = document.createElement('div');
	div.appendChild(img);
	div.appendChild(title);
	div.appendChild(author);
	div.appendChild(pages);
	div.appendChild(isRead);
	isRead.appendChild(toggle);
	div.appendChild(removeBtn);
	div.classList.add('book');
	if (book.isRead == 'yes') {
		div.classList.add('read');
	}
	const bookId = book.bookId;
	div.setAttribute('id', bookId);
	// get random integer for background gradient

	const gradInt = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
	div.classList.add(`bg-${gradInt}`);
	document.getElementById('books').appendChild(div);
};

myLibrary.forEach((book) => {
	createBook(book);
});

// switch function

const isReadSpan = document.querySelectorAll('.isRead');

isReadSpan.forEach((span, index) => {
	const isReadSpanText = span.querySelector('.isReadStatus');
	const toggleStatus = span.querySelector('.toggleStatus');

	toggleStatus.addEventListener('change', () => {
		if (toggleStatus.checked) {
			isReadSpanText.innerHTML = 'yes';
			var getData = JSON.parse(localStorage.getItem('myLibrary'));
			getData[index].isRead = 'yes';
			isReadSpanText.parentElement.parentElement.classList.add('read');
			myLibrary = getData;
			saveLocal();
		} else {
			isReadSpanText.innerHTML = 'no';
			var getData = JSON.parse(localStorage.getItem('myLibrary'));
			getData[index].isRead = 'no';
			myLibrary = getData;
			isReadSpanText.parentElement.parentElement.classList.remove('read');
			saveLocal();
		}
	});
});

//form
const btn = document.getElementById('add');
const form = document.getElementById('addbook');
const container = document.querySelector('.container');
const bookDisplay = document.getElementById('book-display');
btn.addEventListener('click', (e) => {
	bookDisplay.style.opacity = 0.6;
	form.classList.add('show');
});

container.addEventListener('click', (e) => {
	if (
		e.target.parentNode.id !== 'addbook' &&
		e.target.parentNode.id !== 'form' &&
		e.target.id !== 'add' &&
		e.target.parentNode.id !== 'radio1' &&
		e.target.parentNode.id !== 'radio2'
	) {
		bookDisplay.style.opacity = 1;
		form.classList.remove('show');
	}
});

//add button

document.getElementById('submit').addEventListener(
	'click',
	(addBook = () => {
		const bookTitle = document.getElementById('title').value;

		const author = document.getElementById('author').value;
		const pageCount = document.getElementById('pagecount').value;
		const selection = document.getElementsByName('selection');
		const arr = Array.from(selection);
		const isRead = arr.filter((item) => item.checked === true)[0].id;
		let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
		let uniqid = randLetter + Date.now();

		if (bookTitle !== '' && author !== '' && pageCount !== '') {
			book = new Book(uniqid, bookTitle, author, pageCount, isRead);
		}

		if (addBookToLibrary(book)) {
			createBook(book);
			window.location.reload();
		} else {
			alert(`${book.title} is already in the library`);
		}
		bookDisplay.style.opacity = 1;
		form.style.transform = 'translateY(-200%)';
		form.style.opacity = '.6';
		document.getElementById('addbook').reset();
	})
);

const saveLocal = () => {
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
};

function restoreLocal() {
	var getData = JSON.parse(localStorage.getItem('myLibrary'));

	if (getData === null) return [];
	else return getData;
}

// remove book
const remove = document.querySelectorAll('.remove');
remove.forEach((del) => {
	del.addEventListener('click', (e) => {
		if (e.target.previousSibling.lastChild.previousSibling.innerText === 'No') {
			let bookName = e.target.parentNode.firstChild.nextSibling.lastChild.innerText;
			if (confirm(`Are you sure?. You Haven't completed '${bookName}' yet.`)) {
				del.parentNode.classList.add('del-animation');
				setTimeout(() => {
					removeFromLibrary(e.target.parentNode.id);
				}, 1000);
			}
		} else {
			if (confirm('Are you sure?')) {
				del.parentNode.classList.add('del-animation');
				setTimeout(() => {
					removeFromLibrary(e.target.parentNode.id);
				}, 1000);
			}
		}
	});
});

const removeFromLibrary = (bookId) => {
	myLibrary = myLibrary.filter((book) => book.bookId !== bookId);
	saveLocal();
	window.location.reload();
};
