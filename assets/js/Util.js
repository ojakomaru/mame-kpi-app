/**
 * 汎用関数クラス
 */
export default class Util {
  /**
   * 指定した時間だけ待つ（未指定の場合は1秒）
   * @param {int} wait 処理を遅らせるミリ秒
   * @returns Promiseオブジェクト
   */
  static sleep = (wait = 1000) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), wait);
    });
  };

  /**
   * イベントハンドラの追加、削除
   * @param {String} selector HTMLセレクターを指定
   * @param {function} handler イベントハンドラ
   * @param {String} event 作動するトリガー（デフォルトはクリック）
   * @param {boolean} isCancel イベント登録を削除するフラグ。デフォルトはfalse
   * @return {void}
   */
  static EventListener = (
    selector,
    handler,
    event = "click",
    isCancel = false
  ) => {
    if (!isCancel) {
      //イベントを設定
      document
        .querySelectorAll(selector)
        .forEach((el) => el.addEventListener(event, handler));
    } else {
      //イベントをキャンセルする場合
      document
        .querySelectorAll(selector)
        .forEach((el) => el.removeEventListener(event, handler));
    }
  };

  /**
   * いろんな型を真偽値で返す
   * @param {*} str 判定する文字列
   * @returns boolean型の真偽値
   */
  static convertStrToBool = (str) => {
    if (typeof str != "string") {
      return Boolean(str);
    }
    try {
      var obj = JSON.parse(str.toLowerCase());
      return obj == true;
    } catch (e) {
      return str != "";
    }
  };
}