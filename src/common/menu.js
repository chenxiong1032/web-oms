/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

const menuData = [
  { 
    icon: "setting",
    name: "机构管理",
    path: "org-manage"
  },
  {
    icon: "setting",
    name: "角色管理",
    path: "role-manage"
  },
  {
    icon: "setting",
    name: "角色配置",
    path: "role-config"
  },
  {
    icon: "setting",
    name: "菜单设置",
    path: "menu-setting"
  },
  {
    icon: "setting",
    name: "数据权限设置",
    path: "data-permission-setting"
  },
  {
    icon: "setting",
    name: "功能权限设置",
    path: "function-permission-setting"
  },
];

function formatter(data, parentPath = "/", parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
