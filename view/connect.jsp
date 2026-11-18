<%@ page import="java.sql.*, javax.naming.*, javax.sql.*" %>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>アプリのデータベースへの接続</title>
</head>
<body>
<%
  Context context = new InitialContext();
  DataSource ds = (DataSource)context.lookup("java:comp/env/jdbc/habit");
  Connection db = ds.getConnection();
  db.close();
%>
<h1>KPIデータベースへ接続成功</h1>
</body>
</html>