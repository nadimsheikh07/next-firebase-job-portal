import { db } from "@/config/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Delete() {
    const router = useRouter();
    const { id } = router.query;

    const [task, setTask] = useState({
        title: "",
        description: "",
    });

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

    const handleDelete = async () => {
        const ref = doc(db, "tasks", id);
        deleteDoc(ref)
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
                    <h1 className="text-3xl font-semibold">Delete Task</h1>
                </div>
                <form>
                    <div className="my-12">
                        Are you sure to delete <strong>{task?.name}</strong>?
                    </div>
                    <div className="flex w-full gap-2">
                        <Link
                            href="/"
                            className="text-center bg-gray-300 hover:bg-opacity-80 text-black rounded-lg px-4 py-2 duration-200 w-full"
                        >
                            Cancel
                        </Link>
                        <button
                            className="bg-red-500 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                            type="button"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
            <Head>
                <title>Delete Task</title>
            </Head>
        </>
    );
}