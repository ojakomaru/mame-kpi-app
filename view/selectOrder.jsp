<div class="popup selectOrder">
  <form action="OrderByChange" method="POST" id="selectOrder">
    <label for="sortColumn">ソート基準</label>
    <select id="sortColumn" name="sortColumn">
      <option value="id" ${sortColumn.equals("id") ? "selected" : ""}>登録順</option>
      <option value="habitName" ${sortColumn.equals("habitName") ? "selected" : ""}>習慣名</option>
      <option value="orderBySuccessCount" ${sortColumn.equals("orderBySuccessCount") ? "selected" : ""}>達成数</option>
    </select>
    <input type="radio" id="desc" name="order" value="DESC" checked>
    <label for="desc">降順</label>
    <input type="radio" id="asc" name="order" value="ASC">
    <label for="asc">昇順</label>
    <input type="submit" value="並び替える">
  </form>
</div>