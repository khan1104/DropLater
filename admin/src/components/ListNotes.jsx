import { useEffect, useState } from "react";
import axios from "axios";

export default function ListNotes() {
    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const token = "supersecrettoken123";

    const fetchNotes = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/notes", {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, status: statusFilter || undefined },
            });
            setNotes(res.data.notes);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };

    const replayNote = async (id) => {
        try {
            await axios.post(
                `http://localhost:4000/api/notes/${id}/replay`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchNotes();
        } catch (err) {
            console.error("Error replaying note:", err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [page, statusFilter]);

    return (
        <div>
            {/* Filters */}
            <div className="mb-4 flex gap-2 justify-center">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="dead">Dead</option>
                </select>

                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1 bg-gray-300 rounded"
                >
                    Prev
                </button>
                <span className="px-2 py-1">{page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                >
                    Next
                </button>
            </div>

            {/* Table */}
            {notes.length === 0 ? (
                <p className="text-gray-500 text-center">No notes found</p>
            ) : (
                <table className="w-full border-collapse border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">DeliverdAt</th>
                            <th className="border p-2">No of Attempts</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note) => (
                            <tr key={note._id} className="text-center border">
                                <td className="border p-2">{note._id}</td>
                                <td className="border p-2">{note.title}</td>
                                <td className="border p-2">{note.status}</td>
                                <td className="border p-2">{note.deliverdAt}
                                    {/* {note.attempts?.length
                                        ? note.attempts[note.attempts.length - 1].at
                                        : "-"} */}
                                </td>
                                <td className="border p-2">{note.attempts?.length || 0}</td>
                                <td className="border p-2">
                                    {note.status === "dead" && (
                                        <button
                                            className="px-3 py-1 bg-green-600 text-white rounded"
                                            onClick={() => replayNote(note._id)}
                                        >
                                            Replay
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
