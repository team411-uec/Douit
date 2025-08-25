// 他のファイルから必要な機能を「借りてくる」（import）
import { db } from './firebase';  // db = データベース接続
import { 
  collection,     // collection = コレクション（データの入れ物、フォルダのようなもの）を指定
  doc,           // doc = ドキュメント（データの1つの記録、ファイルのようなもの）を指定
  addDoc,        // addDoc = 新しいドキュメントを追加する関数
  updateDoc,     // updateDoc = 既存のドキュメントを更新する関数
  deleteDoc,     // deleteDoc = ドキュメントを削除する関数
  getDoc,        // getDoc = ドキュメントを取得する関数
  getDocs,       // getDocs = 複数のドキュメントを取得する関数
  query,         // query = 検索条件を作る関数
  where,         // where = 「〇〇が△△と等しい」などの条件を作る関数
  collectionGroup, // collectionGroup = 全ての同名サブコレクションから検索する関数
  serverTimestamp // serverTimestamp = サーバーの現在時刻を自動で設定する関数
} from 'firebase/firestore';  // firebase/firestore = Googleのデータベースサービス
import { TermFragment } from './types';  // TermFragment = 規約片の型定義

// 1-1. 規約片の作成
// export = 他のファイルからこの関数を使えるようにする
// async = 非同期関数（時間がかかる処理を扱う）
export async function createTermFragment(
  title: string,       // string = 文字列型
  content: string,
  tags: string[],      // string[] = 文字列の配列型（例：["tag1", "tag2"]）
  parameters: string[]
): Promise<string> {   // Promise<string> = 文字列を返す非同期関数
  
  // 保存するデータを準備
  const fragmentData = {  // const = 変更できない変数
    title,              // title: title の省略形
    content,            // content: content の省略形
    parameters,         // parameters: parameters の省略形
    tags,               // tags: tags の省略形
    currentVersion: 1,  // 最初のバージョンなので1
    createdAt: serverTimestamp(),  // 作成日時をサーバーが自動設定
    updatedAt: serverTimestamp()   // 更新日時をサーバーが自動設定
  };

  // termFragments コレクションに新規作成
  // await = 非同期処理の完了を待つ
  const docRef = await addDoc(
    collection(db, 'termFragments'),  // 'termFragments'という名前のコレクション
    fragmentData                      // 上で準備したデータ
  );
  
  return docRef.id; // 作成されたドキュメントのID（自動生成される文字列）を返す
}

// 1-2. 規約片の編集
export async function updateTermFragment(
  fragmentId: string,  // 編集したい規約片のID
  title: string,       // 新しいタイトル
  content: string,     // 新しい内容
  tags: string[],      // 新しいタグ配列
  parameters: string[] // 新しいパラメータ配列
): Promise<void> {     // Promise<void> = 何も返さない非同期関数
  
  // 対象の規約片を取得
  const fragmentRef = doc(db, 'termFragments', fragmentId);
  // fragmentRef = 特定のドキュメントを指す「参照」
  
  const fragmentDoc = await getDoc(fragmentRef);
  // fragmentDoc = 実際に取得したドキュメントのデータ（箱）
  
  // exists() = ドキュメントが存在するかチェックする関数
  if (!fragmentDoc.exists()) {
    // throw new Error = エラーを発生させる
    throw new Error('規約片が見つかりません');
  }

  // data() = ドキュメントの中身（データ）を取得
  // as TermFragment = TypeScriptに「これはTermFragment型です」と教える
  const currentData = fragmentDoc.data() as TermFragment;
  
  // ステップ1: 現行を versions/{currentVersion} にコピー（バージョン管理）
  // サブコレクション = コレクションの中のコレクション（フォルダの中のフォルダ）
  
  // 現在のデータを履歴として保存
  await addDoc(collection(db, 'termFragments', fragmentId, 'versions'), {
    title: currentData.title,           // 現在のタイトル
    content: currentData.content,       // 現在の内容
    parameters: currentData.parameters, // 現在のパラメータ
    tags: currentData.tags,             // 現在のタグ
    createdAt: currentData.createdAt,   // 元の作成日時
    updatedAt: currentData.updatedAt    // 元の更新日時
  });

  // ステップ2: 親ドキュメント更新 + currentVersion++ + updatedAt 再設定
  await updateDoc(fragmentRef, {
    title,                                        // 新しいタイトル
    content,                                      // 新しい内容
    parameters,                                   // 新しいパラメータ
    tags,                                         // 新しいタグ
    currentVersion: currentData.currentVersion + 1, // バージョン番号を1つ増やす
    updatedAt: serverTimestamp()                  // 更新日時を現在時刻に
  });
}

// 1-3-1. 規約片を参照している規約セットを検索する関数
export async function findReferencingSets(fragmentId: string): Promise<{
  setId: string;        // 規約セットのID
  setTitle?: string;    // 規約セットのタイトル（あれば）
}[]> {
  // collectionGroup = 全ての同名サブコレクションから検索
  // 例：termSets/set1/fragments, termSets/set2/fragments など全てのfragmentsから検索
  const q = query(
    collectionGroup(db, 'fragments'),     // 全ての'fragments'サブコレクションから検索
    where('fragmentId', '==', fragmentId) // 指定のfragmentIdと一致するもの
  );
  
  const querySnapshot = await getDocs(q);  // 検索を実行
  const referencingSets: { setId: string; setTitle?: string }[] = [];  // 結果を格納する配列
  
  // forEach = 配列の各要素に対して処理を実行
  querySnapshot.forEach((doc) => {
    // パスの例：termSets/abc123/fragments/xyz789
    // split('/') = 文字列を'/'で分割して配列にする
    const pathParts = doc.ref.path.split('/');
    const setId = pathParts[1];  // pathParts[1] = 'abc123'（規約セットのID）
    
    referencingSets.push({ setId });  // 配列に追加
  });

  return referencingSets;
}

// 1-3-2. 安全な削除関数（警告付き）
export async function safeDeleteTermFragment(
  fragmentId: string,
  forceDelete: boolean = false  // forceDelete = 強制削除フラグ（デフォルトはfalse）
): Promise<{ 
  success: boolean;     // 削除が成功したかどうか
  referencingSets?: { setId: string; setTitle?: string }[];  // 参照しているセット一覧
  message: string;      // ユーザーに表示するメッセージ
}> {
  
  // まず参照している規約セットを検索
  const referencingSets = await findReferencingSets(fragmentId);
  
  // 参照しているセットがある かつ 強制削除フラグがfalseの場合
  if (referencingSets.length > 0 && !forceDelete) {
    return {
      success: false,   // 削除しない
      referencingSets,  // 参照しているセットの情報を返す
      message: `この規約片は${referencingSets.length}個の規約セットで使用されています。削除を続行しますか？`
    };
  }
  
  // 参照がないか、強制削除の場合は削除実行
  await deleteTermFragment(fragmentId);
  
  return {
    success: true,    // 削除成功
    message: '規約片を削除しました'
  };
}

// 1-3-3. 基本的な削除関数（内部処理用）
export async function deleteTermFragment(fragmentId: string): Promise<void> {
  // termFragments/{fragmentId} を削除
  const fragmentRef = doc(db, 'termFragments', fragmentId);
  await deleteDoc(fragmentRef);  // ドキュメントを完全に削除
}

// 補助関数: 規約片の取得（他の機能でも使用）
export async function getTermFragment(fragmentId: string): Promise<TermFragment | null> {
  // Promise<TermFragment | null> = TermFragment型 または null を返す非同期関数
  const fragmentRef = doc(db, 'termFragments', fragmentId);
  const fragmentDoc = await getDoc(fragmentRef);
  
  if (!fragmentDoc.exists()) {
    return null;  // null = 「何もない」を表す特別な値
  }

  return fragmentDoc.data() as TermFragment;  // 取得したデータを返す
}
