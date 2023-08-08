# React-Simple-Object-Editor

オブジェクトデータを簡易的に編集することができる React 用コンポーネントです。  
バックエンドやデータベースが用意されていない、JSON データのみで管理されているコンテンツの更新作業など  
コード改修なしにデータ更新作業ができるミニマルな CMS への利用のために作成されました。

#### 型の判別

文字列(string)・数値(number)・論理(boolean)・配列・オブジェクト・NULL を自動的に判別し、データタイプに応じた入力フォームを表示します。  
数値は小数点以下の位があれば調整の最小単位を動的に判別します。

#### 配列の追加・削除

配列要素の項目名横の`+`ボタンで配列に項目を追加できます。  
配列内の最後の要素をそのまま複製して追加します。  
配列が空の場合は`samples`属性のデータ内から同列のデータを検索して複製を試みます。

また、配列内項目の入力フォーム横の`x`ボタンで配列内から項目を削除できます。

#### 型の変更

入力フォームにマウスオーバーするとフォーム右端にボタンが表示され、クリックすることで値の型を変更可能な編集モードに入ります。  
JSON の値と同様の形式で入力すると、型が自動的に判別されて値が更新されます。

## Installation and usage

インポート後、JSX 要素として組み込んでください。

```jsx
import SimpleObjectEditor from "./SimpleObjectEditor";

const data = {
  id: 1,
  name: "Example item",
  tags: ["tagA", "tagB"],
};

<SimpleObjectEditor
  data={data}
  types={{ id: null }}
  samples={[data]}
  onChange={(newData) => {
    console.log(newData);
  }}
/>;
```

## Props

#### data

渡されたオブジェクトの型に合わせて内容を編集できます。  
配列以外の項目を追加したり、型を変更したりといったことはこのエディタでは対応できません。

#### types

キーを指定してフォームの入力形式を指定します。
一致するキーがあれば入力フォームの形式が変更されます。
キー名はドット区切りでネストされたデータを指定します。
配列が想定されるキーにつなげて`.*`とアスタリスクを指定すると、配列内の要素すべてに影響します。

- `null`・`'none'` 非表示
- `'text'` テキスト固定
- `'number'` 数値固定
- 配列 セレクトボックス
- オブジェクト・Map セレクトボックス (値を表示名として使用)

```jsx
types={{
  // 非表示
  id: null,
  // セレクトボックス
  type: { text: 'テキスト', html: 'HTML' },
  // セレクトボックス (値が数値)
  category: new Map([[1, 'ページ'], [2, 'ニュース']]),
  // セレクトボックス (ネストされたデータ)
  'links.\*.target': ['_self', '_blank'],
}}
```

#### samples

配列の項目を追加複製する際にサンプルとして利用するデータ配列です。

#### onChange

データが編集されたときに実行されるコールバックです。  
引数に更新後のデータが渡されます。

#### className

コンポーネント最上位にクラス名を追加します。

#### classNamePrefix

指定した接頭辞を持つ CSS クラスをコンポーネント内の各要素に付加します。

## Styles

CSS 変数を上書きするとカラースキームを変更できます。

```css
.object-editor-override {
  --simple-object-editor-button-color: 210, 202, 221;
  --simple-object-editor-border-color: 200, 190, 204;
  --simple-object-editor-free-input-color: 178, 27, 27;
}
```

また、`className`・`classNamePrefix`属性によるスタイルの上書きが可能です。
