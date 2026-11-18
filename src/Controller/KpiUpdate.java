package Controller;

import java.io.IOException;
import DAO.KpiDAO;
import Model.Kpi;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@WebServlet("/KpiUpdate")
public class KpiUpdate extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    req.setCharacterEncoding("UTF-8");
    Kpi kpi = new Kpi();
    kpi.setId(Integer.parseInt(req.getParameter("id")));
    kpi.setUser(Integer.parseInt(req.getParameter("user")));
    kpi.setHabitName(req.getParameter("habitName"));
    kpi.setIcon(req.getParameter("icon"));
    kpi.setHabitGoalValue(Integer.parseInt(req.getParameter("habitGoalValue")));
    kpi.setHabitGoalUnit(Integer.parseInt(req.getParameter("habitGoalUnit")));
    kpi.setHabitGoalPeriodicity(Integer.parseInt(req.getParameter("habitGoalPeriodicity")));
    kpi.setHabitInterval(req.getParameterValues("habitInterval"));
    kpi.setStartDate(req.getParameter("startDate"));
    kpi.setBadHabit(Boolean.parseBoolean(req.getParameter("badHabit")));
    kpi.setOnLimit(Boolean.parseBoolean(req.getParameter("onLimit")));
    KpiDAO dao = new KpiDAO();
    int upCount = dao.updateKpi(kpi);
    req.setAttribute("upCount", upCount);
    this.getServletContext().getRequestDispatcher("/main").forward(req, resp);
  }
}
