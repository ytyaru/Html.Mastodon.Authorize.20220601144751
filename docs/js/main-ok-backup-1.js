window.addEventListener('DOMContentLoaded', async (event) => {
    console.log('DOMContentLoaded!!');


    async function apps() {
        console.log('----- apps -----')
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
        console.log('----- token -----')
        const domain = 'pawoo.net';
        const redirect_uri = location.href.split('?')[0]
        const obj = {
            //grant_type: 'client_credentials',
            grant_type: 'authorization_code',
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
        console.log(method)
        console.log(headers)
        console.log(obj)
        console.log(body)
        const res = await fetch(`https://${domain}/oauth/token`, {method, headers, body}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        return json
    }
    async function verify(accessToken) {
        console.log('----- verify -----')
        const domain = 'pawoo.net';
        const method = "GET";
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };
        console.log(method)
        console.log(headers)
        const res = await fetch(`https://${domain}/api/v1/apps/verify_credentials`, {method, headers}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        //return json
        switch (res.status) {
            case 200: return true
            case 401: return false
            default: return false
        }

    }
    async function toot(accessToken) {
        console.log('----- toot -----')
        const domain = 'pawoo.net';
        const status = document.getElementById('status').value
        console.log('status:', status)
        const obj = {status: status};
        //const obj = {status: "マストドンAPIのテストです。\nJavaScriptとユーザの手動により認証しました。"};
        const method = "POST";
        const body = JSON.stringify(obj);
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };
        console.log(method)
        console.log(headers)
        console.log(obj)
        console.log(body)
        const res = await fetch(`https://${domain}/api/v1/statuses`, {method, headers, body}).catch((e)=>console.error(e));
        console.log(res)
        const json = await res.json()
        console.log(json)
        return json
    }

    const url = new URL(location.href)
    if (!url.searchParams.has('code')) { // マストドンAPI oauth/authorize でリダイレクトされた場合
        document.getElementById('toot').addEventListener('click', async(event) => {
            const access_token = localStorage.getItem('access_token')
            if (access_token && verify(access_token)) {
                console.log('既存のトークンが有効なため即座にトゥートします。');
                const res = await toot(access_token)
                console.log(res)
                document.getElementById('res').value = JSON.stringify(res)
            } else {
                console.log('既存のトークンがないか無効のため、新しいアクセストークンを発行します。');
                const app = await apps()
                localStorage.setItem('client_id', app.client_id);
                localStorage.setItem('client_secret', app.client_secret);
                localStorage.setItem('status', document.getElementById('status').value);
                console.log(app)
                console.log(app.client_id)
                console.log(app.client_secret)
                console.log(localStorage.getItem('client_id'))
                console.log(localStorage.getItem('client_secret'))
                authorize(app.client_id)
            }
        });
    }
    else {
        const status = localStorage.getItem('status')
        if (status) { document.getElementById('status').value = status; }
        console.log('----- authorized -----')
        console.log('client_id:', localStorage.getItem('client_id'))
        console.log('client_secret:', localStorage.getItem('client_secret'))
        console.log('認証コード', url.searchParams.get('code'))
        // client_id, client_secretはLocalStorageに保存しておく必要がある
        const json = await token(localStorage.getItem('client_id'), localStorage.getItem('client_secret'), url.searchParams.get('code'))
        console.log(json)
        console.log('access_token:', json.access_token)
        localStorage.setItem('access_token', json.access_token);
        const accessToken = json.access_token
        const v = await verify(accessToken)
        console.log(v)
        const res = await toot(accessToken)
        console.log(res)
        document.getElementById('res').value = JSON.stringify(res)
        localStorage.removeItem('status')

        // 認証コード(code)をURLパラメータから削除する
        const params = url.searchParams;
        params.delete('code');
        history.replaceState('', '', url.pathname);
        console.log('----- 以上 -----')
    }
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

