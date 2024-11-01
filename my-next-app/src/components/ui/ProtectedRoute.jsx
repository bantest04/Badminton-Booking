import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, roleRequired }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login'); // Nếu không có token, điều hướng tới trang đăng nhập
    } else {
      const user = JSON.parse(atob(token.split('.')[1]));
      if (user.role !== roleRequired) {
        router.push('/not-authorized'); // Điều hướng nếu role không hợp lệ
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router, roleRequired]);

  if (!isAuthorized) return null;

  return children;
}
