import Util from "./Util.js";
/**
 * Kpi追加フォームクラス
 */
export default class KpiForm {
  mask; // マスクのノード
  #addkpiPanel; // 目標追加POP
  insertKpiForm; // 目標追加フォームのラッパークラス
  kpiForm; //フォームエレメント
  #iconChangeButton; //アイコン変更ボタン
  selectedImage; //選択されているアイコン
  /**
   * コンストラクタ
   */
  constructor() {
    this.mask = document.getElementById("mask");
    this.#addkpiPanel = document.getElementById("addkpi");
    this.insertKpiForm = document.getElementById("insertKpiForm");
    this.kpiForm = this.insertKpiForm.firstElementChild;
    this.#iconChangeButton = document.getElementById("iconChangeButton");
    this.selectedImage = document.getElementById("selectedImage");
    this.#setUpEvent();
  }
  /**
   * イベントハンドラを登録する
   */
  #setUpEvent() {
    //目標追加
    Util.EventListener(
      ".topbarSearch li:nth-child(4)",
      this.addKpiActive.bind(this)
    );
    // キャンセル
    Util.EventListener('input[type="reset"]', this.maskHidden.bind(this));
    // アイコンを変更する
    Util.EventListener(
      ".insertKpiForm picture",
      this.selectIocnPanel.bind(this)
    );
    Util.EventListener(".iconSelect p", this.iconSelectCancel.bind(this));
    // アイコンを選択する
    Util.EventListener(".iconSelect img", this.selectIconImage.bind(this));
  }

  /**
   * マスクをクローズして解除する
   */
  maskHidden() {
    this.mask.classList.remove("active");
    this.addKpiClose();
    this.formClose();
    this.iconPanelClose();
  }
  /**
   * 目標を追加するパネルを起動する。
   */
  addKpiActive() {
    this.mask.classList.add("active");
    this.#addkpiPanel.classList.add("active");
    //マスクを解除するキャンセルメソッド
    Util.EventListener("#mask", this.maskHidden.bind(this));
    // 良い目標のフォーム
    Util.EventListener(
      ".addkpi button:nth-child(1)",
      this.goodKpiForm.bind(this)
    );
    // 辞めたい目標のフォーム
    Util.EventListener(
      ".addkpi button:nth-child(2)",
      this.limitKpiForm.bind(this)
    );
  }
  addKpiClose() {
    this.#addkpiPanel.classList.remove("active");
  }
  /**
   * 良い習慣を作るフォーム
   */
  goodKpiForm() {
    this.addKpiClose();
    this.mask.classList.add("active");
    this.insertKpiForm.classList.add("active");
    this.insertKpiForm.classList.remove("badHabit");
    document.getElementById("badHabit").value = "false";
    Util.EventListener("#mask", this.maskHidden.bind(this));
  }
  /**
   * 悪い習慣を無くすフォーム
   */
  limitKpiForm() {
    this.addKpiClose();
    this.mask.classList.add("active");
    this.insertKpiForm.classList.add("active", "badHabit", "stop");
    document.getElementById("badHabit").value = "true";
    Util.EventListener("#mask", this.maskHidden.bind(this));
    // 辞めたい習慣の種類を選ぶ
    Util.EventListener(".selectLimiter p", this.selectLimiter.bind(this));
  }
  formClose() {
    this.insertKpiForm.classList.remove("active", "badHabit", "stop");
  }
  // 節制選択
  selectLimiter(event) {
    let p = document.querySelectorAll(".selectLimiter p");
    let input = document.getElementById("onLimit");
    p.forEach((p) => p.classList.remove("selected"));
    event.target.classList.add("selected");
    if (p[1] === event.target) {
      this.insertKpiForm.classList.remove("stop");
      input.value = "true";
    } else {
      this.insertKpiForm.classList.add("stop");
      input.value = "false";
    }
  }

  /**
   * アイコンを選択する
   */
  selectIocnPanel(event) {
    event.currentTarget.classList.add("active");
  }
  iconPanelClose() {
    this.#iconChangeButton.classList.remove("active");
  }
  // キャンセルボタン
  iconSelectCancel(event) {
    event.stopPropagation();
    this.iconPanelClose();
  }
  // アイコン選択時
  selectIconImage(event) {
    event.stopPropagation();
    let imgInput = document.getElementById("imgInput");
    this.selectedImage.setAttribute("src", event.target.src);
    imgInput.value = event.target.src.split("/").pop();
    this.iconPanelClose();
  }

  /**
   * ORDER BY変更フォーム起動
   * マスクの起動。親要素にclass追加。キャンセル用のイベントリスナー登録
   */
  selectOrderForm() {
    this.mask.classList.add("active");
    const form = document.getElementById("selectOrder");
    form.parentElement.classList.add("active");
    Util.EventListener("#mask", this.selectOrderFormClose.bind(this));
  }
  /**
   * ORDER BY変更フォームキャンセル用メソッド
   */
  selectOrderFormClose() {
    this.mask.classList.remove("active");
    const form = document.getElementById("selectOrder");
    form.parentElement.classList.remove("active");
  }

  /**
   * ボタンを検索窓に変更する。フォーム生成、テキストボックス生成、エンターで送信するためのsubmitボタン生成
   * @param {HTMLnode} el クリックされたHTMLノード
   */
  createSearchForm(el) {
    el.onclick = null;
    el.innerText = '';
    let submit = document.createElement("input");
    submit.type = "submit";
    submit.style.display = "none";
    let input = document.createElement("input");
    input.type = "text";
    input.name = "search";
    input.placeholder = "キーワードを入力";
    let form = document.createElement("form");
    form.action = "ListSearch";
    form.method = "POST";
    form.appendChild(submit);
    form.appendChild(input);
    el.appendChild(form);
  }
}
