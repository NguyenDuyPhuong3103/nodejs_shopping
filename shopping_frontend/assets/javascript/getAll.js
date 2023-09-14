//Create instance axios config
const instance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 3 * 1000, //milliseconds
    headers: {
        'Content-Type': 'application/json'
    }
});


// Xu ly data TRUOC khi gui request den server
instance.interceptors.request.use( async (config) => {
    console.log('truoc khi request:::');
    console.log(config.url)

    //Chung ta khong can kiem tra accessToken voi 2 routes nay
    if (config.url.includes('user/login') || config.url.includes('user/refresh-token') || config.url.includes('user/get-cookie')) {
        return config;
    }

    const {accessToken, timeExpired} = await instance.getCookieAccessToken();
    console.log(`accessToken: ${accessToken} va timeExpired: ${timeExpired}`)
    const now = new Date().getTime()
    console.log(`timeExpired:::${timeExpired} vs now:::${now}`)
    if (timeExpired < now) {
        try {
            console.log(`accessToken het han!!!`);
            const { meta, data: {accessToken, timeExpired} } = await refreshToken();
            console.log(meta.message);
            console.log(accessToken);
            if (meta.ok === true){
                //set token vs timeExpired
                await instance.setCookieAccessToken({accessToken, timeExpired});
                console.log('dong 37:::', updateRef);
                return config;
            }
        } catch (error) {
            return Promise.reject(error)
        }
    }

    return config;
}, err => {
    return Promise.reject(err)
});

// Xu ly data SAU khi server response ve browser
instance.interceptors.response.use( (response) => {
    console.log('sau khi response:::');

    return response;
}, err => {
    return Promise.reject(err)
});

//function

const btn_login = $('#formUser');

if(btn_login){
    btn_login.on('submit', async (event) => {
        event.preventDefault();
        // Xử lý dữ liệu phản hồi ở đây
        const { meta, data: {accessToken, timeExpired} } = await login();
        console.log(meta.message);
        console.log(accessToken);
        if (meta.ok === true){
            //set token vs timeExpired
            await instance.setCookieAccessToken({accessToken, timeExpired});
        }
    });
}

const btn_getAll = $('#getAll');

if (btn_getAll) {
    btn_getAll.on('click', async (event) => {
        event.preventDefault();
        const { meta, data  } = await refreshToken();
        console.log(data);
    });
}

async function getAll() {
    const getAccessToken = await instance.getCookieAccessToken();
    return (await instance.get('user',
    {headers: {authorization: `Bearer ${getAccessToken.accessToken}`}},
    )).data;
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
    // const refreshTokenValue = await instance.get('user/refresh-token');
    // console.log(refreshTokenValue)
    // return refreshTokenValue;
    // return (await instance.get('user/refresh-token')).data;
    const refreshTokenValue = await fetch('http://localhost:3000/api/user/refresh-token', {
        method: 'GET',
    });
    console.log(refreshTokenValue)
    return refreshTokenValue;
}

async function getNewRef() {
    // return (await instance.get('user/get-cookie')).data;
    return (await fetch('http://localhost:3000/api/user/getcookie', {
        method: 'GET',
    })).data;
}

instance.setCookieAccessToken = async ({accessToken, timeExpired}) => {
    setCookie('accessToken', JSON.stringify({accessToken, timeExpired}), 1);
}

instance.getCookieAccessToken = async () => {
    return JSON.parse(getCookie("accessToken"));
}
