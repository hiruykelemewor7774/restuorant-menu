'use client'


import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')


    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })


    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Wrong username or password. Try again.')
    }
  }


  return (
    <main className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-80 space-y-4 rounded-2xl border border-gray-200 p-6 shadow-sm px-6 mr-20">
        <h1 className="text-2xl font-bold">Admin Login</h1>


        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full rounded-lg border px-3 py-2"
        />


        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border px-3 py-2"
        />


        {error && <p className="text-sm text-red-500">{error}</p>}


        <button
          type="submit"
          className="w-full rounded-lg bg-amber-500 py-2 font-semibold text-black hover:bg-amber-400" >
          Login
        </button>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full rounded-lg border py-2 font-semibold hover:bg-gray-100 hover:text-black"
        >
          Back to Menu
        </button>
      </form>
    </main>
  )
}
