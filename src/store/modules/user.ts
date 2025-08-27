import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import {
  getLogin,
  refreshTokenApi,
  logoutApi
} from "@/api/auth";
import { useMultiTagsStoreHook } from "./multiTags";
import { setToken, removeToken, userKey } from "@/utils/auth";
import type { Auth } from "@/types/auth";
import type { Response } from "@/types/response";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<Auth.LoginResult>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<Auth.LoginResult>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<Auth.LoginResult>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<Auth.LoginResult>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions:
      storageLocal().getItem<Auth.LoginResult>(userKey)?.permissions ?? [],
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(loginParams) {
      return new Promise<Response<Auth.LoginResult>>((resolve, reject) => {
        getLogin(loginParams)
          .then(loginResponse => {
            if (loginResponse?.code === 200) {
              setToken(loginResponse.data);
              // 更新本地状态
              this.SET_AVATAR(loginResponse.data.avatar || "");
              this.SET_USERNAME(loginResponse.data.username);
              this.SET_NICKNAME(loginResponse.data.nickname || "");
              this.SET_ROLES(loginResponse.data.roles || []);
              this.SET_PERMS(loginResponse.data.permissions || []);
            }
            resolve(loginResponse);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      // 原有登出逻辑
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 完整登出（调用后端API） */
    async fullLogout() {
      try {
        // 调用后端登出接口
        await logoutApi();
      } catch (error) {
        console.warn('后端登出接口调用失败:', error);
        // 即使后端接口调用失败，也要清理前端状态
      } finally {
        // 清理前端状态
        this.logOut();
      }
    },
    /** 刷新`token` */
    async handRefreshToken(refreshToken) {
      return new Promise<Auth.RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi({ refreshToken })
          .then(response => {
            if (response?.code === 200) {
              // 更新token信息，保留用户信息
              const currentUser = storageLocal().getItem<Auth.LoginResult>(userKey);
              const updatedData = {
                ...currentUser,
                ...response.data,
                expires: response.data.expires
              };
              setToken(updatedData);
              resolve(response.data);
            } else {
              reject(new Error(response.message || '刷新token失败'));
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
