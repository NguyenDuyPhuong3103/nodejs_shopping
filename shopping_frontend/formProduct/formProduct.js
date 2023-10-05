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

async function updateProduct(productId, newProduct) {
    return (await instance.put(`products/${productId}`,newProduct)).data
}

async function detailProduct() {
    return (await instance.get('products/' + URL)).data
}

async function createProduct(newProduct) {
    return (await instance.post('products', newProduct)).data
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

var URL = getParameterByName('id', window.location.href)

var idApi ='http://localhost:3000/api/products/' + URL

var productApi ='http://localhost:3000/api/products'

var createURL = 'http://localhost:5501/shopping_frontend/formProduct/formProduct.html?id=' + URL

if (window.location.href == createURL) {
    detailProduct()
        .then(response  => {
            const { meta, resData: product } = response
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
            `
            $('#formProduct').html(htmlEditProduct)

            // Set up the form submission event listener
            $('#editProduct').on('submit', (event) => {
                event.preventDefault()
                var name = $('input[name = "name"]').val()
                var image = $('input[name = "image"]').val()
                var description = $('textarea[name = "description"]').val()
                var classification = $('input[name = "classification"]').val()
                var price = $('input[name = "price"]').val()

                var newProduct = {
                    name: name,
                    image: image,
                    description: description,
                    classification: classification,
                    price: price
                }

                // Truyền productId của sản phẩm cần cập nhật vào hàm editProduct
                updateProduct(product._id, newProduct)
                    .then(data => {
                        alert('cap nhat san pham thanh cong')
                        // const newPageURL = '../index.html'
                        // window.location.href = newPageURL
                    })
                    .catch(error => {
                        alert('Không thể cập nhật sản phẩm: ' + error.message)
                    })
            })
        })
        .catch(function (error) {
            alert('Have a mistake!!!')
            console.log(error)
        })
}
else 
//Create product
{
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
                <textarea class="form-control" id="description" name="description"></textarea>
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
    $('#formProduct').html(htmlCreateProduct)

    // Set up the form submission event listener
    $('#createProduct').on('submit', (event) => {
        event.preventDefault()
        var name = $('input[name = "name"]').val()
        var image = $('input[name = "image"]').val()
        var description = $('textarea[name = "description"]').val()
        var classification = $('input[name = "classification"]').val()
        var price = $('input[name = "price"]').val()
        

        var newProduct = {
            name: name,
            image: image,
            description: description,
            classification: classification,
            price: price
        }
        createProduct(newProduct)
            .then(data => {
                alert('Tao san pham thanh cong')
                // const newPageURL = '../index.html'
                // window.location.href = newPageURL
            })
            .catch(error => {
                alert('Không thể tạo được sản phẩm: ')
            })
    })
}
