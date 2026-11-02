
import { useEffect, useState } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const paymentLinks = {
  1: 'https://buy.stripe.com/test_cNi28q5hKcBn8w44hH28800',
  2: 'https://buy.stripe.com/test_dRmfZgcKc58VeUsaG528801',
  3: 'https://buy.stripe.com/test_28EdR8fWo8l7cMkeWl28802',
}

function Pricing() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch(`${API_URL}/api/membership-plans`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load plans.')
        }

        setPlans(data.plans || [])
      } catch (error) {
        setMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  function handleBuyNow(plan) {
    const token = localStorage.getItem('fitzoneToken')

    if (!token) {
      window.location.hash = 'login'
      return
    }

    const paymentLink = paymentLinks[Number(plan.id)]

    if (!paymentLink) {
      setMessage('Payment link not found.')
      return
    }

    let user

    try {
      user = JSON.parse(localStorage.getItem('fitzoneUser') || 'null')
    } catch {
      user = null
    }

    if (!user?.id) {
      setMessage('Please log in again.')
      return
    }

    const checkoutUrl = new URL(paymentLink)

    checkoutUrl.searchParams.set(
      'client_reference_id',
      `fitzon_${user.id}_${plan.id}`
    )

    window.location.assign(checkoutUrl.toString())
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <section className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="font-bold uppercase tracking-widest text-orange-500">
            FITZON Membership
          </p>

          <h1 className="mt-3 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Choose Your Plan
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Find the membership that fits your fitness goals and start your
            journey with FITZON.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-600">
            Loading membership plans...
          </p>
        )}

        {message && (
          <p className="mb-6 text-center font-semibold text-orange-600">
            {message}
          </p>
        )}

        {!loading && plans.length === 0 && (
          <p className="text-center text-gray-600">
            No membership plans are currently available.
          </p>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="flex flex-col rounded-2xl bg-gray-900 p-8 text-white shadow-lg"
            >
              <h2 className="text-2xl font-extrabold text-orange-400">
                {plan.name}
              </h2>

              <p className="mt-4 text-4xl font-extrabold">
                R{(plan.price_cents / 100).toFixed(2)}
              </p>

              <p className="mt-1 text-sm text-gray-400">per month</p>

              <p className="mt-6 flex-1 leading-relaxed text-gray-300">
                {plan.description}
              </p>

              <button
                type="button"
                onClick={() => handleBuyNow(plan)}
                className="mt-8 w-full rounded-lg bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
              >
                Buy Now
              </button>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Secure test checkout powered by Stripe.
        </p>
      </section>
    </main>
  )
}

export default Pricing
