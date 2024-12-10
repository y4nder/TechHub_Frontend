const SocialPill = ({ icon, link, name }) => (
	<a
		href={link}
		target="_blank"
		rel="noopener noreferrer"
		className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full shadow-sm hover:bg-blue-200 transition"
	>
		{icon && <span className="mr-2">{icon}</span>}
		{name}
	</a>
);

export default SocialPill;