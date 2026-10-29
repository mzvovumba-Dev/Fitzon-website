import { useState } from 'react'

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    setMessage('')
    setLoading(true)
    try {
      const endpoint = mode === 'signup'
        ? 'https://fitzon-website.onrender.com/api/auth/register'
        : 'https://fitzon-website.onrender.com/api/auth/login'
      const body = mode === 'signup'
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setMessage(data.message || `Request failed (${response.status}).`)
        return
      }
      if (mode === 'signup') {
        setMessage('Account created successfully! Please log in.')
        setMode('login')
        setPassword('')
        return
      }
      if (!data.user || !data.token) {
        setMessage('Login response is incomplete. Please try again.')
        return
      }
      localStorage.setItem('fitzoneUser', JSON.stringify(data.user))
      localStorage.setItem('fitzoneToken', data.token)
      onLogin(data.user)
    } catch (error) {
      console.error('Authentication error:', error)
      setMessage('Could not connect to FitZone. Please try again when the backend is available.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-gray-50 px-6 py-20">
      <section className="mx-auto max-w-md rounded-xl bg-gray-900 p-6 text-white shadow-md">
        <div className="mb-6 text-center">
          <p className="font-semibold uppercase tracking-widest text-orange-400">Member Access</p>
          <h1 className="mt-3 text-3xl font-extrabold">{mode === 'signup' ? 'Create Account' : 'Log In'}</h1>
        </div>
        <div className="mb-6 flex gap-3">
          <button type="button" onClick={() => { setMode('login'); setMessage('') }} className={`flex-1 rounded-lg px-4 py-3 font-bold ${mode === 'login' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-200'}`}>Log In</button>
          <button type="button" onClick={() => { setMode('signup'); setMessage('') }} className={`flex-1 rounded-lg px-4 py-3 font-bold ${mode === 'signup' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-200'}`}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && <div><label htmlFor="fitzone-name" className="mb-1 block">Full name</label><input id="fitzone-name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white" placeholder="Your full name" /></div>}
          <div><label htmlFor="fitzone-email" className="mb-1 block">Email address</label><input id="fitzone-email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white" placeholder="you@example.com" /></div>
          <div><label htmlFor="fitzone-password" className="mb-1 block">Password</label><input id="fitzone-password" name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-900 px-4 py-3 text-white" placeholder="At least 8 characters" /></div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Log In'}</button>
        </form>
        {message && <p role="status" aria-live="polite" className="mt-4 text-center text-orange-300">{message}</p>}
        <p className="mt-6 text-center text-sm text-gray-300"><a href="#home" className="text-orange-400 hover:underline">Return to FitZone home</a></p>
      </section>
    </main>
  )
}

export default Login
