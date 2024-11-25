import {post} from "@/utils/http/http.js";


export async function registerUser(registerInfo){
	console.log(registerInfo);
	return await post({
		endpoint: "/register",
		body: registerInfo
	})
}

export async function loginUser(loginInfo){
	return await post({
		endpoint: "/login",
		body: loginInfo,
	});
}