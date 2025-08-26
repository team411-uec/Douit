'use client';

import React, { useState, useEffect } from 'react';
import { TermFragment, TermSet, FragmentRef, UnderstoodRecord, ApiKey } from '../functions/types';
import { searchTermFragments } from '../functions/tagSearch';
import { 
  createTermFragment, 
  getTermFragment, 
  updateTermFragment, 
  deleteTermFragment 
} from '../functions/termFragments';
import {
  createTermSet,
  addFragmentToSet
} from '../functions/termSetService';
import {
  addUnderstoodRecord,
  getUserUnderstoodRecords,
  getUnderstoodFragmentIds
} from '../functions/understandingService';
import { db } from '../functions/firebase';
import { getDocs, collection } from 'firebase/firestore';

export default function TestPage() {
  // State管理
  const [fragments, setFragments] = useState<{id: string, data: TermFragment}[]>([]);
  const [termSets, setTermSets] = useState<{id: string, data: TermSet}[]>([]);
  const [understoodRecords, setUnderstoodRecords] = useState<(UnderstoodRecord & { id: string })[]>([]);
  const [currentUserId, setCurrentUserId] = useState('test-user-001');
  const [searchTag, setSearchTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム用State
  const [fragmentForm, setFragmentForm] = useState({
    title: '',
    content: '',
    parameters: '',
    tags: ''
  });

  const [termSetForm, setTermSetForm] = useState({
    name: '',
    selectedFragments: [] as string[]
  });

  const [apiKey, setApiKey] = useState<string>('');

  // 初期化
  useEffect(() => {
    loadFragments();
    loadUnderstoodRecords();
  }, []);

  // エラーハンドリング用ヘルパー
  const handleError = (error: any, message: string) => {
    setError(`${message}: ${error.message || 'Unknown error'}`);
  };

  // Firebase接続テスト
  const testFirebaseConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 簡単な接続テスト：空のクエリを実行
      const querySnapshot = await getDocs(collection(db, 'test-connection'));
      
      setError('✅ Firebase接続成功！');
    } catch (error) {
      handleError(error, '❌ Firebase接続失敗');
    } finally {
      setLoading(false);
    }
  };

  // 1. 規約片の検索・一覧表示
  const loadFragments = async () => {
    try {
      setLoading(true);
      const results = await searchTermFragments(searchTag);
      setFragments(results);
      setError(null);
    } catch (error) {
      handleError(error, '規約片の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 2. 規約片の作成
  const createFragment = async () => {
    try {
      const parameters = fragmentForm.parameters
        .split(',')
        .map(p => p.trim())
        .filter(p => p);
      const tags = fragmentForm.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

      await createTermFragment(
        fragmentForm.title,
        fragmentForm.content,
        tags,
        parameters
      );

      setFragmentForm({ title: '', content: '', parameters: '', tags: '' });
      await loadFragments();
      setError('✅ 規約片が正常に作成されました！');
    } catch (error) {
      handleError(error, '規約片の作成に失敗しました');
    }
  };

  // 3. 規約片の削除
  const deleteFragment = async (fragmentId: string) => {
    if (!confirm('この規約片を削除しますか？')) return;
    
    try {
      await deleteTermFragment(fragmentId);
      loadFragments();
      setError(null);
    } catch (error) {
      handleError(error, '規約片の削除に失敗しました');
    }
  };

  // 4. 理解記録の読み込み
  const loadUnderstoodRecords = async () => {
    try {
      const records = await getUserUnderstoodRecords(currentUserId);
      setUnderstoodRecords(records);
    } catch (error) {
      handleError(error, '理解記録の読み込みに失敗しました');
    }
  };

  // 5. 理解の記録
  const markAsUnderstood = async (fragmentId: string) => {
    try {
      await addUnderstoodRecord(currentUserId, fragmentId, 1);
      loadUnderstoodRecords();
      setError(null);
    } catch (error) {
      handleError(error, '理解記録の保存に失敗しました');
    }
  };

  // 6. 規約セットの作成
  const createSet = async () => {
    try {
      const termSetId = await createTermSet();
      // 選択されたフラグメントを追加
      for (let i = 0; i < termSetForm.selectedFragments.length; i++) {
        const fragmentId = termSetForm.selectedFragments[i];
        await addFragmentToSet(termSetId, fragmentId, {}, i + 1);
      }
      setTermSetForm({ name: '', selectedFragments: [] });
      setError(null);
      alert(`規約セットが作成されました: ${termSetId}`);
    } catch (error) {
      handleError(error, '規約セットの作成に失敗しました');
    }
  };

  // 7. APIキーの生成（簡易版）
  const generateApiKey = () => {
    const key = 'test-api-key-' + Math.random().toString(36).substr(2, 9);
    setApiKey(key);
  };

  // パラメータの置換プレビュー
  const replaceParameters = (content: string, parameters: string[]) => {
    let result = content;
    parameters.forEach((param, index) => {
      const placeholder = `[${param}]`;
      result = result.replace(new RegExp(`\\[${param}\\]`, 'g'), `<サンプル値${index + 1}>`);
    });
    return result;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Douit テスト用UI</h1>
      
      {error && (
        <div className={`px-4 py-3 rounded mb-4 ${
          error.includes('✅') ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {error}
        </div>
      )}

      {/* Firebase接続テスト */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Firebase接続テスト</h2>
        <button
          onClick={testFirebaseConnection}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? '接続テスト中...' : 'Firebase接続をテスト'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 左側: 規約片管理 */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">1. 規約片の作成</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="タイトル"
                value={fragmentForm.title}
                onChange={(e) => setFragmentForm({...fragmentForm, title: e.target.value})}
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-500"
              />
              <textarea
                placeholder="内容（[パラメータ名]でプレースホルダーを指定）"
                value={fragmentForm.content}
                onChange={(e) => setFragmentForm({...fragmentForm, content: e.target.value})}
                rows={4}
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="パラメータ（カンマ区切り）"
                value={fragmentForm.parameters}
                onChange={(e) => setFragmentForm({...fragmentForm, parameters: e.target.value})}
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="タグ（カンマ区切り）"
                value={fragmentForm.tags}
                onChange={(e) => setFragmentForm({...fragmentForm, tags: e.target.value})}
                className="w-full p-2 border rounded text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={createFragment}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                規約片を作成
              </button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">2. 規約片の検索</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="タグで検索（空の場合は全て表示）"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="flex-1 p-2 border rounded text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={loadFragments}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">3. 規約セットの作成</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  規約片を選択:
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2 bg-white">
                  {fragments.map((fragment) => (
                    <label key={fragment.id} className="flex items-center space-x-2 mb-1">
                      <input
                        type="checkbox"
                        checked={termSetForm.selectedFragments.includes(fragment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTermSetForm({
                              ...termSetForm,
                              selectedFragments: [...termSetForm.selectedFragments, fragment.id]
                            });
                          } else {
                            setTermSetForm({
                              ...termSetForm,
                              selectedFragments: termSetForm.selectedFragments.filter(id => id !== fragment.id)
                            });
                          }
                        }}
                      />
                      <span className="text-sm text-gray-800">{fragment.data.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={createSet}
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
              >
                規約セットを作成
              </button>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">4. APIキー生成（簡易版）</h2>
            <div className="space-y-3">
              <button
                onClick={generateApiKey}
                className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
              >
                APIキーを生成
              </button>
              {apiKey && (
                <div className="p-2 bg-gray-100 rounded font-mono text-sm">
                  {apiKey}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右側: 規約片一覧と理解記録 */}
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              規約片一覧 ({fragments.length}件)
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {fragments.map((fragment) => {
                const isUnderstood = understoodRecords.some(
                  record => record.fragmentId === fragment.id
                );
                
                return (
                  <div
                    key={fragment.id}
                    className={`p-4 border-2 rounded-lg ${
                      isUnderstood ? 'bg-green-100 border-green-300' : 'bg-white border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{fragment.data.title}</h3>
                      <div className="flex gap-2">
                        {!isUnderstood && (
                          <button
                            onClick={() => markAsUnderstood(fragment.id)}
                            className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                          >
                            理解済み
                          </button>
                        )}
                        <button
                          onClick={() => deleteFragment(fragment.id)}
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-800 mb-2">
                      {replaceParameters(fragment.data.content, fragment.data.parameters)}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {fragment.data.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {fragment.data.parameters.length > 0 && (
                      <div className="text-xs text-gray-700">
                        パラメータ: {fragment.data.parameters.join(', ')}
                      </div>
                    )}
                    
                    {isUnderstood && (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ 理解済み
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-green-50 border border-green-300 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              理解済み規約片 ({understoodRecords.length}件)
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {understoodRecords.map((record, index) => {
                const fragment = fragments.find(f => f.id === record.fragmentId);
                return (
                  <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="font-medium text-gray-900">
                      {fragment?.data.title || `Fragment ID: ${record.fragmentId}`}
                    </div>
                    <div className="text-gray-800 text-xs">
                      理解日時: {record.understoodAt instanceof Date 
                        ? record.understoodAt.toLocaleString()
                        : new Date((record.understoodAt as any).seconds * 1000).toLocaleString()
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">ユーザー情報</h2>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-900">現在のユーザーID:</span> 
                <span className="text-gray-800">{currentUserId}</span>
              </div>
              <input
                type="text"
                placeholder="ユーザーIDを変更"
                value={currentUserId}
                onChange={(e) => setCurrentUserId(e.target.value)}
                className="w-full p-2 border rounded text-sm text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={loadUnderstoodRecords}
                className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 text-sm"
              >
                ユーザーデータを再読み込み
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
