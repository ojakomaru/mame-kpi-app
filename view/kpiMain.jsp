<%@ page language="java" %>
<%--
  Tomcatのアプリケーションを起動
  /Applications/apache-tomcat-10.0.27/bin/に移動して./startup.shを実行。終了時は./shutdown.shを実行
  開発用DBを起動
  MAMPを立ち上げサーバーをstartする
--%>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <script src="https://kit.fontawesome.com/fb19e987ff.js" crossorigin="anonymous"></script>
  <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/assets/css/ress.css">
  <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/assets/css/commons.css">
  <script type="module" language="Javascript" src="<%=request.getContextPath() %>/assets/js/app.js" defer></script>
  <%-- SVGアイコンの色を変更するライブラリ --%>
  <%-- <script src="<%=request.getContextPath() %>/assets/js/desvg.js" defer></script> --%>
  <script>${logic.writeScript()}</script>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>

  <title>KPI管理メインページ</title>
</head>
<body>
<div id="mask"></div>
<main>
  <c:import url="sidebar.jsp" charEncoding="UTF-8"></c:import>
  <section class="kpiContents">
    <c:import url="contentsHeader.jsp" charEncoding="UTF-8"></c:import>
    <div class="kpiItems">
    <c:if test="${!empty kpiList}">
      <ul>
      <c:forEach var="kpi" items="${kpiList}">
        <li class="kpi"
          data-id="${kpi.getId()}"
          data-user="${kpi.getUser()}"
          data-name="${kpi.getHabitName()}"
          data-icon="${kpi.getIcon()}"
          data-value="${kpi.getHabitGoalValue()}"
          data-unit="${kpi.getHabitGoalUnit()}"
          data-periodicity="${kpi.getHabitGoalPeriodicity()}"
          data-interval="${kpi.getHabitInterval()}"
          data-date="${kpi.getStartDate()}"
          data-isbad="${kpi.isBadHabit()}"
          data-islimit="${kpi.isOnLimit()}">
          <div class="progressJournal">
            <picture><img class="svg" src="<%=request.getContextPath() %>/assets/img/${kpi.getIcon()}"></picture>
            <div class="item">
              <p>${kpi.getHabitName()}</p>
              <p>${kpi.getUserStr()}
              <c:if test="${kpi.getHabitGoalPeriodicity() != 1}">
              / ${kpi.getPeriodicityStr()}間目標
              </c:if>
              </p>
            </div>
          </div>
          <div class="progressGauge">
            <span></span>
            <div class="gauge"><span>0</span></div>
            <span>${kpi.getHabitGoalValue()}/${kpi.getUnitStr()}</span>
          </div>
          <div class="itemHabitInfo">
            <button data-id="${kpi.getId()}" class="plusOne">＋１</button>
            <button data-id="${kpi.getId()}" class="settings"><span class="dot"></span></button>
            <div class="modBox">
              <ul>
                <c:choose>
                  <c:when test="${kpi.getHabitGoalPeriodicity() != 1}">
                    <li id="resetValue${kpi.getId()}">進捗リセット</li>
                  </c:when>
                  <c:otherwise>
                    <li id="success${kpi.getId()}">本日成功</li>
                  </c:otherwise>
                </c:choose>
                <li id="skip${kpi.getId()}">スキップする</li>
                <li id="modify${kpi.getId()}">編集</li>
                <li id="cancelDay${kpi.getId()}">本日分取消</li>
              </ul>
            </div>
            <button data-id="${kpi.getId()}" class="deleteIcon"><img class="svg" src="<%=request.getContextPath() %>/assets/img/trash-can-solid.svg"></button>
          </div>
        </li>
      </c:forEach>
      </ul>
    </c:if>
    <c:if test="${!empty limitList}">
      <dl>
        <dt>ネガティブな習慣</dt>
        <dd class="open">
          <ul>
          <c:forEach var="kpi" items="${limitList}">
            <li class="kpi"
              data-id="${kpi.getId()}"
              data-user="${kpi.getUser()}"
              data-name="${kpi.getHabitName()}"
              data-icon="${kpi.getIcon()}"
              data-value="${kpi.getHabitGoalValue()}"
              data-unit="${kpi.getHabitGoalUnit()}"
              data-periodicity="${kpi.getHabitGoalPeriodicity()}"
              data-interval="${kpi.getHabitInterval()}"
              data-date="${kpi.getStartDate()}"
              data-isbad="${kpi.isBadHabit()}"
              data-islimit="${kpi.isOnLimit()}">
              <div class="progressJournal">
                <picture><img class="svg" src="<%=request.getContextPath() %>/assets/img/${kpi.getIcon()}"></picture>
                <div class="item">
                  <p>${kpi.getHabitName()}</p>
                  <p>${kpi.getUserStr()}
                  <c:if test="${kpi.getHabitGoalPeriodicity() != 1}">
                  / ${kpi.getPeriodicityStr()}間目標
                  </c:if>
                  </p>
                </div>
              </div>
              <c:if test="${kpi.isOnLimit()}">
                <div class="progressGauge">
                  <span>${kpi.getPeriodicityStr()}</span>
                  <div class="gauge"><span>0</span></div>
                  <span>${kpi.getHabitGoalValue()}/${kpi.getUnitStr()}</span>
                </div>
              </c:if>
              <div class="itemHabitInfo">
                <button data-id="${kpi.getId()}" class="plusOne">成功</button>
                <button data-id="${kpi.getId()}" class="settings"><span class="dot"></span></button>
                <div class="modBox">
                  <ul>
                    <c:choose>
                      <c:when test="${kpi.getHabitGoalPeriodicity() != 1}">
                        <li id="resetValue${kpi.getId()}">進捗リセット</li>
                      </c:when>
                      <c:otherwise>
                        <li id="success${kpi.getId()}">本日成功</li>
                      </c:otherwise>
                    </c:choose>
                    <li id="skip${kpi.getId()}">スキップする</li>
                    <li id="modify${kpi.getId()}">編集</li>
                  </ul>
                </div>
                <button data-id="${kpi.getId()}" class="deleteIcon"><img class="svg" src="<%=request.getContextPath() %>/assets/img/trash-can-solid.svg"></button>
              </div>
            </li>
          </c:forEach>
          </ul>
        </dd>
      </dl>
    </c:if>
    </div>
  </section>
  <c:import url="singleProgress.jsp" charEncoding="UTF-8"></c:import>
</main>
<div id="addkpi" class="popup addkpi">
  <button>良い習慣を作ろう</button>
  <button>悪い習慣をなくそう</button>
</div>
<c:import url="selectOrder.jsp" charEncoding="UTF-8"></c:import>
<c:import url="addKpiForm.jsp" charEncoding="UTF-8"></c:import>

</body>
</html>