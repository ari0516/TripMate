/** Google Places 사진을 가로 스크롤 썸네일로 보여준다 */
export function PlacePhotoStrip({
  photos,
  size = 84,
}: {
  photos: string[];
  size?: number;
}) {
  if (photos.length === 0) return null;

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto">
      {photos.map((name) => (
        // eslint-disable-next-line @next/next/no-img-element -- 서버 프록시를 거치는 동적 이미지라 next/image 최적화 대상이 아님
        <img
          key={name}
          src={`/api/places/photo?name=${encodeURIComponent(name)}&maxWidth=${size * 2}`}
          alt=""
          width={size}
          height={size}
          className="shrink-0 rounded-[12px] object-cover"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}
