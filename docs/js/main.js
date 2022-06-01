window.addEventListener('DOMContentLoaded', async (event) => {
    console.log('DOMContentLoaded!!');


    async function apps() {
        const domain = 'pawoo.net';
        const redirect_uri = location.href
        const obj = {
            client_name: `Test Application by API redirect_uris=${redirect_uri}`,
            redirect_uris: `${redirect_uri}`,
            scopes: 'read write follow push',
            website: `${redirect_uri}`,
        };
        const method = "POST";
        const body = JSON.stringify(obj);
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        const res = await fetch(`https://${domain}/api/v1/apps`, {method, headers, body}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        console.log(JSON.stringify(json))
        return json
    }
    function authorize(client_id) {
        console.log('----- authorize -----')
        const scope='read+write+follow+push'
        const redirect_uri = location.href
        const url = `https://pawoo.net/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&response_type=code`
        console.log(url)
        window.location.href = url
    }
    async function token(client_id, client_secret, code) {
        const domain = 'pawoo.net';
        const redirect_uri = location.href
        const obj = {
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: redirect_uri,
            code: code,
        };
        const method = "POST";
        const body = JSON.stringify(obj);
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        const res = await fetch(`https://${domain}/oauth/token`, {method, headers, body}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        return json
    }
    async function verify(accessToken) {
        const domain = 'pawoo.net';
        const method = "GET";
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };
        console.log(method)
        console.log(header)
        const res = await fetch(`https://${domain}/api/v1/apps/verify_credentials`, {method, headers}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        return json

    }
    async function toot(accessToken) {
        const domain = 'pawoo.net';
        const obj = {status: "マストドンAPIのテストです。\nJavaScriptとユーザの手動により認証しました。"};
        const method = "POST";
        const body = JSON.stringify(obj);
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };
        console.log(method)
        console.log(header)
        console.log(obj)
        console.log(body)
        const res = await fetch(`https://${domain}/api/v1/statuses`, {method, headers, body}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        return json
    }
    /*
    async function apps() {
        const domain = 'pawoo.net';
        const obj = {
            client_name: 'Test Application by API redirect_uris=https://ytyaru.github.io/',
            redirect_uris: 'https://ytyaru.github.io/',
            scopes: 'read write follow push',
            website: 'https://ytyaru.github.io/',
        };
        const method = "POST";
        const body = JSON.stringify(obj);
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };
        const res = await fetch(`https://${domain}/api/v1/apps`, {method, headers, body}).catch((e)=>console.error(e));
        const json = await res.json()
        console.log(json)
        console.log(JSON.stringify(json))
    }
    */



    /*
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
        const url = `https://${DOMAIN}/${api}`
        console.log(HEADERS)
        console.log(params)
        console.log(body)
        const res = await fetch(url, {method, HEADERS, body}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        console.log(JSON.stringify(json))
        return json
    }
    async function apps() {
        console.log('----- apps -----')
        const redirect_url = location.href
        const params = {
            client_name: `Test Application by API redirect_uris=${redirect_url}`,
            redirect_uris: `${redirect_url}`,
            scopes: 'read write follow push',
            website: `${redirect_url}`,
        };
        return await post('pawoo.net', 'api/v1/apps', null, params)
    }
    function authorize(client_id) {
        console.log('----- authorize -----')
        const scope='read+write+follow+push'
        const redirect_url = location.href
        const url = `https://pawoo.net/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&response_type=code`
        console.log(url)
        //window.location.href = url
    }
    async function token(client_id, client_secret, code) {
        console.log('----- token -----')
        const redirect_url = location.href
        const params = {
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret,
            redirect_uri: `${redirect_url}`,
            code: code,
        };
        return await post('pawoo.net', 'oauth/token', null, params)
    }
    async function toot(token) {
        console.log('----- toot -----')
        const hreader = {
            'Authorization': `Bearer ${token}`
        }
        const params = {status: "マストドンAPIのテストです。\nJavaScriptで認証ページへ遷移しユーザにログインで認証手続きをさせ、tokenを取得してtootするテストです。"};
        return await post('pawoo.net', 'api/v1/statuses', header, params)
    }
    */
    const url = new URL(location.href)
    if (!url.searchParams.has('code')) { // マストドンAPI oauth/authorize でリダイレクトされた場合
//        const client_id = localStorage.getItem('client_id');
//        const client_secret = localStorage.getItem('client_secret');
        const app = await apps()
        localStorage.setItem('client_id', app.client_id);
        localStorage.setItem('client_secret', app.client_secret);
        console.log(app)
        console.log(app.client_id)
        console.log(app.client_secret)
        console.log(localStorage.getItem('client_id'))
        console.log(localStorage.getItem('client_secret'))
        authorize(app.client_id)
    }
    else {
        console.log('----- authorized -----')
        console.log(localStorage.getItem('client_id'))
        console.log(localStorage.getItem('client_secret'))
        // client_id, client_secretはLocalStorageに保存しておく必要がある
        const json = await token(localStorage.getItem('client_id'), localStorage.getItem('client_secret'), url.searchParams.get('code'))
        console.log(json)
        const accessToken = json.access_token
        const v = await verify(accessToken)
        console.log(v)
        const res = await toot(accessToken)
        console.log(res)
        console.log('----- 以上 -----')
    }
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

