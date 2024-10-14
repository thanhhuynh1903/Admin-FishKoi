// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  UserAddOutlined,
  SnippetsOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  UserAddOutlined,
  SnippetsOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'menuitem',
  title: 'Menu',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.UserAddOutlined
    },
    {
      id: 'util-color',
      title: 'Blogs',
      type: 'item',
      url: '/blog',
      icon: icons.SnippetsOutlined
    },
    {
      id: 'util-shadow',
      title: 'Shadow',
      type: 'item',
      url: '/shadow',
      icon: icons.BarcodeOutlined
    }
  ]
};

export default utilities;
