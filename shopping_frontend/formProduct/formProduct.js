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

var imagesArrayData = []
var imageId
var cloudName = ''

var URL = getParameterByName('id', window.location.href)

var idApi = 'http://localhost:3000/api/products/' + URL

var createURL = 'http://localhost:5501/shopping_frontend/formProduct/formProduct.html?id=' + URL

var productApi = 'http://localhost:3000/api/products'

// Thêm 1 lần nhiều ảnh vào cloudinay
const uploadImgUrl = "https://api.cloudinary.com/v1_1/ddjfns8d7/image/upload"
// const destroyImgUrl = ""

async function createImages(images) {
    return (await axios({
        method: 'post',
        url: uploadImgUrl,
        data: images
    }))
}

async function deleteImages(fileName) {
    return (await instance.delete(`images?fileName=${fileName}`))
}

async function updateProduct(productId, newProduct) {
    return (await instance.put(`products/${productId}`, newProduct)).data
}

async function detailProduct() {
    return (await instance.get('products/' + URL)).data
}

async function createProduct(newProduct) {
    return (await axios({
        method: 'post',
        url: 'http://localhost:3000/api/products',
        data: newProduct
    })).data
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

function getStringValue(input) {
    const valuesArray = input.replace(/ /g, '').split(',')
    const data = valuesArray.map(value => value.trim())
    return data
}

function getFileName(url) {
    const urlArray = url.split('/');
    const urlCut = `${urlArray[urlArray.length - 3]}/${urlArray[urlArray.length - 2]}/${urlArray[urlArray.length - 1]}`
    const fileName = urlCut.split('.')[0]
    return fileName
}

// Sử dụng jQuery để thêm sự kiện change
async function handleInputImages(event) {
    event.preventDefault()
    //tai anh len cloudinary
    const files = event.target.files
    const formData = new FormData()
    for (const file of files) {
        formData.append('file', file)
        formData.append('upload_preset', 'kfktapsu')
        formData.append('folder', 'shopping-nodejs/image-products')
        const response = await createImages(formData)
        if (response.status === 200) {
            imagesArrayData = [...imagesArrayData, response.data?.secure_url]
        }
    }

    //xem truoc anh truoc khi submit
    const imageElements = imagesArrayData?.map(item => {

        const imgElement = document.createElement('img')
        imgElement.src = item
        imgElement.alt = 'preview'
        imgElement.className = 'classHandleImages'

        const spanElement = document.createElement('span')
        spanElement.className = 'oi oi-trash p-2 m-1'
        spanElement.title = 'xoa'

        const divElement = document.createElement('div')
        divElement.className = 'd-inline-block p-2'
        divElement.appendChild(imgElement)
        divElement.appendChild(spanElement)

        return divElement
    })

    // Lấy tham chiếu đến phần tử '#imagesPreview' bằng jQuery
    const $imagesPreview = $('#imagesPreview')

    // Xóa toàn bộ nội dung của phần tử xem trước (nếu có)
    $imagesPreview.empty()

    // Thêm các thẻ <img> vào phần tử '#imagesPreview' bằng jQuery
    imageElements?.forEach(img => {
        $imagesPreview.append(img)
    })

    // Xóa ảnh khi chưa submit
    $('span[title="xoa"]').on('click', async function () {
        const divToRemove = $(this).closest('div')
        if (divToRemove.length) {
            const imgToRemove = divToRemove.find('img').attr('src')
            const fileNameToDelete = getFileName(imgToRemove)
            console.log(fileNameToDelete)
            deleteImages(fileNameToDelete)

            imagesArrayData = imagesArrayData.filter(item => item !== imgToRemove)
            divToRemove.remove()
        }
    })
}

if (window.location.href == createURL) {
    detailProduct()
        .then(response => {
            const { meta, resData: product } = response
            const htmlEditProduct = `
                <h3>Update item</h3>

                <form id="editProduct" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="title">Title item</label>
                        <input type="text" class="form-control" value="${product.title}" id="title" title="title">
                    </div>

                    <div class="form-group">
                        <label for="images">Image</label>
                        <input type="file" class="form-control" value="${product.image}" id="images" name="images" multiple>
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
                const name = $('input[name = "name"]').val()
                const images = $('input[name = "images"]').val()
                const description = $('textarea[name = "description"]').val()
                const classification = $('input[name = "classification"]').val()
                const price = $('input[name = "price"]').val()

                const newProduct = {
                    name: name,
                    images: images,
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
    const htmlCreateProduct = `
        <h3>Post item</h3>
                    
        <form id="createProduct" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Title item</label>
                <input type="text" class="form-control" id="title" name="title">
            </div>

            <div class="form-group">
                <label for="images">Image (Vui lòng đợi hình ảnh tải lên hoàn chỉnh)</label>
                <div>
                    <input type="file" class="form-control" id="images" name="images" multiple>
                </div>
            </div>

            <div class="form-group imagesPreview d-flex flex-wrap justify-content-start" id="imagesPreview">

            </div>

            <div class="form-group">
                <label for="color">Color</label>
                <input type="text" class="form-control" id="color" name="color">
            </div>

            <div class="form-group">
                <label for="sizes">Sizes (mỗi size cần được cách nhau bằng <b>dấu phẩy</b>)</label>
                <input type="text" class="form-control" id="sizes" name="sizes">
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea type="text" class="form-control" id="description" name="description"></textarea>
            </div>

            <div class="form-group">
                <label for="price">Price</label>
                <input type="text" class="form-control" id="price" name="price">
            </div>
            
            <button type="submit" class="btn btn-primary">Create item</button>
        </form>
    `
    $('#formProduct').html(htmlCreateProduct)

    $('input[name="images"]').on('change', handleInputImages)

    // Set up the form submission event listener
    $('#createProduct').on('submit', (event) => {
        event.preventDefault()
        const title = $('input[name = "title"]').val()
        const images = imagesArrayData
        const color = $('input[name = "color"]').val()
        const InputSizes = $('input[name = "sizes"]').val()
        const price = $('input[name = "price"]').val()
        const description = $('textarea[name = "description"]').val()

        const sizes = getStringValue(InputSizes)

        const newProduct = {
            title: title,
            images: images,
            color: color,
            sizes: sizes,
            price: price,
            description: description,
        }
        createProduct(newProduct)
            .then(data => {
                alert('Tao san pham thanh cong')
                console.log(data)
                // const newPageURL = '../index.html'
                // window.location.href = newPageURL
            })
            .catch(error => {
                alert('Không thể tạo được sản phẩm: ')
                console.log(error)
            })
    })
}
