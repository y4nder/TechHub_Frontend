import {useMutation, useQuery} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
	fetchArticle,
	getReportedArticles,
	getReportsForArticle,
} from "@/utils/http/articles.js";
import { ReportedArticleListItem } from "@/components/pagination/paginatedItems/ReportedArticleListItem.jsx";
import { useState } from "react";
import PreviewArticle from "@/components/PreviewArticle.jsx";
import Modal from "@/components/ui/Modal.jsx";
import {ReportAction} from "@/utils/constants/ReportActions.js";
import DropdownSelector from "@/components/ui/DropdownSelector.jsx";
import MultilineInput from "@/components/ui/MultilineInput.jsx";
import {evaluateReport} from "@/utils/http/moderators.js";
import {useToast} from "@/hooks/use-toast.js";
import {ToastAction} from "@/components/ui/toast.jsx";

export default function ClubReportsPage() {
	const { clubId } = useParams();
	const [selectedArticleId, setSelectedArticleId] = useState(null);
	const [selectedReport, setSelectedReport] = useState(null);
	const [evaluating, setEvaluating] = useState(false);
	const [selectedEvaluationAction, setSelectedEvaluationAction] = useState(null);
	const [evaluationNotes, setEvaluationNotes] = useState("");
	const {toast} = useToast()

	const {
		data: reportedArticles,
		isPending: isPendingReportedArticles,
		isError: isErrorLoadingReports
	} = useQuery({
		queryKey: ['reportedArticles', clubId],
		queryFn: async() => {
			const data = await getReportedArticles(clubId);
			return data.reportedArticles;
		}
	})

	const {
		data: reports,
		isPending: isPendingReports,
		isError: isErrorReportsForArticle,
		refetch: refetchReports
	} = useQuery({
		queryKey: ['reportedArticles', selectedArticleId],
		queryFn: () =>  getReportsForArticle(selectedArticleId),
		enabled: !!selectedArticleId,

	})

	const { data: article, isLoading: isArticleLoading, isError: isArticleError } = useQuery({
		queryKey: ["article", selectedArticleId, "preview"],
		queryFn: () => fetchArticle(selectedArticleId),
		enabled: !!selectedArticleId, // Only fetch when articleId is set
	});

	const {mutate: evaluateMutation} = useMutation({
		mutationFn: evaluateReport,
		onSuccess: () => {
			refetchReports();
			handleStopEvaluating();
			toast({
				description: "Report Successfully Evaluated",
			})
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


	// Loading and error states for reported articles
	if (isPendingReportedArticles) {
		return <div>Loading reported articles...</div>;
	}

	if (isErrorLoadingReports) {
		return <div>Failed to load reported articles. Please try again later.</div>;
	}

	const handleClickedReportedArticle = (report) => {
		console.log("articleId", report.articleId );
		setSelectedArticleId(report.articleId);
		setSelectedReport(report);
	};

	const handleStartEvaluating = () => {
		setEvaluating(true);
	}

	const handleStopEvaluating = () => {
		setEvaluating(false);
		setEvaluationNotes("");
		setSelectedEvaluationAction(null);
		setSelectedArticleId(null);
	}

	const handleCancelEvaluating = () => {
		setEvaluating(false);
		setEvaluationNotes("");
	}

	const reportTypeOptions = ReportAction.map((action) => ({
		id: action.id,
		label: action.label,
	}))
	
	const handleActionSelection = (action) => {
		setSelectedEvaluationAction(action)
	}

	const handleSubmitEvaluation = () => {
		const evaluationData = {
			ArticleId: selectedArticleId,
			ArticleAuthorId : article?.author.userId || -1,
			EvaluationNotes: evaluationNotes,
			EvaluationActionType : selectedEvaluationAction.id
		}

		console.log("evaluationData", evaluationData);
		evaluateMutation(evaluationData);
	}

	const EvaluationModal = () => {
		return (
			<Modal
				open={evaluating}
				onClose={() => setEvaluating(false)}
				className="py-6 px-6 rounded-3xl space-y-5 max-w-lg  w-full border border-lightPurple-200 bg-gradient-to-t from-lightPurple-50 to-lightPurple-10 shadow-2xl"
			>
				<div className="space-y-5">
					<div className="header text-center">
						<h1 className="text-center font-bold text-2xl gradient-text-reversed">Evaluate Article</h1>
					</div>
					{selectedReport && (
						<div>
							<p className="font-bold">Choose Action for "{selectedReport.articleTitle}"</p>
						</div>
					)}
					<div>
						<DropdownSelector
							label="Choose action"
							options={ reportTypeOptions }
							onSelect={ (selectedAction) => handleActionSelection(selectedAction) }
							transitionDuration="200ms"
							dropdownColor = "bg-surface-50"
						/>
					</div>
					<div>
						<MultilineInput
							id="evaluationNotes"
							placeholder="Notes..."
							value={ evaluationNotes }
							onChange={ (e) => setEvaluationNotes(e.target.value) }
							rows={ 4 }
							className = "bg-surface-50 p-3 rounded-2xl"
						/>
					</div>
					<div className="flex justify-end gap-3">
						<button
							onClick={ handleCancelEvaluating }
							className="self-start boder bg-gray-200 text-gray-600 border-gray-800 p-2 rounded-2xl px-6 "
						>
							Cancel
						</button>
						<button
							className="bg-brightOrange-500 text-white py-2 px-6 rounded-2xl hover:bg-orange-800 hover:shadow-lg"
							onClick={handleSubmitEvaluation}
						>
							Confirm Action
						</button>
					</div>
				</div>
			</Modal>
		)
	}

	return (
		<>
			{ EvaluationModal() }
			<div className="clubReportsPage grid grid-cols-8 gap-16 mt-8">
				{/* Reported Articles List */ }
				<div className="left col-span-2 col-start-1 border bg-red-50 rounded-2xl p-4 max-w-sm h-fit">
					<h2 className="text-lg font-semibold mb-4">Reported Articles</h2>
					<div className="flex flex-col gap-4">
						{reportedArticles.map((report) => (
							<ReportedArticleListItem
								key={report.articleId.toString()}
								report={report}
								onClick={handleClickedReportedArticle}
							/>
						))}
					</div>
				</div>

				{/* Article Preview */}
				<div className="right col-span-4 border bg-lightPurple-10 rounded-2xl p-4 space-y-4 ">
					{ selectedReport && selectedArticleId && (
						<div className="border p-2 pl-4 pb-4 space-y-4 rounded-2xl bg-surface-200 shadow-md">
							<h1 className="font-medium text-red-500">Reported as</h1>
							<div className="flex flex-wrap gap-2">
								{ reports && reports.length > 0 && (
									reports.map((report, index) => (
										<ReportContainer key={ index } report={ report }/>
									))
								) }
							</div>
						</div>
					) }
					{ isArticleLoading && <p>Loading article preview...</p> }
					{ isArticleError && (
						<p>Failed to load article details. Please try again later.</p>
					) }
					{ !isArticleLoading && article && (
						<PreviewArticle article={ article }/>
					) }
					{ !isArticleLoading && !article && !selectedArticleId && (
						<p>Select a reported article to preview its details.</p>
					) }
					<div className="flex justify-end">
						{selectedReport && selectedArticleId && (
							<button
								className="bg-brightOrange-500 text-white py-2 px-6 rounded-2xl hover:bg-orange-800 hover:shadow-lg"
								onClick={handleStartEvaluating}
							>
								Evaluate
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);

	function ReportContainer({report}){
		return (
			<div className="border p-2 bg-red-50 border-red-500 w-fit rounded-2xl text-sm ">
				{ report.reportReason === "Other" && report.additionalNotes ? (
					<p className="text-red-500">
						<span className="italic">{ report.additionalNotes }</span>
					</p>
				) : (
					<p className="text-red-500">
						<span className="font-bold">{ report.reportReason }</span>
					</p>
				) }
			</div>
		)
	}


}
