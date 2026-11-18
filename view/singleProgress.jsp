<%@ page language="java" import="Model.KpiCalendar"%>
<%
	KpiCalendar kcal=(KpiCalendar)request.getAttribute("kcal");
%>
<section class="singleProgress">
  <h1 id="habitTitle">KPI項目</h1>
  <dl>
    <dt>開始日：</dt>
    <dd id="startDay">…</dd>
  </dl>
  <dl>
    <dt>担当：</dt>
    <dd id="habitUser">…</dd>
  </dl>
  <dl>
    <dt>曜日指定：</dt>
    <dd id="intervalDay">…</dd>
  </dl>
  <nav>
    <ul>
      <li>
        <dl>
          <dt>現在の連続記録</dt>
          <dd id="continueDay">０日</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>達成</dt>
          <dd id="attainDay">０日</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>未達成</dt>
          <dd id="missDay">０日</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>スキップ</dt>
          <dd id="skipDay">０日</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>統計</dt>
          <dd id="statsDay">０回</dd>
        </dl>
      </li>
    </ul>
  </nav>
  <section class="calendarArea">
    <div class="table_head">
      <a href="?year=${kcal.getYear()}&month=${kcal.getMonth()-1}">前月</a>
      <h1>${kcal.getGengou()}年${kcal.getMonth() }月</h1>
    	<a href="?year=${kcal.getYear()}&month=${kcal.getMonth()+1}">翌月</a>
    </div>
    <input id="updateYear" type="hidden" name="year" value="${kcal.getYear()}">
    <input id="updateMonth" type="hidden" name="month" value="${kcal.getMonth()}">
    <table>
      <tbody>
        <tr>
          <th>日</th>
          <th>月</th>
          <th>火</th>
          <th>水</th>
          <th>木</th>
          <th>金</th>
          <th>土</th>
        </tr>
        <%for(String[] row: kcal.getData()){ %>
        <tr>
          <%for(String col:row) {%>
            <%if (col.startsWith("*")){ %>
              <td class="today"><%=col.substring(1)%></td>
            <%}else{ %>
              <td><%=col %></td>
            <%} %>
          <%} %>
        </tr>
        <%} %>
      </tbody>
    </table>
  </section>
</section>