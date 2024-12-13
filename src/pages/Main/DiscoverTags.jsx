import {ImEmbed} from "react-icons/im";
import {useQuery} from "@tanstack/react-query";
import {getDiscoverTags, getTrendingTags} from "@/utils/http/tags.js";
import ArticleTag from "@/components/ui/ArticleTag.jsx";

export default function DiscoverTagsPage() {
	const {
		data: trendingTagsData,
		isPending: isPendingTrendingTags,
		isError: isErrorTrendingTags,
		error : errorTrendingTags
	} = useQuery({
		queryKey: ['tags', 'trending'],
		queryFn: getTrendingTags
	})

	const {
		data : discoverTagsData,
		isPending : isPendingDiscoverTags,
		isError : isErrorDiscoverTags,
		error : errorDiscoverTags
	} = useQuery({
		queryKey: ['tags', 'discover'],
		queryFn: getDiscoverTags
	})

	const trendingTags = trendingTagsData?.tags || [];
	const discoverTags = discoverTagsData?.groupedTags || [];

	return (
		<div>
			<div className="border border-b-gray-400 p-3 pb-2 space-y-4">
				<div className="header flex gap-2 items-center">
					<ImEmbed color="gray" size={30}/>
					<h1 className={`text-sm font-bold`}># Tags</h1>
				</div>
				<div className="trending-tags space-y-2">
					<h1 className={`font-bold`}>Trending Tags</h1>
					<div className="flex gap-2 overflow-x-auto scrollbar-hider">
						{ isPendingTrendingTags && <p>Loading trending tags...</p> }
						{ isErrorTrendingTags && <p>Error: { errorTrendingTags?.message }</p> }
						{ !isPendingTrendingTags &&
							!isErrorTrendingTags &&
							trendingTags.map((tag) => (
								<ArticleTag key={ tag.tagId } tag={ tag } isTrending={true}/>
							)) }
					</div>
				</div>
			</div>
			<div className="all-tags p-5">
				<h1 className="text-md font-bold mb-1">All Tags</h1>
				<div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 space-y-120  pb-10   ">
					{ isPendingTrendingTags && <p>Loading discover tags...</p> }
					{ isErrorDiscoverTags && <p>Error: { errorDiscoverTags?.message }</p> }
					{ !isPendingDiscoverTags &&
						!isErrorDiscoverTags &&
						discoverTags.map((discoverTag) => (
							<div key={ discoverTag.group }
							     className=" p-4 flex flex-col"
							>
								<h2 className="text-sm font-semibold mb-2">{ discoverTag.group }</h2>
								<div className="flex gap-2 flex-col ">
									{ discoverTag.tags.map((tag) => (
										<ArticleTag key={ tag.tagId } tag={ tag } isDiscover={true}/>
									)) }
								</div>
							</div>
						)) }
				</div>
			</div>
		</div>
	)
}