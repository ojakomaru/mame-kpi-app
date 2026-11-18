package Controller;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Properties;
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
@WebServlet("/OrderByChange")
public class OrderByChange extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    KpiCalendarLogic calLogic = new KpiCalendarLogic();
    KpiCalendar calendar = calLogic.creatCalendar();

    String sortColumn = req.getParameter("sortColumn");
    String order = req.getParameter("order");
    Properties p = new Properties();
    String path = this.getServletContext().getRealPath("/WEB-INF/habit.properties");
    p.setProperty("sortColumn", sortColumn);
    p.setProperty("order", order);
    p.store(new FileOutputStream(path), "change Of Sort");
    
    List<Kpi> kpis = null;
    if (sortColumn.equals("orderBySuccessCount")) {
      kpis = new KpiDAO().orderSuccessCount(order);
    } else {
      kpis = new KpiDAO().selectAllKpi(sortColumn, order);
    }
    ResultsDAO RsDao = new ResultsDAO();
    List<Results> resultList = RsDao.selectAllResults();
    BusinessLogic logic = new BusinessLogic(kpis, resultList);
    req.setAttribute("kcal", calendar);
    req.setAttribute("limitList", logic.getBadHabits());
    req.setAttribute("kpiList", logic.getGoodKpis());
    req.setAttribute("sortColumn", sortColumn);

    // メイン画面へディスパッチ
    this.getServletContext().getRequestDispatcher("/view/kpiMain.jsp").forward(req, resp);
  }
}
