import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const token = Cookies.get('token');
  let user;
  if (!token) {
    user = { isAuth: false };
  } else {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      user = { isAuth: false };
    } else {
      user = { isAuth: true, ...decoded.user };
    }
  }
  return user;
};
