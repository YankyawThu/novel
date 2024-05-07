import axios from "axios";
import defaultSetting from "@/config/apiConfig";
import helper from "@/utils/helper"

const getRequestHeader = (token) => Object.assign(defaultSetting.requestHeader, {Authorization: `Bearer ${token}`});
const getFileRequestHeader = (token) => Object.assign(defaultSetting.fileRequestHeader, {Authorization: `Bearer ${token}`});

const puller = (token, url, params = "") => {
    // url = helper.encryptURI("/api/v1.0" + url)
    return axios({
        method: "GET",
        url: `${defaultSetting.mainHostUrl}${url}`,
        headers: getRequestHeader(token),
        params: params
    });
}

const poster = async (token, url, payload) => {
    return axios({
        method: "POST",
        url: `${defaultSetting.mainHostUrl}${url}`,
        headers: getRequestHeader(token),
        data: payload
    });
}
    

const filePoster = async (token, url, payload) => {
    return axios({
        method: "POST",
        url: `${defaultSetting.mainHostUrl}${url}`,
        headers: getFileRequestHeader(token),
        data: payload
    });
}


const updater = async (token, url, payload = {}, params = "") => {
    return axios({
        method: "PUT",
        url: `${defaultSetting.mainHostUrl}${url}`,
        headers: getRequestHeader(token),
        params: params,
        data: payload
    });
}

const destroyer = async (token, url, params = "") => {
    return axios({
        method: "DELETE",
        url: `${defaultSetting.mainHostUrl}${url}`,
        headers: getRequestHeader(token),
        params: params
    });
}
    
export default {
    puller,
    poster,
    filePoster,
    destroyer,
    updater
};