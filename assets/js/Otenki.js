export default class Otenki {
  #weather;
  constructor() {
    this.#initialize();
  }

  /**
   * コンストラクターとなる初期化処理。
   * 非同期で天気情報を取得して画面に表示する
   */
  async #initialize() {
    this.#weather = await this.getWeather();
    this.displayWeather();
  }

  /**
   * 今日から3日間の天気情報をAjaxで取得する
   * @returns {Promise} 非同期で取得したJson形式の天気情報
   */
  getWeather() {
    return new Promise((resolve, reject) => {
      let url = "https://weather.tsukumijima.net/api/forecast/city/210010";
      $.ajax({
        url: url,
        type: "GET",
        caches: true,
        async: true,
        dataType: "json",
      }).then(
        function (weather) {
          // 通信成功時のコールバック
          resolve(weather);
        },
        function () {
          // 通信失敗時のコールバック
          alert("エラー！気象データの取得に失敗しました。");
          reject();
        }
      );
    });
  }

  /**
   * ループ中に使用しimgタグを生成して返す。
   * そのためこの関数を使用するときはinnerTextではなく、appendChildを使用する
   * @param {int} number ループ変数を受け取る
   * @returns {HTMLobject} 作成したimgタグ
   */
  getWeatherIcon(number) {
    let imageEl = null;
    if (this.#weather) {
      imageEl = document.createElement("img");
      imageEl.src = this.#weather.forecasts[number].image.url;
      imageEl.alt = this.#weather.forecasts[number].image.title;
    }
    return imageEl;
  }

  /**
   * ループ中に使用し最高、最低気温をHTMLにセットする
   * 値がnullであることもあるため条件分岐で表示を分ける
   * @param {int} number ループ変数を受け取る
   */
  getTemperature(number) {
    let maxtemp = this.#weather.forecasts[number].temperature.max.celsius;
    let mintemp = this.#weather.forecasts[number].temperature.min.celsius;
    let tempMax = document.getElementById(`tempMax-${number + 1}`);
    let tempMin = document.getElementById(`tempMin-${number + 1}`);
    tempMax.innerText = maxtemp ? maxtemp + "℃" : "- ";
    tempMin.innerText = mintemp ? mintemp + "℃" : "- ";
  }

  /**
   * ループ中に使用し午前、午後の降水確率をHTMLにセットする
   * 値がnullであることもあるため条件分岐で表示を分ける
   * @param {int} number ループ変数を受け取る
   */
  getChangeOfRain(number) {
    let t06_12 = this.#weather.forecasts[number].chanceOfRain.T06_12;
    let t12_18 = this.#weather.forecasts[number].chanceOfRain.T12_18;
    let T06_12 = document.getElementById(`chanceOfRainMorning-${number + 1}`);
    let T12_18 = document.getElementById(`chanceOfRainAfternoon-${number + 1}`);
    T06_12.innerText = t06_12 ? t06_12 : "…";
    T12_18.innerText = t12_18 ? t12_18 : "…";
  }

  /**
   * 受け取った天気のオブジェクトをもとにHTML上に値をセットしていく
   * Viewでもループ処理を行っているため、Selectorには＋１する
   */
  displayWeather() {
    document.getElementById("tenkiTitle").innerText = this.#weather.title;
    for (let i = 0; i < 3; i++) {
      document.getElementById(`dateLabel-${i + 1}`).innerText =
        this.#weather.forecasts[i].dateLabel;
      document
        .getElementById(`telop-${i + 1}`)
        .appendChild(this.getWeatherIcon(i));
      this.getTemperature(i);
      this.getChangeOfRain(i);
    }
  }
}