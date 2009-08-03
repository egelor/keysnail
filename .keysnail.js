// ==================== KeySnail 0.1.0 configuration file ==================== //

// -------------------- How to bind function to the key -------------------- //
//
// key.setGlobalKey(keys, func, ksDescription, ksNoRepeat);
// key.setEditKey(keys, func, ksDescription, ksNoRepeat);
// key.setViewKey(keys, func, ksDescription, ksNoRepeat);
//
// keys          => キー (文字列) か キーシーケンス (文字列の配列) を指定する
//                  キーの表記は Emacs のそれを踏襲
//                  ex1) Ctrl + Alt + t : C-M-t
//                  ex2) Arrow Key      : <up>, <down>, <left>, <right>
//                  ex3) PgUp, PgDn     : <prior>, <next>
//                  ex4) F1, F2, F3     : <f1>, <f2>, <f3>
//
// func          => 無名関数を指定する. この関数は二つの引数を取ることが出来る
//                     * 第一引数 => キーイベント
//                     * 第二引数 =>前置引数 (無ければ null)
//                  のようになっている.
//                  必要な場合は function (aEvent, aArg) のようにして
//                  これら二つの引数を関数中から使うことが出来る.
//
// ksDescription => 関数の説明. 省略可能. <help>
//
// ksNoRepeat    => false なら 前置引数が与えられた時にコマンドを繰り返す
//                  これは func 内で独自に前置引数を扱いたい場合に,
//                  勝手にコマンドが繰り返されるのを防ぐ為に使用する.
//                  省略可能.
//
// key.defineKey(keyMapName, keys, func, ksDescription, ksNoRepeat);
//
// keyMapName    => 現在のところ "global", "view", "edit" の三つが指定可能

// フックの説明
// プログラムの各所には「フック」というものが設けられており, ユーザはここに任意の
// 関数を割り当てることが可能.
// 例えば C-g が入力された時には KeyBoardQuit というフックに登録された
// 関数が呼ばれる.
// ユーザはここに「検索のキャンセル」、「選択の解除」といった関数を登録することができ,
// より高い拡張性を実現している.

// @scope KeySnail.modules

// ==================== misc settings ==================== //
// 特殊キーの設定.
// key.quitKey : キーシーケンス入力のキャンセルに用いられる.
//               KeyBoardQuit フックを呼ぶので, 検索バーを閉じる等の動作をそこに登録しておくことも出来る.

// key.helpKey : インタラクティヴヘルプの表示, 汎用のヘルプキーとして働く.
//               例えば C-c C-c <helpKey> と入力すると, C-c C-c から始まるキーバインド一覧が表示される.
//               またこの初期化ファイルの設定では <helpKey> b とすればキーバインド一覧が表示されるようになっている.

// key.quitKey = "C-g";
// key.helpKey = "<f1>";

// key.isControlKey = function (aEvent) {
//     return aEvent.ctrlKey;
// };

// key.isMetaKey = function (aEvent) {
//     return aEvent.altKey || aEvent.commandKey;
// };

// ==================== short cut ==================== //
// エディットモード中からでもビューモードのキーバインドを使えるように
// エディットモードで C-z を入力するとビューモードのキーバインドが使える
key.keyMapHolder["edit"]["C-z"] = key.keyMapHolder["view"];

// ==================== access key ==================== //
// Mac ユーザで Ctrl キーを使いたい場合はアンコメント.
// nsPreferences.setIntPref("ui.key.generalAccessKey", 0);

// ==================== set hooks ==================== //

hook.setHook("KeyBoardQuit",
            function (aEvent) {
                // 検索バーが開いていたら閉じる
                command.gFindBar.close();
                if (util.isWritable()) {
                    // 編集エリアならマークをリセット
                    command.resetMark(aEvent);
                } else {
                    // ビューモードなら選択を解除 & 汎用的なキャンセルイベントを生成
                    goDoCommand('cmd_selectNone');
                    key.generateKey(aEvent.target,
                                    KeyEvent.DOM_VK_ESCAPE, true);
                }
                if (util.isMenu()) {
                    // 補間メニュー内ならポップアップなどを閉じる
                    key.generateKey(aEvent.originalTarget,
                                    KeyEvent.DOM_VK_ESCAPE, true);
                }
            });

key.setGlobalKey("C-M-i",
                 function (aEvent) {
                     util.listProperty(aEvent.target);
                 },
                 "調査");

key.setGlobalKey("C-M-I",
                 function (aEvent) {
                     util.listProperty(aEvent.originalTarget);
                 },
                 "調査");

// ==================== set global keys ==================== //

key.setGlobalKey("C-M-r",
                 function () { userscript.load(); },
                 "設定ファイルを再読み込み");

// -------------------- help command -------------------- //

key.setGlobalKey([key.helpKey, "b"], function () {
                     key.listKeyBindings();
                 }, "キーバインド一覧を表示");

key.setGlobalKey([key.helpKey, "F"], function (aEvent) {
                     openHelpLink('firefox-help');
                 }, "Firefox のヘルプを表示");

// -------------------- misc -------------------- //

key.setGlobalKey("C-t", function () {
                     document.getElementById("cmd_newNavigatorTab").doCommand();
                 }, "タブを開く");

key.setGlobalKey(["C-x", "j"], function (aEvent) {
                     hah.enterStartKey(aEvent);
                 }, "LoL を開始");

key.setGlobalKey("C-m", function (aEvent) {
                     key.generateKey(aEvent.originalTarget,
                                     KeyEvent.DOM_VK_RETURN, true);
                 },
                 "リターンコードを生成");

key.setGlobalKey("C-j",
                 function (aEvent, arg) {
                     command.bookMarkToolBarJumpTo(aEvent, arg);
                 },
                 "ブックマークツールバーのアイテムを開く", true);

// -------------------- useful focus -------------------- //

key.setGlobalKey(["C-x", "l"],
                 function () {
                     command.focusToById('urlbar');
                 },
                 "ロケーションバーへフォーカス", true);

key.setGlobalKey(["C-x", "g"],
                 function () {
                     command.focusToById('searchbar');
                 },
                 "検索バーへフォーカス", true);

key.setGlobalKey(["C-x", "t"],
                 function () {
                     command.focusElement(command.elementsRetrieverTextarea, 0);
                 },
                 "最初のインプットエリアへフォーカス", true);

key.setGlobalKey(["C-x", "s"],
                 function () {
                     command.focusElement(command.elementsRetrieverButton, 0);
                 },
                 "最初のボタンへフォーカス", true);

// -------------------- copy -------------------- //

key.setGlobalKey("M-w",
                 function (aEvent) {
                     command.copyRegion(aEvent);
                 },
                 "コピー");

// -------------------- search -------------------- //

key.setGlobalKey("C-s", function () {
                     command.iSearchForward();
                 },
                 "インクリメンタル検索");

key.setGlobalKey("C-r", function () {
                     command.iSearchBackward();
                 }, "逆方向インクリメンタル検索");

// -------------------- window --------------------
key.setGlobalKey(["C-x", "k"],
                 function () { BrowserCloseTabOrWindow(); },
                 "タブ / ウィンドウを閉じる");

key.setGlobalKey(["C-x", "K"],
                 function () { closeWindow(true); },
                 "ウィンドウを閉じる");

key.setGlobalKey(["C-x", "n"],
                 function () { OpenBrowserWindow(); },
                 " ウィンドウを開く");

key.setGlobalKey(["C-x", "C-c"],
                 function () { goQuitApplication(); },
                 "Firefox を終了");
key.setGlobalKey(["C-x", "o"],
                 function (aEvent, aArg) {
                     rc.focusOtherFrame(aArg);
                 },
                 "次のフレームを選択");

// -------------------- tab --------------------
key.setGlobalKey(["C-c", "C-t", "l"],
                 function () { gBrowser.mTabContainer.advanceSelectedTab(1, true); },
                 "ひとつ右のタブへ");
key.setGlobalKey(["C-c", "C-t", "h"],
                 function () { gBrowser.mTabContainer.advanceSelectedTab(-1, true); },
                 "ひとつ左のタブへ");
key.setGlobalKey(["C-c", "C-t", "u"],
                 function () { undoCloseTab(); },
                 "閉じたタブを元に戻す");

// -------------------- console --------------------
key.setGlobalKey(["C-c", "C-c", "C-v"],
                 function () { toJavaScriptConsole(); },
                 "Javascript コンソールを表示");
key.setGlobalKey(["C-c", "C-c", "C-c"],
                 function () {
                     command.clearConsole();
                 },
                 "Javascript コンソールの表示をクリア");

key.setGlobalKey(["C-c", "i"],
                 function () { BrowserPageInfo(); },
                 "ページ情報表示");

// -------------------- file --------------------
key.setGlobalKey(["C-x", "C-w"],
                 function () { saveDocument(window.content.document); },
                 "ファイルを保存");
key.setGlobalKey(["C-x", "C-f"],
                 function () { BrowserOpenFileWindow(); },
                 "ファイルを開く");

// ==================== set view mode keys ==================== //

// -------------------- scroll --------------------
key.setViewKey("C-n", function (aEvent) {
                   key.generateKey(aEvent.originalTarget,
                                   KeyEvent.DOM_VK_DOWN, true);
                   // goDoCommand('cmd_scrollLineDown');
               },
               "一行スクロールダウン");
key.setViewKey("C-p", function (aEvent) {
                   key.generateKey(aEvent.originalTarget,
                                   KeyEvent.DOM_VK_UP, true);
                   // goDoCommand('cmd_scrollLineUp');
               },
               "一行スクロールアップ");
key.setViewKey("C-f", function (aEvent) {
                   key.generateKey(aEvent.originalTarget,
                                   KeyEvent.DOM_VK_RIGHT, true);
               },
               "右へスクロール");
key.setViewKey("C-b", function (aEvent) {
                   key.generateKey(aEvent.originalTarget,
                                   KeyEvent.DOM_VK_LEFT, true);
               },
               "左へスクロール");

key.setViewKey("j", function () { goDoCommand('cmd_scrollLineDown'); },
               "一行スクロールダウン");
key.setViewKey("k", function () { goDoCommand('cmd_scrollLineUp'); },
               "一行スクロールアップ");

key.setViewKey(">", function () { goDoCommand('cmd_scrollRight'); },
               "右へスクロール");
key.setViewKey("<", function () { goDoCommand('cmd_scrollLeft'); },
               "左へスクロール");
key.setViewKey(".", function () { goDoCommand('cmd_scrollRight'); },
               "右へスクロール");
key.setViewKey(",", function () { goDoCommand('cmd_scrollLeft'); },
               "左へスクロール");

key.setViewKey("b", function () { goDoCommand('cmd_scrollPageUp'); },
               "一画面分スクロールアップ");
key.setViewKey("C-v",
               function () { goDoCommand('cmd_scrollPageDown'); },
               "一画面スクロールダウン");
key.setViewKey("M-v",
               function () { goDoCommand('cmd_scrollPageUp'); },
               "一画面スクロールアップ");

key.setViewKey("g", function () { goDoCommand('cmd_scrollTop'); },
               "ページ先頭へ移動");
key.setViewKey("G", function () { goDoCommand('cmd_scrollBottom'); },
               "ページ末尾へ移動");

key.setViewKey("M-<",
               function () { goDoCommand('cmd_scrollTop'); },
               "ページ先頭へ移動");
key.setViewKey("M->",
               function () { goDoCommand('cmd_scrollBottom'); },
               "ページ末尾へ移動");

// -------------------- navigation --------------------
key.setViewKey("R", function (aEvent) { BrowserReload(); },
               "更新");
key.setViewKey("B", function (aEvent) { BrowserBack(); },
               "戻る");
key.setViewKey("F", function (aEvent) { BrowserForward(); },
               "進む");

// -------------------- tab --------------------
key.setViewKey("l", function () { gBrowser.mTabContainer.advanceSelectedTab(1, true); },
               "ひとつ右のタブへ");
key.setViewKey("h", function () { gBrowser.mTabContainer.advanceSelectedTab(-1, true); },
               "ひとつ左のタブへ");

// -------------------- text --------------------
key.setViewKey(["C-x", "h"],
               function () { goDoCommand('cmd_selectAll'); },
               "すべて選択");

// ==================== set edit mode key ==================== //

key.setEditKey("C-SPC",
               function (aEvent) {
                   command.setMark(aEvent);
               },
               "マークをセット");

key.setEditKey("C-@",
               function (aEvent) {
                   command.setMark(aEvent);
               },
               "マークをセット");

key.setEditKey("C-o",
               function (aEvent) {
                   command.openLine(aEvent);
               },
               "行を開く (open line)");

// -------------------- undo --------------------

key.setEditKey(["C-x", "u"],
               function () { goDoCommand('cmd_undo'); },
               "アンドゥ");
key.setEditKey("C-_",
               function () { goDoCommand('cmd_undo'); },
               "アンドゥ");

// -------------------- cursor navigation --------------------

// -------------------- inner line --------------------

key.setEditKey("C-a",
               function (aEvent) { command.beginLine(aEvent); },
               "行頭へ移動");
key.setEditKey("C-e",
               function (aEvent) { command.endLine(aEvent); },
               "行末へ");

key.setEditKey("C-f",
               function (aEvent) { command.nextChar(aEvent); },
               "一文字右へ移動");
key.setEditKey("C-b",
               function (aEvent) { command.previousChar(aEvent); },
               "一文字左へ移動");

key.setEditKey("M-f",
               function (aEvent) { command.nextWord(aEvent); },
               "一単語右へ移動");
key.setEditKey("M-b",
               function (aEvent) { command.previousWord(aEvent); },
               "一単語左へ移動");

// -------------------- by line --------------------

key.setEditKey("C-n",
               function (aEvent) { command.nextLine(aEvent); },
               "一行下へ");
key.setEditKey("C-p",
               function (aEvent) { command.previousLine(aEvent); },
               "一行上へ");

// -------------------- by page --------------------

key.setEditKey("C-v",
               function (aEvent) { command.pageDown(aEvent); },
               "一画面分下へ");
key.setEditKey("M-v",
               function (aEvent) { command.pageUp(aEvent); },
               "一画面分上へ");

// -------------------- absolute --------------------

key.setEditKey("M-<",
               function (aEvent) { command.moveTop(aEvent); },
               "テキストエリア先頭へ");
key.setEditKey("M->",
               function (aEvent) { command.moveBottom(aEvent); },
               "テキストエリア末尾へ");

// -------------------- delete --------------------

key.setEditKey("C-d",
               function () {
                   goDoCommand("cmd_deleteCharForward");
               },
               "次の一文字削除");
key.setEditKey("C-h",
               function () {
                   goDoCommand("cmd_deleteCharBackward");
               },
               "前の一文字を削除");
key.setEditKey("M-d",
               function () {
                   goDoCommand('cmd_deleteWordForward');
               },
               "前の一単語を削除");

// -------------------- cut / paste --------------------

key.setEditKey("C-k",
               function (aEvent) {
                   command.killLine(aEvent);
               },
               "カーソルから先を一行カット");
key.setEditKey("C-y",
               function () { goDoCommand("cmd_paste"); },
               "ペースト");

key.setEditKey("C-w",
               function (aEvent) {
                   goDoCommand('cmd_copy');
                   goDoCommand("cmd_delete");
                   command.resetMark(aEvent);
               },
               "リージョンをカット");

// -------------------- selection -------------------- //
key.setEditKey(["C-x", "h"],
                 function (aEvent) {
                     command.selectAll(aEvent);
                 },
                 "全て選択");

// -------------------- walk through elements -------------------- //

key.setEditKey("M-n", function () {
                   command.walkInputElement(command.elementsRetrieverTextarea, true, true);
               }, "次のテキストエリアへフォーカス");

key.setEditKey("M-p", function () {
                   command.walkInputElement(command.elementsRetrieverTextarea, false, true);
               }, "前のテキストエリアへフォーカス");

key.setViewKey("M-n", function () {
                   command.walkInputElement(command.elementsRetrieverButton, true, true);
               }, "次のボタンへフォーカス");

key.setViewKey("M-p", function () {
                   command.walkInputElement(command.elementsRetrieverButton, false, true);
               }, "前のボタンへフォーカス");

// ==================== caret mode (press F7 to enter) ==================== //

// copy view mode keymap to caret mode keymap
key.copy("view", "caret");

// remap h and l
key.setCaretKey("h", function () {
                    goDoCommand('cmd_scrollLeft');
                }, "scroll left");

key.setCaretKey("l", function () {
                    goDoCommand('cmd_scrollRight');
                }, "scroll right");

// ==================== Define your function (if needed) ==================== //
// 以下のようにしてモジュールを作成して関数を定義することが出来ます.
// ここでは RC という名前になっていますが, 他のモジュールと被らない範囲であれば
// 自由につけてしまって構いません.
// あらかじめ予約された名前空間は現在のところ
// Command, Display, Hook, HTML, Key, Util, Prompt, UserScript
// となっています.
// モジュールへのアクセスは「小文字にしたモジュール名」で行います.
// RC なら rc.hoge といった具合です.

KeySnail.RC = {
    init: function () {
    },

    // Very inspired from functions for keyconfig
    // http://www.pqrs.org/tekezo/firefox/extensions/functions_for_keyconfig/
    focusOtherFrame: function (aArg) {
        var focused = this.getFocusedWindow();
        var topFrameWindow = this.getTopFrameWindow();

        if (!focused) {
            focused = this.topFrameWindow();
        }

        // frame
        var currentframeindex = -1;
        var frameWindows = this.getListFrameWindow(topFrameWindow);
        for (var i = 0; i < frameWindows.length; ++i) {
            if (frameWindows[i] == focused) {
                currentframeindex = i;
                break;
            }
        }

        var focusTo = aArg ?
            currentframeindex - 1 : currentframeindex + 1;
        if (focusTo >= frameWindows.length) {
            focusTo = 0;
        } else if (focusTo < 0) {
            focusTo = frameWindows.length - 1;
        }

        // set focus
        var nextFrameWindow = frameWindows[focusTo];
        if (nextFrameWindow) {
            nextFrameWindow.focus();
            return;
        }
    },

    isFrameSetWindow: function (frameWindow) {
        if (!frameWindow) {
            return false;
        }

        var listElem = frameWindow.document.documentElement
            .getElementsByTagName('frameset');

        return (listElem && listElem.length > 0);
    },

    getListFrameWindow: function (baseWindow) {
        var listFrameWindow = [];

        if (this.isFrameSetWindow(baseWindow)) {
            var frameWindows = baseWindow.frames;

            for (var i = 0; i < frameWindows.length; ++i) {
                if (this.isFrameSetWindow(frameWindows[i])) {
                    var childWindows = this.getListFrameWindow(frameWindows[i]);
                    // 子フレームをくっつける
                    listFrameWindow = listFrameWindow.concat(childWindows);
                } else {
                    listFrameWindow.push(frameWindows[i]);
                }
            }
        }

        return listFrameWindow;
    },

    getTopFrameWindow: function () {
        return gBrowser.contentWindow;
    },

    getFocusedWindow: function () {
        var focused = document.commandDispatcher.focusedWindow;
        if (!focused) {
            focused = null;
        }

        return focused;
    }
};

// モジュールを登録
KeySnail.registerModule("RC");
// モジュールを初期化 (init メソッドが呼ばれる)
KeySnail.initModule("RC");