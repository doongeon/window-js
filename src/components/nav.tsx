import { ColorResult } from "react-color";
import ColorBtn from "./color-btn";
import { useNavigate } from "react-router";

export default function Nav({
  selection,
  handleAddSquare,
  handleAddGeul,
  handleDeleteAsset,
  convertToSelect,
  updateCardColor,
  moveToTopOfZStack,
  moveToBottomOfZStack,
  isCardSelected,
}: {
  selection: number[];
  handleAddSquare: () => void;
  handleAddGeul: () => void;
  handleDeleteAsset: () => void;
  convertToSelect: () => void;
  updateCardColor: (colorMap: { [key: number]: string }) => void;
  moveToTopOfZStack: ({ assetIds }: { assetIds: number[] }) => void;
  moveToBottomOfZStack: ({ assetIds }: { assetIds: number[] }) => void;
  isCardSelected: boolean;
}) {
  const navigate = useNavigate();

  function handleColorChange(color: ColorResult) {
    updateCardColor(
      selection.reduce<{ [key: number]: string }>((result, cardId) => {
        result[cardId] = color.hex;
        return result;
      }, {})
    );
  }

  return (
    <nav className="py-2 px-4 fixed top-0 left-0 z-10 w-full flex items-end justify-start gap-4 text-white border-b bg-gradient-to-r from-cyan-400 to-pink-400 border-transparent">
      <h1 className="text-3xl bg-clip-text font-bold">Window.js</h1>
      <button
        onClick={() => {
          convertToSelect();
        }}
      >
        선택
      </button>
      <button onClick={handleAddSquare}>카드 추가</button>
      <button onClick={handleAddGeul}>텍스트 추가</button>
      <button
        className={`${isCardSelected ? "opacity-100" : "opacity-40"}`}
        disabled={!isCardSelected}
        onClick={handleDeleteAsset}
      >
        삭제
      </button>
      <ColorBtn
        isCardSelected={isCardSelected}
        handleColorChange={handleColorChange}
      />
      <button
        className={`${isCardSelected ? "opacity-100" : "opacity-40"}`}
        disabled={!isCardSelected}
        onClick={() => {
          moveToTopOfZStack({ assetIds: selection });
        }}
      >
        맨 위로
      </button>
      <button
        className={`${isCardSelected ? "opacity-100" : "opacity-40"}`}
        disabled={!isCardSelected}
        onClick={() => {
          moveToBottomOfZStack({ assetIds: selection });
        }}
      >
        맨 뒤로
      </button>
      <button
        onClick={() => {
          if (process.env.NODE_ENV === "development") {
            navigate("/oauth2/callback?code=123");
          } else {
            window.location.replace(
              "https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=193814143627-iherkj2filktbt1566ts6lmhse67a6ol.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwindow-js.netlify.app%2Foauth2%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow"
            );
          }
        }}
      >
        로그인
      </button>
    </nav>
  );
}
