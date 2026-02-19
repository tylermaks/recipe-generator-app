function MainNav() {
  return (
    <nav className="container flex justify-between items-center">
      <h1 className="text-2xl font-bold">Pomodoro</h1>
      <ul className="flex gap-4">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
      </ul>
    </nav>
  )
}

export default MainNav