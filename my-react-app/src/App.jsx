import { useState } from 'react'
 
import SpreadSheet from './components/SpreadSheet'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex justify-center p-2'>
      <SpreadSheet/>
    </div>
  )
}

export default App
