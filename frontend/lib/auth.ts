// 저장 키 이름은 지우가 만든 AuthInitializer.tsx와 반드시 똑같아야 함
// (다르면 AuthInitializer가 저장한 토큰을 우리 쪽에서 못 찾음)
const TOKEN_KEY = "token";

// 토큰 저장하기 (AuthInitializer가 로그인 콜백 받았을 때 사용)
export function saveToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

// 저장된 토큰 꺼내오기 (없으면 null)
// typeof window === "undefined" 체크하는 이유:
// 서버 컴포넌트에서 실수로 이 함수를 부르면 에러나는 걸 방지하기 위함
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

// 로그아웃 시 토큰 삭제
export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}