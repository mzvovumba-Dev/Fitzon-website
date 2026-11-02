function Dashboard({ user }) {
  return (
    <main className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold uppercase tracking-widest text-orange-500">Member Area</p>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Welcome, {user.name}!</h1>
        <p className="mt-3 text-gray-600">Your FitZone dashboard. Choose a section below to continue your fitness journey.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a href="#classes" className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl"><h2 className="text-xl font-bold text-gray-900">Fitness Classes</h2><p className="mt-2 text-gray-600">Browse Strength Training, Yoga, HIIT, and Pilates.</p><span className="mt-4 inline-block font-semibold text-orange-500">View classes →</span></a>
          <a href="#timetable" className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl"><h2 className="text-xl font-bold text-gray-900">Timetable</h2><p className="mt-2 text-gray-600">Check the sample schedule, trainers, and session times.</p><span className="mt-4 inline-block font-semibold text-orange-500">View timetable →</span></a>
          <a href="#trainers" className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl"><h2 className="text-xl font-bold text-gray-900">Trainers</h2><p className="mt-2 text-gray-600">Meet the trainers currently listed on FitZone.</p><span className="mt-4 inline-block font-semibold text-orange-500">Meet trainers →</span></a>
        </div>
        <div className="mt-8 rounded-xl bg-white p-6 shadow-md"><h2 className="text-xl font-bold text-gray-900">Account details</h2><p className="mt-2 text-gray-600">Name: {user.name}</p><p className="text-gray-600">Email: {user.email}</p></div>
      </div>
    </main>
  )
}

export default Dashboard
