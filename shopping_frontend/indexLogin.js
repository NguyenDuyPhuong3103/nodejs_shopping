//Create instance axios config
const instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 3 * 1000, //milliseconds,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
});

// Xu ly data TRUOC khi gui request den server
instance.interceptors.request.use( async (config) => {
    //Chung ta khong can kiem tra accessToken voi 2 routes nay
    if (config.url.includes('user/login') || config.url.includes('user/register') || config.url.includes('user/refresh-token') || config.url.includes('products')) {
        return config;
    }
    const accessToken = await instance.getCookieAccessToken();
    config.headers['authorization'] = `Bearer ${accessToken}`
    return config;
}, err => {
    return Promise.reject(err)
});

// Xu ly data SAU khi server response ve browser
instance.interceptors.response.use( async(response) => {
    const config = response.config;
    if (config.url.includes('user/login')  || config.url.includes('user/register') || config.url.includes('user/refresh-token') || config.url.includes('products')) {
        return response;
    }
    const {ok} = response.data.meta;
    if (ok === false) {
        //step 1: get token from refreshToken
        const { meta, resData : {accessToken} } = await refreshToken();
        if (accessToken){
            //step 2: 
            config.headers['authorization'] = `Bearer ${accessToken}`;
            //step 3: 
            await instance.setCookieAccessToken(accessToken);

            return instance(config);
        }
    }

    return response;
}, err => {
    return Promise.reject(err)
});

//before login/ sign up

instance.get('products')
    .then(response => {
        const products = response.data;
        const htmls = products.map(function(product){
            return `
                <div class="col-sm-6 col-lg-4">
                    <div class="card card-course-item">
                        <a href="./detailProduct/detailsProducts.html?id=${product._id}">
                            <img class="card-img-top" src="${product.image}" alt="${product.name}">
                        </a>
                        <div class="card-body">
                            <a href="./detailProduct/detailsProducts.html?id=${product._id}">
                                <h5 class="card-title">${product.name}</h5>
                            </a>
                            <a href="./detailProduct/detailsProducts.html?id=${product._id}" class="btn btn-primary">Details</a>
                        </div>
                    </div>
                </div> 
            `
        });
        
        const  html = htmls.join('');
        document.getElementById('getAllProducts').innerHTML = html;
    })
    .catch(function(error){
        alert('có lỗi ở phần front end!!! ');
        console.log(error);
    });

//function

const btnLogin = $('#loginForm');

if(btnLogin){
    btnLogin.on('submit', async (event) => {
        event.preventDefault();
        // Xử lý dữ liệu phản hồi ở đây
        const { meta, resData: {accessToken} } = await login();
        if (meta.ok === true){
            //set token vs timeExpired
            await instance.setCookieAccessToken(accessToken);
            alert(meta.message);
            
        }
    });
}

async function login() {
    const email = $('#emailLogin').val();
    const password = $('#passwordLogin').val();
    return (await instance.post('user/login',
        {
            email,
            password
        }
    )).data;
}

const btnSignup = $('#signupForm');

if(btnSignup){
    btnSignup.on('submit', async (event) => {
        event.preventDefault();
        // Xử lý dữ liệu phản hồi ở đây
        const { meta, resData } = await signup();
        if (meta.ok === true ) {
            alert(meta.message);
            // Nếu đăng nhập thành công thì đưa đến trang  My profile
            // const currentPageURL = './index copy.html';
            // window.location.href = currentPageURL;
        } else {
            alert(meta.message);
            $('#signupForm').innerHTML;
        }
    });
}

async function signup() {
    const email = $('#emailSignup').val();
    const password = $('#passwordSignup').val();
    const name = $('#nameSignup').val();
    const sex = $('#sexSignup').val();
    const phone = $('#phoneSignup').val();
    const address = $('#addressSignup').val();
    const birth = $('#birthSignup').val();
    return (await instance.post('user/register',
        {
            email,
            password,
            name,
            sex,
            phone,
            address,
            birth,
        }
    )).data;
}

const btnGetAll = $('#getAll');

if (btnGetAll) {
    btnGetAll.on('click', async (event) => {
        event.preventDefault();
        const { meta, resData: allUsers } = await getAll();
        console.log(allUsers);
    });
}

async function getAll() {
    return (await instance.get('user')).data;
}

async function refreshToken() {
    return (await instance.get('user/refresh-token')).data;
}

instance.setCookieAccessToken = async (token) => {
    setCookie('accessToken', token, 1);
}

instance.getCookieAccessToken = async () => {
    return getCookie("accessToken");
}
