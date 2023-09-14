var loginApi = 'http://localhost:3000/api/user/login';
var registerApi = 'http://localhost:3000/api/user/register';
var logoutApi = 'http://localhost:3000/api/user/logout';
var refreshTokenApi = 'http://localhost:3000/api/user/refresh-token';

function formUser(apiUrl, event) {
    event.preventDefault();

    const email = $('#email').val();
    const password = $('#password').val();

    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        dataType: "json",
        contentType: "application/json"
    })
    .then(user => {
        console.log(user.data);
        console.log(user.meta);
        console.log(user.data.accessToken);
        // const newPageURL = './index.html';
        // window.location.href = newPageURL;
        alert(user.meta.message);
        setCookie('accessToken', user.data.accessToken, 1);
    })
    .catch(error => {
        console.error('Có lỗi xảy ra trong phần login.js', error);
        if (error.responseJSON && error.responseJSON.meta && error.responseJSON.meta.message) {
            alert(error.responseJSON.meta.message);
        } else {
            alert('Có lỗi xảy ra trong quá trình xử lý.');
        }
    });
};

$('#formUser').on('submit', function (event){
    formUser(loginApi, event);      
});

$('#getAll').on('submit', function (event){
    formUser(loginApi, event);      
});
