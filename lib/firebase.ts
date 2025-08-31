import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBoBjEzruVZBCt7e_68bTP0dPOkPgF_9Xg",
  authDomain: "jacsicestaffs-a213f.firebaseapp.com",
  projectId: "jacsicestaffs-a213f",
  storageBucket: "jacsicestaffs-a213f.firebasestorage.app",
  messagingSenderId: "12784625644",
  appId: "1:12784625644:web:2a3ab5c59b6effaf5dc2c9",
  measurementId: "G-0VBR947CL8",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
