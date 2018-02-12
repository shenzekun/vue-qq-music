export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
    // 将类型转化成全部大写
    type = type.toUpperCase();

    if (type === 'GET') {
        let dataStr = ''; // 数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        });

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    if (window.fetch && method === 'fetch') {
        const requestConfig: RequestInit = {
            method: type,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors',
            cache: 'force-cache'
        };

        if (type === 'POST') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            });
        }

        try {
            const response = await fetch(url, requestConfig);
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            throw new Error(error);
        }
    } else {
        return new Promise((resolve, reject) => {
            let requestObj;
            // 浏览器是否支持XMLHttpRequest
            if ((window as any).XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject('Microsoft.XMLHTTP');
            }

            let sendData = '';
            if (type === 'POST') {
                sendData = JSON.stringify(data);
            }

            requestObj.open(type, url, true);
            requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState === 4) {
                    if (requestObj.status === 200) {
                        let obj = requestObj.response;
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj);
                    } else {
                        reject(requestObj);
                    }
                }
            };
        });
    }
};
