//Create instance axios config
const instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 3 * 1000, //milliseconds
    headers: {
        'Content-Type': 'application/json'
    }
});


// Xu ly data TRUOC khi gui request den server
instance.interceptors.request.use( async (config) => {
    console.log('truoc khi request:::',config);
    console.log(config.url)

    //Chung ta khong can kiem tra accessToken voi 2 routes nay
    if (config.url.includes('user/login') || config.url.includes('user/refresh-token') || config.url.includes('user/get-cookie')) {
        return config;
    }
    console.log('co di xuong day');
    const accessToken = await instance.getCookieAccessToken();
    config.headers['authorization'] = `Bearer ${accessToken}`
    return config;
}, err => {
    return Promise.reject(err)
});

// Xu ly data SAU khi server response ve browser
instance.interceptors.response.use( async(response) => {
    console.log('Sau khi server response:::', response.data);
    const config = response.config;
    if (config.url.includes('user/login') || config.url.includes('user/refresh-token') || config.url.includes('user/get-cookie')) {
        return response;
    }
    const {ok} = response.data.meta;
    console.log('dong 36:::', ok);
    if (ok && ok === false) {
        console.log('truong hop token het han:::');
        //step 1: get token from refreshToken
        const { meta, data: {accessToken} } = await refreshToken();
        console.log('dong 41:::',accessToken);
        if (accessToken){
            console.log('da lay lai accessToken thanh cong')
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

//function

const btnLogin = $('#formUser');

if(btnLogin){
    btnLogin.on('submit', async (event) => {
        event.preventDefault();
        // Xử lý dữ liệu phản hồi ở đây
        const { meta, data: {accessToken} } = await login();
        console.log(meta.message);
        console.log(accessToken);
        if (meta.ok === true){
            //set token vs timeExpired
            await instance.setCookieAccessToken(accessToken);
        }
    });
}

const btnGetAll = $('#getAll');

if (btnGetAll) {
    btnGetAll.on('click', async (event) => {
        event.preventDefault();
        const { meta, data: allUsers } = await getAll();
        console.log(allUsers);
    });
}

async function getAll() {
    return (await instance.get('user')).data;
}

async function login() {
    const email = $('#email').val();
    const password = $('#password').val();
    return (await instance.post('user/login',
        {
            email: email,
            password: password
        }
    )).data;
}

async function refreshToken() {
    return (await instance.get('user/refresh-token'));
}

async function getNewRef() {
    // return (await instance.get('user/get-cookie')).data;
    return (await fetch('http://localhost:3000/api/user/getcookie', {
        method: 'GET',
    })).data;
}

instance.setCookieAccessToken = async (token) => {
    setCookie('accessToken', token, 1);
}

instance.getCookieAccessToken = async () => {
    return getCookie("accessToken");
}
