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
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';

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
    },
    {
      id: 'util-package',
      title: 'Package',
      type: 'item',
      url: '/package',
      icon: Inventory2OutlinedIcon
    },
    {
      id: 'util-advertisement',
      title: 'Advertisement',
      type: 'item',
      url: '/advertisement',
      icon: CardGiftcardOutlinedIcon
    }
  ]
};

export default utilities;
