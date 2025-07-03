import Posts from './components/Posts'
import SignUpForm from './components/SignUpForm'
import LoginForm from './components/LoginForm'
import {Routes, Route} from 'react-router-dom'
import NavBar from './components/Navbar'
import CreatePost from './components/CreatePost'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import SinglePost from './components/SinglePost'
import { Github } from 'lucide-react'
import { Toaster } from "react-hot-toast";

function App() {


  return (
    <div className='max-w-svw  min-h-screen flex flex-col'>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <header>
        <NavBar />
      </header>
      <main className="container mx-auto p-4 justify-center items-center">
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
      </main>
      <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
  <aside className="grid-flow-col items-center">
    
    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
  </aside>
  <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
    <a href="https://github.com/fullstackcommander" target="_blank" rel="noopener noreferrer" className="link link-hover"><Github /></a>
      
    
  </nav>
</footer>
    </div>
  )
}

export default App
