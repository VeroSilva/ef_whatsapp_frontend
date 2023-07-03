import React from "react";

interface SkeletonTableProps {
    col: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ col }) => {
    const skeletonRows = [...Array(col)].map((item, index) => (
        <tr key={index} className="bg-white">
            <td>
                <div className="w-10 m-auto my-2 animate-pulse bg-gray-300 h-6 rounded-md"></div>
            </td>
            <td>
                <div className="w-20 m-auto my-2 animate-pulse bg-gray-300 h-6 rounded-md"></div>
            </td>
            <td>
                <div className="w-20 m-auto my-2 animate-pulse bg-gray-300 h-6 rounded-md"></div>
            </td>
            <td className="w-56">
                <div className="flex justify-center items-center my-2">
                    <div className="w-10 animate-pulse bg-gray-300 h-6 rounded-md mr-5"></div>
                    <div className="w-10 animate-pulse bg-gray-300 h-6 rounded-md"></div>
                </div>
            </td>
        </tr>
    ));

    return <>{skeletonRows}</>;
};