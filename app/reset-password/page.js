// app/reset-password/page.jsx
import { Suspense } from 'react';
import ResetPasswordClient from './resetpasswordclient';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
