import AuthCard from "@/components/ui/AuthCard.jsx";
import AuthCardHero from "@/components/ui/AuthCardHero.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import Divider from "@/components/ui/Divider.jsx";
import {IconContext} from "react-icons";
import {FcGoogle} from "react-icons/fc";
import {FaFacebook} from "react-icons/fa";
import {useMutation} from "@tanstack/react-query";
import {registerUser} from "@/utils/http/auth.js";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userActions} from "@/store/user-slice.js";
import {storeToken} from "@/utils/token/token.js";
import hero2 from "../../assets/hero2.png";

export default function SignUp() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {
		mutate,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: registerUser,
		onSuccess: (data) => {
			dispatch(userActions.setUser(data.createdUser));
			storeToken(data.token);
			navigate("/tag-selection")
		}
	});

	function validatePasswords(password, confirmPassword) {
		return password === confirmPassword;
	}

	function onSubmitHandler(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const data = Object.fromEntries(formData);
		if(!validatePasswords(formData.get("password"), formData.get("confirmPassword"))) {
			return;
		}
		mutate({
			username: data.username,
			email: data.email,
			password: data.password,
		});
	}

	return (
		<div className="flex justify-center items-center min-h-screen">
			<AuthCard>
				<form className="flex flex-col justify-center gap-8 py-10 px-10 w-1/2" onSubmit={onSubmitHandler}>
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-3xl font-sans font-medium gradient-text">Create Account</h1>
						<p className="font-sans font-thin text-sm text-gray-400">Get started by creating your new account</p>
					</div>
					<div className="flex flex-col gap-5">
						<Input
							id="username"
							placeholder="Username"
							type="text"
						/>
						<Input
							id="email"
							placeholder="Email"
							type="email"
						/>
						<Input
							id="password"
							isPassword
							placeholder="Enter your password"
						/>
						<Input
							id="confirmPassword"
							isPassword
							placeholder="Confirm Password"
						/>
					</div>
					{isError && <p className="text-red-500 text-sm text-center">{error?.message}</p>}
					<div className="flex flex-col gap-3">
						<Button
							disabled = {isPending}
							className="bg-darkPurple-500 font-sans text-white w-full p-3 rounded-[15px] hover:bg-brightOrange-500 duration-300">
							{ isPending && 'Registering..' || 'Register' }
						</Button>
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
						<p className="text-center font-sans font-light text-sm text-surface-900">
							Already have an account? <a href="/auth/sign-in" className="text-brightOrange-500 font-bold">Sign
							in</a>
						</p>
					</div>
				</form>
				<AuthCardHero image={hero2}/>
			</AuthCard>
		</div>
	)
}