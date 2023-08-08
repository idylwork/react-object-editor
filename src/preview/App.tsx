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

export default function App() {
  const [dataList, setDataList] = useState<Article[]>([
    { id: 1, title: 'One', categoryId: 1, description: [''], detail: { id: 1, isDisplay: true } },
    { id: 2, title: 'Two', categoryId: 1, description: [''], detail: { id: 2, isDisplay: true } },
    { id: 3, title: 'Three', categoryId: 2, description: [null], detail: { id: 3, isDisplay: false } },
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
              types={{ id: null, categoryId: new Map([[1, 'Category A'], [2, 'Category B'], [3, 'Category C']]) }}
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
