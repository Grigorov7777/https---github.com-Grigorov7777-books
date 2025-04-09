/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

const containerStyle = css`
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
`;

const headerStyle = css`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
`;

const libraryListStyle = css`
  list-style-type: none;
  padding: 0;
`;

const libraryItemStyle = css`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
`;

const Libraries = () => {
  const libraries = [
    {
      name: "Национална библиотека „Св. св. Кирил и Методий“",
      address: "бул. „Васил Левски“ 88, София"
    },
    {
      name: "Столична библиотека",
      address: "пл. „Славейков“ 4, София"
    },
    {
      name: "Регионална библиотека „Пенчо Славейков“",
      address: "бул. „Сливница“ 34, Варна"
    },
    {
      name: "Регионална библиотека „Захарий Княжески“",
      address: "бул. „Руски“ 44, Стара Загора"
    },
    {
      name: "Регионална библиотека „Любен Каравелов“",
      address: "пл. „Батенберг“ 1, Русе"
    },
    {
      name: "Регионална библиотека „Христо Смирненски“",
      address: "ул. „Ген. Владимир Заимов“ 1, Хасково"
    }
  ];

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>Най-големите библиотеки в България</h1>
      <ul css={libraryListStyle}>
        {libraries.map((lib, index) => (
          <li key={index} css={libraryItemStyle}>
            <h3>{lib.name}</h3>
            <p><strong>Адрес:</strong> {lib.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Libraries;
