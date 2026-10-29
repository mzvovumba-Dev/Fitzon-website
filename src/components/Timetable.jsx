const sessions = [
  { day: 'Monday', time: '08:00–09:00', className: 'Strength Training', mentor: 'Alex', trainee: 'Registered members' },
  { day: 'Tuesday', time: '09:00–10:00', className: 'Yoga', mentor: 'Sarah', trainee: 'Registered members' },
  { day: 'Wednesday', time: '17:00–18:00', className: 'HIIT Workout', mentor: 'David', trainee: 'Registered members' },
  { day: 'Thursday', time: '10:00–11:00', className: 'Pilates', mentor: 'Sarah', trainee: 'Registered members' },
]

function Timetable() {
  return (
    <main className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold uppercase tracking-widest text-orange-500">Weekly Schedule</p>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Fitness Timetable</h1>
        <p className="mt-4 max-w-2xl text-gray-600">A sample weekly timetable showing the class, mentor, trainee group, and session time. These times are examples until real bookings are connected.</p>
        <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-md">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-900 text-white"><tr><th className="p-4">Day</th><th className="p-4">Time</th><th className="p-4">Class</th><th className="p-4">Mentor</th><th className="p-4">Trainee</th></tr></thead>
            <tbody>{sessions.map((session) => <tr key={session.day} className="border-b border-gray-100"><td className="p-4 font-semibold text-gray-900">{session.day}</td><td className="p-4 text-gray-600">{session.time}</td><td className="p-4 text-gray-600">{session.className}</td><td className="p-4 text-gray-600">{session.mentor}</td><td className="p-4 text-gray-600">{session.trainee}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-gray-500">Note: This is a display-only example. Booking and managing real trainee sessions would require database tables and API endpoints.</p>
      </div>
    </main>
  )
}

export default Timetable
