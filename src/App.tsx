import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import './App.css'
import { GameScene } from './scenes/GameScene'

function App() {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!gameContainerRef.current) {
      return
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      backgroundColor: '#1a1a1a',
      parent: gameContainerRef.current,
      scene: [GameScene],
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
