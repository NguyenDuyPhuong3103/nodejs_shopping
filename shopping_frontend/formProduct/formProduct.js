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

var idApi ='http://localhost:3000/api/products/' + URL;

var productApi ='http://localhost:3000/api/products';

var createURL = 'http://127.0.0.1:5501/shopping_frontend/formProduct/formProduct.html?id=' + URL;

if (window.location.href == createURL) {
    fetch(idApi)
        .then(response => response.json())
        .then(product => {
            var htmlEditProduct = `
                <h3>Update item</h3>

                <form id="editProduct">
                    <div class="form-group">
                        <label for="name">Name item</label>
                        <input type="text" class="form-control" value="${product.name}" id="name" name="name">
                    </div>

                    <div class="form-group">
                        <label for="image">Image</label>
                        <input type="text" class="form-control" value="${product.image}" id="image" name="image">
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea class="form-control" id="description" name="description">${product.description}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="classification">Classification</label>
                        <input type="text" class="form-control" value="${product.classification}" id="classification" name="classification">
                    </div>

                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="text" class="form-control" value="${product.price}" id="price" name="price">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Save item</button>
                </form>
            `;
            $('#formProduct').html(htmlEditProduct);

            // Set up the form submission event listener
            $('#editProduct').on('submit', (event) => {
                event.preventDefault();
                var name = $('input[name = "name"]').val();
                var image = $('input[name = "image"]').val();
                var description = $('input[name = "description"]').val();
                var classification = $('input[name = "classification"]').val();
                var price = $('input[name = "price"]').val();

                var newProduct = {
                    name: name,
                    image: image,
                    description: description,
                    classification: classification,
                    price: price
                }

                // Truyền productId của sản phẩm cần cập nhật vào hàm editProduct
                editProduct(product._id, newProduct);
            })
        })
        .catch(function (error) {
            alert('Have a mistake!!!');
        });

// PUT new product to server
function editProduct(productId, data) {
    var apiUrl = `http://localhost:3000/api/products/eidt/${productId}`;
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(idApi, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi cập nhật sản phẩm.');
            }
            return response.json();
        })
        .then(data => {
            const newPageURL = '../index.html';
            window.location.href = newPageURL;
        })
        .catch(error => {
            alert('Không thể cập nhật sản phẩm: ' + error.message);
        });
 }
}
else 
//Create product
{
    fetch(productApi)
        .then(response => response.json())
        .then(product => {
            var htmlCreateProduct = `
                <h3>Post item</h3>
                            
                <form id="createProduct">
                    <div class="form-group">
                        <label for="name">Name item</label>
                        <input type="text" class="form-control" id="name" name="name">
                    </div>

                    <div class="form-group">
                        <label for="image">Image</label>
                        <input type="text" class="form-control" id="image" name="image">
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <input type="text" class="form-control" id="description" name="description">
                    </div>

                    <div class="form-group">
                        <label for="classification">Classification</label>
                        <input type="text" class="form-control" id="classification" name="classification">
                    </div>

                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="text" class="form-control" id="price" name="price">
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Create item</button>
                </form>
            `
            $('#formProduct').html(htmlCreateProduct);

            // Set up the form submission event listener
            $('#createProduct').on('submit', (event) => {
                event.preventDefault();
                var name = $('input[name = "name"]').val();
                var image = $('input[name = "image"]').val();
                var description = $('input[name = "description"]').val();
                var classification = $('input[name = "classification"]').val();
                var price = $('input[name = "price"]').val();
                
        
                var newProduct = {
                    name: name,
                    image: image,
                    description: description,
                    classification: classification,
                    price: price
                }
                createProduct(newProduct);
            })
        })
        .catch(function(error){
            alert('Have a mistake!!!')
        });
    
    // Post new product to server
    function createProduct(data) {
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        fetch(productApi, options)
            .then(res =>res.clone().json())
            .then(data => {
                const newPageURL = '../getAllProducts/getAllProducts.html';
                window.location.href = newPageURL;
            }
                )
            .catch(error => {
                alert('Không tạo được sản phẩm');
            });
    }
}
