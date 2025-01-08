export default function SelectSquare({
  start,
  end,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
}) {
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <div
      className="absolute bg-blue-300 border border-blue-700 opacity-30 border-collapse"
      style={{
        left,
        top,
        width,
        height,
      }}
    ></div>
  );
}
