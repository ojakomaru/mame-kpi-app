package Model;

import java.util.Calendar;

public class KpiCalendarLogic {
  public KpiCalendar creatCalendar(int... args) {
    KpiCalendar kcal = new KpiCalendar();
    Calendar cal = Calendar.getInstance();
    //リクエストパラメータがついていた場合その設定でカレンダーを生成
    if (args.length == 2) {
      cal.set(Calendar.YEAR, args[0]);
      cal.set(Calendar.MONTH, args[1]-1);
    }
    // 年を設定
    kcal.setYear(cal.get(Calendar.YEAR));
    // 元号の設定
    if (kcal.getYear() > 2018) {
      kcal.setGengou("令和" + (kcal.getYear() - 2018));
    } else if (kcal.getYear() > 1988) {
      kcal.setGengou("平成" + (kcal.getYear() - 1988));
    } else if (kcal.getYear() > 1925) {
      kcal.setGengou("昭和" + (kcal.getYear() - 1925));
    } else if (kcal.getYear() > 1911) {
      kcal.setGengou("大正" + (kcal.getYear() - 1911));
    } else {
      kcal.setGengou("" + kcal.getYear());
    }
    // 月の設定
    kcal.setMonth(cal.get(Calendar.MONTH) + 1);
    // カレンダーを1日に設定(1日が何曜日計算するため)
    cal.set(Calendar.DATE, 1);
    // カレンダーの最初の空白の数
    int before = cal.get(Calendar.DAY_OF_WEEK) - 1;
    // カレンダーの日付の数
    int daysCount = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
    // カレンダーを最終日に設定(最終日が何曜日か計算するため)
    cal.set(Calendar.DATE, daysCount);
    // 最終日後の空白の数
    int after = 7 - cal.get(Calendar.DAY_OF_WEEK);
    // 全ての要素数
    int total = before + daysCount + after;
    // その要素数を幅7個の配列に入れていった場合何行になるか
    int rows = total / 7;
    // その行数で2次元配列を生成
    String[][] data = new String[rows][7];
    // 今見ているカレンダーが今月かどうかを調べるために、この瞬間の日付情報をもつもう一つのインスタンス作成しておく
    Calendar now = Calendar.getInstance();
    for (int i = 0; i < rows; i++) {
      for (int j = 0; j < 7; j++) {
        if (i == 0 && j < before || i == rows - 1 && j >= (7 - after)) {
          // カレンダーの前後に入る空白の部分は空文字
          data[i][j] = "";
        } else {
          // カウンター変数と実際の日付の変換
          int date = i * 7 + j + 1 - before;
          // 配列に日付を入れる
          data[i][j] = String.valueOf(date);
          // 今作業しているマイカレンダーが今月のカレンダーだったら今日の日付の先頭に*を付与する
          if (now.get(Calendar.DATE) == date && now.get(Calendar.MONTH) == kcal.getMonth() - 1
              && now.get(Calendar.YEAR) == kcal.getYear()) {
            data[i][j] = "*" + data[i][j];
          }
        }
      }
    }
    kcal.setData(data);
    return kcal;
  }
}
