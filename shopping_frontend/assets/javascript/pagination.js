var currentPage = 1;
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

async function pagination() {
    return (await instance.get('products?page=' + currentPage)).data
}

async function deleteProduct(productId) {
    return (await instance.delete('products/' + productId)).data
}


function generateProductHtml(resData, currentPage) {
    const products = resData.docs
    var htmls = products.map(function(product, index){
        return `
            <tr>
                <th scope="row">${(currentPage - 1) * resData.limit + index + 1}</th>
                <td>
                    <a class="details" href="./detailProduct/detailsProducts.html?id=${product._id}">${product.name}</a>
                </td>
                <td>${product.classification}</td>
                <td>${product.price}</td>
                <td>
                    <a href="./formProduct/formProduct.html?id=${product._id}" class="btn btn-primary">Update</a>
                    <a href="" class="btn btn-primary" data-id="${product._id}" data-toggle="modal" data-target="#deleteProductModal">Delete</a>
                </td>    
            </tr>
        `;
    });
    
    var html = htmls.join('');
    $('#postedProducts').html(html);
}

pagination()
    .then(response  => {
        console.log(response)
        const { meta, resData } = response
        const products = resData.docs
        $('.pagination').append(`<li class="page-item"><a class="page-link page-pre" href="#">Previous</a></li>`);

        // Tạo vòng lặp để hiển thị các nút bấm số trang
        for (var i = 1; i <= parseInt(resData.totalPage); i++) {
            var liClass = 'page-item';
            var liContent = `<a class="page-link page-number" href="#">${i}</a>`;
            $('.pagination').append(`<li class="${liClass}">${liContent}</li>`);
        }

        $('.pagination').append(`<li class="page-item"><a class="page-link page-next" href="#">Next</a></li>`);
    })
    .catch(error => console.log(error))
    .then(() => {
        pagination()
            .then(response  => {
                const { meta, resData } = response
                const products = resData.docs
                    generateProductHtml(resData, currentPage);
                })
            .catch(error => console.log(error));
        
        $("a.page-number").on( "click", function () {
            currentPage = $(this).html();
            pagination()
            .then(response  => {
                const { meta, resData } = response
                const products = resData.docs
                    generateProductHtml(resData, currentPage);
                })
                .catch(error => console.log('co loi sai o phan pagination.js'));    
        });
        
        
        $("a.page-next").on( "click", function () {
            currentPage++;
            $("li.page-item a.page-pre").removeClass("disabled").css("pointer-events", "auto");
            pagination()
            .then(response  => {
                const { meta, resData } = response
                const products = resData.docs
                $("li.page-item a.page-next").removeClass("disabled").css("pointer-events", "auto");
                generateProductHtml(resData, currentPage);
                })
            .catch(error => { 
                alert('It is a last page!!!');
                currentPage--;
                $("li.page-item a.page-next").addClass("disabled").css("pointer-events", "none");  
            }
            );
        });
        
        $("a.page-pre").on( "click", function () {
            currentPage--;
            $("li.page-item a.page-next").removeClass("disabled").css("pointer-events", "auto");
            
            pagination()
            .then(response  => {
                const { meta, resData } = response
                const products = resData.docs
                    if (currentPage < 1){
                        alert('Can not previous page !!!');
                        currentPage++;
                        $("li.page-item a.page-pre").addClass("disabled").css("pointer-events", "none");
                    } else {
                        $("li.page-item a.page-pre").removeClass("disabled").css("pointer-events", "auto");
                        generateProductHtml(resData, currentPage);
                    }
                })
                .catch(error => console.log('co loi sai o phan pagination.js'));
        });
        
        
        //Delete product
        
        var productId;
        
        $('#deleteProductModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            productId = button.data('id');
        })
        
        var btnDeleteProduct = $('#btn-delete-product');
        
        btnDeleteProduct.on( "click", function( event ) {
            deleteProduct(productId)
                .then(response => {
                    console.log(response)
                    alert(`Ban da xoa thanh cong ${response.resData.name}`)
                    // const newPageURL = '/shopping_frontend/admin.html';
                    // window.location.href = newPageURL;
                }
                    )
                .catch(error => {
                    alert('Can not delete product');
                })
        });
    });
