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
}

export default function App() {
  const [dataList, setDataList] = useState<Article[]>([
    { id: 1, title: 'One', description: [''], detail: { id: 1, isDisplay: true } },
    { id: 2, title: 'Two', description: [''], detail: { id: 2, isDisplay: true } },
    { id: 3, title: 'Three', description: [null], detail: { id: 3, isDisplay: false } },
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
            <SimpleObjectEditor data={data} excludes={['id']} onChange={handleChange} className="simple-object-editor-override" classNamePrefix="simple-object-editor" />
          </div>
        ))}
      </section>
    </main>
  );
}
