export default function ArticleDisplay({htmlContent}){
	return (
		<div
			className="article-content"
			dangerouslySetInnerHTML={ {__html: htmlContent} }
		/>
	);
}