package Controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Properties;
import DAO.KpiDAO;
import DAO.ResultsDAO;
import Model.Kpi;
import Model.KpiCalendar;
import Model.KpiCalendarLogic;
import Model.Results;
import Model.BusinessLogic;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/main")
public class KpiAppMain extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    // カレンダーのリンク用のメソッド
    String s_year = req.getParameter("year");
    String s_month = req.getParameter("month");
    KpiCalendarLogic calLogic = new KpiCalendarLogic();
    KpiCalendar calendar = null;
    if (s_year != null && s_month != null) {
      int year = Integer.parseInt(s_year);
      int month = Integer.parseInt(s_month);
      if (month == 0) {
        month = 12;
        year--;
      }
      if (month == 13) {
        month = 1;
        year++;
      }
      calendar = calLogic.creatCalendar(year, month);
    } else {
      calendar = calLogic.creatCalendar();
    }

    // ソート順変更リクエストの場合
    Properties p = new Properties();
    String path = this.getServletContext().getRealPath("/WEB-INF/habit.properties");
    String sortColumn = null;
    String order = null;
    try (InputStream iStream = new FileInputStream(path)) {
      p.load(iStream);
      sortColumn = p.getProperty("sortColumn");
      order = p.getProperty("order");
      iStream.close();
    } catch (Exception e) {
      e.printStackTrace();
    }

    // KPI項目の取得とセット
    List<Kpi> kpis = null;
    if (sortColumn.equals("orderBySuccessCount")) {
      kpis = new KpiDAO().orderSuccessCount(order);
    } else {
      kpis = new KpiDAO().selectAllKpi(sortColumn, order);
    }
    // 結果セットの取得とセット
    ResultsDAO RsDao = new ResultsDAO();
    List<Results> resultList = RsDao.selectAllResults();
    // 値処理用のロジッククラス
    BusinessLogic logic = new BusinessLogic(kpis, resultList);
    
    req.setAttribute("kcal", calendar);
    req.setAttribute("limitList", logic.getBadHabits());
    req.setAttribute("kpiList", logic.getGoodKpis());
    req.setAttribute("sortColumn", sortColumn);

    // メイン画面へディスパッチ
    this.getServletContext().getRequestDispatcher("/view/kpiMain.jsp").forward(req, resp);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    this.doGet(req, resp);
  }
}
