/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

// Стилове
const containerStyle = css`padding: 24px; max-width: 960px; margin: 0 auto;`;
const headerStyle = css`font-size: 3rem; font-weight: bold; text-align: center; margin-bottom: 24px;`;
const clubListStyle = css`margin-top: 24px; list-style-type: none; padding: 0;`;
const clubItemStyle = css`
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
`;
const clubTitleStyle = css`font-size: 1.5rem; font-weight: bold; color: #333;`;
const clubDescriptionStyle = css`margin-top: 8px; color: #555;`;
const clubLinkStyle = css`
  margin-top: 12px;
  display: inline-block;
  color: #8B4513;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const BookClubs = () => {
  // Списък с примери за читателски клубове
  const clubs = [
    {
      name: "Клуб за любители на съвременна литература",
      location: "София",
      description: "Този клуб обединява любители на съвременната българска и международна литература. Всеки месец избираме нова книга за дискусия.",
      link: "https://facebook.com/bookclub1"
    },
    {
      name: "Класическа литература и философия",
      location: "Пловдив",
      description: "Клуб за четене и обсъждане на класически произведения от литературата и философията. Приветстваме хора с дълбок интерес към старите текстове.",
      link: "https://facebook.com/bookclub2"
    },
    {
      name: "Фентъзи и научна фантастика",
      location: "Варна",
      description: "Ако обичате да потъвате в свят на фантазия и научни чудеса, този клуб е за вас! Обсъждаме най-новите и най-добрите произведения в тези жанрове.",
      link: "https://facebook.com/bookclub3"
    },
    {
      name: "Женска литература и писателки",
      location: "Бургас",
      description: "В този клуб се фокусираме върху литература от женски автори. Всеки месец избираме творба, написана от жена, която предизвиква интерес и въпроси.",
      link: "https://facebook.com/bookclub4"
    }
  ];

  return (
    <div css={containerStyle}>
      <h1 css={headerStyle}>Читателски клубове</h1>

      <ul css={clubListStyle}>
        {clubs.map((club, index) => (
          <li key={index} css={clubItemStyle}>
            <div css={clubTitleStyle}>{club.name} - {club.location}</div>
            <p css={clubDescriptionStyle}>{club.description}</p>
            <a href={club.link} target="_blank" rel="noopener noreferrer" css={clubLinkStyle}>
              Прочети повече / Присъедини се
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookClubs;
