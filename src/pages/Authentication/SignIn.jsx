import AuthCard from "../../components/ui/AuthCard.jsx";
import Input from "../../components/ui/Input.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import Button from "@/components/ui/Button.jsx";
import Divider from "@/components/ui/Divider.jsx";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IconContext } from "react-icons";
import AuthCardHero from "@/components/ui/AuthCardHero.jsx";
import {useMutation} from "@tanstack/react-query";
import {loginUser} from "@/utils/http/auth.js";
import {checkToken, storeToken} from "@/utils/token/token.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";


export default function SignIn() {
	const  navigate = useNavigate();

	useEffect(() => {
		if(checkToken()) {
			navigate("/home");
		}
	}, [navigate]);

	const {
		mutate,
		isPending,
		isError,
		error
	}
	= useMutation({
		mutationFn: loginUser,
		onSuccess : (data) => {
			const token = data?.token;
			storeToken(token);
			navigate("/home");
		}
	})

	function onSubmitHandler(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const data = Object.fromEntries(formData);
		const loginData = {
			email: data.email,
			password: data.password,
		}

		mutate(loginData);
	}



	return (
		<div className="flex justify-center items-center min-h-screen" onSubmit={onSubmitHandler}>
			<AuthCard>
				<AuthCardHero/>
				<form className="flex flex-col justify-center gap-8 py-10 px-10 w-1/2">
					<div className="space-y-2">
						<h1 className="text-3xl font-sans font-medium gradient-text-reversed">WELCOME BACK</h1>
						<p className="font-sans font-thin text-sm text-gray-400">Enter your email and password to access your account</p>
					</div>
					<div className="space-y-7">
						<Input
							name="email"
							id="email"
							placeholder="Enter your email"
							type="email"
							label="Email"
							hasError={isError}
						/>
						<Input
							label="Password"
							id="password"
							name="password"
							isPassword
							placeholder="Enter your password"
							hasError={isError}
						/>
						{isError && <p className="text-red-500 text-sm text-center">{error.info?.message || 'fallback error'}</p>}
						<div className="flex flex-row justify-between">
							<div className="items-center flex space-x-2">
								<Checkbox id="rememberMe" name="rememberMe" />
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="rememberMe"
										className="text-sm font-sans font-light text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Remember me
									</label>
								</div>
							</div>
							<a href="" className="text-lightPurple-500 font-sans font-medium text-sm flex">
								Forgot Password?
							</a>
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<Button disabled ={isPending}
							className="bg-brightOrange-500 font-sans text-white w-full p-3 rounded-[15px] hover:bg-lightPurple-500 duration-300 disabled:opacity-70"
						>
							{isPending && 'Logging in...' || 'Log in'}
						</Button>
						<p className="text-center font-sans font-light text-sm text-surface-900">
							Don't have an account? <a href="/auth/sign-up" className="text-lightPurple-500 font-bold">Sign up</a>
						</p>
						<Divider text="Or"/>
						<div className="flex flex-row gap-2">
							<IconContext.Provider value={ {size: '1.5em'} }>
								<Button
									className="bg-[#FF3D00] bg-opacity-30 font-medium text-black-300 text-sm py-4 px-4 rounded-[15px] flex-1"
									icon={ <FcGoogle/> }
									iconPosition="left"
								>
									Google
								</Button>
							</IconContext.Provider>

							<IconContext.Provider value={ {color: "#1877F2", size: '1.5em'} }>
								<Button
									className="bg-[#267EF1] bg-opacity-20 font-medium text-black-300 text-sm py-2 px-4 rounded-[15px] flex-1"
									icon={ <FaFacebook/> }
									iconPosition="left"
								>
									Facebook
								</Button>
							</IconContext.Provider>
						</div>
					</div>
				</form>
			</AuthCard>
		</div>
	)
}