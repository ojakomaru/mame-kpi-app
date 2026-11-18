<section id="insertKpiForm" class="popup insertKpiForm">
<form action="<%=request.getContextPath() %>/InsertKpi" method="POST">
  <h1 id="formTitle">新しい習慣</h1>
  <div class="selectLimiter">
    <p class="selected">やめる</p>
    <p>制限する</p>
  </div>
  <label for="habitName">
    習慣の名前
    <input type="text" name="habitName" id="habitName">
  </label>
  <label for="user">
    目標の担当者
    <select name="user" id="user">
      <option value="1">おジャコ</option>
      <option value="2">ハーちゃん</option>
      <option value="3" selected >二人で頑張る♡</option>
    </select>
  </label>
  <picture id="iconChangeButton">
    <img id="selectedImage" src="<%=request.getContextPath() %>/assets/img/beel.svg">
    <c:import url="iconSelect.jsp"></c:import>
  </picture>
  <label for="habitGoalValue">
    目標
    <input type="number" name="habitGoalValue" id="habitGoalValue" min="0" max="999" value="1">
  </label>
  <select name="habitGoalUnit" id="habitGoalUnit">
    <option value="1" selected>回</option>
    <option value="2">時間</option>
    <option value="3">分</option>
  </select>
  <select name="habitGoalPeriodicity" id="habitGoalPeriodicity">
    <option value="1" selected>1日あたり</option>
    <option value="2">1週間あたり</option>
    <option value="3">1ヶ月あたり</option>
  </select>
  <fieldset>
    繰り返し
    <input id="interval1" name="habitInterval" type="checkbox" value="月" checked>
    <label for="interval1">月</label>
    <input id="interval2" name="habitInterval" type="checkbox" value="火" checked>
    <label for="interval2">火</label>
    <input id="interval3" name="habitInterval" type="checkbox" value="水" checked>
    <label for="interval3">水</label>
    <input id="interval4" name="habitInterval" type="checkbox" value="木" checked>
    <label for="interval4">木</label>
    <input id="interval5" name="habitInterval" type="checkbox" value="金" checked>
    <label for="interval5">金</label>
    <input id="interval6" name="habitInterval" type="checkbox" value="土" checked>
    <label for="interval6">土</label>
    <input id="interval7" name="habitInterval" type="checkbox" value="日" checked>
    <label for="interval7">日</label>
  </fieldset>
  <label for="startDate">
    開始日
    <input type="date" name="startDate" id="startDate">
  </label>
  <input id="onLimit" type="hidden" name="onLimit" value="false">
  <input id="badHabit" type="hidden" name="badHabit" value="false">
  <input type="reset" value="キャンセル">
  <input type="submit" value="保存">
</form>
</section>