import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Main Reservation',
    path: '/reservation',
    icon: icon('ic_user'),
  },
  {
    title: 'Daily Planning',
    path: '/daily-planning',
    icon: icon('ic_cart'),
  },
  // {
  //   title: 'product',
  //   path: '/products',
  //   icon: icon('ic_cart'),
  // },
  {
    title: 'Hotels',
    path: '/hotels',
    icon: icon('ic_blog'),
  },
  {
    title: 'Agencies',
    path: '/agencies',
    icon: icon('ic_disabled'),
  },
  {
    title: 'Services',
    path: '/services',
    icon: icon('ic_service'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
