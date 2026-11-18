package Model;

import java.util.List;
import java.util.stream.Collectors;

public class BusinessLogic {
  private List<Kpi> kpis;
  private List<Kpi> goodKpis;
  private List<Kpi> badHabits;
  private List<Results> results;

  public BusinessLogic(List<Kpi> kpis, List<Results> results) {
    this.kpis = kpis;
    this.results = results;
    this.goodKpis = kpis.stream()
        .filter(kpi -> !kpi.isBadHabit())
        .collect(Collectors.toList());
    this.badHabits = kpis.stream()
        .filter(kpi -> kpi.isBadHabit())
        .collect(Collectors.toList());
  }

  public BusinessLogic(List<Kpi> kpis) {
    this.kpis = kpis;
  }

  public List<Kpi> getKpis() {
    return kpis;
  }

  public void setKpis(List<Kpi> kpis) {
    this.kpis = kpis;
  }

  public List<Kpi> getGoodKpis() {
    return goodKpis;
  }

  public List<Kpi> getBadHabits() {
    return badHabits;
  }

  public void setResults(List<Results> results) {
    this.results = results;
  }

  /**
   * JSPページでJavaScriptのオブジェクトを作成する
   * @return 結果セットのオブジェクトの文字列
   * 返り値の例 Results [{…}, {…}, {…}]
   */
  public String writeScript() {
    StringBuffer strBuf = new StringBuffer();
    strBuf.append("var Results =[\n");
    for (Results rs : this.results) {
      strBuf.append("{\t kpiID:");
      strBuf.append("\t" + rs.getKpiID() + ",\n");
      strBuf.append("\t date:");
      strBuf.append("\"" + rs.getDate() + "\", \n");
      strBuf.append("\t result:");
      strBuf.append("\t" + rs.getResult() + "\n");
      strBuf.append("},\n");
    }
    strBuf.append("];");
    return strBuf.toString();
  }
}
