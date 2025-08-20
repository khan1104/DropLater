import { useForm } from "react-hook-form";
import axios from "axios";

export default function CreateNotes() {
    const { register, handleSubmit } = useForm();
    const token = "supersecrettoken123";

    const onSubmit = async (data) => {
        try {
            // Convert to ISO string
            const payload = {
                ...data,
                releaseAt: new Date(data.releaseAt).toISOString(),
            };
            const res = await axios.post("http://localhost:4000/api/notes", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res);
        } catch (err) {
            console.error(err);
            alert("Error creating note");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block font-medium">Title</label>
                <input
                    {...register("title", { required: true })}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Body</label>
                <textarea
                    {...register("body")}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Release At</label>
                <input
                    type="datetime-local"
                    {...register("releaseAt", { required: true })}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label className="block font-medium">Webhook URL</label>
                <input
                    {...register("webhookUrl", { required: true })}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
                Create Note
            </button>
        </form>
    );
}
