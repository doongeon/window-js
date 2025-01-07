import { ChangeEvent, useEffect, useState } from "react";

function Card({ cardId }: { cardId: number }) {
  const [isTyping, setIsTyping] = useState(false);
  const [isDraging, setIsDraging] = useState(false);
  const [text, setText] = useState(`Card #${cardId}`);
  const [size, setSize] = useState({ width: 100, height: 40 });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isTyping) setIsTyping(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log(e);
    setText(e.target.value);
  }

  function handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      setIsTyping(false);
    }
  }

  return (
    <div
      className="absolute border border-red-300 container w-10"
      onClick={handleClick}
      style={{
        width: size.width,
        height: size.height,
      }}
    >
      {isTyping ? (
        <textarea
          className="w-full h-full"
          autoFocus
          defaultValue={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyDown}
        />
      ) : (
        <p className="w-full h-full">{text}</p>
      )}
    </div>
  );
}

function App() {
  const [cards, setCards] = useState<{ id: number }[]>([]);
  const [cardId, setCardId] = useState(0);

  function cardAddHandler() {
    setCardId((prev) => {
      const newId = prev + 1;
      setCards((prevCards) => [...prevCards, { id: newId }]);
      return newId;
    });
  }

  return (
    <>
      <nav className="py-2 px-4 bg-slate-200">
        <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 font-bold">
          Window.js
        </h1>
        <button onClick={cardAddHandler}>Add card</button>
      </nav>
      <div className="cards relative bg-green-300 w-full h-[500px]">
        {cards.map((card) => (
          <Card cardId={card.id} key={card.id} />
        ))}
      </div>
    </>
  );
}

export default App;
