document.getElementById('displayButton').addEventListener('click', function () {

    hide('displayButton');
    hide('content1');
    hide('content2');
    hide('resultsLimit');
    hide('limitButton');
    show('loading');

    // Here we set everything back to normal after the loading is complete
    setTimeout(function () {
        show('displayButton');
        show('content1');
        show('resultsLimit');
        show('limitButton');
        hide('loading');
    }, 3000);

    fetch('https://edtechbooks.org/api.php?action=search_books', {
        method: 'GET'
    })
    .then(res => {
        res.json()
            .then(data => {
                if (data.status === 'success' && data.books) {
                    var temp = "";
                    for (const bookId in data.books) {
                        const bookData = data.books[bookId];
                        temp += "<tr>";
                        temp += "<td>" + bookData.book_id + "</td>";  
                        temp += "<td>" + bookData.title + "</td>";
                        temp += "<td>" + bookData.subtitle + "</td>";     
                        temp += "<td>" + bookData.links.html + "</td></tr>";
                    }
                    document.getElementById('data1').innerHTML = temp;  
                }
            });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('limitButton').addEventListener('click', function () {

    const resultsLimit = document.getElementById('resultsLimit').value;
    
    if (resultsLimit >= 1 && resultsLimit <= 200) {

        hide('displayButton');
        hide('content1');
        hide('content2');
        hide('resultsLimit');
        hide('limitButton');
        hide('error');
        show('loading');

        //here we set everything back to normal after the loading is complete
        setTimeout(function () {
            show('displayButton');
            show('content2');
            show('resultsLimit');
            show('limitButton');
            hide('loading');
        }, 3000);
        
        fetch(`https://edtechbooks.org/api.php?action=search_books&offset=0&limit=${resultsLimit}`, {
            method: 'GET'
        })
        .then(res => {
            res.json()
                .then(data => {
                    if (data.status === 'success' && data.books) {
                        var temp = "";
                        for (const bookId in data.books) {
                            const bookData = data.books[bookId];
                            temp += "<tr>";
                            temp += "<td>" + bookData.book_id + "</td>";
                            temp += "<td>" + bookData.title + "</td>";
                            temp += "<td>" + bookData.subtitle + "</td>";
                            temp += "<td>" + bookData.links.html + "</td></tr>";
                        }
                        document.getElementById('data2').innerHTML = temp;
                    }
                });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } 
    else {
        document.getElementById('error').innerHTML = 'Limita trebuie să fie între 1 și 200';
        show('error')
    }
});

document.getElementById('searchButton').addEventListener('click', function () {
    const searchTerm = document.getElementById('searchInput').value;
    
    // Fetch data based on the search term
    fetch(`https://edtechbooks.org/api.php?action=search_books&term=${searchTerm}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success' && data.books) {
            // Display the pop-up with book details
            const firstBook = data.books[Object.keys(data.books)[0]]; // Assuming you want details of the first book
            showPopup(firstBook);
        } else {
            // Display an error message in the pop-up
            showErrorMessage();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('closePopup').addEventListener('click', function () {
    // Close the pop-up when the "Închide" button is clicked
    document.getElementById('popup').classList.add('hidden');
});

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
function showPopup(book) {
    document.getElementById('popupBookId').textContent = book.book_id;
    document.getElementById('popupShortName').textContent = book.short_name;
    document.getElementById('popupTitle').textContent = book.title;
    document.getElementById('popupAbstract').textContent = book.abstract;
    hide('popupErrorMessage');
    show('popup');
}
function showErrorMessage() {
    show('popupErrorMessage');
    hide('popup');
}