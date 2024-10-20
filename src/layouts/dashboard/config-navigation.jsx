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
    access: ['admin', 'user', 'driver'],
  },
  {
    title: 'Main Reservation',
    path: '/reservation',
    icon: icon('ic_user'),
    access: ['admin', 'user', 'driver'],
  },
  {
    title: 'Daily Planning',
    path: '/daily-planning',
    icon: icon('ic_cart'),
    access: ['admin', 'user', 'driver'],
  },
  // {
  //   title: 'Driver Planning',
  //   path: '/driver-planning',
  //   icon: <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />,
  // },
  {
    title: 'Hotels',
    path: '/hotels',
    icon: icon('ic_blog'),
    access: ['admin'],
  },

  {
    title: 'Agencies',
    path: '/agencies',
    icon: icon('ic_disabled'),
    access: ['admin'],
  },
  {
    title: 'Services',
    path: '/services',
    icon: icon('ic_service'),
    access: ['admin'],
  },
  {
    title: 'Excursions',
    path: '/excursion',
    icon: icon('ic_guid'),
    access: ['admin'],
  },

  {
    title: 'Vehicles',
    path: '/vehicle',
    icon: icon('ic_vehicle'),
    access: ['admin', 'driver'],
  },
  {
    title: 'Drivers',
    path: '/drivers',
    icon: <img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />,
    access: ['admin', 'driver'],
  },
  {
    title: 'Guides',
    path: '/guid',
    icon: icon('ic_guid'),
    access: ['admin', 'driver'],
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
