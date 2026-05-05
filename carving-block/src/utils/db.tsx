/**
 * - connectDB()
 * - storeProjectDetails(projDetails: ProjectListingProps)
 * - setBookingTime(id, datetime) - set or update the booking time for the associated project
 * - getProjectDetails(id) returns associated project details object
 * - getProjectsByPhase(phase) returns list of project details from db
 * - getProjectsByIDList(list of ids) returns list of project details from db
 */

import type { ProjectListingProps } from "../components/projListing";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    // documentId,
} from "firebase/firestore";

import {
    getStorage,
    // ref,
    // uploadBytes,
    // getDownloadURL,
} from "firebase/storage";

// set firebase config and init
const firebaseConfig = {
    apiKey: "AIzaSyD9gbNyub0mO-YBr4gc-EVQOI4NSoY0j-o",
    authDomain: "carving-block-ca92f.firebaseapp.com",
    projectId: "carving-block-ca92f",
    storageBucket: "carving-block-ca92f.firebasestorage.app",
    messagingSenderId: "557184328016",
    appId: "1:557184328016:web:0fec10f7c8895405840c55"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);


// /** upload image to firestore so it can be retrieved by url */
// export const uploadImage = async (file: File): Promise<string> => {
//     //   const { storage } = connectDB();

//     const imageRef = ref(storage, `projects/${Date.now()}-${file.name}`);

//     const snapshot = await uploadBytes(imageRef, file);
//     const url = await getDownloadURL(snapshot.ref);

//     return url;
// };

export const uploadImage = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
            Authorization: "Client-ID YOUR_CLIENT_ID"
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        return data.data.link as string;
    });
};

export const storeProjectDetails = (proj: ProjectListingProps) => {
    //   const { db } = connectDB();

    return setDoc(doc(db, "projects", proj.id), proj)
        .catch((err) => {
            console.error("storeProjectDetails failed:", err);
            throw err;
        });
};

export const setBookingTime = (id: string | any, datetime: number) => {
    //   const { db } = connectDB();

    return updateDoc(doc(db, "projects", id), {
        time: datetime,
    }).catch((err) => {
        console.error("setBookingTime failed:", err);
        throw err;
    });
};

export const getProjectDetails = (id: string) => {
    //   const { db } = connectDB();

    return getDoc(doc(db, "projects", id))
        .then((snap) => {
            if (!snap.exists()) return null;
            return snap.data() as ProjectListingProps;
        })
        .catch((err) => {
            console.error("getProjectDetails failed:", err);
            throw err;
        });
};

export const getProjectsByState = (phase: 0 | 1 | 2 | 3 | 4) => {
    //   const { db } = connectDB();

    const q = query(
        collection(db, "projects"),
        where("state", "==", phase)
    );

    return getDocs(q)
        .then((snap) => snap.docs.map((d) => d.data() as ProjectListingProps))
        .catch((err) => {
            console.error("getProjectsByState failed:", err);
            throw err;
        });
};

export const getProjectsByIDList = (ids: string[]) => {
    if (!ids.length) return Promise.resolve([]);

    const promises = ids.map((id) => {
        return getDoc(doc(db, "projects", id))
            .then((snap) => {
                if (!snap.exists()) return null;
                return snap.data() as ProjectListingProps;
            });
    });

    return Promise.all(promises)
        .then((results) => results.filter(Boolean) as ProjectListingProps[])
        .catch((err) => {
            console.error("getProjectsByIDList failed:", err);
            throw err;
        });
};