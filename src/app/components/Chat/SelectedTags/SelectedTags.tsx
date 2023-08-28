import { isColorDark } from "@/app/utils/functions";

export const SelectedTags = ({ tags }: { tags: any }) => {
    return (
        <>
            {tags.map((tag: any) => (
                <span
                    key={`tag-${tag.id}`}
                    style={{ backgroundColor: tag.color }}
                    className={`rounded-full px-2 py-1 text-xs font-bold ${isColorDark(tag.color) ? "text-slate-200" : "text-gray-800"}`}
                >{tag.name}</span>
            ))}
        </>
    )
}