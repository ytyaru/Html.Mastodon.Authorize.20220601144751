window.addEventListener('DOMContentLoaded', async (event) => {
    console.log('DOMContentLoaded!!');
    async function post(domain='pawoo.net', api='api/v1/apps', headers=null, params=null) {
        const method = "POST";
        const DOMAIN = domain || 'pawoo.net';
        //const PARAMS = params;
        const body = JSON.stringify(params);
        const defHeaders = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        const HEADERS = (headers) ? {...defHeaders, headers} : defHeaders
        console.log(HEADERS)
        console.log(body)
        const res = await fetch(`https://${DOMAIN}/${api}`, {method, HEADERS, body}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        console.log(JSON.stringify(json))
        return json
    }
    async function apps() {
        console.log('----- apps -----')
        const params = {
            client_name: 'Test Application by API redirect_uris=https://ytyaru.github.io/',
            redirect_uris: 'https://ytyaru.github.io/',
            scopes: 'read write follow push',
            website: 'https://ytyaru.github.io/',
        };
        return await post('pawoo.net', 'api/v1/apps', {}, params)
    }
    function authorize(client_id) {
        console.log('----- authorize -----')
        const scope='read+write+follow+push'
        const redirect_uri = 'https://ytyaru.github.io/'
        const url = `https://pawoo.net/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&response_type=code`
        console.log(url)
        //window.location.href = url
    }
    async function token(client_id, client_secret, code) {
        console.log('----- token -----')
        const params = {
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: 'https://ytyaru.github.io/',
            code: code,
        };
        return await post('pawoo.net', 'oauth/token', {}, params)
    }
    async function toot(token) {
        console.log('----- toot -----')
        const hreader = {
            'Authorization': `Bearer ${token}`
        }
        const params = {status: "マストドンAPIのテストです。\nJavaScriptで認証ページへ遷移しユーザにログインで認証手続きをさせ、tokenを取得してtootするテストです。"};
        return await post('pawoo.net', 'api/v1/statuses', header, params)
    }
    const url = new URL(location.href)
    if (url.searchParams.has('code')) { // マストドンAPI oauth/authorize でリダイレクトされた場合
        console.log('----- authorized -----')
        // client_id, client_secretはLocalStorageに保存しておく必要がある
        const json = await token(localStorage.getItem('client_id'), localStorage.getItem('client_secret'), url.searchParams.get('code'))
        const token = json.access_token
        const res = await toot(token)
        console.log(res)
        console.log('----- 以上 -----')
    }
    else {
//        const client_id = localStorage.getItem('client_id');
//        const client_secret = localStorage.getItem('client_secret');
        const app = await apps()
        localStorage.setItem('client_id', app.client_id);
        localStorage.setItem('client_secret', app.client_secret);
        console.log(app)
        console.log(app.client_id)
        const auth = authorize(app.client_id)
    }
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

