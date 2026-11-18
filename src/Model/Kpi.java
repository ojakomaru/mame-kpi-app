package Model;

import java.io.Serializable;

/**
 * KPIのBeanクラス
 */
public class Kpi implements Serializable {
  private int     id;
  private int     user;
  private String  habitName;
  private String  icon;
  private int     habitGoalValue;
  private int     habitGoalUnit;
  private int     habitGoalPeriodicity;
  private String  habitInterval;
  private String  startDate;
  private boolean badHabit;
  private boolean onLimit;

  public Kpi(){}

  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
  }
  public int getUser() {
    return user;
  }
  public String getUserStr() {
    String userName;
    if (user == 1) {
      userName = "おジャコ";
    } else if(user == 2) {
      userName = "ハーちゃん";
    } else {
      userName = "二人で頑張る♡";
    }
    return userName;
  }
  public void setUser(int user) {
    this.user = user;
  }
  public String getHabitName() {
    return habitName;
  }
  public void setHabitName(String habitName) {
    this.habitName = habitName;
  }
  public String getIcon() {
    return icon;
  }
  public void setIcon(String icon) {
    this.icon = icon;
  }
  public int getHabitGoalValue() {
    return habitGoalValue;
  }
  public void setHabitGoalValue(int habitGoalValue) {
    this.habitGoalValue = habitGoalValue;
  }
  public int getHabitGoalUnit() {
    return habitGoalUnit;
  }
  public String getUnitStr() {
    String unit;
    if (habitGoalUnit == 1) {
      unit = "回";
    } else if (habitGoalUnit == 2) {
      unit = "時間";
    } else {
      unit = "分";
    }
    return unit;
  }
  public void setHabitGoalUnit(int habitGoalUnit) {
    this.habitGoalUnit = habitGoalUnit;
  }

  public int getHabitGoalPeriodicity() {
    return habitGoalPeriodicity;
  }
  
  /**
   * 目標間隔を返す
   * @return 目標間隔文字列
   */
  public String getPeriodicityStr() {
    String Periodicity;
    if (habitGoalPeriodicity == 1) {
      Periodicity = "日";
    } else if (habitGoalPeriodicity == 2) {
      Periodicity = "週";
    } else {
      Periodicity = "月";
    }
    return Periodicity;
  }
  public void setHabitGoalPeriodicity(int habitGoalPeriodicity) {
    this.habitGoalPeriodicity = habitGoalPeriodicity;
  }

  public String getHabitInterval() {
    return habitInterval;
  }
  /**
   * 曜日設定
   * @param string 曜日設定の配列
   */
  public void setHabitInterval(String[] string) {
    this.habitInterval = String.join(",", string);
  }
  public void setHabitInterval(String string) {
    this.habitInterval = string;
  }
  public String getStartDate() {
    return startDate;
  }
  public void setStartDate(String startDate) {
    this.startDate = startDate;
  }
  public boolean isBadHabit() {
    return badHabit;
  }

  public void setBadHabit(boolean badHabit) {
    this.badHabit = badHabit;
  }
  public boolean isOnLimit() {
    return onLimit;
  }
  public void setOnLimit(boolean onLimit) {
    this.onLimit = onLimit;
  }

}
