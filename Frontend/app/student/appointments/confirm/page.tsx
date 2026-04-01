import { ConfirmCompletionContent } from '@/components/student/appointment/confirm-appointment'
import { Suspense } from 'react'


export default function ConfirmCompletionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmCompletionContent />
    </Suspense>
  )
}