export default class ProgressCalcLogic {
  #startDate;
  #results;
  constructor(results, startDate) {
    this.#results = results;
    this.#startDate = startDate;
  }

  /**
   * 今日の日付を返す
   * @returns {String} 形式（YYYY-MM-DD）月日は0埋め
   */
  today() {
    let date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formatToday = `${year}-${month}-${day}`;
    return formatToday;
  }

  /**
   * 日付を任意のフォーマットで返す
   * @param {Object} date 基準となるDateオブジェクト
   * @param {String} format 改変する場合のフォーマット。ResultSetの値と比較するためフロントに表示する時のみ変更するようにする。
   * @returns {String} フォーマットされた日付
   */
  dateFormat(date, format = "YYYY-MM-DD") {
    // フォーマット文字列内のキーワードを日付に置換する
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ("0" + date.getDate()).slice(-2));
    return format;
  }

  /**
   * 日付の差分日数を計算する
   * @param {String} nowDate 比較用の日付（現在）
   * @param {String} resultDate 比較対象の日付（結果日）
   * @returns {int} 日付の差分の数値
   */
  getDiff(nowDate, resultDate) {
    let date1 = new Date(nowDate);
    let date2 = new Date(resultDate);
    // getTimeメソッドで経過ミリ秒を取得し、２つの日付の差を求める
    let msDiff = date2.getTime() - date1.getTime();
    // 求めた差分（ミリ秒）を日付へ変換します（経過ミリ秒÷(1000ミリ秒×60秒×60分×24時間)。端数切り捨て）
    let daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    // 差分へ1日分加算して返却します
    return ++daysDiff;
  }

  /**
   * ResultSetから連続日を計算する
   * @returns {int} 何日連続していたかの最高値を返す
   */
  getContinue() {
    if (this.#results.length === 0) return 0;
    let resultDate = this.#results.filter((obj) => obj.result > 0).map(obj => obj.date);
    let continueCount = 1;
    let tmp = 1;
    for (let i = 0; i < resultDate.length; i++) {
      //達成日をセット
      let current = new Date(resultDate[i]);
      //翌日のインスタンスを生成
      let tomorrow = new Date(current.getTime());
      tomorrow.setDate(tomorrow.getDate() + 1);
      //判定しやすいように文字列にフォーマット
      tomorrow = this.dateFormat(tomorrow);
      if (resultDate.includes(tomorrow)) {
        if (continueCount === tmp) continueCount++;
        tmp++;
      } else {
        tmp = 1;
      }
    }
    return continueCount;
  }

  /**
   * ResultSetから結果の合計値を求めて返す（mapでも良さそうだけど、きちっと型変換されていて他のオブジェクトでも使えるためこの方法で実装）
   * @returns {int} resultの値の合計値
   */
  getAttainDay() {
    let attainDays = 0;
    if (this.#results.length === 0) return 0;
    attainDays = Object.keys(this.#results).reduce(
      (sum, key) => sum + parseInt(this.#results[key].result || 0),
      attainDays
    );
    return attainDays;
  }

  /**
   * ResultSetからresultカラムの値が0の日の合計を返す
   * @return {int} ソートした配列の合計値
   */
  getSkipDay() {
    let skipDays = 0;
    if (this.#results.length === 0) return 0;
    let resultsObj = this.#results.filter((kpi) => kpi.result === 0);
    return (skipDays = resultsObj.length);
  }

  /**
   * 開始日から今日までの経過日数を統計日として返す
   * @returns {int} 開始日 - 今日までの経過日数
   */
  getStatsDay() {
    let statsDays = 0;
    statsDays = this.getDiff(this.#startDate, this.today());
    return statsDays;
  }

  /**
   * 開始日から今日まで達成できていない日の日数を返します。
   * @returns {int} 開始日 - スキップ日 - 成功日
   */
  getMissDay() {
    let missDays = 0;
    let statsDays = this.getStatsDay();
    let skipDays = this.getSkipDay();
    let attainDays = this.getAttainDay();
    return (missDays = statsDays - skipDays - attainDays);
  }
}