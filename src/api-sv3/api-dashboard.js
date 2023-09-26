import { getAction,deleteAction,putAction,postAction} from '@/api-sv3/manage'


const getUserQuickMenu = ()=>getAction("/system/sysQuickMenu/queryByUser");
const saveUserMenu = (params)=>postAction("/system/sysQuickMenu/saveUserMenu",params);

export {
  getUserQuickMenu,
  saveUserMenu
}



