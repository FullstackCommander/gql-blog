import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import client from './apolloClient.ts'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
<AuthProvider>
  <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
</AuthProvider>
,
)
