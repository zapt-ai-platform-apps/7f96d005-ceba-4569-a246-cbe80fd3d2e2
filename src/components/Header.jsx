function Header(props) {
  return (
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-blue-900">Task Manager</h1>
      <button
        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
        onClick={props.onSignOut}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Header;