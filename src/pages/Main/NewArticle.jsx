import ArticleForm from "@/components/ArticleForm.jsx";
import { BiArrowBack } from "react-icons/bi";
import {useMutation} from "@tanstack/react-query";
import {createArticle} from "@/utils/http/articles.js";
import {ToastAction} from "@/components/ui/toast.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useToast} from "@/hooks/use-toast.js";


export default function NewArticlePage() {
	const navigate = useNavigate();
	const {toast} = useToast();
	const params = useParams();
	const clubId = params.clubId;

	const {
		mutate,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: createArticle,
		onSuccess: (data) => {
			toast({
				description: "New Article Created",
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

	const onSubmit = (newArticleData) => {
		console.log("Logging new article newArticleData: ", newArticleData);
		mutate(newArticleData);
	};

	// Simulating inputData for editing an existing article
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
			<div className="bg-surface-200 flexPa flex-col max-w-screen-md w-full rounded-3xl ">
				<div className="article-form-header flex p-4">
					<BiArrowBack size={25} color="black" onClick={() => {
						let url = "";
						if(clubId) url = `/club/${clubId}/`;
						else url = `..`
						navigate(url);
					}}
                  className="hover:-translate-x-1 transition-transform duration-150 "
					/>
					<div className="flex-grow"></div>
					<h1 className="font-bold text-xl">Create Article</h1>
					<div className="flex-grow"></div>
				</div>
				<div className="article-form-body">
					<ArticleForm onSubmit={onSubmit} isPending={isPending} inputData={ {clubId: +clubId}}/>
				</div>
			</div>
		</div>
	);
}
