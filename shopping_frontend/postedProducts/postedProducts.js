var postApi ='http://localhost:3000/api/products/AllPostedProducts';

fetch(postApi)
    .then(response => response.json())
    .then(products => {
        var htmls = products.map(function(product, index){
            return `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>
                        <a class="details" href="./detailProduct/detailsProducts.html?id=${product._id}">${product.name}</a>
                    </td>
                    <td>${product.classification}</td>
                    <td>${product.price}</td>
                    <td>
                        <a href="../formProduct/formProduct.html?id=${product._id}" class="btn btn-primary">Update</a>
                        <a href="" class="btn btn-primary" data-id="${product._id}" data-toggle="modal" data-target="#deleteProductModal">Delete</a>
                    </td>    
                </tr>
            `;
        });
        
        var html = htmls.join('');
        document.getElementById('postedProducts').innerHTML = html;
    })
    .catch(function(error){
        alert('There was a mistake!!!');
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
            const newPageURL = '../postedProducts/postedProducts.html';
            window.location.href = newPageURL;
        }
            )
        .catch(error => {
            alert('Can not delete product');
        });
}