import { defineStore } from "pinia";
import { getDisc, setDisc, removeDisc } from "../hooks/useOwnLocalStorage.ts";

const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: "",
    };
  },
  getters: {
    getUserToken: (state) => state.token,
  },
  actions: {
    setUserInfo(userInfo: any) {
      const condition = getDisc("token");
      if (condition) {
        removeDisc("token");
      }
      setDisc("token", userInfo.token);
      this.token = userInfo.token;
    },
    clearUserInfo() {
      removeDisc("token");
      this.token = "";
    },
  },
});
export default useUserStore;
