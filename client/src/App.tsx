import Posts from './components/Posts'
import SignUpForm from './components/SignUpForm'
import './App.css'

function App() {

  return (
    <div>
      <div className='App'>
        <SignUpForm />
      </div>
      <div className='App'>
        
        <h1>GraphQL MERN Blog</h1>
        <Posts />
      </div>
    </div>
  )
}

export default App
