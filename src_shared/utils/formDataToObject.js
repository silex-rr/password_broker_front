export const formDataToObject = data => {
    const dataObj = {};
    for (let i = 0; i < data._parts.length; i++) {
        dataObj[data._parts[i][0]] = data._parts[i][1];
    }
    return dataObj;
};
