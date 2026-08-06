// 인증 추가 수정 (지우 작성, saveToken 함수만 우리 lib/auth.ts 걸로 연결)
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveToken } from "@/lib/auth";

export default function AuthInitializer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 현재 페이지 주소에 ?token=... 이 붙어있는지 확인
    // 백엔드가 로그인 성공 후 어느 페이지로 리다이렉트하든 상관없이,
    // 이 컴포넌트가 모든 페이지에 항상 떠 있어서 어디서든 토큰을 잡아낼 수 있음
    const token = searchParams.get("token");

    if (token) {
      saveToken(token);
      // 주소에 남아있는 ?token=... 지우고 깔끔한 홈 주소로 이동
      router.replace("/");
    }
  }, [searchParams, router]);

  // 화면에는 아무것도 안 그림, 로직만 실행하는 컴포넌트
  return null;
}