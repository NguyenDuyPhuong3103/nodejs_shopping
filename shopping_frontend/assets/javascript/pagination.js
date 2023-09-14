var currentPage = 1;

function generateProductHtml(products, currentPage) {
    var htmls = products.data.map(function(product, index){
        return `
            <tr>
                <th scope="row">${(currentPage - 1) * products.pageSize + index + 1}</th>
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

$.ajax({
    url: 'http://localhost:3000/api/products?page=' + currentPage,
    method: 'GET'
})
    .then(products => {
        $('.pagination').append(`<li class="page-item"><a class="page-link page-pre" href="#">Previous</a></li>`);

        // Tạo vòng lặp để hiển thị các nút bấm số trang
        for (var i = 1; i <= parseInt(products.totalPage); i++) {
            var liClass = 'page-item';
            var liContent = `<a class="page-link page-number" href="#">${i}</a>`;
            $('.pagination').append(`<li class="${liClass}">${liContent}</li>`);
        }

        $('.pagination').append(`<li class="page-item"><a class="page-link page-next" href="#">Next</a></li>`);
    })
    .catch(error => console.log('co loi sai o phan pagination.js'))
    .then(() => {
        $.ajax({
            url: 'http://localhost:3000/api/products?page=' + currentPage,
            method: 'GET'
        })
            .then(products => {
                generateProductHtml(products, currentPage);
            })
            .catch(error => console.log('co loi sai o phan pagination.js'));
        
        $("a.page-number").on( "click", function () {
            currentPage = $(this).html();
            $.ajax({
                url: 'http://localhost:3000/api/products?page=' + $(this).html(),
                method: 'GET'
            })
                .then(products => {
                    generateProductHtml(products, currentPage);
                })
                .catch(error => console.log('co loi sai o phan pagination.js'));    
        });
        
        
        $("a.page-next").on( "click", function () {
            currentPage++;
            $("li.page-item a.page-pre").removeClass("disabled").css("pointer-events", "auto");
            $.ajax({
                url: 'http://localhost:3000/api/products?page=' + currentPage,
                method: 'GET'
            })
                .then(products => {
                    if (currentPage > parseInt(products.totalPage)){
                        alert('It is a last page!!!');
                        currentPage--;
                        $("li.page-item a.page-next").addClass("disabled").css("pointer-events", "none");
                    } else {
                        $("li.page-item a.page-next").removeClass("disabled").css("pointer-events", "auto");
                        generateProductHtml(products, currentPage);
                    }
                })
                .catch(error => console.log('co loi sai o phan pagination.js'));
        });
        
        $("a.page-pre").on( "click", function () {
            currentPage--;
            $("li.page-item a.page-next").removeClass("disabled").css("pointer-events", "auto");
            
            $.ajax({
                url: 'http://localhost:3000/api/products?page=' + currentPage,
                method: 'GET'
            })
                .then(products => {
                    if (currentPage < 1){
                        alert('Can not previous page !!!');
                        currentPage++;
                        $("li.page-item a.page-pre").addClass("disabled").css("pointer-events", "none");
                    } else {
                        $("li.page-item a.page-pre").removeClass("disabled").css("pointer-events", "auto");
                        generateProductHtml(products, currentPage);
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
            deleteProduct(productId);
        });
        
        function deleteProduct(productId) {
            var options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            fetch('http://localhost:3000/api/products/' + productId, options)
                .then(res =>res.clone().json())
                .then(data => {
                    const newPageURL = '/shopping_frontend/index.html';
                    window.location.href = newPageURL;
                }
                    )
                .catch(error => {
                    alert('Can not delete product');
                });
        }
        
    });
