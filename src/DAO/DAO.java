package DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 * 基本となるDAOクラス
 */
public class DAO {
  protected Connection db;
  protected PreparedStatement ps;
  protected ResultSet rs;

  // 接続共通処理
  protected void connect() throws NamingException, SQLException {
    String connectionURL = "java:comp/env/jdbc/habit";
    Context ctx = new InitialContext();
    DataSource ds = (DataSource) ctx.lookup(connectionURL);
    this.db = ds.getConnection();
  }

  // 切断共通処理
  protected void disconnect() {
    try {
      if (rs != null)
        rs.close();
      if (ps != null)
        ps.close();
      if (db != null)
        db.close();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public String TestConnect() {
    String str = "接続失敗です。";
    try {
      this.connect();
      str = "接続成功しました。";
    } catch (NamingException | SQLException e) {
      e.printStackTrace();
    } finally {
      this.disconnect();
    }
    return str;
  }
}