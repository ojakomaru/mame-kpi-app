import ProgressCalcLogic from "./ProgressCalcLogic.js";
import Util from "./Util.js";

export default class Kpi {
  constructor() {}

  /**
   * ユーザー名の値を文字列で返す
   * @param {int} user ユーザーを示す値
   * @returns {String} 値に応じたユーザー名
   */
  getUserStr(user) {
    let userName;
    if (user == 1) {
      userName = "おジャコ";
    } else if (user == 2) {
      userName = "ハーちゃん";
    } else {
      userName = "二人で頑張る♡";
    }
    return userName;
  }

  /**
   * 目標単位の値を文字列で返す
   * @param {int} unit 目標単位を示す値
   * @returns {String} 値に応じた文字列
   */
  getUnitStr(unit) {
    let unitStr;
    if (unit == 1) {
      unitStr = "回";
    } else if (unit == 2) {
      unitStr = "時間";
    } else {
      unitStr = "分";
    }
    return unitStr;
  }

  /**
   * 目標間隔の値を文字列で返す
   * @param {int} periodicity 目標間隔を示す値
   * @returns {String} 値に応じた文字列
   */
  getPeriodicityStr(periodicity) {
    let periodicityStr;
    if (periodicity == 1) {
      periodicityStr = "日";
    } else if (periodicity == 2) {
      periodicityStr = "週";
    } else {
      periodicityStr = "月";
    }
    return periodicityStr;
  }

  /**
   * 現在の進捗に応じて表示を変更する
   * @param {object} kpi メイン画面から取得したKPIオブジェクト
   * @returns {boolean} 本日の進捗が完了したらtrueを返す
   */
  displayGauge(kpi) {
    let complate = false;
    const gauge = document.querySelector(`li[data-id="${kpi.id}"] .gauge span`);
    const progressWidth = (kpi.result / kpi.value) * 100;
    if (progressWidth <= 100 && gauge) {
      gauge.innerText = kpi.result;
      gauge.style.width = progressWidth + "%";
      if (progressWidth == 100) {
        kpi.complate = true;
        return (complate = true);
      }
    }
    return complate;
  }

  /**
   * 画面リロードで呼び出され画面更新を行う。
   * @param {Array} kpilist 最新のKPIリスト
   * @param {callback} func 完了したイベントを削除するためのハンドルイベント
   */
  updateView(kpilist, func) {
    kpilist.forEach((kpi) => {
      // 日課目標以外の場合
      if (kpi.periodicity != 1) {
        this.displayGauge(kpi);
        this.DayTaskComplate(kpi, func);
      } else if (
        kpi.skip ||
        // スキップされている場合
        // または悪い習慣かつ制限項目でない場合
        (Util.convertStrToBool(kpi.isbad) &&
          !Util.convertStrToBool(kpi.islimit) &&
          kpi.result !== 0)
      ) {
        this.DayTaskComplate(kpi, func);
      } else {
        //ゲージ更新処理を挟む
        let complate = this.displayGauge(kpi);
        if (complate) this.DayTaskComplate(kpi, func);
      }
    });
  }

  /**
   * 完了フラグがあればイベントを削除し完了viewにする
   * @param {Object} kpi 選択された項目のオブジェクト
   * @param {callback} func イベントを削除する関数
   */
  DayTaskComplate(kpi, func) {
    const li = document.querySelector(`li[data-id="${kpi.id}"]`);
    Util.EventListener(
      `li[data-id="${kpi.id}"] .plusOne`,
      func,
      "click",
      kpi.complate
    );
    if (kpi.complate) {
      li.classList.add("complate");
    } else {
      li.classList.remove("complate");
    }
  }
}
