import { db } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/types";

/**
 * ユーザーの作成
 */
export async function createUser(userId: string, name: string, email?: string): Promise<void> {
  const userData: Omit<User, "id"> = {
    name,
    email: email || "",
    role: "user",
    createdAt: new Date(),
  };

  await setDoc(doc(db, "users", userId), {
    ...userData,
    createdAt: serverTimestamp(),
  });
}

/**
 * ユーザー情報の取得
 */
export async function getUser(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, "users", userId));

  if (!userDoc.exists()) {
    return null;
  }

  return userDoc.data() as User;
}

/**
 * ユーザー情報の更新
 */

/**
 * ユーザーが存在しない場合は作成する
 */
export async function ensureUser(userId: string, name: string, email?: string): Promise<void> {
  const existingUser = await getUser(userId);

  if (!existingUser) {
    await createUser(userId, name, email);
  }
}
