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
@WebServlet("/AddResult")
public class AddResult extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setCharacterEncoding("UTF-8");
    int kpiID = Integer.parseInt(req.getParameter("id"));
    String date = req.getParameter("date");
    boolean skip = Boolean.valueOf(req.getParameter("skip"));
    int result = skip ? 0 : 1;
    Results results = new Results(kpiID, date, result);
    ResultsDAO dao = new ResultsDAO();
    int insertCount = dao.insertResult(results);
    req.setAttribute("insertCount", insertCount);
    if (insertCount != 0) {
      PrintWriter out = resp.getWriter();
      out.println("本日の進捗を登録しました。");
    }
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    this.doPost(req, resp);
  }
  
}
