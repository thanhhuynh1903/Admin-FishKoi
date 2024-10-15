// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  UserAddOutlined,
  SnippetsOutlined,
  WechatOutlined,
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
  SnippetsOutlined,
  WechatOutlined 
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
      title: 'Ponds',
      type: 'item',
      url: '/ponds',
      icon: icons.BarcodeOutlined
    },
    {
      id: 'util-consultation',
      title: 'Consultation',
      type: 'item',
      url: '/consultation',
      icon: icons.WechatOutlined
    }
  ]
};

export default utilities;
