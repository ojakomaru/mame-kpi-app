package DAO;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import javax.naming.NamingException;
import Model.Results;

public class ResultsDAO extends DAO {
  /**
   * Beanから結果を一件DBに登録する
   * @param result Bean
   * @return 登録した件数（一件）
   */
  public int insertResult(Results result) {
    int insertCount = 0;
    String sql =
        "INSERT INTO results(kpiID, date, result) VALUES(?,?,?)";
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      // プレースホルダーを処理
      ps.setInt(1, result.getKpiID());
      ps.setString(2, result.getDate());
      ps.setInt(3, result.getResult());
      insertCount = ps.executeUpdate();
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return insertCount;
  }

  /**
   * idに紐づく項目の結果をすべて取得する
   * @param id 項目番号
   * @return 対象の項目の結果を格納したBeanクラスのリスト
   */
  public List<Results> selectOneResult(int id) {
    List<Results> resultList = new ArrayList<>();
    String sql =
    "SELECT kpiID, date, result FROM results WHERE KpiID=? ORDER BY date DESC";
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      ps.setInt(1, id);
      ResultSet rs = ps.executeQuery();
      while (rs.next()) {
        Results results = new Results();
        results.setKpiID(rs.getInt("kpiID"));
        results.setDate(rs.getString("date"));
        results.setResult(rs.getInt("result"));
        resultList.add(results);
      }
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return resultList;
  }

  /**
   * すべての結果セットを取得する
   * @return 結果セット格納したBeanクラス
   */
  public List<Results> selectAllResults() {
    List<Results> resultList = new ArrayList<>();
    String sql = "SELECT kpiID, date, result FROM results ORDER BY kpiID";
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      ResultSet rs = ps.executeQuery();
      while (rs.next()) {
        Results results = new Results();
        results.setKpiID(rs.getInt("kpiID"));
        results.setDate(rs.getString("date"));
        results.setResult(rs.getInt("result"));
        resultList.add(results);
      }
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return resultList;
  }

  /**
   * IDに紐づく結果リストを削除する
   * @param kpiId 項目番号と紐づくID
   * @return 削除した件数
   */
  public int deleteResults(int kpiId) {
    int deleteCount = 0;
    String sql = "DELETE FROM results WHERE kpiID=?";
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

  /**
   * idと日付を指定して対象のデータを削除する
   * @param results Bean
   * @return 削除した件数
   */
  public int cancelDays(Results results) {
    int deleteCount = 0;
    String sql = "DELETE FROM results WHERE kpiID=? AND date=?";
    try {
      super.connect();
      ps = db.prepareStatement(sql);
      ps.setInt(1, results.getKpiID());
      ps.setString(2, results.getDate());
      deleteCount = ps.executeUpdate();
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      super.disconnect();
    }
    return deleteCount;
  }

}
