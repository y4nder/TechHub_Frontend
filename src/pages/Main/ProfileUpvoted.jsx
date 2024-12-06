import {useQuery} from "@tanstack/react-query";
import {getUserIdFromToken} from "@/utils/token/token.js";
import {getUserUpVotedArticles} from "@/utils/http/articles.js";
import UpVotedContainer from "@/components/UpVotedContainer.jsx";

export default function ProfileUpVotedPage() {
	const {
		data,
		isLoading,
		isError,
		error
	}
		= useQuery({
		queryKey: ['articles', 'upVoted', getUserIdFromToken()],
		queryFn: () => getUserUpVotedArticles(getUserIdFromToken(), 1, 10)
	})

	return (
		<div className={ `
		
		` }>
			{ isLoading && (
				<p>Loading data</p>
			) }
			{ isError && (
				<p>Error fetching data</p>
			) }
			{ data && (
				data.articles.items.map(article => (
					<UpVotedContainer
						key={ article.articleId}
						article={ article }
					/>
				))
			) }

			{ data && (data.articles.items.length === 0 && (
				<div className="h-screen">no upvoted articles yet yet</div>
			)) }

		</div>

	)
}