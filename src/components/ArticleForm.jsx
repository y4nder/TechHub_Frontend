import { useSelector } from "react-redux";
import DropdownSelector from "@/components/ui/DropdownSelector.jsx";
import { useState, useEffect } from "react";
import { CameraIcon } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor.jsx";
import Input from "@/components/ui/Input.jsx";
import TagInput from "@/components/TagInput.jsx";
import {VscLoading} from "react-icons/vsc";

export default function ArticleForm({ inputData, onSubmit, edit, isPending = false}) {
	const { clubs } = useSelector((state) => state.joinedClubs);
	const [clubSelectionError, setClubSelectionError] = useState("");
	const [articleTitleError, setArticleTitleError] = useState("");
	const [tagsError, setTagsError] = useState("");
	const [richTextError, setRichTextError] = useState("");
	const [selectedClub, setSelectedClub] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [imageError, setImageError] = useState(false);
	const [deltaObject, setDeltaObject] = useState(null);
	const [htmlObject, setHtmlObject] = useState(null);
	const [tags, setTags] = useState({ selectedTags: [], customTags: [] });
	const [articleTitle, setArticleTitle] = useState("");
	const [edited, setEdited] = useState(true);

	useEffect(() => {
		if (inputData) {
			const foundClub = clubs.find((club) => club.clubId === inputData.clubId);
			setSelectedClub(
				foundClub && {
					image: foundClub.clubProfilePicUrl,
					id: foundClub.clubId,
					label: foundClub.clubName,
				}
			);
			setArticleTitle(inputData.articleTitle || null);
			setPreviewImage(inputData.articleThumbnail || null);
			if(inputData.articleContent){
				setDeltaObject(JSON.parse(inputData.articleContent) || null);
			}
		}
	}, [inputData, clubs]);

	const handleClubSelection = (option) => setSelectedClub(option);

	const clubOptions = clubs.map((club) => ({
		image: club.clubProfilePicUrl,
		id: club.clubId,
		label: club.clubName,
	}));

	const validateForm = () => {
		let valid = true;

		// Reset errors
		setClubSelectionError("");
		setArticleTitleError("");
		setTagsError("");
		setRichTextError("");
		setImageError(false);

		const fileInput = document.getElementById("articleThumbnail");
		const file = fileInput?.files[0];

		// Club selection validation
		if (!selectedClub) {
			setClubSelectionError("Please select a club.");
			valid = false;
		}

		// Image validation
		if (!file && previewImage === null) {
			setImageError(true);
			valid = false;
		}

		// Article Title validation
		if (!articleTitle) {
			setArticleTitleError("Please enter an article title.");
			valid = false;
		}

		// Tags validation
		if (tags.selectedTags.length === 0 && tags.customTags.length === 0) {
			setTagsError("Please select or add at least one tag.");
			valid = false;
		}

		// Rich Text Editor validation
		if (!deltaObject || deltaObject.ops.length === 0 || (deltaObject.ops.length === 1 && deltaObject.ops[0].insert === '\n')) {
			setRichTextError("Article content is required.");
			valid = false;
		}

		return valid;
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const validTypes = ["image/png", "image/jpeg"];
		if (!validTypes.includes(file.type)) {
			setImageError(true);
			setPreviewImage(null);
			return;
		}

		const reader = new FileReader();
		reader.onload = () => setPreviewImage(reader.result);
		reader.readAsDataURL(file);
	};

	// const handleEditedState = () => {
	// 	if(!edit) return;
	//
	// 	if(edited === false){
	// 		console.log("edited set to true")
	// 		setEdited(true);
	// 	}
	//
	// 	if(inputData.articleTitle === articleTitle.trim()){
	// 		console.log("edited set to false because of title")
	// 		console.log(inputData.articleTitle)
	// 		console.log(articleTitle)
	// 		setEdited(false);
	//
	// 	}
	//
	// 	if(JSON.stringify(deltaObject) === JSON.stringify(inputData.articleContent)) {
	// 		console.log("edited set to false because of content")
	// 		setEdited(false);
	// 	}
	//
	// 	setEdited(true);
	// }

	const handleFormSubmit = (event, isDraft = false) => {
		event.preventDefault();

		if (!validateForm()) return;

		// Get the file input element and the selected file
		const fileInput = document.getElementById("articleThumbnail");
		const file = fileInput?.files[0];

		// Create a new FormData object
		const formData = new FormData();

		// Append fields according to the model structure
		formData.append("ClubId", selectedClub?.id); // ClubId (int)
		formData.append("ArticleTitle", articleTitle); // ArticleTitle (string)

		// Append ArticleHtmlContent (string)
		formData.append("ArticleHtmlContent", htmlObject);

		// Append TagIds as individual items (List<int>)
		tags.selectedTags.forEach(tag => {
			formData.append("TagIds[]", tag); // Assuming tag.tagId is the value you want (int)
		});

		// Append NewTags as individual items (List<string>)
		tags.customTags.forEach(tag => {
			formData.append("NewTags[]", tag); // Custom tags are strings
		});

		// Append ArticleContent (string) as JSON
		formData.append("ArticleContent", JSON.stringify(deltaObject));

		// Append IsDrafted (bool)
		formData.append("IsDrafted", isDraft.toString()); // Convert boolean to string for form submission

		// Append the file (if any)
		if (file) {
			formData.append("ArticleThumbnail", file); // ArticleThumbnail (IFormFile)
		}

		// Pass the FormData object to the onSubmit function
		onSubmit(formData);
	};

	return (
		<form className="article-form" onSubmit={(e) => handleFormSubmit(e)}>
			{/* Club Selection */}
			<div className="article-form-body-container border border-t-black-75 p-4 space-y-3 border-b-surface-200">
				<div className="article-form-club-selection">
					<DropdownSelector
						initialValue={selectedClub}
						label="Choose a Club"
						dropdownColor="bg-surface-500"
						options={clubOptions}
						hasError={!!clubSelectionError}
						onSelect={handleClubSelection}
						transitionDuration="200ms"
					/>
					{clubSelectionError && (
						<p className="text-red-500 text-sm pl-2">{clubSelectionError}</p>
					)}
				</div>

				{/* Article Thumbnail */}
				<div className="article-form-thumbnail">
					<div className="input-profile-picture flex flex-col w-fit">
						<label
							htmlFor="articleThumbnail"
							className="cursor-pointer w-fit"
							title="Click to change profile picture"
						>
							{previewImage ? (
								<div className="group bg-surface-500 px-4 py-2 w-fit flex items-center gap-5 rounded-2xl text-black-75 hover:text-black-300">
									<div className="relative">
										<img
											src={previewImage}
											alt="Profile Preview"
											className="w-24 h-24 rounded-3xl object-cover border border-gray-300 group-hover:ring-2 group-hover:ring-darkPurple-500 transition-all duration-300"
										/>
									</div>
									<p>Change Thumbnail</p>
								</div>
							) : (
								<div
									className={`w-fit h-24 rounded-3xl bg-surface-500 flex gap-3 px-8 items-center justify-center ${
										imageError ? "border border-red-400" : "border border-gray-300"
									}`}
								>
									<CameraIcon />
									<span className="text-gray-500 text-sm">Thumbnail</span>
								</div>
							)}
						</label>
						<input
							id="articleThumbnail"
							type="file"
							accept=".png, .jpg"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>
					{imageError && (
						<p className="text-red-500 text-sm font-sm pl-2">
							Article Thumbnail is required
						</p>
					)}
				</div>

				{/* Article Title */}
				<div className="article-form-title">
					<Input
						id="articleTitle"
						onChange={(e) => setArticleTitle(e.target.value)}
						value={articleTitle}
						placeholder="Article Title"
					/>
					{articleTitleError && (
						<p className="text-red-500 text-sm pl-2">{articleTitleError}</p>
					)}
				</div>

				{/* Rich Text Editor */}
				<div className="article-form-text-editor">
					<RichTextEditor value={deltaObject} onChangeDelta={setDeltaObject} onChangeHtml={setHtmlObject} />
					{richTextError && (
						<p className="text-red-500 text-sm pl-2">{richTextError}</p>
					)}
				</div>

				{/* Tags */}
				<div className="article-form-tags">
					<TagInput onTagsChange={setTags} initialTags={inputData && inputData.tags} />
					{tagsError && (
						<p className="text-red-500 text-sm pl-2">{tagsError}</p>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="article-form-actions p-4 flex justify-end gap-4">
				{!edit && (
					<button
						type="button"
						onClick={(e) => handleFormSubmit(e, true)} // Save as draft
						className="bg-surface-500  py-1.5 px-6 rounded-xl text-black border hover:bg-surface-700 hover:text-white"
					>
						Save as Draft
					</button>
				)}
				<button
					type="button"
					disabled={isPending || (edit && !edited)}
					onClick={(e) => handleFormSubmit(e, false)} // Post the article
					className="bg-brightOrange-500 py-1.5 px-6 rounded-xl text-white font-bold hover:bg-darkPurple-500 flex gap-2 text-nowrap disabled:bg-lightPurple-200"
				>
					{isPending ? (
							<>
								<VscLoading className="w-4 h-4 animate-spin" />
								{edit ? 'Updating...' : 'Posting...'}

							</>
						):
						edit ? 'Update' : 'Post'
					}
				</button>
			</div>
		</form>
	);
}
