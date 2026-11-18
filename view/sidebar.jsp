<section class="sidebar">
  <p id="today">本日の目標</p>
  <aside>
    <h2 id="tenkiTitle">天気</h2>
    <c:forEach begin="1" end="3" varStatus="i">
    <dl>
      <dt id="dateLabel-${i.index}">…</dt>
      <dd id="telop-${i.index}" data="tenkiImage"></dd>
      <dd class="chanceOfRain">
        <small id="chanceOfRainMorning-${i.index}"></small>
        <small id="chanceOfRainAfternoon-${i.index}"></small>
      </dd>
      <dd class="temperature">
        <small id="tempMin-${i.index}">…</small>
        <small>〜</small>
        <small id="tempMax-${i.index}">…</small>
      </dd>
    </dl>
    </c:forEach>

    <dl>
      <dt>設定</dt>
      <dd>習慣を管理する</dd>
    </dl>
  </aside>
</section>