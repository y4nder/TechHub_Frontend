export default function ArticleDetailTag({tag, onClick}) {
	return <button  className={`
			bg-surface-200
			border border-black-50 
			px-2.5 py-1
			rounded-lg 
			text-black-300
		`}
		onClick={onClick}
	>
		<p className="text-xxs font-thin text-nowrap line-clamp-1">{tag.tagName}</p>
	</button>
}