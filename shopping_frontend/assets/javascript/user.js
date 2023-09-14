var getListsApi = 'http://localhost:3000/api/user';
var accessToken = getCookie("accessToken");

$('#formUser').on('submit', function (event){
    event.preventDefault();

    fetch(getListsApi, {
        method: 'GET',
        headers: {authorization: `Bearer ${accessToken}`}
    })
   .then(resp => resp.json())
   .then(json => console.log(JSON.stringify(json)))     
});

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
            return config;
        }
    } catch (error) {
        return Promise.reject(error)
    }
}
