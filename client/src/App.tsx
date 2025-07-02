import Posts from './components/Posts'
import SignUpForm from './components/SignUpForm'
import LoginForm from './components/LoginForm'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import NavBar from './components/Navbar'
import CreatePost from './components/CreatePost'

function App() {

  return (
    <div>
      <header>
        <NavBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
      <footer>
        <p>&copy; FullStack Commander</p>
      </footer>
    </div>
  )
}

export default App
