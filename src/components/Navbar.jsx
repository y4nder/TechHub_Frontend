import SearchBar from "@/components/ui/Searchbar.jsx";
import Button from "@/components/ui/Button.jsx";
import { IoNotifications } from "react-icons/io5";
import { SiDgraph } from "react-icons/si";
import { formatNumberToK as formatter } from "@/utils/formatters/numberFomatter.js";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOutDispatcher } from "@/store/user-slice.js";
import { LogOut } from "lucide-react";
import { getUserIdFromToken } from "@/utils/token/token.js";
import {useToast} from "@/hooks/use-toast.js";
import Avatar from "@/components/ui/Avatar.jsx";

export default function Navbar({ user }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //for testing
    const {toast} = useToast()

    const toastTester = () => {
        toast({
            description: "Your Article Has Been Created",
            variant: 'articleCreated'
        })
    }

    const handleSearch = (query) => {
        console.log(query);
    };

    const handleCreatePost = () => {
        navigate("/articles/new");
    };

    const handleLogout = () => {
        dispatch(logOutDispatcher());
        navigate("/auth/sign-in");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav
            className={`
			flex items-center justify-between
			px-4 py-2
			bg-surface-100
			border border-black-50
			w-full
		`}
        >
            {/* Logo */}
            <div
                className="flex cursor-pointer"
                onClick={() => navigate("/home")}
            >
                <img
                    src="https://placehold.co/40"
                    alt="Hero Image"
                    className="object-cover rounded-xl"
                />
            </div>
            <div className="flex-grow">
                <button
                    onClick={toastTester}
                >
                    Toast Tester
                </button>
            </div>
            <div className="flex-grow"></div>

            {/* Search Bar */}
            <div className="flex-grow items-center px-12 py-2">
                <SearchBar
                    id="search"
                    placeholder="Search"
                    onSubmitSearch={handleSearch}
                />
            </div>
            <div className="flex-grow"></div>

            {/* Buttons and Icons */}
            <div className="flex gap-2 justify-end">
                <Button
                    className={`
            bg-brightOrange-500 
            text-surface-50 
            font-sans font-light 
            py-3 px-7 
            rounded-[15px] 
            hover:bg-darkPurple-500 duration-200
          `}
                    onClick={handleCreatePost}
                    disabled={false}
                >
                    <p className="text-nowrap">New Post</p>
                </Button>

                {/* Notification Icon */}
                <div
                    className={`
						bg-lightPurple-50
						text-lightPurple-500
						px-2 
						rounded-[15px]
						flex items-center justify-center
				`}
                >
                    <IoNotifications size={30} />
                </div>

                {/* Stats and Profile */}
                <div
                    className="relative"
                    ref={dropdownRef}
                >
                    <div
                        className={`
	              flex gap-2 items-center justify-center
	              bg-darkOrange-50
	              py-2 px-2.5
	              rounded-[15px]
	              hover:bg-lightPurple-50
	              cursor-pointer
            `}
                        onClick={toggleDropdown}
                    >
                        <SiDgraph
                            size={15}
                            color="purple"
                        />
                        <p className="text-lg gradient-text font-bold">{formatter(user.reputationPoints)}</p>
                        {/* user profile pic */}
                        {/*<img*/}
                        {/*    src={user.userProfilePicUrl}*/}
                        {/*    alt="User"*/}
                        {/*    className="w-8 h-8 object-cover rounded-xl"*/}
                        {/*/>*/}
                        <Avatar
                            imageUrl={user.userProfilePicUrl}
                            userName={user.username}
                            userId={user.userId}
                            variant='navProfile'
                        />
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div
                            className={`
								absolute right-0 mt-2 w-40
								bg-white border border-gray-200
								rounded-xl shadow-2xl
								z-50
							`}
                        >
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => navigate(`/profile/${getUserIdFromToken()}`)}
                            >
                                Profile
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-2 items-center text-obsidianBlack-500 font-bold"
                                onClick={handleLogout}
                            >
                                <LogOut
                                    size={22}
                                    className="text-obsidianBlack-500"
                                />
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
