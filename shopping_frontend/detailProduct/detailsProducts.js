function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var URL = getParameterByName('id', window.location.href);

var postApi ='http://localhost:3000/api/products/' + URL;
fetch(postApi)
    .then(response => response.json())
    .then(product => {
        var html = `
        <div>
            <h2>${product.name}</h2>
            <center>
                <img class="details-img" src="${product.image}" alt="${product.name}">
            </center>
            <p>${product.description}</p>
        </div>
        <div class="detailsPrice">
            <h3 class="mr-4">${product.price}</h3>
            <button>BUY NOW</button>
        </div>
        `
        document.getElementById('detailsProducts').innerHTML = html;
    })
    .catch(function(error){
        alert('Have a mistake!!!')
    });