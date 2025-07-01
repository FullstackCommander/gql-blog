import Posts from './components/Posts'
import SignUpForm from './components/SignUpForm'
import LoginForm from './components/LoginForm'
import {Routes, Route} from 'react-router-dom'
import './App.css'

function App() {

  return (
    <div>
      <header>
        <h1>GQL MERN Blog</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </main>
      <footer>
        <p>&copy; FullStack Commander</p>
      </footer>
    </div>
  )
}

export default App
