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
    console.log('truoc khi request:::');
    console.log(config.url)

    //Chung ta khong can kiem tra accessToken voi 2 routes nay
    if (config.url.includes('user/login') || config.url.includes('user/refresh-token') || config.url.includes('user/set-cookie')  || config.url.includes('user/get-cookie')) {
        return config;
    }

    const {accessToken, timeExpired} = await instance.getCookieAccessToken();
    console.log(`accessToken: ${accessToken} va timeExpired: ${timeExpired}`)
    const now = new Date().getTime()
    console.log(`timeExpired:::${timeExpired} vs now:::${now}`)
    if (timeExpired < now) {
        try {
            console.log(`accessToken het han!!!`);
            const { meta, resData: {accessToken, timeExpired} } = await refreshToken();
            console.log(meta.message);
            console.log(accessToken);
            if (meta.ok === true){
                //set token vs timeExpired
                config.headers['authorization'] = `Bearer ${accessToken}`;
                await instance.setCookieAccessToken({accessToken, timeExpired});
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

const btnLogin = $('#formUser');

if(btnLogin){
    btnLogin.on('submit', async (event) => {
        event.preventDefault();
        // Xử lý dữ liệu phản hồi ở đây
        const { meta, resData: {accessToken, timeExpired} } = await login();
        console.log(meta.message);
        console.log(accessToken);
        if (meta.ok === true){
            //set token vs timeExpired
            await instance.setCookieAccessToken({accessToken, timeExpired});
        }
    });
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
    const {accessToken} = await instance.getCookieAccessToken();
    console.log('dong 87:::', accessToken);
    return (await instance.get('user',
    {headers: {authorization: `Bearer ${accessToken}`}},
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
    return (await instance.get('user/refresh-token')).data;
}

const setBtn = $('#setCookieServer');

if (setBtn) {
    setBtn.on('click', async (event) => {
        event.preventDefault();
        const result = await instance.get("user/set-cookie", {
            withCredentials: true,
          });
          console.log(result);
    });
}
async function setCookieServer() {
    return (await instance.get('user/set-cookie')).data;
}

const getBtn = $('#getCookieServer');

if (getBtn) {
    getBtn.on('click', async (event) => {
        event.preventDefault();
        const result1 = await instance.get("user/get-cookie", {
            withCredentials: true,
          });
        console.log(result1.data.resData);
    });
}

instance.setCookieAccessToken = async ({accessToken, timeExpired}) => {
    setCookie('accessToken', JSON.stringify({accessToken, timeExpired}), 1);
}

instance.getCookieAccessToken = async () => {
    return JSON.parse(getCookie("accessToken"));
}
