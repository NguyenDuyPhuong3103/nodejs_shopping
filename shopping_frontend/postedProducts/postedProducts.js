var productApi ='http://localhost:3000/api/products';

$('#postedProducts').on('submit', (event) => {
    event.preventDefault();
    var name = $('input[name = "name"]').val();
    var image = $('input[name = "image"]').val();
    var description = $('input[name = "description"]').val();

    var newProduct = {
        name: name,
        image: image,
        description: description
    }
    postedProducts(newProduct);
})

function postedProducts(data) {
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
            const newPageURL = '../clothes/clothes.html';
            window.location.href = newPageURL;
        }
            )
        .catch(error => {
            alert('Không tạo được sản phẩm');
        });
}
