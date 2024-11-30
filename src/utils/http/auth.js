    import { post } from "@/utils/http/http.js";
import {removeToken} from "@/utils/token/token.js";

export async function registerUser(registerInfo) {
    return await post({
        endpoint: "/register",
        body: registerInfo,
    });
}

export async function loginUser(loginInfo) {
    return await post({
        endpoint: "/login",
        body: loginInfo,
    });
}

export function logOutUser() {
    removeToken();
}
