import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import '@/RichTextEditorStyles.css';
import {useEffect, useState} from "react";


export default function RichTextEditor({value,  onChangeDelta, onChangeHtml}) {
	const toolbarOptions = [
		['bold', 'italic'],
		['link', 'image'],
		['blockquote', 'code-block'],
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
	];
	const modules = {
		toolbar: toolbarOptions,
	}



	const handleChange = (content, delta, source, editor) => {
		// Only fire editedState when not initializing
		onChangeHtml(editor.getHTML());
		onChangeDelta(editor.getContents());
		// editedState();
		// console.log("fired edited state from text editor");
	};

	return(
		<div className="rounded-2xl bg-surface-500">
			<ReactQuill
				modules={modules}
				theme="snow"
				value={value}
				onChange={handleChange}
				placeholder="share your thoughts"
			/>
		</div>
	)
}