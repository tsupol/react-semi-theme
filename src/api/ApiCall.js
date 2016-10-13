import api from './index';
import $ from 'jquery';

// Object setter for getAll()
const setter = (obj, propString, value) => {
    if (!propString)
        return obj;

    let prop, ref = obj, props = propString.split('.');
    for (let i = 0, iLen = props.length - 1; i <= iLen; i++) {
        prop = props[i];
        if(i == iLen) {
            return ref[prop] = value;
        } else {
            if(ref[prop] == undefined) {
                ref[prop] = {};
            }
            ref = ref[prop];
        }
    }
    return obj;
};

// Primary ajax function with access token
export function ajax (method, url, data, access_token) {
    if(!data) data = {};
    if (typeof method === "undefined") {
        method = 'post';
        data._method = 'POST';
    } else if(method === 'put') {
        method = 'post';
        data._method = 'PUT';
    }  else if(method === 'patch') {
        method = 'post';
        data._method = 'PATCH';
    } else if(method === 'delete') {
        method = 'post';
        data._method = 'DELETE';
    }
    if(data) data = JSON.stringify(data);

    return new Promise((resolve, reject) => {
        $.ajax({method, url, data, dataType: 'json',
            headers: {
                'Access-Token': access_token,
                'Content-Type': 'application/json'
            },
            // custom
            tryCount : 0,
            retryLimit : 3,
            success : function(response) {
                if(response.status == "error"){
                    reject(response.data.error);
                }
                resolve(response);
            },
            error : function(xhr, textStatus, errorThrown ) {
                if (textStatus == 'timeout' || xhr.status == 500) {
                    console.log('retry: xhr', textStatus, xhr);
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        $.ajax(this);
                    }
                } else {
                    reject(xhr);
                }
            }
        });
    });
}

// Fetch all and deep set an object
export function getAll(urls, access_token) {
    return new Promise((_resolve, _reject) => {
        let promises = [];
        for (let get of urls) {
            let promise = new Promise((resolve, reject) => {
                ajax('get', get.url, null, access_token).then( response => {
                    resolve(response.data);
                    // note: should be array instead of object
                    // resolve(Object.assign({}, response.data));
                }).catch( error => {
                    reject(error);
                });
            });
            promises.push(promise);
        }
        Promise.all(promises).then(responses => { // all success
            let data = {};
            for (let i in responses) {
                setter(data, urls[i].name, responses[i]);
            }
            // callback
            // console.log('Promise data: ',data);
            _resolve(data);
        }, error => { // not all success
            _reject(error);
        });
    });
}
