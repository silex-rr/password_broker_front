/**
 * Generates a search request string for API calls.
 *
 * @param {string} searchQuery - The search query string.
 * @param {number} [page=1] - The page number.
 * @param {number} [perPage=20] - The number of items per page.
 * @param {Array<string>} [additionalParams=[]] - Additional URL parameters.
 * @returns {string} - The search request string.
 * @throws Error
 */
export const searchRequestString = (searchQuery, page = 1, perPage = 20, additionalParams = []) => {
    if (
        typeof searchQuery !== 'string' ||
        typeof page !== 'number' ||
        page < 1 ||
        typeof perPage !== 'number' ||
        perPage < 1 ||
        !Array.isArray(additionalParams)
    ) {
        throw new Error('Invalid argument(s)');
    }

    const params = [`page=${page}`, `perPage=${perPage}`, `q=${searchQuery}`, ...additionalParams];

    return params.length > 0 ? '?' + params.join('&') : '';
};
