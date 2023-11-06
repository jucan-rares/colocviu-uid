document.getElementById('displayButton').addEventListener('click', function () {

    loading();

    setTimeout(function () {
        show('content1');
        afterLoading();
    }, 3000);

    fetchResultsBasic();
});
document.getElementById('limitButton').addEventListener('click', function () {

    const resultsLimit = document.getElementById('resultsLimit').value;

    if (resultsLimit >= 1 && resultsLimit <= 200) {
        loading();
        hide('error');

        setTimeout(function () {
            show('content2');
            afterLoading();
        }, 3000);

        fetchResultsWithLimit(resultsLimit);
    } else {
        document.getElementById('error').innerHTML = 'Limita trebuie să fie între 1 și 200';
        hide('content2');
        show('error');
    }
});
document.getElementById('searchButton').addEventListener('click', function () {

    const searchTerm = document.getElementById('searchTerm').value.trim();

    loading();

    hide('error2');

    setTimeout(function () {
        show('content3');
        afterLoading();
    }, 3000);

    fetchResultsByKeyword(searchTerm);
});

function fetchResultsBasic(){
    fetch('https://edtechbooks.org/api.php?action=search_books', {
        method: 'GET'
    })
    .then(res => {
        res.json()
            .then(data => {
                renderBookListWithLinks(data, 'content1');
            });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function fetchResultsWithLimit(resultsLimit) {
    fetch(`https://edtechbooks.org/api.php?action=search_books&offset=0&limit=${resultsLimit}`, {
        method: 'GET'
    })
    .then(res => {
        res.json()
            .then(data => {
                renderBookListWithLinks(data, 'content2');
            });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function fetchResultsByKeyword(searchTerm) {

    fetch(`https://edtechbooks.org/api.php?action=search_books&term=${searchTerm}`, {
        method: 'GET'
    })
    .then(res => {
        res.json()
            .then(data => {
                renderBookListWithoutLinks(data, 'content3');
                if (!data.books || Object.keys(data.books).length === 0) {
                    document.getElementById('error2').innerHTML = 'Nu s-au găsit cărți pentru cuvântul cheie specificat.';
                    hide('content3');
                    show('error2');
                }
            });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function renderBookListWithLinks(data, element) {
    if (data.status === 'success' && data.books) {
        const bookList = document.getElementById(element);
        bookList.innerHTML = '';

        Object.keys(data.books).forEach(bookId => {
            const bookData = data.books[bookId];
            const bookListItem = document.createElement('li');
            const bookDetailsList = document.createElement('ul');

            const detailsToDisplay = ["book_id", "title", "subtitle", "links"];
            detailsToDisplay.forEach(key => {
                if (key === "links" && bookData[key]) {
                    const linksList = document.createElement('ul');

                    for (const linkKey in bookData.links) {
                        const linkValue = bookData.links[linkKey];
                        if (linkValue) {
                            const linkListItem = document.createElement('li');
                            linkListItem.innerHTML = `<strong>${linkKey}:</strong> ${linkValue}`;
                            linksList.appendChild(linkListItem);
                        }
                    }

                    if (linksList.childNodes.length > 0) {
                        const linksListItem = document.createElement('li');
                        linksListItem.innerHTML = '<strong>Links:</strong>';
                        linksListItem.appendChild(linksList);
                        bookDetailsList.appendChild(linksListItem);
                    }
                } else {
                    const detailListItem = document.createElement('li');
                    detailListItem.innerHTML = `<strong>${key}:</strong> ${bookData[key]}`;
                    bookDetailsList.appendChild(detailListItem);
                }
            });

            bookListItem.appendChild(bookDetailsList);
            bookList.appendChild(bookListItem);
        });
    }
}
function renderBookListWithoutLinks(data, element) {
    if (data.status === 'success' && data.books) {
        const bookList = document.getElementById(element);
        bookList.innerHTML = '';

        Object.keys(data.books).forEach(bookId => {
            const bookData = data.books[bookId];
            const bookListItem = document.createElement('li');
            const bookDetailsList = document.createElement('ul');

            const detailsToDisplay = ["book_id", "short_name", "title", "abstract"];
            detailsToDisplay.forEach(key => {
                
                const detailListItem = document.createElement('li');
                detailListItem.innerHTML = `<strong>${key}:</strong> ${bookData[key]}`;
                bookDetailsList.appendChild(detailListItem);
            });

            bookListItem.appendChild(bookDetailsList);
            bookList.appendChild(bookListItem);
        });
    }
}

function hide(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}
function show(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}
function loading(){
    hide('displayButton');
    hide('content1');
    hide('content2');
    hide('resultsLimit');
    hide('limitButton');
    hide('searchTerm');
    hide('searchButton');
    hide('popup');
    show('loading');
}
function afterLoading(){
    show('displayButton');
    show('resultsLimit');
    show('limitButton');
    show('searchTerm');
    show('searchButton');
    hide('loading');
}