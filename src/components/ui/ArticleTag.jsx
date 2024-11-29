export default function ArticleTag({tagName}) {
	return <div className={`
			bg-surface-200
			border border-black-50 
			px-2.5 py-1
			rounded-lg 
			text-black-300
		`}>
		<p className="text-xxs font-thin text-nowrap line-clamp-1">{tagName}</p>
	</div>
}