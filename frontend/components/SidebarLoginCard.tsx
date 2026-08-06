"use client";

// 이 컴포넌트는 이제 "로그인 여부"를 스스로 판단하지 않음
// HomeAccountCard가 로그인 여부를 확인해서, 로그인 안 됐을 때만 이 컴포넌트를 렌더링해줌
export default function SidebarLoginCard() {
  function handleKakaoLogin() {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/kakao/login`;
  }

  return (
    <div className="login-card">
      <p className="login-card-text">
        티스토리에 로그인하시고 더 많은 기능을 이용해보세요!
      </p>
      <button type="button" className="login-cta" onClick={handleKakaoLogin}>
        <span className="login-cta-icon">💬</span>
        카카오계정으로 시작하기
      </button>
    </div>
  );
}