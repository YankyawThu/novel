const defaultSetting = {};

defaultSetting.mainHostUrl = process.env.API_DOMAIN

var token = ''

defaultSetting.requestHeader = {
    Accept: 'application/json',
    "Content-Type": 'application/json',
    'x-api-token': 'gkWZDcoX0pmZU41NAHHl',
    Authorization: `Bearer ${token}`
};

defaultSetting.fileRequestHeader = {
    Accept: 'application/json',
    'x-api-token': 'gkWZDcoX0pmZU41NAHHl',
    "Content-Type": 'multipart/form-data',
    Authorization: `Bearer ${token}`
};

export default defaultSetting;