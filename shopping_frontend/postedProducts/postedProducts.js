var postApi ='http://localhost:3000/api/products/AllPostedProducts';

fetch(postApi)
    .then(response => response.json())
    .then(products => {
        var htmls = products.map(function(product, index){
            return `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${product.name}</td>
                    <td>${product.classification}</td>
                    <td>${product.price}</td>
                    <td>
                        <a href="../formProduct/formProduct.html?id=${product._id}" class="btn btn-primary">Update</a>
                        <a href="" class="btn btn-primary">Delete</a>
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
