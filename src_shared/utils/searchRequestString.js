export const searchRequestString = (searchQuery, page = 1, perPage = 20, additionalParams = []) => {
    let req = [];
    if (page) {
        req.push(`page=${page}`);
    }
    if (perPage) {
        req.push(`perPage=${perPage}`);
    }
    if (searchQuery) {
        req.push(`q=${searchQuery}`);
    }
    if (additionalParams.length) {
        req = req.concat(additionalParams);
    }
    return req.length > 0 ? '?' + req.join('&') : '';
};
