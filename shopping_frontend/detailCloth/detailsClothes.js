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

var postApi ='http://localhost:3000/clothes/' + URL;
fetch(postApi)
    .then(response => response.json())
    .then(cloth => {
        htmls = `
            <div class="col-lg-3">
                <button>BUY NOW</button>
            </div>
            <div class="col-lg-9">
                <h2>${cloth.name}</h2>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${cloth.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <p>${cloth.description}</p>
            </div>
            `
        document.getElementById('detailClothes').innerHTML = htmls;
    })
    .catch(function(error){
        alert('Have a mistake!!!')
    });