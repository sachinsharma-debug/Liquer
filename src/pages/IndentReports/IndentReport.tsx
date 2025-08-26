// import { useState } from "react";

// const IndentReport = () => {

//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const data = [
//         {
//             date: "1-4-2013",
//             indentNo: 1,
//             particulars: "INDENT",
//             nameOfItem: "",
//             depotName: "",
//             supplierName: "",
//             indentQty1: "",
//             uom1: "",
//             indentQty2: "",
//             uom2: "",
//         },
//         {
//             date: "1-4-2013",
//             indentNo: 2,
//             particulars: "INDENT",
//             nameOfItem: "",
//             depotName: "",
//             supplierName: "",
//             indentQty1: "",
//             uom1: "",
//             indentQty2: "",
//             uom2: "",
//         },
//     ];

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//                 <div className="flex flex-left"><h2 className="text-2xl font-semibold">Indent Voucher Register</h2><h5 className="text-2xl text-sm p-2">(from 1-Apr-2013 To 30-Apr-2013)</h5></div>
//                 <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="bg-[#243D5C] text-white px-4 py-2 rounded-md hover:bg-black-700"
//                 >
//                     Add Indent Report
//                 </button>
//             </div>

//             <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//                 <table className="w-full text-sm text-left text-gray-700 border">
//                     <thead className="bg-gray-100 text-xs uppercase">
//                         <tr>
//                             <th className="px-4 py-2">Date</th>
//                             <th className="px-4 py-2">Indent No</th>
//                             <th className="px-4 py-2">Particulars</th>
//                             <th className="px-4 py-2">Name of Item</th>
//                             <th className="px-4 py-2">Ident Quantity</th>
//                             <th className="px-4 py-2">Rate</th>
//                             <th className="px-4 py-2">Amount</th>
//                             <th className="px-4 py-2">Due On</th>
//                             <th className="px-4 py-2">Over Due</th>
//                             <th className="px-4 py-2">UOM</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((row, idx) => (
//                             <tr key={idx} className="border-t hover:bg-gray-50">
//                                 <td className="px-4 py-2">{row.date}</td>
//                                 <td className="px-4 py-2">{row.indentNo}</td>
//                                 <td className="px-4 py-2">{row.particulars}</td>
//                                 <td className="px-4 py-2">{row.nameOfItem}</td>
//                                 <td className="px-4 py-2">{row.depotName}</td>
//                                 <td className="px-4 py-2">{row.supplierName}</td>
//                                 <td className="px-4 py-2">{row.indentQty1}</td>
//                                 <td className="px-4 py-2">{row.uom1}</td>
//                                 <td className="px-4 py-2">{row.indentQty2}</td>
//                                 <td className="px-4 py-2">{row.uom2}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//                     <div className="bg-white rounded-lg shadow-lg w-[600px] p-6 relative">
//                         <button
//                             onClick={() => setIsModalOpen(false)}
//                             className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//                         >
//                             ✖
//                         </button>
//                         <h2 className="text-lg font-semibold mb-4">Add Indent Voucher</h2>
//                         <form className="grid grid-cols-2 gap-4">
//                             <input type="text" placeholder="Date" className="border p-2 rounded" />
//                             <input type="text" placeholder="Indent No" className="border p-2 rounded" />
//                             <input type="text" placeholder="Name of Item" className="border p-2 rounded" />
//                             <input type="text" placeholder="Depot Name" className="border p-2 rounded" />
//                             <input type="text" placeholder="Supplier Name" className="border p-2 rounded" />
//                             <input type="text" placeholder="Indent Qty 1" className="border p-2 rounded" />
//                             <input type="text" placeholder="UOM" className="border p-2 rounded" />
//                             <input type="text" placeholder="Indent Qty 2" className="border p-2 rounded" />
//                             <input type="text" placeholder="UOM" className="border p-2 rounded" />
//                             <input type="text" placeholder="Rate" className="border p-2 rounded" />
//                             <input type="text" placeholder="Amount" className="border p-2 rounded" />
//                             <input type="text" placeholder="Due On" className="border p-2 rounded" />
//                             <input type="text" placeholder="Over Due" className="border p-2 rounded" />

//                             <div className="col-span-2 flex justify-end">
//                                 <button
//                                     type="submit"
//                                     className="bg-[#243D5C] text-white px-4 py-2 rounded hover:bg-[#243D5C]"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default IndentReport;
























import React, { useEffect, useMemo, useState } from "react";

interface IndentFormData {
    date: string;
    indentNo: string;
    nameOfItem: string;
    depotName: string;
    indentQty1: string;
    indentQty2: string;
    uom1: string;
    uom2: string;
    rate: string;
    amount: string;
    dueOn: string;
    overDue: string;
}
const initialMockData = [
    {
        id: 1,
        date: "2013-04-01",
        indentNo: 1,
        particulars: "INDENT",
        nameOfItem: "Item A",
        depotName: "Depot 1",
        supplierName: "Supplier X",
        indentQty1: 10,
        uom1: "KG",
        indentQty2: 0,
        uom2: "",
        rate: 50,
        amount: 500,
        dueOn: "2013-04-10",
        overDue: 0,
    },
    {
        id: 2,
        date: "2013-04-02",
        indentNo: 2,
        particulars: "INDENT",
        nameOfItem: "Item B",
        depotName: "Depot 2",
        supplierName: "Supplier Y",
        indentQty1: 5,
        uom1: "LTR",
        indentQty2: 0,
        uom2: "",
        rate: 120,
        amount: 600,
        dueOn: "2013-04-12",
        overDue: 0,
    },
    // add more mock rows if you want
];

const formatDateForInput = (d) => {
    if (!d) return "";
    // accept "YYYY-MM-DD" or "DD-MM-YYYY"
    if (/\d{4}-\d{2}-\d{2}/.test(d)) return d;
    const parts = d.split("-");
    if (parts.length === 3) {
        // assume DD-MM-YYYY
        return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
    }
    return d;
};

export default function IndentReport() {
    // UI state
    const [data, setData] = useState([]); // full data from "API"
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null = add, object = edit

    // filters
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [search, setSearch] = useState("");
    const [depotFilter, setDepotFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");

    // table control
    const [sortBy, setSortBy] = useState({ key: "date", dir: "asc" });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const emptyForm = {
        date: "",
        indentNo: "",
        particulars: "INDENT",
        nameOfItem: "",
        depotName: "",
        supplierName: "",
        indentQty1: "",
        uom1: "",
        indentQty2: "",
        uom2: "",
        rate: "",
        amount: "",
        dueOn: "",
        overDue: "",
    };

    type RowData = {
        date: string;
        indentNo: string;
        nameOfItem: string;
        depotName: string;
        indentQty1: string;
        rate: string;
        dueOn?: string;
    };

    const emptyErrors: FormErrors = {};

    type FormErrors = {
        [K in keyof RowData]?: string;
    };

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({
        date: "",
        indentNo: "",
        nameOfItem: "",
        depotName: "",
        indentQty1: "",
        rate: ""
    });

    // local ID counter for mock adds
    const [nextId, setNextId] = useState(1000);

    // ---------- Mock "API" functions ----------
    // Replace these with real fetch/axios calls when backend ready.

    const fetchData = async (opts = {}) => {
        setLoading(true);
        // simulate network delay
        await new Promise((r) => setTimeout(r, 350));

        // In real scenario:
        // const resp = await fetch(`/api/indent-report?from=${fromDate}&to=${toDate}&depot=${depotFilter}&supplier=${supplierFilter}`);
        // const json = await resp.json();
        // setData(json);

        // For mock: filter initialMockData (you can persist to localStorage if you want)
        const source = JSON.parse(localStorage.getItem("indent_mock")) || initialMockData;
        setData(source);
        setLoading(false);
    };

    const saveRecord = async (payload) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 300));
        const store = JSON.parse(localStorage.getItem("indent_mock")) || initialMockData;
        if (payload.id) {
            // edit
            const idx = store.findIndex((s) => s.id === payload.id);
            if (idx !== -1) store[idx] = payload;
        } else {
            // add
            payload.id = nextId;
            setNextId((n) => n + 1);
            store.unshift(payload); // add to top
        }
        localStorage.setItem("indent_mock", JSON.stringify(store));
        setData(store);
        setLoading(false);
        return payload;
    };

    const deleteRecord = async (id) => {
        if (!confirm("Are you sure to delete this record?")) return false;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 250));
        const store = JSON.parse(localStorage.getItem("indent_mock")) || initialMockData;
        const newStore = store.filter((s) => s.id !== id);
        localStorage.setItem("indent_mock", JSON.stringify(newStore));
        setData(newStore);
        setLoading(false);
        return true;
    };
    // -----------------------------------------

    useEffect(() => {
        // initial load
        fetchData();
        // set reasonable defaults for date (demo)
        if (!fromDate) {
            setFromDate("");
            setToDate("");
        }
        // try to keep nextId consistent
        const store = JSON.parse(localStorage.getItem("indent_mock")) || initialMockData;
        const maxId = store.reduce((m, r) => Math.max(m, r.id || 0), 0);
        setNextId(maxId + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // derived lists for dropdowns
    const depotOptions = useMemo(() => {
        const setD = new Set(data.map((r) => r.depotName).filter(Boolean));
        return Array.from(setD);
    }, [data]);

    const supplierOptions = useMemo(() => {
        const setS = new Set(data.map((r) => r.supplierName).filter(Boolean));
        return Array.from(setS);
    }, [data]);

    // filtered + sorted data
    const processed = useMemo(() => {
        let rows = [...data];

        // filters
        if (fromDate) rows = rows.filter((r) => r.date >= fromDate);
        if (toDate) rows = rows.filter((r) => r.date <= toDate);
        if (depotFilter) rows = rows.filter((r) => r.depotName === depotFilter);
        if (supplierFilter) rows = rows.filter((r) => r.supplierName === supplierFilter);
        if (search) {
            const s = search.toLowerCase();
            rows = rows.filter(
                (r) =>
                    (r.nameOfItem && r.nameOfItem.toLowerCase().includes(s)) ||
                    (r.particulars && r.particulars.toLowerCase().includes(s)) ||
                    (String(r.indentNo) || "").includes(s)
            );
        }

        // sort
        rows.sort((a, b) => {
            const key = sortBy.key;
            const dir = sortBy.dir === "asc" ? 1 : -1;
            if (key === "date") return dir * (a.date.localeCompare(b.date));
            if (key === "indentNo") return dir * (Number(a.indentNo) - Number(b.indentNo));
            if (key === "amount") return dir * (Number(a.amount) - Number(b.amount));
            return 0;
        });

        return rows;
    }, [data, fromDate, toDate, depotFilter, supplierFilter, search, sortBy]);

    // pagination
    const total = processed.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    const currentPageRows = processed.slice((page - 1) * pageSize, page * pageSize);

    // form helpers
    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setErrors({
            date: '',
            indentNo: '',
            nameOfItem: '',
            depotName: '',
            indentQty1: '',
            rate: ''
        });
        setIsModalOpen(true);
    };

    const openEdit = (row: RowData) => {
    setEditing(row);
    // setForm({
    //   ...row,
    //   date: formatDateForInput(row.date),
    //   dueOn: formatDateForInput(row.dueOn),
    // });
    // setErrors(emptyErrors);
    setIsModalOpen(true);
  };


    type FormData = {
        date: string;
        indentNo: string;
        nameOfItem: string;
        depotName: string;
        indentQty1: string;
        rate: string;
    };

    const validateForm = () => {
        const err = {
            date: "",
            indentNo: "",
            nameOfItem: "",
            depotName: "",
            indentQty1: "",
            rate: ""
        };
        if (!form.date) err.date = "Date required";
        if (!form.indentNo) err.indentNo = "Indent No required";
        if (!form.nameOfItem) err.nameOfItem = "Name of item required";
        if (!form.depotName) err.depotName = "Depot required";
        // numeric checks
        if (form.indentQty1 !== "" && isNaN(Number(form.indentQty1)))
            err.indentQty1 = "Must be a number";
        if (form.rate !== "" && isNaN(Number(form.rate))) err.rate = "Must be a number";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const payload = {
            ...form,
            indentQty1: form.indentQty1 ? Number(form.indentQty1) : 0,
            indentQty2: form.indentQty2 ? Number(form.indentQty2) : 0,
            rate: form.rate ? Number(form.rate) : 0,
            amount: form.amount ? Number(form.amount) : (Number(form.indentQty1 || 0) * Number(form.rate || 0)),
            date: form.date,
            dueOn: form.dueOn || "",
            indentNo: Number(form.indentNo),
            id: editing ? editing.id : undefined,
        };
        await saveRecord(payload);
        setIsModalOpen(false);
        setEditing(null);
        setForm(emptyForm);
        setPage(1);
    };

    const handleDelete = async (id) => {
        await deleteRecord(id);
    };

    const exportCSV = () => {
        const rows = processed;
        if (!rows.length) {
            alert("No data to export");
            return;
        }
        const headers = [
            "Date",
            "Indent No",
            "Particulars",
            "Name of Item",
            "Depot Name",
            "Supplier Name",
            "Indent Qty1",
            "UOM1",
            "Indent Qty2",
            "UOM2",
            "Rate",
            "Amount",
            "Due On",
            "Over Due",
        ];
        const csv = [
            headers.join(","),
            ...rows.map((r) =>
                [
                    r.date,
                    r.indentNo,
                    `"${(r.particulars || "").replaceAll('"', '""')}"`,
                    `"${(r.nameOfItem || "").replaceAll('"', '""')}"`,
                    `"${(r.depotName || "").replaceAll('"', '""')}"`,
                    `"${(r.supplierName || "").replaceAll('"', '""')}"`,
                    r.indentQty1 ?? "",
                    r.uom1 ?? "",
                    r.indentQty2 ?? "",
                    r.uom2 ?? "",
                    r.rate ?? "",
                    r.amount ?? "",
                    r.dueOn ?? "",
                    r.overDue ?? "",
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `indent-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // small UI helpers
    const toggleSort = (key) => {
        setSortBy((s) => {
            if (s.key === key) return { key, dir: s.dir === "asc" ? "desc" : "asc" };
            return { key, dir: "asc" };
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold">Indent Voucher Register</h2>
                    <div className="text-sm text-gray-500">(from 1-Apr-2013 To 30-Apr-2013)</div>
                </div>

                <div className="flex gap-2 items-center">
                    <button
                        onClick={exportCSV}
                        className="bg-white border px-3 py-2 rounded shadow-sm hover:bg-gray-50"
                        title="Export visible rows to CSV"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={openAdd}
                        className="bg-[#243D5C] text-white px-4 py-2 rounded-md hover:opacity-95"
                    >
                        Add Indent Report
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 grid grid-cols-12 gap-3 items-end">
                <div className="col-span-3">
                    <label className="text-xs block mb-1">From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="col-span-3">
                    <label className="text-xs block mb-1">To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>
                <div className="col-span-3">
                    <label className="text-xs block mb-1">Depot</label>
                    <select
                        value={depotFilter}
                        onChange={(e) => setDepotFilter(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">All Depots</option>
                        {depotOptions.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-span-3">
                    <label className="text-xs block mb-1">Supplier</label>
                    <select
                        value={supplierFilter}
                        onChange={(e) => setSupplierFilter(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">All Suppliers</option>
                        {supplierOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-8">
                    <label className="text-xs block mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Search by item name / indent no / particulars"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded p-2 w-full"
                    />
                </div>

                <div className="col-span-4 flex gap-2 justify-end">
                    <button
                        onClick={() => {
                            setPage(1);
                            fetchData();
                        }}
                        className="bg-[#243D5C] text-white px-4 py-2 rounded-md"
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => {
                            setFromDate("");
                            setToDate("");
                            setDepotFilter("");
                            setSupplierFilter("");
                            setSearch("");
                            setPage(1);
                        }}
                        className="border px-4 py-2 rounded-md"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full text-sm text-left text-gray-700 border-collapse">
                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("date")}>
                                Date {sortBy.key === "date" ? (sortBy.dir === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className="px-3 py-2 cursor-pointer" onClick={() => toggleSort("indentNo")}>
                                Indent No {sortBy.key === "indentNo" ? (sortBy.dir === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className="px-3 py-2">Particulars</th>
                            <th className="px-3 py-2">Name of Item</th>
                            <th className="px-3 py-2">Depot Name</th>
                            <th className="px-3 py-2">Supplier Name</th>
                            <th className="px-3 py-2 text-right">Indent Qty1</th>
                            <th className="px-3 py-2">UOM</th>
                            <th className="px-3 py-2 text-right">Rate</th>
                            <th className="px-3 py-2 text-right">Amount</th>
                            <th className="px-3 py-2">Due On</th>
                            <th className="px-3 py-2">Over Due</th>
                            <th className="px-3 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={13} className="px-4 py-6 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : currentPageRows.length === 0 ? (
                            <tr>
                                <td colSpan={13} className="px-4 py-6 text-center text-gray-500">
                                    No data found.
                                </td>
                            </tr>
                        ) : (
                            currentPageRows.map((row) => (
                                <tr key={row.id} className="border-t hover:bg-gray-50">
                                    <td className="px-3 py-2">{row.date}</td>
                                    <td className="px-3 py-2">{row.indentNo}</td>
                                    <td className="px-3 py-2">{row.particulars}</td>
                                    <td className="px-3 py-2">{row.nameOfItem}</td>
                                    <td className="px-3 py-2">{row.depotName}</td>
                                    <td className="px-3 py-2">{row.supplierName}</td>
                                    <td className="px-3 py-2 text-right">{row.indentQty1}</td>
                                    <td className="px-3 py-2">{row.uom1}</td>
                                    <td className="px-3 py-2 text-right">{row.rate}</td>
                                    <td className="px-3 py-2 text-right">{row.amount}</td>
                                    <td className="px-3 py-2">{row.dueOn}</td>
                                    <td className="px-3 py-2">{row.overDue}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEdit(row)}
                                                className="text-sm px-2 py-1 border rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row.id)}
                                                className="text-sm px-2 py-1 border rounded text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-600">
                    Showing {(page - 1) * pageSize + 1} -{" "}
                    {Math.min(page * pageSize, total)} of {total} entries
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="border rounded p-1"
                    >
                        {[5, 10, 20, 50].map((s) => (
                            <option key={s} value={s}>
                                {s} / page
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <div className="px-2">Page</div>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={page}
                        onChange={(e) => setPage(Math.min(Math.max(1, Number(e.target.value || 1)), totalPages))}
                        className="w-16 border rounded p-1 text-center"
                    />
                    <div>/ {totalPages}</div>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditing(null);
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <h2 className="text-lg font-semibold mb-3">
                            {editing ? "Edit Indent Voucher" : "Add Indent Voucher"}
                        </h2>

                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs">Date *</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                                {errors.date && <div className="text-red-500 text-xs mt-1">{errors.date}</div>}
                            </div>

                            <div>
                                <label className="text-xs">Indent No *</label>
                                <input
                                    type="number"
                                    value={form.indentNo}
                                    onChange={(e) => setForm((f) => ({ ...f, indentNo: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                                {errors.indentNo && (
                                    <div className="text-red-500 text-xs mt-1">{errors.indentNo}</div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs">Name of Item *</label>
                                <input
                                    type="text"
                                    value={form.nameOfItem}
                                    onChange={(e) => setForm((f) => ({ ...f, nameOfItem: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                                {errors.nameOfItem && (
                                    <div className="text-red-500 text-xs mt-1">{errors.nameOfItem}</div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs">Depot Name *</label>
                                <input
                                    type="text"
                                    value={form.depotName}
                                    onChange={(e) => setForm((f) => ({ ...f, depotName: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                                {errors.depotName && (
                                    <div className="text-red-500 text-xs mt-1">{errors.depotName}</div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs">Supplier Name</label>
                                <input
                                    type="text"
                                    value={form.supplierName}
                                    onChange={(e) => setForm((f) => ({ ...f, supplierName: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs">Due On</label>
                                <input
                                    type="date"
                                    value={form.dueOn}
                                    onChange={(e) => setForm((f) => ({ ...f, dueOn: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs">Indent Qty 1</label>
                                <input
                                    type="number"
                                    value={form.indentQty1}
                                    onChange={(e) => setForm((f) => ({ ...f, indentQty1: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                                {errors.indentQty1 && (
                                    <div className="text-red-500 text-xs mt-1">{errors.indentQty1}</div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs">UOM 1</label>
                                <input
                                    type="text"
                                    value={form.uom1}
                                    onChange={(e) => setForm((f) => ({ ...f, uom1: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs">Indent Qty 2</label>
                                <input
                                    type="number"
                                    value={form.indentQty2}
                                    onChange={(e) => setForm((f) => ({ ...f, indentQty2: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs">UOM 2</label>
                                <input
                                    type="text"
                                    value={form.uom2}
                                    onChange={(e) => setForm((f) => ({ ...f, uom2: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs">Rate</label>
                                <input
                                    type="number"
                                    value={form.rate}
                                    onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                                {errors.rate && <div className="text-red-500 text-xs mt-1">{errors.rate}</div>}
                            </div>

                            <div>
                                <label className="text-xs">Amount</label>
                                <input
                                    type="number"
                                    value={form.amount}
                                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="text-xs">Over Due</label>
                                <input
                                    type="text"
                                    value={form.overDue}
                                    onChange={(e) => setForm((f) => ({ ...f, overDue: e.target.value }))}
                                    className="border rounded p-2 w-full"
                                />
                            </div>

                            <div className="col-span-2 flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditing(null);
                                    }}
                                    className="border px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-[#243D5C] text-white px-4 py-2 rounded">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
