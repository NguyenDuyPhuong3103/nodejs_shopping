//Create instance axios config
const instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 3 * 1000, //milliseconds,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
})

async function getAllProducts(productId) {
    return (await instance.get('products')).data
}

getAllProducts()
    .then(response => {
        const products = response.resData
        var htmls = products.map(function(product){
                return `
                    <div class="col-sm-6 col-lg-4">
                        <div class="card card-course-item">
                            <a href="../detailProduct/detailsProducts.html?id=${product._id}">
                                <img class="card-img-top" src="${product.image}" alt="${product.name}">
                            </a>
                            <div class="card-body">
                                <a href="../detailProduct/detailsProducts.html?id=${product._id}">
                                    <h5 class="card-title">${product.name}</h5>
                                </a>
                                <a href="../detailProduct/detailsProducts.html?id=${product._id}" class="btn btn-primary">Details</a>
                            </div>
                        </div>
                    </div> 
                `
        });
        
        var html = htmls.join('');
        document.getElementById('getAllProducts').innerHTML = html;
    })
    .catch(function(error){
        alert('có lỗi ở phần front end!!! ');
        console.log(error);
    });
