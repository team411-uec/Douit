import { useState, useEffect, useCallback } from "react";
import { TermFragment, UnderstoodRecord } from "@/types";
import { searchTermFragments } from "@/functions/tagSearch";
import { createTermFragment, deleteTermFragment } from "@/functions/termFragments";
import { createTermSet, addFragmentToSet } from "@/functions/termSetService";
import { addUnderstoodRecord, getUserUnderstoodRecords } from "@/functions/understandingService";
import { db } from "@/functions/firebase";
import { getDocs, collection } from "firebase/firestore";

interface FragmentFormData {
  title: string;
  content: string;
  parameters: string;
  tags: string;
}

interface TermSetFormData {
  name: string;
  selectedFragments: string[];
}

interface UseFragmentTestingReturn {
  // データ
  fragments: { id: string; data: TermFragment }[];
  understoodRecords: (UnderstoodRecord & { id: string })[];

  // UI状態
  currentUserId: string;
  searchTag: string;
  loading: boolean;
  error: string | null;

  // フォーム状態
  fragmentForm: FragmentFormData;
  termSetForm: TermSetFormData;
  apiKey: string;

  // アクション
  setCurrentUserId: (userId: string) => void;
  setSearchTag: (tag: string) => void;
  setApiKey: (key: string) => void;
  updateFragmentForm: (field: keyof FragmentFormData, value: string) => void;
  updateTermSetForm: (field: keyof TermSetFormData, value: string | string[]) => void;

  // API操作
  testFirebaseConnection: () => Promise<void>;
  loadFragments: () => Promise<void>;
  loadUnderstoodRecords: () => Promise<void>;
  createFragment: () => Promise<void>;
  deleteFragment: (fragmentId: string) => Promise<void>;
  createTermSetWithFragments: () => Promise<void>;
  addUnderstandingRecord: (fragmentId: string) => Promise<void>;
}

export function useFragmentTesting(): UseFragmentTestingReturn {
  // データ状態
  const [fragments, setFragments] = useState<{ id: string; data: TermFragment }[]>([]);
  const [understoodRecords, setUnderstoodRecords] = useState<(UnderstoodRecord & { id: string })[]>(
    []
  );

  // UI状態
  const [currentUserId, setCurrentUserId] = useState("test-user-001");
  const [searchTag, setSearchTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム状態
  const [fragmentForm, setFragmentForm] = useState<FragmentFormData>({
    title: "",
    content: "",
    parameters: "",
    tags: "",
  });

  const [termSetForm, setTermSetForm] = useState<TermSetFormData>({
    name: "",
    selectedFragments: [],
  });

  const [apiKey, setApiKey] = useState<string>("");

  // フォーム更新ヘルパー
  const updateFragmentForm = useCallback((field: keyof FragmentFormData, value: string) => {
    setFragmentForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateTermSetForm = useCallback(
    (field: keyof TermSetFormData, value: string | string[]) => {
      setTermSetForm(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  // エラーハンドリング用ヘルパー
  const handleError = useCallback((error: unknown, message: string) => {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    setError(`${message}: ${errorMessage}`);
  }, []);

  // Firebase接続テスト
  const testFirebaseConnection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await getDocs(collection(db, "test-connection"));
      setError("✅ Firebase接続成功！");
    } catch (error) {
      handleError(error, "❌ Firebase接続失敗");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // 規約片の読み込み
  const loadFragments = useCallback(async () => {
    try {
      setLoading(true);
      const results = await searchTermFragments(searchTag);
      setFragments(results);
      setError(null);
    } catch (error) {
      handleError(error, "規約片の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, [searchTag, handleError]);

  // 理解記録の読み込み
  const loadUnderstoodRecords = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUserUnderstoodRecords(currentUserId);
      if (result.success && result.data) {
        setUnderstoodRecords(result.data);
        setError(null);
      } else {
        throw new Error(result.error || "理解記録の読み込みに失敗しました");
      }
    } catch (error) {
      handleError(error, "理解記録の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, handleError]);

  // 規約片作成
  const createFragment = useCallback(async () => {
    try {
      setLoading(true);
      const parametersArray = fragmentForm.parameters
        ? fragmentForm.parameters.split(",").map(p => p.trim())
        : [];
      const tagsArray = fragmentForm.tags ? fragmentForm.tags.split(",").map(t => t.trim()) : [];

      await createTermFragment(
        fragmentForm.title,
        fragmentForm.content,
        tagsArray,
        parametersArray
      );

      setFragmentForm({
        title: "",
        content: "",
        parameters: "",
        tags: "",
      });
      await loadFragments();
      setError("✅ 規約片が作成されました");
    } catch (error) {
      handleError(error, "規約片の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [fragmentForm, loadFragments, handleError]);

  // 規約片削除
  const deleteFragment = useCallback(
    async (fragmentId: string) => {
      try {
        setLoading(true);
        await deleteTermFragment(fragmentId);
        await loadFragments();
        setError("✅ 規約片が削除されました");
      } catch (error) {
        handleError(error, "規約片の削除に失敗しました");
      } finally {
        setLoading(false);
      }
    },
    [loadFragments, handleError]
  );

  // 利用規約セット作成
  const createTermSetWithFragments = useCallback(async () => {
    try {
      setLoading(true);
      const termSetResult = await createTermSet();

      if (!termSetResult.success || !termSetResult.data) {
        throw new Error(termSetResult.error || "規約セットの作成に失敗しました");
      }

      const termSetId = termSetResult.data;

      for (const fragmentId of termSetForm.selectedFragments) {
        if (fragmentId) {
          await addFragmentToSet(termSetId, fragmentId, {});
        }
      }

      setTermSetForm({
        name: "",
        selectedFragments: [],
      });
      setError("✅ 利用規約セットが作成されました");
    } catch (error) {
      handleError(error, "利用規約セットの作成に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, termSetForm, handleError]);

  // 理解記録追加
  const addUnderstandingRecord = useCallback(
    async (fragmentId: string) => {
      try {
        setLoading(true);
        await addUnderstoodRecord(currentUserId, fragmentId, 1);
        await loadUnderstoodRecords();
        setError("✅ 理解記録が追加されました");
      } catch (error) {
        handleError(error, "理解記録の追加に失敗しました");
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, loadUnderstoodRecords, handleError]
  );

  // 初期化
  useEffect(() => {
    loadFragments();
    loadUnderstoodRecords();
  }, [loadFragments, loadUnderstoodRecords]);

  return {
    // データ
    fragments,
    understoodRecords,

    // UI状態
    currentUserId,
    searchTag,
    loading,
    error,

    // フォーム状態
    fragmentForm,
    termSetForm,
    apiKey,

    // 設定
    setCurrentUserId,
    setSearchTag,
    setApiKey,
    updateFragmentForm,
    updateTermSetForm,

    // API操作
    testFirebaseConnection,
    loadFragments,
    loadUnderstoodRecords,
    createFragment,
    deleteFragment,
    createTermSetWithFragments,
    addUnderstandingRecord,
  };
}
