/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from "react";

const containerStyle = css`
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
`;

const headerStyle = css`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
`;

const listStyle = css`
  list-style-type: none;
  padding: 0;
`;

const itemStyle = css`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: #fdf6e3;
`;

const Bookstores = () => {
  const bookstores = [
    { name: "Хеликон", address: "бул. „Цар Освободител“ 4, София" },
    { name: "Сиела", address: "бул. „Витоша“ 60, София" },
    { name: "Гринуич", address: "бул. „Витоша“ 37, София" },
    { name: "Бард", address: "ул. „Г. С. Раковски“ 161, София" },
    { name: "Orange Center", address: "бул. „Александър Стамболийски“ 101, София" },
  ];

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>Големи книжарници в България</h1>
      <ul css={listStyle}>
        {bookstores.map((store, index) => (
          <li key={index} css={itemStyle}>
            <strong>{store.name}</strong>
            <p>{store.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookstores;
