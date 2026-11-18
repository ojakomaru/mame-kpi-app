import Util from "./Util.js";
import KpiForm from "./KpiForm.js";
import UpdateForm from "./UpdateForm.js";
import Kpi from "./Kpi.js";
import CalcLogic from "./ProgressCalcLogic.js";
import DaysLogic from "./CalendarLogic.js";
import Otenki from "./Otenki.js";
/**
 * Mainクラス
 */
export default class Main {
  #kpiObjs; //KPIのデータを登録するノード
  #kpiList; //KPIのオブジェクト
  #kpi;
  #daysLogic;
  #cb_plusOneProgress;
  /**
   * コンストラクタ
   */
  constructor() {
    this.#kpiObjs = document.querySelectorAll(".kpiItems li[data-id]");
    new KpiForm();
    new UpdateForm();
    new Otenki();
    this.#daysLogic = new DaysLogic();
    this.#cb_plusOneProgress = this.#plusOneProgress.bind(this);
    this.#initialize();
    this.#setUpEvent();
    this.#kpi = new Kpi();
    this.#kpi.updateView(this.#kpiList, this.#cb_plusOneProgress);
    // localStorage.clear();
  }

  /**
   * アプリの状態を初期化する
   */
  #initialize() {
    // 最新のリストを取得
    let kpiList = [];
    this.#kpiObjs.forEach((val) => {
      let kpi = {
        id: parseInt(val.dataset.id), //id
        user: parseInt(val.dataset.user), //責任者
        name: val.dataset.name, //目標名
        icon: val.dataset.icon, //ICON
        value: parseInt(val.dataset.value), //目標値
        unit: parseInt(val.dataset.unit), //目標単位
        periodicity: parseInt(val.dataset.periodicity), //目標間隔
        interval: val.dataset.interval, //曜日指定
        date: val.dataset.date, //開始日
        isbad: val.dataset.isbad, //ネガティブな習慣
        islimit: val.dataset.islimit, //ネガティブを制限するか
        result: 0, //その日の結果
        skip: false,
        complate: false,
      };
      kpiList.push(kpi);
    });
    this.#kpiList = kpiList;
    let changeDay = this.#daysLogic.isRefreshDay();
    let skipHabit = this.#daysLogic.getSkipTask(this.#kpiList);
    // 登録されたデータが有れば取得
    if (localStorage.hasOwnProperty("kpiList")) {
      let oldKpiList = JSON.parse(localStorage.getItem("kpiList"));
      // 配列の結合
      let kpidatas = [...kpiList, ...oldKpiList];
      this.#kpiList = Array.from(
        new Map(kpidatas.map((kpi) => [kpi.id, kpi])).values()
      );
    }
    //日付が変わっていた場合
    if (changeDay) {
      this.#autoSkipTask(skipHabit);
      this.#kpiList.forEach((kpi) => {
        if (kpi.periodicity == 1) {
          kpi.result = 0;
        }
        kpi.skip = false;
        kpi.complate = false;
      });
    }
    this.#updateDaysTaskList(skipHabit);
    console.log(this.#kpiList);
    this.#kpisSave();
  }

  /**
   * イベントハンドラを登録する
   */
  #setUpEvent() {
    //非表示の項目を切り替える
    Util.EventListener(".showToggle", this.#kpiShowToggle.bind(this));
    //習慣の順序を変更する
    Util.EventListener(".listsOrder", this.#listSetOrder);
    //習慣を検索する
    document.querySelector(".listsSearch").onclick = (event) =>
      new KpiForm().createSearchForm(event.currentTarget);
    //削除アイコン起動
    Util.EventListener(".deleteIcon", this.#kpiDelete.bind(this));
    //アコーディオンパネル
    Util.EventListener(".kpiItems dt", this.#accodionPanel);
    // KPI編集パネル起動
    Util.EventListener(".settings", this.#kpiSetting.bind(this));
    // KPI項目に結果を追加
    Util.EventListener(".plusOne", this.#cb_plusOneProgress);
    // 選択した項目の結果セットを表示する
    Util.EventListener(".kpiItems li", this.#displayProgress.bind(this));
    // SVGアイコンの色を変更する
    // window.addEventListener("load", function () {
    //   deSVG(".svg", true);
    // });
  }

  /**
   * KPI項目データをlocalstrageに保存する
   */
  #kpisSave() {
    localStorage.setItem("kpiList", JSON.stringify(this.#kpiList));
  }

  /**
   * 引数に渡したオブジェクトのIDをすべてスキップとしてDBに登録する。jQueryのAjaxを使用市非同期としてサーブレットを実行する
   * @param {Object} skipHabit スキップする項目のオブジェクト配列
   */
  #autoSkipTask(skipHabit) {
    let skipKpi = skipHabit.map((kpi) => kpi.id);
    $.ajax({
      url: "AddSkips",
      type: "POST",
      data: { skipKpi: skipKpi.join(), date: new CalcLogic().today() },
    })
      .done(function (result) {
        // 通信成功時のコールバック
        alert(result);
      })
      .fail(function () {
        // 通信失敗時のコールバック
        alert("エラー！データの登録に失敗しました。");
      });
  }

  /**
   * 引数に渡した項目をAjaxで非同期でDBに登録する
   * @param {Object} kpi 登録する項目オブジェクト
   */
  #addResult(kpi) {
    $.ajax({
      url: "AddResult",
      type: "POST",
      data: { id: kpi.id, date: new CalcLogic().today(), skip: kpi.skip },
    })
      .done(function (result) {
        // 通信成功時のコールバック
        alert(result);
      })
      .fail(function () {
        // 通信失敗時のコールバック
        alert("エラー！データの登録に失敗しました。");
      });
  }

  /**
   * 本日のタスクではない項目を非表示にする
   * @param {Object} habitList 今日のタスクではない項目のリストのオブジェクト配列
   * @param {boolean} isShowAll 非表示になっている項目を全件表示にするためのフラグ
   */
  #updateDaysTaskList(habitList, isShowAll = true) {
    habitList.forEach((kpi) => {
      let li = document.querySelector(`li[data-id="${kpi.id}"]`);
      li.classList.add("hidden");
      if (!isShowAll) li.classList.remove("hidden");
    });
  }

  /**
   * 選択した項目に結果を追加する。悪い習慣、かつ制限項目の場合は即完了処理。日課目標の場合はゲージ更新判定後DB登録処理を行う
   * @param {obj} event クリックされたイベント情報。このオブジェクトから選択したidをサーブレットに渡す
   */
  #plusOneProgress(event) {
    const progressKpi = this.findKpiObj(event);
    //制限項目なら即「完了」
    if (
      Util.convertStrToBool(progressKpi.isbad) &&
      !Util.convertStrToBool(progressKpi.islimit)
    ) {
      this.#kpiSuccess(progressKpi);
    } else if (progressKpi.periodicity != 1) {
      //日課目標ではない場合はDBに登録
      progressKpi.result++;
      progressKpi.complate = true;
      this.#kpi.displayGauge(progressKpi);
      this.#kpi.DayTaskComplate(progressKpi, this.#cb_plusOneProgress);
      this.#kpisSave();
      this.#addResult(progressKpi);
    } else {
      // 日課の場合はゲージを満タンにしないと登録しない
      progressKpi.result++;
      let complate = this.#kpi.displayGauge(progressKpi);
      if (complate) {
        this.#kpi.DayTaskComplate(progressKpi, this.#cb_plusOneProgress);
        this.#addResult(progressKpi);
      }
      this.#kpisSave();
    }
  }

  /**
   * 選択した項目を削除する。同時にローカルストレージの情報を削除し現在の値を保存。
   * @param {obj} event クリックされたイベント情報。このオブジェクトから選択したidをサーブレットに渡す
   */
  #kpiDelete(event) {
    const kpiObj = this.findKpiObj(event);
    if (confirm(`選択した「${kpiObj.name}」を削除しますか？`)) {
      // 登録されたデータが有れば取得
      let oldKpiList = JSON.parse(localStorage.getItem("kpiList"));
      // localStorageのデータを削除
      this.#kpiList = oldKpiList.filter((kpi) => kpi.id != kpiObj.id);
      this.#kpisSave();
      window.location.href = `/kpiapp/DeleteKpi?id=${kpiObj.id}`;
    } else {
      alert("キャンセルしました");
    }
  }

  /**
   * 本日の目標を完了する処理。グローバルオブジェクトの書き換え、保存
   * @param {Object} kpi bindして渡されてきた現在のKPIオブジェクト
   */
  #kpiSuccess(kpi) {
    kpi.result = kpi.value;
    kpi.complate = true;
    this.#kpi.displayGauge(kpi);
    this.#kpi.DayTaskComplate(kpi, this.#cb_plusOneProgress);
    this.#kpisSave();
    this.#addResult(kpi);
  }

  /**
   * 本日の目標をスキップする処理。グローバルオブジェクトの書き換え、保存
   * @param {Object} kpi bindして渡されてきた現在のKPIオブジェクト
   */
  #addSkipDay(kpi) {
    kpi.skip = true;
    kpi.complate = true;
    this.#kpi.DayTaskComplate(kpi, this.#cb_plusOneProgress);
    this.#kpisSave();
    this.#addResult(kpi);
  }

  /**
   * 現在の進捗のゲージをリセットする処理
   * @param {Object} kpi bindして渡されてきた現在のKPIオブジェクト
   */
  #progressReset(kpi) {
    kpi.result = 0;
    kpi.complate = false;
    this.#kpi.displayGauge(kpi);
    this.#kpi.DayTaskComplate(kpi, this.#cb_plusOneProgress);
    this.#kpisSave();
  }

  /**
   * 本日の進捗、スキップ、達成状況を削除し、今日のデータをDBから削除する
   * @param {Object} kpi bindして渡されてきた現在のKPIオブジェクト
   */
  #cancelDay(kpi) {
    this.#progressReset(kpi);
    $.ajax({
      url: "CancelDay",
      type: "POST",
      data: { id: kpi.id, date: new CalcLogic().today() },
    })
      .done(function (result) {
        // 通信成功時のコールバック
        alert(result);
      })
      .fail(function () {
        // 通信失敗時のコールバック
        alert("エラー！データの登録に失敗しました。");
      });
  }

  /**
   * 編集ボタンのトリガーで対象の編集用のパネルを起動する
   * パネルの中の処理を4種類登録する
   * ・項目編集フォーム起動
   * ・項目の成功処理
   * ・項目のスキップ処理
   * ・リセット処理
   * ・本日分を取り消す処理
   * @param {obj} event クリックされたイベント情報。このオブジェクトから選択したKPIデータを編集用に渡す
   */
  #kpiSetting(event) {
    event.stopPropagation();
    const modKpi = this.findKpiObj(event);
    event.currentTarget.classList.toggle("active");
    event.currentTarget.nextElementSibling.classList.toggle("active");
    //編集フォーム起動
    document.getElementById(`modify${modKpi.id}`).onclick = () =>
      new UpdateForm().modKpiForm(modKpi);
    //成功処理を実行
    if (modKpi.periodicity == 1) {
      document.getElementById(`success${modKpi.id}`).onclick = () =>
        this.#kpiSuccess(modKpi);
    }
    //スキップ処理を実行
    document.getElementById(`skip${modKpi.id}`).onclick = () =>
      this.#addSkipDay(modKpi);
    //進捗リセット処理を実行
    if (modKpi.periodicity != 1) {
      document.getElementById(`resetValue${modKpi.id}`).onclick = () =>
        this.#progressReset(modKpi);
    }
    //本日分キャンセル処理
    if (modKpi.complate == true) {
      document.getElementById(`cancelDay${modKpi.id}`).onclick = () =>
        this.#cancelDay(modKpi);
    }
  }

  /**
   * 選択した項目の進捗を右のパネルに表示する。グローバルな結果オブジェクトから結果判定ロジックの処理を行う
   * @param {object} event イベントノード
   */
  async #displayProgress(event) {
    event.stopPropagation();
    [...document.querySelectorAll(".kpiItems li.kpi")].forEach((li) =>
      li.classList.remove("selected")
    );
    event.currentTarget.classList.add("selected");
    const kpi = this.findKpiObj(event);
    document.getElementById("habitTitle").innerText = kpi.name;
    document.getElementById("startDay").innerText = `${kpi.date}`;
    document.getElementById("habitUser").innerText = `${this.#kpi.getUserStr(
      kpi.user
    )}`;
    document.getElementById("intervalDay").innerText = `${kpi.interval.replace(
      /,/g,
      " "
    )}`;
    //クリックされた結果セットを取得
    const resultSet = await this.#getResult(kpi.id);
    const calcLogic = new CalcLogic(resultSet, kpi.date);
    console.log(resultSet);
    //連続記録を取得
    const continueDay = calcLogic.getContinue();
    document.getElementById("continueDay").innerText = `${continueDay}日`;
    //達成日を取得
    const attainDay = calcLogic.getAttainDay();
    document.getElementById("attainDay").innerText = `${attainDay}日`;
    //スキップした日数を取得
    const skipDay = calcLogic.getSkipDay();
    document.getElementById("skipDay").innerText = `${skipDay}日`;
    //未達成日数を取得
    const missDay = calcLogic.getMissDay();
    document.getElementById("missDay").innerText = `${missDay}日`;
    //統計日数を取得
    const statsDay = calcLogic.getStatsDay();
    document.getElementById("statsDay").innerText = `${statsDay}日`;
    //カレンダーを書き換える
    this.#daysLogic.displayCalendar(resultSet);
    //カレンダーにイベントをセット
    [...document.querySelectorAll(".calendarArea td")]
      .filter((td) => td.innerText !== "")
      .forEach((td) => {
        // クリックイベントは追加用
        td.onclick = (event, id) => this.#daysLogic.modResult(event, kpi.id);
        // ダブルクリックは削除用
        td.oncontextmenu = (event, id) =>
          this.#daysLogic.modResult(event, kpi.id);
      });
  }

  /**
   * idから非同期でサーブレットを呼び出し結果セットを取得します。通信成功時結果セットはObjectなので、配列に変換して返します。
   * @param {int} id 検索してもらう項目番号
   * @returns {Promise} 結果を受け取るまで待機させる
   * @returns {Object} 検索結果のオブジェクト配列
   */
  #getResult(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: "GetResult",
        type: "POST",
        async: true,
        data: { id: id },
      }).then(
        function (resultSet) {
          // 通信成功時のコールバック
          let resultObj = JSON.parse(resultSet);
          let results = Object.values(resultObj)[0];
          resolve(results);
        },
        function () {
          // 通信失敗時のコールバック
          alert("エラー！データの取得に失敗しました。");
          reject();
        }
      );
    });
  }

  /**
   * アコーディオンパネル開閉処理。nextElementで処理しているためHTML構造が変わると動作しなくなるので注意
   */
  #accodionPanel(event) {
    event.currentTarget.nextElementSibling.classList.toggle("open");
  }

  /**
   * クリックで隠れているタスクを全件表示にする
   * @param {Object} event クリックされたHTMLノード
   */
  #kpiShowToggle(event) {
    let toggle = event.currentTarget;
    let skipHabit = this.#daysLogic.getSkipTask(this.#kpiList);
    toggle.classList.toggle("allShow");
    if (toggle.classList.contains("allShow")) {
      toggle.innerText = "全件表示";
      this.#updateDaysTaskList(skipHabit, false);
    } else {
      toggle.innerText = "本日分";
      this.#updateDaysTaskList(skipHabit, true);
    }
  }

  /**
   * 順序変更用のフォームを立ち上げる
   */
  #listSetOrder() {
    new KpiForm().selectOrderForm();
  }

  /**
   * 現在のKPIオブジェクトから選択した項目を検索する
   * @param {Object} event イベントノード
   * @returns idから取得したKPIオブジェクト
   */
  findKpiObj(event) {
    let kpiObj = null;
    const kpiId = event.currentTarget.dataset.id;
    kpiObj = this.#kpiList.find((kpi) => kpi.id == kpiId);
    return kpiObj;
  }
}
