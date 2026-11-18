import ProgressCalcLogic from "./ProgressCalcLogic.js";
import Util from "./Util.js";

export default class CalendarLogic extends ProgressCalcLogic {
  #week;
  constructor() {
    super();
    this.#week = ["日", "月", "火", "水", "木", "金", "土"];
    this.#setUpEvent();
    this.displayToday();
    this.displayDateTime();
  }

  #setUpEvent() {
    window.addEventListener("load", this.displayToday);
  }

  /**
   * localStorageに保存されている日付が今日の日付か判定する
   * @returns boolean
   */
  isRefreshDay() {
    let refresh = false;
    let today = super.dateFormat(new Date(), "YYYY/MM/DD");
    let oldday = localStorage.getItem("today");
    if (oldday !== today) {
      // if (oldday !== "2023/02/01") {
      localStorage.setItem("today", today);
      return (refresh = true);
    }
    return refresh;
  }

  /**
   * 本日の日付を表示する。日付をブラウザに登録する。コンストラクターで呼び出される。
   * @returns void localStorageに"today"のキーで文字列の日付を登録する
   */
  displayToday() {
    let today = super.dateFormat(new Date(), "YYYY/MM/DD");
    document.getElementById("today").innerText = today;
  }

  /**
   * 現在時刻をリアルタイムで表示する。
   * 桁数は二桁で統一する
   */
  displayDateTime() {
    const showClock = () => {
      let nowTime = new Date();
      let nowHour = nowTime.getHours().toString().padStart(2, "0");
      let nowMin = nowTime.getMinutes().toString().padStart(2, "0");
      let nowSec = nowTime.getSeconds().toString().padStart(2, "0");
      let msg = "現在時刻：" + nowHour + ":" + nowMin + ":" + nowSec;
      document.getElementById("nowDateTime").innerHTML = msg;
    };
    setInterval(showClock, 1000);
  }

  /**
   * 本日の曜日指定がある項目のリストを絞り込みます
   * @param {Object} kpiList 現在のパラメータを持つ項目のオブジェクト配列
   * @returns 今日の曜日を含むオブジェクトの配列
   */
  getSkipTask(kpiList) {
    const date = new Date();
    let daysTask = kpiList.filter(
      (kpi) => !kpi.interval.split(",").includes(this.#week[date.getDay()])
    );
    return daysTask;
  }

  /**
   * 現在表示されているカレンダーに達成日とスキップした日のクラス名を付与する
   * 整合性を合わせるため年月日を合わせて照合する
   * @param {Object} resultSet 結果セットのオブジェクト配列
   * @see Calendar.getSubCalendar()
   */
  displayCalendar(resultSet) {
    //カレンダーの年月を取得
    const inputYear = document.getElementById("updateYear").value;
    const inputMonth = document
      .getElementById("updateMonth")
      .value.padStart(2, "0");
    //カレンダーを取得し日付形式に変更
    const calNode = document.querySelectorAll(".calendarArea td");
    const calendar = Array.from(calNode)
      .map((td) => {
        if (td.innerText == "") return;
        td.classList.remove("ok");
        td.classList.remove("throw");
        return `${inputYear}-${inputMonth}-${td.innerText.padStart(2, "0")}`;
      })
      .filter((e) => typeof e !== "undefined");
    // カレンダーに含まれる結果の配列を生成
    const complateDays = this.getSubCalendar(calendar, resultSet, 1);
    const throwDays = this.getSubCalendar(calendar, resultSet, 0);
    // 結果に応じてクラス名を付与
    calNode.forEach((td) => {
      if (td.innerText == "") return;
      if (complateDays.includes(Number(td.innerText))) td.classList.add("ok");
      if (throwDays.includes(Number(td.innerText))) td.classList.add("throw");
    });
  }

  /**
   * カレンダーノードから結果セットに含まれている値に応じて配列を作成する。
   * 主に上のdisplayCalendarの専用メソッド。
   * カレンダーに含まれる結果セットの日付を加工して比較し、再度加工して返す
   * @param {HTMLNode} calendar ドキュメントに表示されているカレンダーノード
   * @param {Object} resultSet 結果セットのオブジェクトの配列
   * @param {int} flag 結果オブジェクトのresultの値。1か0
   * @returns {Array[int]} カレンダーに含まれている値の配列
   */
  getSubCalendar(calendar, resultSet, flag) {
    // カレンダーに表示する日を抜き出す
    const subCalendar = calendar.filter((day) => {
      return resultSet.some(
        (result) => result.date === day && result.result == flag
      );
    });
    // Nodeと比較できるように末尾を切り出してゼロパディングを削除
    const dayNumberArray = subCalendar.map((day) =>
      Number(day.substring(day.length - 2))
    );
    return dayNumberArray;
  }

  /**
   * 選択した項目の結果を非同期で削除、もしくわ追加する。
   * 発生したイベントの種類によって、クリック＝追加、右クリック＝削除となる
   * カレンダーが更新されていると整合性が合わなくなるため、現在のカレンダーを取得し生成後、イベントに応じて非同期サーブレットを実行する。
   * @param {Object} onClickEventのHTMLノード
   * @param {int} id 選択されたKPIのid
   * @returns 通常の右クリックを停止するためにfalseを返す
   * @see Main.displayProgress
   */
  modResult(event, id) {
    // カレンダーの年月を取得
    const inputYear = document.getElementById("updateYear").value;
    const inputMonth = document
      .getElementById("updateMonth")
      .value.padStart(2, "0");
    const td = event.currentTarget.innerText.padStart(2, "0");
    const insertDate = `${inputYear}-${inputMonth}-${td}`;
    const updateResults = (id, date, del = false) => {
      $.ajax({
        url: "UpdateResults",
        type: "POST",
        data: { id: id, date: date, del },
      })
        .done(function (result) {
          // 通信成功時のコールバック
          alert(result);
        })
        .fail(function () {
          // 通信失敗時のコールバック
          alert("エラー！データの通信に失敗しました。");
        });
    };
    if (event.type === "contextmenu") {
      if (!event.currentTarget.classList.contains("ok")) return false;
      if (confirm(`${insertDate}のデータを削除しますか？`)) {
        updateResults(id, insertDate, true);
        event.currentTarget.classList = "";
      } else {
        alert("キャンセルしました。");
      }
    } else {
      if (event.currentTarget.classList.contains("ok")) return;
      updateResults(id, insertDate);
      event.currentTarget.classList.add("ok");
    }
    return false;
  }
}