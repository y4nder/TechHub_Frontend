import { forwardRef } from "react";
import {TbMessageReport} from "react-icons/tb";

export const ReportedArticleListItem= forwardRef(({ report, onClick,...props  }, ref) => {
	return (
		<div ref={ref} {...props}
			className="border rounded-2xl p-3 border-red-200 bg-surface-200 hover:bg-red-100 group"
	      onClick={() => onClick(report)}
		>
			<div className="reported-article grid grid-cols-10 gap-2">
				<TbMessageReport
					className="text-red-500 col-span-2"
					size={28}/>
				<div className="col-span-6">
					<p className="font-md text-sm">{report.articleTitle}</p>
					{/*<p className="font-medium text-xs text-red-500 group-hover:font-bold">{report.reportReason}</p>*/}
					{/*{report.additionalNotes !== "" || report.additionalNotes && (*/}
					{/*	<p>{report.additionalNotes}</p>*/}
					{/*)}*/}
				</div>
				<img
					src={report.userProfilePicUrl}
					alt=""
					className="h-8 w-8 object-cover rounded-full col-span-2 flex-shrink-0"
				/>
			</div>
		</div>
	);
});


