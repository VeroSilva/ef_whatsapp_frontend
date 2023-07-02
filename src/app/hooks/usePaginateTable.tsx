import { useState, useEffect } from "react";

export const usePaginateTable = ({ data, page, rowsPerPage }: { data: any, page: number, rowsPerPage: number }) => {
  const [tableRange, setTableRange] = useState<number[]>([]);
  const [slice, setSlice] = useState<any[]>([]);

  const calculateRange = ({ data, rowsPerPage }: { data: any, rowsPerPage: number }) => {
    const range = [];
    const num = Math.ceil(data.length / rowsPerPage);
    let i = 1;
    for (let i = 1; i <= num; i++) {
      range.push(i);
    }

    return range;
  };

  const sliceData = ({ data, page, rowsPerPage }: { data: any, page: number, rowsPerPage: number }) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  };

  useEffect(() => {
    const range = calculateRange({ data, rowsPerPage });
    setTableRange([...range]);

    const slice = sliceData({ data, page, rowsPerPage });
    setSlice([...slice]);
  }, [data, setTableRange, page, setSlice, rowsPerPage]);

  return { slice, range: tableRange };
};
