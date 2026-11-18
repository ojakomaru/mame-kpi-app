package Controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import DAO.ResultsDAO;
import Model.Results;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/GetResult")
public class GetResult extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setCharacterEncoding("UTF-8");
    PrintWriter out = resp.getWriter();
    String resultJson = null;
    int kpiID = Integer.parseInt(req.getParameter("id"));
    ResultsDAO dao = new ResultsDAO();
    try {
      List<Results> resultSet = dao.selectOneResult(kpiID);
      ObjectMapper mapper = new ObjectMapper();
      //Listは変換できないのでListの値を持つMapを作成
      Map<String, List<Results>> resultMap = new HashMap<>();
      resultMap.put("json", resultSet);
      resultJson = mapper.writeValueAsString(resultMap);
    } catch (Exception e) {
      e.printStackTrace();
    }
    out.println(resultJson);
  }
}
