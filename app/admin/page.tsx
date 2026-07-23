'use client'


import { useRouter } from 'next/navigation'


export default function AdminPage() {
  const router = useRouter()


  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }


  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Admin Page</h1>
        <button
          onClick={handleLogout}
          className="rounded-lg border px-4 py-2 font-semibold hover:bg-gray-100 hover:text-black"
        >
          Logout
        </button>
      </div>


      <p className="mb-6 text-gray-500">Welcome, admin. Add your actions here.</p>


      <button
        onClick={() => router.push('/')}
        className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400"
      >
        Go to Menu
      </button>
    </main>
  )
}
