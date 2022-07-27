// 查看日志: "docker logs -f -n 10 emby-nginx 2>&1  | grep js:"
async function redirect2Pan(r) {
    //根据实际情况修改下面4个设置
    const audioHost = 'http://192.168.31.10:13378';
    const mountPath = '/audiobooks';
    const alistPwd = '123456';
    const token = "tttotoo.eyJ1c2VySWQiOiJyb290IiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTY1ODIxMzQzM30.BHEUHocUCGBgERW3AFDkrfkLfl0B3yE8cZdRUyuMyYw"

    const alistApiPath = 'http://192.168.1.10:5244/api/public/path';

    const regex = /[^/]+(?!.*\/)/g;
    // xxx.mp3
    const item_collect = r.uri.match(regex)[0];

    const itemId = r.uri.split('/')[2];

    const itemInfoUri = `${audioHost}/api/items/${itemId}`;
    r.warn(`itemInfoUri: ${itemInfoUri}`);
    let fileRes = await fetchFilePath(itemInfoUri,token);
    if (fileRes.startsWith('error')) {
        r.error(fileRes);
        r.return(500, fileRes);
        return;
    }
    fileRes += "/"
    fileRes += item_collect

    r.warn(`mount file path: ${fileRes}`);

    //fetch alist direct link
    const alistFilePath = fileRes.replace(mountPath, '/zgm/omv/video');

    r.warn(`alistFilePath file path: ${alistFilePath}`);

    const alistRes = await fetchAlistPathApi(alistApiPath, alistFilePath, alistPwd);
    if (!alistRes.startsWith('error')) {
        r.warn(`redirect to: ${alistRes}`);
        r.return(302, alistRes);
        return;
    }
    if (alistRes.startsWith('error401')) {
        r.error(alistRes);
        r.return(401, alistRes);
        return;
    }
    if (alistRes.startsWith('error404')) {
        const filePath = alistFilePath.substring(alistFilePath.indexOf('/', 1));
        const foldersRes = await fetchAlistPathApi(alistApiPath, '/', alistPwd);
        if (foldersRes.startsWith('error')) {
            r.error(foldersRes);
            r.return(500, foldersRes);
            return;
        }
        const folders = foldersRes.split(',').sort();
        for (let i = 0; i < folders.length; i++) {
            r.warn(`try to fetch alist path from /${folders[i]}${filePath}`);
            const driverRes = await fetchAlistPathApi(alistApiPath, `/${folders[i]}${filePath}`, alistPwd);
            if (!driverRes.startsWith('error')) {
                r.warn(`redirect to: ${driverRes}`);
                r.return(302, driverRes);
                return;
            }
        }
        r.warn(`not found direct ${alistRes}`);
        r.internalRedirect("@backend");
        return;

    }
    r.warn(`not found direct ${alistRes}`);
    r.internalRedirect("@backend");
    return;
}

async function fetchAlistPathApi(alistApiPath, alistFilePath, alistPwd) {
    const alistRequestBody = {
        "path": alistFilePath,
        "password": alistPwd
    }
    try {
        const response = await ngx.fetch(alistApiPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            max_response_body_size: 65535,
            body: JSON.stringify(alistRequestBody)
        })
        if (response.ok) {
            const result = await response.json();
            if (result === null || result === undefined) {
                return `error: alist_path_api response is null`;
            }
            if (result.message == 'success') {
                if (result.data.type == 'file') {
                    return result.data.files[0].url;
                }
                if (result.data.type == 'folder') {
                    return result.data.files.map(item => item.name).join(',');
                }
            }
            if (result.code == 401) {
                return `error401: alist_path_api ${result.message}`;
            }
            if (result.message.includes('account')) {
                return `error404: alist_path_api ${result.code} ${result.message}`;
            }
            if (result.message == 'file not found' || result.message == 'path not found') {
                return `error404: alist_path_api ${result.message}`;
            }
            return `error: alist_path_api ${result.code} ${result.message}`;
        } else {
            return `error: alist_path_api ${response.status} ${response.statusText}`;
        }
    } catch (error) {
        return (`error: alist_path_api fetchAlistFiled ${error}`);
    }
}

async function fetchFilePath(itemInfoUri, token) {
    try {
        const res = await ngx.fetch(itemInfoUri, {
            method: 'GET',
            headers: {
                'Content-Length': 0,
                'Authorization': 'Bearer ' + token
            },
            max_response_body_size: 6553500,
        });
        if (res.ok) {
            const result = await res.json();
            if (result === null || result === undefined) {
                return `error: api itemInfoUri response is null`;
            }
            return result.path;
        } else {
            return (`error: api ${res.status} ${res.statusText}`);
        }
    } catch (error) {
        return (`error: api fetch mediaItemInfo failed,  ${error}`);
    }
}

export default {redirect2Pan};