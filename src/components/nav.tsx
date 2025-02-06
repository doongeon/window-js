import { ColorResult } from 'react-color';
import ColorBtn from './color-btn';
import { useNavigate } from 'react-router';
import { Geul } from '../types/guel';
import { Square } from '../types/square';

export default function Nav({
  assets,
  selection,
  handleAddSquare,
  handleAddGeul,
  handleDeleteAsset,
  convertToSelect,
  updateCardColor,
  moveToTopOfZStack,
  moveToBottomOfZStack,
}: {
  assets: { [key: number]: Square | Geul };
  selection: number[];
  handleAddSquare: () => void;
  handleAddGeul: () => void;
  handleDeleteAsset: () => void;
  convertToSelect: () => void;
  updateCardColor: (colorMap: { [key: number]: string }) => void;
  moveToTopOfZStack: ({ assetIds }: { assetIds: number[] }) => void;
  moveToBottomOfZStack: ({ assetIds }: { assetIds: number[] }) => void;
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
    <nav className="py-2 px-4 h-[60px] fixed top-0 left-0 z-10 w-full flex items-end gap-4 text-white bg-gradient-to-r from-cyan-400 to-pink-400">
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
        className={`${selection.length > 0 ? 'opacity-100' : 'opacity-40'}`}
        disabled={selection.length === 0}
        onClick={handleDeleteAsset}
      >
        삭제
      </button>
      <ColorBtn
        active={
          selection.length > 0 &&
          selection.filter((assetId) => assets[assetId] instanceof Geul)
            .length === 0
        }
        handleColorChange={handleColorChange}
      />
      <button
        className={`${selection.length > 0 ? 'opacity-100' : 'opacity-40'}`}
        disabled={selection.length === 0}
        onClick={() => {
          moveToTopOfZStack({ assetIds: selection });
        }}
      >
        맨 위로
      </button>
      <button
        className={`${selection.length > 0 ? 'opacity-100' : 'opacity-40'}`}
        disabled={selection.length === 0}
        onClick={() => {
          moveToBottomOfZStack({ assetIds: selection });
        }}
      >
        맨 뒤로
      </button>
      <button
        disabled={true}
        onClick={() => {
          if (process.env.NODE_ENV === 'development') {
            navigate('/oauth2/callback?code=123');
          } else {
            window.location.replace(
              'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=193814143627-iherkj2filktbt1566ts6lmhse67a6ol.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwindow-js.netlify.app%2Foauth2%2Fcallback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow'
            );
          }
        }}
      >
        로그인
      </button>
    </nav>
  );
}
