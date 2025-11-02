import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/types";

/**
 * ユーザーが存在しない場合は作成する
 */
export async function ensureUser(userId: string, name: string, email?: string): Promise<void> {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const userData: Omit<User, "id"> = {
      name,
      email: email || "",
      createdAt: new Date(),
    };

    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
  }
}
