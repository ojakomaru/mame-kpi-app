package Controller;

import java.io.IOException;
import java.util.List;
import DAO.KpiDAO;
import DAO.ResultsDAO;
import Model.BusinessLogic;
import Model.Kpi;
import Model.KpiCalendar;
import Model.KpiCalendarLogic;
import Model.Results;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@WebServlet("/ListSearch")
public class ListSearch extends HttpServlet {

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    KpiCalendarLogic calLogic = new KpiCalendarLogic();
    KpiCalendar calendar = calLogic.creatCalendar();
    String keyWord = req.getParameter("search");
    List<Kpi> kpis = new KpiDAO().kpiSearch(keyWord);
    ResultsDAO RsDao = new ResultsDAO();
    List<Results> resultList = RsDao.selectAllResults();
    BusinessLogic logic = new BusinessLogic(kpis, resultList);
    req.setAttribute("kcal", calendar);
    req.setAttribute("limitList", logic.getBadHabits());
    req.setAttribute("kpiList", logic.getGoodKpis());
    // メイン画面へディスパッチ
    this.getServletContext().getRequestDispatcher("/view/kpiMain.jsp").forward(req, resp);
  }
  
}
