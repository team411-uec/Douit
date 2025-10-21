import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { User } from "../types";

/**
 * ユーザーの作成
 */
export async function createUser(userId: string, name: string, email?: string): Promise<void> {
  const userData: Omit<User, "id"> = {
    name,
    email: email || "",
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
export async function updateUser(userId: string, name?: string, email?: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  const updateData: any = {};

  if (name !== undefined) {
    updateData.name = name;
  }
  if (email !== undefined) {
    updateData.email = email;
  }

  if (Object.keys(updateData).length > 0) {
    await updateDoc(userRef, updateData);
  }
}

/**
 * ユーザーが存在しない場合は作成する
 */
export async function ensureUser(userId: string, name: string, email?: string): Promise<void> {
  const existingUser = await getUser(userId);

  if (!existingUser) {
    await createUser(userId, name, email);
  }
}
