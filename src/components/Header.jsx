function Header({ user, onLogout }) {
  return (
    <header className="bg-gray-900 text-white">
      <nav className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between sm:px-6">
        <a href="#home" className="text-2xl font-bold text-orange-400">
          FitZone
        </a>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm sm:gap-6 sm:text-base">
          <a href="#home" className="hover:text-orange-400">Home</a>
          <a href="#about" className="hover:text-orange-400">About</a>
          <a href="#classes" className="hover:text-orange-400">Classes</a>
          <a href="#trainers" className="hover:text-orange-400">Trainers</a>
          <a href="#timetable" className="hover:text-orange-400">Timetable</a>
          <a href="#contact" className="hover:text-orange-400">Contact</a>
          {user ? (
            <>
              <a href="#dashboard" className="hover:text-orange-400">Dashboard</a>
              <button type="button" onClick={onLogout} className="hover:text-orange-400">Log Out</button>
            </>
          ) : (
            <a href="#login" className="hover:text-orange-400">Login / Register</a>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
