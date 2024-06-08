import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Edit() {
    const router = useRouter();
    const { id } = router.query;

    const [task, setTask] = useState({
        name: "",
        description: "",
    });

    const onChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchTask = async () => {
            const ref = doc(db, "tasks", id);
            const snapshot = await getDoc(ref);
            setTask({ id: snapshot.id, ...snapshot.data() });
        };

        if (id) {
            fetchTask();
        }
    }, [id]);

    const handleUpdate = async () => {
        const ref = doc(db, "tasks", id);
        setDoc(ref, {
            name: task.name,
            description: task.description,
        })
            .then(() => {
                router.push("/task");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <div className="container mx-auto mt-8 max-w-[560px]">
                <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
                    <h1 className="text-3xl font-semibold">Edit Task</h1>
                </div>
                <form>
                    <div className="mb-4">
                        <label>Title</label>
                        <input
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
                            type="text"
                            name="name"
                            value={task?.name}
                            onChange={onChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label>Description</label>
                        <input
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
                            type="text"
                            name="description"
                            value={task?.description}
                            onChange={onChange}
                        />
                    </div>
                    <button
                        className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                        type="button"
                        onClick={handleUpdate}
                    >
                        Edit Task
                    </button>
                </form>
            </div>
            <Head>
                <title>Edit Task</title>
            </Head>
        </>
    );
}