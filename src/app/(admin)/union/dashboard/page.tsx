export default function UnionDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        유니온시스템즈 관리
      </h1>
      <p className="text-gray-500 mb-8">
        좌측 메뉴에서 관리할 항목을 선택하세요.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "메뉴 관리", desc: "사이트 메뉴 구조 편집", color: "bg-red-50 border-red-200" },
          { label: "콘텐츠 편집", desc: "페이지 콘텐츠 관리", color: "bg-red-50 border-red-200" },
          { label: "게시글 관리", desc: "공지사항 / 인사이트 / 이벤트", color: "bg-red-50 border-red-200" },
          { label: "배너 관리", desc: "메인 / 팝업 / 프로모션 배너", color: "bg-red-50 border-red-200" },
          { label: "고객사 로고", desc: "파트너 로고 관리", color: "bg-red-50 border-red-200" },
          { label: "문의 관리", desc: "고객 문의 조회 및 답변", color: "bg-red-50 border-red-200" },
        ].map((card) => (
          <div
            key={card.label}
            className={`${card.color} border rounded-lg p-4`}
          >
            <h3 className="font-semibold text-gray-900">{card.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
