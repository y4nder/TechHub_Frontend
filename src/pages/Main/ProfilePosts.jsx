import {useQuery} from "@tanstack/react-query";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {getUserArticles} from "@/utils/http/articles.js";
import UserPost from "@/components/UserPost.jsx";


export default function ProfilePostsPage() {

	const {
		data,
		isPending,
		isError,
		error
	} = useQuery({
		queryKey:['articles', getUserIdFromToken()],
		queryFn: () => getUserArticles(getUserIdFromToken(), 1, 10)
	})


	return (
		<div className="bg-red-400">
			{/* Display loading state */}
			{isPending && (
				<p>Fetching user posts...</p>
			)}

			{/* Display error state */}
			{isError && (
				<p>Error fetching posts</p>
			)}

			{/* Display data when available */}
			{data && (
				data.articles.items.map(article => (
					<UserPost key={article.articleId} article={article} />
				))
			)}
		</div>
	);
}