import ArticleForm from "@/components/ArticleForm.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getArticleForEdit, updateArticle} from "@/utils/http/articles.js";
import {ToastAction} from "@/components/ui/toast.jsx";
import {useToast} from "@/hooks/use-toast.js";
import {BiArrowBack} from "react-icons/bi";

export default function EditArticlePage() {
	const params = useParams();
	const articleId = params.articleId;
	const {toast } = useToast();
	const navigate = useNavigate();

	const {
		data,
		isPending,
		isError,
		error
	} = useQuery({
		queryKey:['article', articleId, 'edit'],
		queryFn: () => getArticleForEdit(articleId),
	});

	const {
		mutate,
		isPending : isUpdating,
		isError : isErrorUpdateArticle,
		error: errorUpdateArticle,
	} = useMutation({
		mutationFn: updateArticle,
		onSuccess: (data) => {
			toast({
				description: "Article Updated",
				variant: 'custom'
			})
			navigate(`/articles/${data.articleId}`)
		},
		onError: () => {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			})
		}
	})

	if(isPending){
		return <p>Fetching data</p>
	}


	if(isError){
		return <p>Error Loading data {error}</p>
	}

	const onSubmit = (articleData) => {
		articleData.append('ArticleId', articleId);
		console.log("Logging new article articleData: ", articleData);
		mutate(articleData); // Uncomment to submit the form data
	};

	// const inputData = {
	// 	clubId: clubId,
	// 	articleTitle: 'input article title',
	// 	thumbnail: "https://example.com/thumbnail.jpg", // Example thumbnail URL
	// 	delta: { ops: [{ insert: "This is the content of the article." }] }, // Example Delta
	// 	tags : [
	// 		{ tagId: 1, tagName: "C#" },
	// 		{ tagId: 2, tagName: "Python" },
	// 		{ tagId: 5, tagName: "Ruby" },
	// 	]
	// };

	return (
		<div className="NewArticlePage flex justify-center items-center p-10">
			<div className="bg-surface-200 flex flex-col max-w-screen-md w-full rounded-3xl ">
				<div className="article-form-header flex p-4">
					<BiArrowBack size={ 25 } color="black" onClick={ () => {
						navigate(`/articles/${articleId}`);
					} }
						className="hover:translate-x-2 transition-transform duration-150"
					/>
					<div className="flex-grow"></div>
					<h1 className="font-bold text-xl">Create Article</h1>
					<div className="flex-grow"></div>
				</div>
				<div>
					<ArticleForm inputData={ data.article } edit onSubmit={ onSubmit } isPending={ isUpdating }/>
				</div>
			</div>
		</div>
	)
}