package Controller;

import java.io.IOException;
import DAO.KpiDAO;
import DAO.ResultsDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@WebServlet(urlPatterns = {
  "/DeleteKpi","/main/DeleteKpi"
})
public class DeleteKpi extends HttpServlet{
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    resp.setCharacterEncoding("UTF-8");
    int deleteId = Integer.parseInt(req.getParameter("id"));
    // 項目番号からKPIを取得
    KpiDAO kpiDAO = new KpiDAO();
    ResultsDAO rsDAO = new ResultsDAO();
    int kpiDelete = kpiDAO.deleteOne(deleteId);
    int resultsDelete = rsDAO.deleteResults(deleteId);
    req.setAttribute("kpiDelete", kpiDelete);
    req.setAttribute("resultsDelete", resultsDelete);
    this.getServletContext().getRequestDispatcher("/main").forward(req, resp);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    this.doGet(req, resp);
  }
}
