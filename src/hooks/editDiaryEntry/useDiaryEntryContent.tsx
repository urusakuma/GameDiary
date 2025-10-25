'use client';
import {
  ICurrentDiaryEntryAccessor,
  IEditDiaryEntry,
} from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useState, useEffect, useCallback } from 'react';
import { container } from 'tsyringe';

/**
 * 日記エントリーの内容を管理・編集するためのカスタムフックです。
 * @description
 * このフックは、現在編集中の日記エントリーの内容を取得・更新する機能を提供します。
 * 依存性注入コンテナから現在の日記エントリーアクセサと編集用インターフェースを取得し、
 * 内容の取得・編集・リフレッシュを行うための関数や状態を返します。
 * isReadyフラグで初期化完了を判定し、未準備時にはダミー関数を返します。
 *
 * @returns {object} isReady: 初期化完了フラグ, content: 現在の内容, updateContent: 内容更新関数, refreshContent: 内容再取得関数
 */
const useDiaryEntryContent = () => {
  const [content, setContent] = useState<string>('');
  const [currentDiaryEntry, setCurrentDiaryEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  const [editDiaryEntry, setEditDiaryEntry] = useState<IEditDiaryEntry>();
  const [isReady, setIsReady] = useState(false);
  /**
   * @function refreshContent
   * @description
   * 現在選択されている日記エントリーの内容を取得し、contentステートを更新します。
   * currentDiaryEntryが未定義の場合は何も行いません。
   * 引数や戻り値はありません。
   */
  const refreshContent = useCallback(() => {
    if (currentDiaryEntry === undefined) {
      return;
    }
    const newContent = currentDiaryEntry.getCurrentDiaryEntry().getContent();
    setContent(newContent);
  }, [currentDiaryEntry]);
  /**
   * 日記エントリーの内容を更新する関数です。
   * @description
   * 引数で受け取った新しい内容を現在編集中の日記エントリーに反映し、
   * 内容の更新後に最新の内容を再取得します。
   *
   * @param {string} content 新しい日記エントリーの内容
   * @returns {void} なし
   */
  const updateContent = useCallback(
    (content: string) => {
      if (editDiaryEntry === undefined || refreshContent === undefined) {
        return;
      }
      editDiaryEntry.editContent(content);
      refreshContent();
    },
    [editDiaryEntry, refreshContent]
  );
  /**
   * @function useEffect
   * @description
   * 依存性注入コンテナから現在の日記エントリーアクセサと編集用インターフェースを取得し、<br/>
   * ステートにセットします。<br/>
   * また、初期化完了フラグ(isReady)をtrueに設定し、contentの初期化も行います。
   * この副作用はコンポーネントのマウント時に一度だけ実行されます。
   */
  useEffect(() => {
    setCurrentDiaryEntryAccessor(
      container.resolve<ICurrentDiaryEntryAccessor>(
        'ICurrentDiaryEntryAccessor'
      )
    );
    setEditDiaryEntry(container.resolve<IEditDiaryEntry>('IEditDiaryEntry'));
    setIsReady(true);
    //contentを初期化
    refreshContent();
  }, []);
  if (!isReady || updateContent === undefined || refreshContent === undefined) {
    return {
      isReady: false,
      content: '',
      updateContent: (_: string) => {},
      refreshContent: () => {},
    };
  }
  return {
    isReady,
    content,
    updateContent,
    refreshContent,
  };
};

export default useDiaryEntryContent;
