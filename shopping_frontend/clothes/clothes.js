var postApi ='http://localhost:3000/clothes';

fetch(postApi)
    .then(response => response.json())
    .then(clothes => {
        var htmls = clothes.map(function(cloth){
                return `
                    <div class="col-sm-6 col-lg-4">
                        <div class="card card-course-item">
                            <a href="../detailCloth/detailsClothes.html?id=${cloth._id}">
                                <img class="card-img-top" src="${cloth.image}" alt="${cloth.name}">
                            </a>
                            <div class="card-body">
                                <a href="../detailCloth/detailsClothes.html?id=${cloth._id}">
                                    <h5 class="card-title">${cloth.name}</h5>
                                </a>
                                <p class="card-text">${cloth.description}</p>
                                <a href="../detailCloth/detailsClothes.html?id=${cloth._id}" class="btn btn-primary">Details</a>
                            </div>
                        </div>
                    </div> 
                `
        });

        var html = htmls.join('');
        document.getElementById('postClothes').innerHTML = html;
    })
    .catch(function(error){
        alert('Have a mistake!!!')
    });
