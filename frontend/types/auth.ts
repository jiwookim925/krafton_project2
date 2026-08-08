// 지우 백엔드의 "로그인된 유저 정보 조회 API"가 정확히 어떤 필드를 주는지
// 아직 확정 안 됐으면, 응답 받아보고 필드 이름 여기서 맞춰 고치면 됨
export interface AuthUser {
  // 백엔드 users 테이블의 PK. 글 작성자(authorId)와 비교해 "내 글인지" 판단할 때 씀
  id: number;
  kakao_id: number;
  // 카카오 동의 항목이라 없을 수도 있음(null) - 화면에 쓸 땐 kakao_id로 폴백
  nickname: string | null;
  profile_image: string | null;
}