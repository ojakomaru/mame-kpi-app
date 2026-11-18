import KpiForm from "./KpiForm.js";
import Util from "./Util.js";

export default class UpdateForm extends KpiForm {
  #formTitle; //h1
  #habitName;
  #user;
  #icon;
  #habitGoalValue;
  #habitGoalUnit;
  #habitGoalPeriodicity;
  #habitInterval;
  #startDate;

  constructor() {
    super();
    this.#formTitle = document.getElementById("formTitle");
    this.#habitName = document.getElementById("habitName");
    this.#user = document.getElementById("user");
    this.#icon = document.getElementById("imgInput");
    this.#habitGoalValue = document.getElementById("habitGoalValue");
    this.#habitGoalUnit = document.getElementById("habitGoalUnit");
    this.#habitGoalPeriodicity = document.getElementById("habitGoalPeriodicity");
    this.#habitInterval = Array.from(document.querySelectorAll('input[name="habitInterval"]'));
    this.#startDate = document.getElementById("startDate");
  }

  /**
   * マスクをクローズする関数
   * @override
   */
  maskHidden() {
    super.maskHidden();
    this.modCancel();
  }

  /**
   * 編集する項目によって編集フォームを改変する
   * @param {object} kpi フロントで取得したKPIデータ
   */
  modKpiForm(kpi) {
    // サーブレットの起動URLを変更
    let formAction = this.kpiForm.action;
    this.kpiForm.setAttribute(
      "action",
      this.imgPathReplace(formAction, 'KpiUpdate')
    );
    // id送信用のタグを生成
    this.insertInputEl(kpi.id);
    // ネガティブな習慣の場合
    if (Util.convertStrToBool(kpi.isbad)) {
      super.limitKpiForm();
      this.selectToggle(false);
      this.#formTitle.innerText = "習慣を編集";
      this.#habitName.value = kpi.name;
      this.#user.options.selectedIndex = kpi.user - 1;
      this.#icon.value = kpi.icon;
      let target = this.selectedImage.src;
      this.selectedImage.setAttribute(
        "src",
        this.imgPathReplace(target, kpi.icon)
      );
      // 制限課題の場合
      if(Util.convertStrToBool(kpi.islimit)) {
        this.selectToggle(true);
        this.#habitGoalValue.value = kpi.value;
        this.#habitGoalUnit.selectedIndex = kpi.unit - 1;
        this.#habitGoalPeriodicity.selectedIndex = kpi.periodicity - 1;
      }
      this.#startDate.value = kpi.date;
    } else {
    // 良い習慣の場合
      super.goodKpiForm();
      this.#formTitle.innerText = "習慣を編集";
      this.#habitName.value = kpi.name;
      this.#user.options.selectedIndex = kpi.user - 1;
      this.#icon.value = kpi.icon;
      let target = this.selectedImage.src;
      this.selectedImage.setAttribute('src',this.imgPathReplace(target, kpi.icon));
      this.#habitGoalValue.value = kpi.value;
      this.#habitGoalUnit.selectedIndex = kpi.unit - 1;
      this.#habitGoalPeriodicity.selectedIndex = kpi.periodicity - 1;
      this.intervalChecked(this.#habitInterval, kpi.interval);
      this.#startDate.value = kpi.date;
    }
  }

  /**
   * formにidのinputタグを追加する.
   * @param {int} id データを識別するPrimaryKey
   * @param {boolean} isdelete 挿入したElementを削除するときは第一引数を空にしてisdeleteをtrueにしてください
   */
  insertInputEl(id, isdelete = false) {
    if(isdelete) {
      let input = document.querySelector('input[name="id"]');
      if(input) input.remove();
      return;
    } else {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "id");
      input.setAttribute("value", id);
      this.kpiForm.appendChild(input);
    }
  }

  /**
   * 編集キャンセル時にフォームをリセットする
   */
  modCancel() {
    let formAction = this.kpiForm.action;
    this.kpiForm.setAttribute(
      "action",
      this.imgPathReplace(formAction, "InsertKpi")
    );
    this.insertInputEl(0, true);
    this.#formTitle.innerText = "新しい習慣";
    this.#user.options.selectedIndex = 2;
    this.#icon.value = "beel.svg";
    let target = this.selectedImage.src;
    this.selectedImage.setAttribute("src", this.imgPathReplace(target, 'beel.svg')
    );
    this.#habitGoalValue.value = 1;
    this.#habitGoalUnit.selectedIndex = 0;
    this.#habitGoalPeriodicity.selectedIndex = 0;
  }

  /**
   * URLから画像フォルダのパス以降を置換する
   * @param {String} target 対象のURLパス
   * @param {String} str 表示したいファイル名
   * @returns {String} strをつなげた絶対パス
   */
  imgPathReplace(target, str) {
    let regexp = /^(https?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+(img)?(image)?\/)/g;
    return target.match(regexp)[0] + str;
  }

  /**
   * チェックボックスに選択した値を設定する
   * @param {HTMLCollection} checkbox checkboxのノード
   * @param {String} reg 検索するカンマ区切りの文字列
   */
  intervalChecked(checkbox, reg) {
    checkbox.forEach((e) => {
      e.checked = false;
      if (reg.includes(e.value)) e.checked = true;
    });
  }

  /**
   * イベントリスナーに依存せずにトグルの設定を変更する
   * @param {boolean} boolean トグルのフラグ変更したい方へ応じて変更する
   * 例：制限するにトグルを入れたい場合「true」
   * @see super.selectLimiter();
   */
  selectToggle(boolean) {
    let p = document.querySelectorAll(".selectLimiter p");
    p.forEach((p) => p.classList.remove("selected"));
    if(boolean === true) {
      p[1].classList.add("selected");
      this.insertKpiForm.classList.remove("stop");
    } else {
      p[0].classList.add("selected");
      this.insertKpiForm.classList.add("stop");
    }
  }
}