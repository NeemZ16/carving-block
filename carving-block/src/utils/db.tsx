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
} from "firebase/firestore";

import {
    getStorage,
} from "firebase/storage";

// -------------------- CONFIG --------------------

// const PROJECTS_COLLECTION = "projects";
const PROJECTS_COLLECTION = "projects-prod";

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

// -------------------- STORAGE --------------------

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
        .then(data => data.data.link as string);
};

// -------------------- FIRESTORE OPS --------------------

export const storeProjectDetails = (proj: ProjectListingProps) => {
    return setDoc(doc(db, PROJECTS_COLLECTION, proj.id), proj)
        .catch((err) => {
            console.error("storeProjectDetails failed:", err);
            throw err;
        });
};

export const setBookingTime = (id: string | any, datetime: number) => {
    return updateDoc(doc(db, PROJECTS_COLLECTION, id), {
        time: datetime,
    }).catch((err) => {
        console.error("setBookingTime failed:", err);
        throw err;
    });
};

export const getProjectDetails = (id: string) => {
    return getDoc(doc(db, PROJECTS_COLLECTION, id))
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
    const q = query(
        collection(db, PROJECTS_COLLECTION),
        where("state", "==", phase)
    );

    return getDocs(q)
        .then((snap) =>
            snap.docs.map((d) => d.data() as ProjectListingProps)
        )
        .catch((err) => {
            console.error("getProjectsByState failed:", err);
            throw err;
        });
};

export const getProjectsByIDList = (ids: string[]) => {
    if (!ids.length) return Promise.resolve([]);

    const promises = ids.map((id) =>
        getDoc(doc(db, PROJECTS_COLLECTION, id))
            .then((snap) => {
                if (!snap.exists()) return null;
                return snap.data() as ProjectListingProps;
            })
    );

    return Promise.all(promises)
        .then((results) =>
            results.filter(Boolean) as ProjectListingProps[]
        )
        .catch((err) => {
            console.error("getProjectsByIDList failed:", err);
            throw err;
        });
};