const CryptoJS = require('crypto-js');

const isMobile = (userAgent) => {
    if (
        userAgent.match(/Android/i) ||
        userAgent.match(/webOS/i) ||
        userAgent.match(/iPhone/i) ||
        userAgent.match(/iPad/i) ||
        userAgent.match(/iPod/i) ||
        userAgent.match(/BlackBerry/i) ||
        userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}

const encryptURI = (url) => {
    const key = CryptoJS.enc.Utf8.parse('&wdZGQ9zqB$kcPrD&nMB3YqA8@QV%S2D');
    const iv = CryptoJS.enc.Utf8.parse('JMF#R4WrP5#U%S8K');

    const ciphertext = CryptoJS.AES.encrypt(url, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString();

    const encodedCiphertext = encodeURIComponent(ciphertext);
    const encryptedUrl = `/${encodedCiphertext}`;
    
    return encryptedUrl;
}

const encrypt = (data) => {
    const key = CryptoJS.enc.Utf8.parse('&wdZGQ9zqB$kcPrD&nMB3YqA8@QV%S2D');
    const iv = CryptoJS.enc.Utf8.parse('JMF#R4WrP5#U%S8K');

    const ciphertext = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    }).toString();
    
    return ciphertext;
}

const decrypt = (data) => {
    const key = CryptoJS.enc.Utf8.parse('&wdZGQ9zqB$kcPrD&nMB3YqA8@QV%S2D');
    const iv = CryptoJS.enc.Utf8.parse('JMF#R4WrP5#U%S8K');

    const decryptedBytes = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
}

const consoleTraceForFindByKeyword = (consoleTrace, message) => {
    if (consoleTrace) {
        console.error(...message);
    }
};

const getNestedValue = (keys, list, defaultValue) => {

    defaultValue = defaultValue ? defaultValue : '';

    if (!keys || !list) {
        return defaultValue;
    }

    keys = keys.split(".");
    let key = keys.shift();
    if (keys.length > 0) {
        return getNestedValue(keys.join("."), list[key]);
    } else {
        return list[key] ? list[key] : defaultValue;
    }
};

const findByKeyword = (list, key, value, lastIndex, consoleTrace) => {
    if (!key || !value) {
        consoleTraceForFindByKeyword(consoleTrace, [
            "Key or Value is invalid ",
            key,
            value
        ]);
        return null;
    }

    if (typeof list != "array" && typeof list != "object") {
        consoleTraceForFindByKeyword(consoleTrace, [
            "list is not array nor object",
            list
        ]);
        return null;
    }

    if (lastIndex) {
        list = list.reverse();
    }

    if (typeof list === "object") {
        const val = Object.values(list);

        if (typeof val == "undefined") return null;

        const result = val.find(item => {
            return value.toString() === getNestedValue(key, item).toString();
        });

        if (!result) {
            consoleTraceForFindByKeyword(consoleTrace, [
                "Not Found ",
                value,
                " may be value is not correct"
            ]);
        }

        return result;
    }

    consoleTraceForFindByKeyword(consoleTrace, "nested value ", val);

    return list.find(
        item => getNestedValue(key, item).toString() === value.toString()
    );
};

const extractDeviceName = (userAgent) => {
    const regex = /(\bAndroid|\biPhone|\biPad|\biPod\b)/;
    const match = userAgent.match(regex);
    if (match) {
        return match[0];
    } else {
        return 'Unknown Device';
    }
}

const extractBrowserName = (userAgent) => {
    let browserName;

    if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        browserName = "Opera";
    } else if (userAgent.indexOf("Edg") > -1) {
        browserName = "Microsoft Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Google Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Apple Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
        browserName = "Microsoft Internet Explorer";
    } else {
        browserName = "Unknown";
    }
    return browserName;
}

const extractOS = (userAgent) => {
    const regex = /(\bWindows NT\b|\bLinux\b|\bAndroid\b|\bMac OS X\b|\biOS\b)/;
    const match = userAgent.match(regex);
    if (match) {
        return match[0];
    } else {
        return 'Unknown OS';
    }
}

const getGAUser = (cookieHeader) => {
    
}

const getCookie = (name, cookieHeader) => {
    if (cookieHeader) {
        const cookies = cookieHeader.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    }
    
}

// for currency format like 100000 => 100,000 | 10000000 => 10,000,000
const currencyFormat = (value) => {
    if (value != 0 && !value) {
        return "0";
    }

    // if (decimal) {
    //     value = parseFloat(value).toFixed(decimal);
    // }

    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1, ");
};

const localeIndex = (num, messageList) => {
    let numArr = String(num).split("");
    
    numArr = numArr.map(i => {
        return messageList(i);
    });
    
    return numArr.join("");
};

const localeNumbering = (num, messageList) => {
    let currencyNumber = currencyFormat(num);
    return localeIndex(currencyNumber, messageList);
};

const hideGmail = (gmail) => {
    let a = gmail.split("@"); 
    let b = a[0];
    let res = b[0] + b[1] + "*****@gmail.com";
    return res;
}

export default {
    isMobile,
    encryptURI,
    encrypt,
    decrypt,
    consoleTraceForFindByKeyword,
    getNestedValue,
    findByKeyword,
    extractDeviceName,
    extractOS,
    getCookie,
    extractBrowserName,
    currencyFormat,
    localeIndex,
    localeNumbering,
    getGAUser,
    hideGmail
}