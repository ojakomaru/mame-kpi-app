# 使いやすい目標管理アプリ
アプリの設計で有用なサイトは以下です。
- [参考サイト利用方法](https://www.kerenor.jp/how-to-use-habitify/)
- [参考サイトPC版もある](https://lifehacking.jp/2019/07/habitify-ver6/)
アプリを作成、いやホームページの制作も設計がダメすぎて  何度も修正改修が発生している。  そのため、基本的には既存のアプリの設計を踏襲する形が良いかと思いました。  また画面設定が見れないと上手くイメージも湧かないため、デザインツールを使用するまでしなくても、既存のものを参考にHTMLとCSSのみで簡単にメインの画面だけでも作成してしまおうと思った。
 
## 目標のデータ設計
データベースの設計をまとめます。
### habitテーブル
- id
- user: 目標の担当者 int 1=おジャコ, 2=ハーちゃん, 3=二人で頑張る♡
- habitName: 習慣の名前 varchar(64)
- icon: 習慣に設定するアイコン varchar(12)
- habitGoalValue: 目標 int
- habitGoalUnit: 目標単位 int 1=回, 2=時間, 3=分
- habitGoalPeriodicity: int 1=一日あたり, 2=一週間あたり, 3=一ヶ月あたり
- habitInterval: 繰り返し varchar(200) [月,火,水,木,金,土,日]
- startDate: 開始日 varchar(64)
- badHabit: 悪い習慣かどうか true/false
```
habit | CREATE TABLE `habit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` int DEFAULT '3',
  `habitName` varchar(64) NOT NULL,
  `icon` varchar(20) DEFAULT 'f3c',
  `habitGoalValue` int NOT NULL,
  `habitGoalUnit` int DEFAULT '1',
  `habitGoalPeriodicity` int DEFAULT '1',
  `habitInterval` varchar(1049) DEFAULT '月,火,水,木,金,土,日',
  `startDate` varchar(64) NOT NULL,
  `badHabit` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
```
### NULLを許可
```
alter table habit modify habitGoalValue int null;
```
確認：show columns from habit;

### カラムを追加
```
 alter table habit add onLimit boolean default 0;
```

### インサート文のサンプル
```
INSERT INTO habit(user, habitName, icon, habitGoalValue, habitGoalUnit, habitGoalPeriodicity, habitInterval, startDate, badHabit) VALUES(1,'おジャコ','gift-solid.svg',5,2,1,'月,火,水','2023-02-10',0);
```

## 成果の結果セット
- id
- kpiID: 目標の方に紐づくIDの値
- date: 目標の結果が格納されている日付
- result: 達成した回数になる数値
### resultsテーブル
```
 results | CREATE TABLE `results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kpiID` int DEFAULT NULL,
  `date` varchar(64) DEFAULT NULL,
  `result` int DEFAULT '0',
  PRIMARY KEY (`id`)

```