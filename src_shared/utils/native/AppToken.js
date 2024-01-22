export class AppToken {
    user_id = '';
    /**
     * Email
     * @type {string}
     */
    login = '';
    name = '';
    url = '';
    token = '';
    /**
     * @type {boolean}
     */
    is_admin = false;
    constructor(user_id, login, name, url, token, is_admin) {
        this.user_id = user_id;
        this.login = login;
        this.name = name;
        this.url = url;
        this.token = token;
        this.is_admin = is_admin;
    }
}
