import { useEffect } from "react";
import { IconChevron } from "../Icons/IconChevron";

export const TableFooter = ({
    range,
    setPage,
    page,
    slice
}: { range: number[], setPage: Function, page: number, slice: any[] }) => {
    useEffect(() => {
        if (slice.length < 1 && page !== 1) {
            setPage(page - 1);
        }
    }, [slice, page, setPage]);

    return (
        <div className="w-100 flex items-center flex-wrap justify-content-center align-items-center my-3">
            <button
                className="bg-sky-800 text-white p-2 mr-2 rounded-md"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
            >
                <IconChevron classes="w-4 h-4 rotate-180" />
            </button>
            <button
                className="bg-sky-800 text-white p-2 mr-2 rounded-md"
                onClick={() => setPage(page + 1)}
                disabled={page === range[range.length - 1]}
            >
                <IconChevron classes="w-4 h-4" />
            </button>
            <span className="w-100 text-center text-sm">Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{range[range.length - 1]}</span></span>
        </div>
    )
}