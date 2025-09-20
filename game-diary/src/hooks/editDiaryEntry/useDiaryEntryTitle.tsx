'use client';
import {
  ICurrentDiaryEntryAccessor,
  IEditDiaryEntry,
} from '@/control/controlDiaryEntry/controlDiaryEntryInterface';
import { useCallback, useEffect, useState } from 'react';
import { container } from 'tsyringe';

/**
 * 日記エントリーのタイトルを管理するカスタムフックです。
 *
 * @returns {Object}
 *  isReady: 初期化完了フラグ,
 *  title: 現在のタイトル,
 *  updateTitle: タイトル更新関数,
 *  refreshTitle: タイトル再取得関数
 */
const useDiaryEntryTitle = () => {
  const [title, setTitle] = useState<string>('');
  const [currentDiaryEntry, setCurrentDiaryEntryAccessor] =
    useState<ICurrentDiaryEntryAccessor>();
  const [editDiaryEntry, setEditDiaryEntry] = useState<IEditDiaryEntry>();
  const [isReady, setIsReady] = useState(false);

  const refreshTitle = useCallback(() => {
    if (currentDiaryEntry === undefined) {
      return;
    }
    const newTitle = currentDiaryEntry.getCurrentDiaryEntry().getTitle();
    setTitle(newTitle);
  }, [currentDiaryEntry]);

  /**
   * タイトルを更新する関数
   *
   * @param {string} title 新しいタイトル
   * @description
   * editDiaryEntryインスタンスを使用してタイトルを編集し、編集後にrefreshTitle関数でタイトルを再取得します。
   */
  const updateTitle = useCallback(
    (title: string) => {
      if (editDiaryEntry === undefined || refreshTitle === undefined) {
        return;
      }
      editDiaryEntry.editTitle(title);
      refreshTitle();
    },
    [editDiaryEntry, refreshTitle]
  );

  /**
   * @description
   * Reactの副作用フックです。コンテナから依存性（ICurrentDiaryEntryAccessor, IEditDiaryEntry）を取得し、状態を初期化します。
   * また、初期化完了後にタイトルを再取得します。
   * この副作用はコンポーネントのマウント時に一度だけ実行されます。
   *
   * @returns {void}
   */
  useEffect(() => {
    setCurrentDiaryEntryAccessor(
      container.resolve<ICurrentDiaryEntryAccessor>(
        'ICurrentDiaryEntryAccessor'
      )
    );
    setEditDiaryEntry(container.resolve<IEditDiaryEntry>('IEditDiaryEntry'));
    setIsReady(true);
    //titleを初期化
    refreshTitle();
  }, []);

  if (!isReady || updateTitle === undefined || refreshTitle === undefined) {
    /**
     * @returns {Object}
     * @property {boolean} isReady 初期化が完了しているかどうかを示すフラグです。
     * @property {string} title 現在の日記エントリーのタイトルです。
     * @property {(title: string) => void} updateTitle タイトルを更新する関数です。
     * @property {() => void} refreshTitle タイトルを再取得する関数です。
     */
    return {
      isReady: false, // 初期化が完了していない場合はfalse
      title: '', // タイトルは空文字
      updateTitle: (_: string) => {}, // ダミーの更新関数
      refreshTitle: () => {}, // ダミーの再取得関数
    };
  }
  /**
   * @returns {Object}
   * @property {boolean} isReady 初期化が完了しているかどうかを示すフラグです。
   * @property {string} title 現在の日記エントリーのタイトルです。
   * @property {(title: string) => void} updateTitle タイトルを更新する関数です。
   * @property {() => void} refreshTitle タイトルを再取得する関数です。
   */
  return { isReady, title, updateTitle, refreshTitle };
};

export default useDiaryEntryTitle;
