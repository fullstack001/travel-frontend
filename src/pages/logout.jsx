import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

import userStore from 'src/store/userStroe';

export default function Signout() {
  const { setUser } = userStore();

  setUser({ isAuth: false });
  Cookies.remove('token');

  return <Navigate to="/" replace />;
}
