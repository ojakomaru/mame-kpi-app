package DAO;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.naming.NamingException;
import Model.Kpi;

/**
 * habitテーブルのデータを操作するDAOクラス
 */
public class KpiDAO extends DAO {
  /**
   * 新規データを一件登録する
   * @param kpi Beanクラス
   * @return 登録成功件数
   */
  public int insertKpi(Kpi kpi) {
    int insertCount = 0;
    String sql =
      "INSERT INTO habit(user, habitName, icon, habitGoalValue, habitGoalUnit, habitGoalPeriodicity, habitInterval, startDate, badHabit, onLimit) VALUES(?,?,?,?,?,?,?,?,?,?)";
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      // プレースホルダーを処理
      ps.setInt(1, kpi.getUser());
      ps.setString(2, kpi.getHabitName());
      ps.setString(3, kpi.getIcon());
      ps.setInt(4, kpi.getHabitGoalValue());
      ps.setInt(5, kpi.getHabitGoalUnit());
      ps.setInt(6, kpi.getHabitGoalPeriodicity());
      ps.setString(7, kpi.getHabitInterval());
      ps.setString(8, kpi.getStartDate());
      ps.setBoolean(9, kpi.isBadHabit());
      ps.setBoolean(10, kpi.isOnLimit());
      insertCount = ps.executeUpdate();
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return insertCount;
  }
  
  /** ORDER BY に使ってよい列名（これ以外は名前順にする） */
  private static final java.util.Set<String> SORT_COLUMNS = java.util.Set.of(
      "id", "user", "habitName", "icon", "habitGoalValue", "habitGoalUnit",
      "habitGoalPeriodicity", "habitInterval", "startDate", "badHabit", "onLimit");

  private static String safeColumn(String column) {
    return SORT_COLUMNS.contains(column) ? column : "habitName";
  }

  private static String safeOrder(String order) {
    return "DESC".equalsIgnoreCase(order) ? "DESC" : "ASC";
  }

  /**
   * KPI項目を全件取得する
   * ORDER BYの値を受けてSQLを実行する
   * @param sortColumn ソートする列名
   * @param order ソート順
   * @return Beansを格納したListを返す
   */
  public List<Kpi> selectAllKpi(String sortColumn, String order) {
    // ORDER BY の列名・向きは ? で渡せないため、許可リストにある値だけを使う
    String sql = "SELECT * FROM habit ORDER BY " + safeColumn(sortColumn) + " " + safeOrder(order);
    List<Kpi> kpiList = new ArrayList<>();
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      ResultSet rs = ps.executeQuery();
      while (rs.next()) {
        Kpi kpi = new Kpi();
        kpi.setId(rs.getInt("id"));
        kpi.setUser(rs.getInt("user"));
        kpi.setHabitName(rs.getString("habitName"));
        kpi.setIcon(rs.getString("icon"));
        kpi.setHabitGoalValue(rs.getInt("habitGoalValue"));
        kpi.setHabitGoalUnit(rs.getInt("habitGoalUnit"));
        kpi.setHabitGoalPeriodicity(rs.getInt("habitGoalPeriodicity"));
        kpi.setHabitInterval(rs.getString("habitInterval"));
        kpi.setStartDate(rs.getString("startDate"));
        kpi.setBadHabit(rs.getBoolean("badHabit"));
        kpi.setOnLimit(rs.getBoolean("onLimit"));
        kpiList.add(kpi);
      }
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return kpiList;
  }

  // KPI項目をキーワード検索
  public List<Kpi> kpiSearch(String keyWord) {
    String sql = "SELECT * FROM habit WHERE habitName LIKE ?";
    List<Kpi> kpiList = new ArrayList<>();
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      ps.setString(1, "%" + keyWord + "%");
      ResultSet rs = ps.executeQuery();
      while (rs.next()) {
        Kpi kpi = new Kpi();
        kpi.setId(rs.getInt("id"));
        kpi.setUser(rs.getInt("user"));
        kpi.setHabitName(rs.getString("habitName"));
        kpi.setIcon(rs.getString("icon"));
        kpi.setHabitGoalValue(rs.getInt("habitGoalValue"));
        kpi.setHabitGoalUnit(rs.getInt("habitGoalUnit"));
        kpi.setHabitGoalPeriodicity(rs.getInt("habitGoalPeriodicity"));
        kpi.setHabitInterval(rs.getString("habitInterval"));
        kpi.setStartDate(rs.getString("startDate"));
        kpi.setBadHabit(rs.getBoolean("badHabit"));
        kpi.setOnLimit(rs.getBoolean("onLimit"));
        kpiList.add(kpi);
      }
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return kpiList;
  }

  // KPI項目をキーワード検索
  public List<Kpi> orderSuccessCount(String order) {
    String sql =
      "SELECT H.*, R.result_sum FROM habit AS H INNER JOIN (SELECT kpiID, SUM(result) AS result_sum FROM results GROUP BY kpiID) AS R on H.id = R.kpiID ORDER BY R.result_sum " + safeOrder(order);
    List<Kpi> kpiList = new ArrayList<>();
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      ResultSet rs = ps.executeQuery();
      while (rs.next()) {
        Kpi kpi = new Kpi();
        kpi.setId(rs.getInt("id"));
        kpi.setUser(rs.getInt("user"));
        kpi.setHabitName(rs.getString("habitName"));
        kpi.setIcon(rs.getString("icon"));
        kpi.setHabitGoalValue(rs.getInt("habitGoalValue"));
        kpi.setHabitGoalUnit(rs.getInt("habitGoalUnit"));
        kpi.setHabitGoalPeriodicity(rs.getInt("habitGoalPeriodicity"));
        kpi.setHabitInterval(rs.getString("habitInterval"));
        kpi.setStartDate(rs.getString("startDate"));
        kpi.setBadHabit(rs.getBoolean("badHabit"));
        kpi.setOnLimit(rs.getBoolean("onLimit"));
        kpiList.add(kpi);
      }
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return kpiList;
  }

  /**
   * KPI項目を一件削除する
   * @param kpiId PrimaryKeyとなる項目番号
   * @return 削除した件数
   */
  public int deleteOne(int kpiId) {
    int deleteCount = 0;
    String sql = "DELETE FROM habit WHERE id=?";
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      ps.setInt(1, kpiId);
      deleteCount = ps.executeUpdate();
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return deleteCount;
  }

  // 項目を一件編集する
  public int updateKpi(Kpi kpi) {
    int modifyCount = 0;
    String sql =
      "UPDATE habit SET user=?, habitName=?, icon=?, habitGoalValue=?, habitGoalUnit=?, habitGoalPeriodicity=?, habitInterval=?, startDate=?, badHabit=?, onLimit=? WHERE id=?";
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      // プレースホルダーを処理
      ps.setInt(1, kpi.getUser());
      ps.setString(2, kpi.getHabitName());
      ps.setString(3, kpi.getIcon());
      ps.setInt(4, kpi.getHabitGoalValue());
      ps.setInt(5, kpi.getHabitGoalUnit());
      ps.setInt(6, kpi.getHabitGoalPeriodicity());
      ps.setString(7, kpi.getHabitInterval());
      ps.setString(8, kpi.getStartDate());
      ps.setBoolean(9, kpi.isBadHabit());
      ps.setBoolean(10, kpi.isOnLimit());
      ps.setInt(11,kpi.getId());
      modifyCount = ps.executeUpdate();
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return modifyCount;
  }

}
