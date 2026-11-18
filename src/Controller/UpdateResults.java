package Controller;

import java.io.IOException;
import java.io.PrintWriter;
import DAO.ResultsDAO;
import Model.Results;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@WebServlet("/UpdateResults")
public class UpdateResults extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    int kpiID = Integer.parseInt(req.getParameter("id"));
    String date = req.getParameter("date");
    boolean isDel = Boolean.parseBoolean(req.getParameter("del"));
    String updateMsg = null;
    Results results = new Results();
    results.setKpiID(kpiID);
    results.setDate(date);
    ResultsDAO dao = new ResultsDAO();
    if (isDel) {
      int commit = dao.cancelDays(results);
      if (commit > 0) {
        updateMsg = date + "のデータを削除しました。";
      }
    } else {
      results.setResult(1);
      int commit = dao.insertResult(results);
      if (commit > 0) {
        updateMsg = date + "のデータを登録しました。";
      }
    }
    PrintWriter out = resp.getWriter();
    out.println(updateMsg);

  }
  
}
