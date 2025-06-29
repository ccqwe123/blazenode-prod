import axios from 'axios';

axios.defaults.withCredentials = true;
const token = sessionStorage.getItem('auth_token');
// axios.defaults.baseURL = 'https://app.blazenode.io';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export default axios;
