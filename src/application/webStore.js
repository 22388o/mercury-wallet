import {
  save_wallet,
  save_login,
  save_statecoins,
  save_statecoinObj,
  delete_statecoins,
  save_activity,
  save_account,
} from "../features/WalletInfoSlice";

import { store } from "./reduxStore";

// class the wraps in-built redux store
export class WebStore {
  object;

  constructor(name) {
    this.object = { name };
  }

  get(value = undefined) {
    let walletVar = undefined;
    let walletObject = undefined;
    let walletAttribute = undefined;
    let walletAttributeProperty = undefined;
    let walletInfo = store.getState().walletInfo;
    let wallets = walletInfo.wallets;
    let loginInfo = walletInfo.loginInfo;
    // console.log("WalletInfo ->", walletInfo);
    // console.log("LoginInfo ->", loginInfo);
    // console.log("Value ->", value);

    if (value !== undefined && value.includes(".")) {
      walletVar = value.split("."); // array of for e.g. wallet.name into ["wallet", "name"]
      walletObject = walletVar[0] + ""; // key to whole object {}
      walletAttribute = walletVar[1] + ""; // variable {}.variable
      walletAttributeProperty = walletVar[2] + "";

      // get from login store
      if (value.includes("logins.")) {
        // console.log("Logins...");
        // console.log(walletAttribute)
        return loginInfo[walletAttribute];
      }

      // wallets : { test123:{}, wallet2:{}, wallet3: {}}
      // wallets.walletName.walletAttribute
      if (walletObject === undefined || walletAttribute === undefined) {
        return undefined;
      }
      if (walletObject === "" || walletAttribute === "") {
        return undefined;
      }

      let getWalletAttribute;
      if (wallets[walletObject] !== undefined) {
        getWalletAttribute = wallets[walletObject][walletAttribute];
        if (getWalletAttribute === undefined) {
          return undefined;
        }
      } else {
        return undefined;
      }

      // get the wallet Name
      if (walletAttribute === "name") {
        if (wallets[walletObject] !== undefined) {
          return walletObject + "";
        }
      }

      // get statecoins
      if (walletAttribute === "statecoins") {
        if (walletAttributeProperty === "coins") {
          return wallets[walletObject].statecoins.coins;
        } else if (walletAttributeProperty === "swapped_coins") {
          return wallets[walletObject].statecoins.swapped_coins;
        }
        return wallets[walletObject].statecoins;
      } else if (walletAttribute === "statecoins_obj") {
        if (walletAttributeProperty === "coins") {
          return wallets[walletObject].statecoins_obj.coins;
        } else if (walletAttributeProperty === "swapped_coins") {
          return wallets[walletObject].statecoins_obj.swapped_coins;
        }
        return wallets[walletObject].statecoins_obj;
      } else if (getWalletAttribute === {}) {
        return undefined;
      } else if (walletAttribute === "swapped_statecoins_obj") {
        return wallets[walletObject].swapped_statecoins_obj;
      } else {
        return getWalletAttribute;
      }
    } else {
      if (value === undefined) {
        const hasKeys = !!Object.keys(wallets).length;
        if (!hasKeys) {
          return null;
        } else {
          return wallets;
        }
      } else if (wallets[value] !== undefined) {
        return wallets[value];
      } else {
      }
    }

    return undefined;
  }

  set(key, value) {
    // set for login
    if (key.includes("logins.")) {
      store.dispatch(save_login({ key, value }));
    }
    // set for account
    else if (key.includes(".account")) {
      store.dispatch(save_account({ key, value }));
    }
    // set for activity
    else if (key.includes(".activity")) {
      store.dispatch(save_activity({ key, value }));
    } else if (key.includes(".statecoins_obj")) {
      store.dispatch(save_statecoinObj({ key, value }));
    }
    // set for statecoins
    else if (key.includes(".statecoins")) {
      store.dispatch(save_statecoins({ key, value }));
    } else {
      // must be saving wallet only
      store.dispatch(save_wallet({ key, value }));
    }
  }

  delete(key, value) {
    if (key.includes(".statecoins")) {
      store.dispatch(delete_statecoins({ key, value }));
    }
  }
}
