var productApi ='http://localhost:3000/api/products';

$('#deleteProduct').on('submit', (event) => {
    event.preventDefault();
    var name = $('input[name = "name"]').val();
    var image = $('input[name = "image"]').val();
    var description = $('input[name = "description"]').val();

    var newProduct = {
        name: name,
        image: image,
        description: description
    }
    deleteProduct(newProduct);
})

// Xóa bằng fetch được truyền id ở URL
function deleteProduct(data) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(productApi + '/' + id, options)
        .then(res =>res.clone().json())
        .then(data => {
            //thẻ li của course muốn xóa sẽ được đặt 1 class là class="course-item-${course.id}"
            var courseItem = $('.course-item-' + id);
            if (courseItem) {
                //Xóa khỏi DOM mà ko cần phải gọi lại Api
                courseItem.remove();
            }
        }
            )
        .catch(error => {
            alert('Không xóa được sản phẩm');
        });
}
