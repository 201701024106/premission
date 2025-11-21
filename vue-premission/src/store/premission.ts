import { defineStore } from "pinia";
import { getUserPression } from "../http/user";

const usepremissionStore = defineStore("usepremissionStore", {
    state: () => {
        return {
            premissions: [],
            menuList: [],
            currentMenu: "",
            hasAddDynamicRoute: false,
        };
    },
    actions: {
        SET_premissionS(premissions: any) {
            this.premissions = premissions;
        },
        CLEAR_premissionS() {
            this.premissions = [];
        },
        SET_MENU_LIST(menuList: any) {
            this.menuList = menuList;
        },
        CLEAR_MENU_LIST() {
            this.menuList = [];
        },
        SET_CURRENT_MENU(menu: any) {
            this.currentMenu = menu;
        },
        CLEAR_CURRENT_MENU() {
            this.currentMenu = "";
        },
        async fetchUserPression(data: any) {
            // 实现获取权限的逻辑
            return new Promise(async (resolve) => {
                let premissions = await getUserPression(data);
                resolve(premissions);
            });
        },
        SET_HAS_ADD_DYNAMIC_ROUTE(hasAdd: boolean) {
            this.hasAddDynamicRoute = hasAdd;
        },
        async logout() {
            // 实现登出逻辑
            this.CLEAR_premissionS();
            this.CLEAR_MENU_LIST();
            this.CLEAR_CURRENT_MENU();
        },
    },
});
export default usepremissionStore;
