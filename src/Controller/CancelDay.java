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
@WebServlet("/CancelDay")
public class CancelDay extends HttpServlet {

  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setCharacterEncoding("UTF-8");
    int kpiID = Integer.parseInt(req.getParameter("id"));
    String date = req.getParameter("date");
    Results results = new Results();
    results.setKpiID(kpiID);
    results.setDate(date);
    ResultsDAO dao = new ResultsDAO();
    int deleteCount = dao.cancelDays(results);
    req.setAttribute("deleteCount", deleteCount);
    if (deleteCount != 0) {
      PrintWriter out = resp.getWriter();
      out.println(deleteCount + "件のデータを取り消しました");
    }
  }

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    this.doPost(req, resp);
  }
  
}
