import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import './App.css'
import { gameConfig } from './game/config/gameConfig'

function App() {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!gameContainerRef.current) {
      return
    }

    const game = new Phaser.Game({
      ...gameConfig,
      parent: gameContainerRef.current,
    })

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <>
      <div ref={gameContainerRef} />
    </>
  )
}

export default App
