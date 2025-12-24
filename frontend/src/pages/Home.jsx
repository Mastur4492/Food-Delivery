import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const primary = '#ff4d2d'

  return (
    <div className="min-h-screen bg-[#fff9f6] flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full" style={{ background: primary }}></div>
          <h1 className="text-xl font-bold" style={{ color: primary }}>Food-Delivery</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700" onClick={() => navigate('/signIn')}>Sign In</button>
          <button className="px-4 py-2 rounded-lg bg-red-500 text-white" onClick={() => navigate('/signUp')}>Sign Up</button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <section className="bg-white rounded-xl p-6 shadow mb-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold" style={{ color: primary }}>Delicious Food, Delivered To You</h2>
          <p className="text-gray-600 mt-2">Browse restaurants, track delivery, and enjoy hot meals from nearby vendors.</p>

          <div className="mt-4 flex gap-3">
            <input className="flex-1 border rounded-lg px-4 py-3" placeholder="Search for restaurants or dishes" />
            <button className="px-6 py-3 bg-red-500 text-white rounded-lg">Search</button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">Pizza</div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">Burgers</div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">Sushi</div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-3">Popular near you</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="h-32 bg-gray-200 rounded mb-3" />
              <h4 className="font-semibold">Mama's Kitchen</h4>
              <p className="text-sm text-gray-500">Italian • 4.5 ★</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="h-32 bg-gray-200 rounded mb-3" />
              <h4 className="font-semibold">Spice House</h4>
              <p className="text-sm text-gray-500">Indian • 4.6 ★</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="h-32 bg-gray-200 rounded mb-3" />
              <h4 className="font-semibold">Sushi Point</h4>
              <p className="text-sm text-gray-500">Japanese • 4.7 ★</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600">© {new Date().getFullYear()} Food-Delivery</footer>
    </div>
  )
}

export default Home
