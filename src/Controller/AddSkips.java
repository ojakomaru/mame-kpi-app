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
@WebServlet("/AddSkips")
public class AddSkips extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setCharacterEncoding("UTF-8");
    String[] skipKpi = req.getParameter("skipKpi").split(",");
    String date = req.getParameter("date");
    int insertCount = 0;
    for (int i = 0; i < skipKpi.length; i++) {
      int kpiID = Integer.parseInt(skipKpi[i]);
      Results results = new Results(kpiID, date, 0);
      ResultsDAO dao = new ResultsDAO();
      insertCount += dao.insertResult(results);
    }
    if (insertCount != 0) {
      PrintWriter out = resp.getWriter();
      out.println(insertCount + "件のデータをスキップしました。");
    }
  }
}

