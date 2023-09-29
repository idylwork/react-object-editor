import { useEffect, useState } from 'react';
import SimpleObjectEditor from '../components/SimpleObjectEditor';

type ArticleCategory = {
  id: number;
  isDisplay: boolean;
}

type Article = {
  id: number;
  title: string;
  description: (string|null)[];
  detail: ArticleCategory;
  categoryId: number;
}

const typeRule = {
  id: null,
  title: 'string?',
  categoryId: { 'Category A': 1, 'Category B': 2, 'Category C': 3 },
};

export default function App() {
  const [dataList, setDataList] = useState<Article[]>([
    { id: 1, title: 'One', categoryId: 1, description: ['Example 1', 'Example 2'], detail: { id: 1, isDisplay: true } },
    { id: 2, title: 'Two', categoryId: 2, description: [''], detail: { id: 2, isDisplay: true } },
    { id: 3, title: 'Three', categoryId: 4, description: [null], detail: { id: 3, isDisplay: false } },
  ]);

  const [json, setJson] = useState('');

  useEffect(() => {
    setJson(JSON.stringify(dataList, null, 2));
  }, [dataList]);

  const handleChange = (newData: Article) => {
    const newDataList = [...dataList];
    const index = newDataList.findIndex((data) => (data.id === newData.id));
    if (index >= 0) {
      newDataList.splice(index, 1, newData);
      setDataList(newDataList);
    }
  };

  return (
    <main className="main">
      <section className="preview">
        {json}
      </section>
      <section className="editor">
        {dataList.map((data) => (
          <div key={data.id}>
            <SimpleObjectEditor
              data={data}
              types={typeRule}
              onChange={handleChange}
              className="simple-object-editor-override"
              classNamePrefix="simple-object-editor"
            />
          </div>
        ))}
      </section>
    </main>
  );
}
