import './App.css';

import React, { 
  useState,
  useEffect,
  Suspense
} from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import { 
  OrbitControls,
  Sky,
  Environment
} from '@react-three/drei'

import Grid from './components/Grid'
import { 
  PlacingBlock,
  RenderBlock
 } from './components/Blocks'

import {
  EffectComposer,
  DepthOfField,
} from '@react-three/postprocessing'

import { useGame } from './hooks/useGame'

// import { useControls } from 'leva'
import UserInterface from './components/UserInterface'
import Loading from './components/Loading'
import { calculateProceduralHighrise, getRandomHighriseTexture } from './constants/blocks';

import { buildingColors } from './constants/colors'

const enableEffects = false

function App() {
  
  const [
    gridSize, 
    playerMode, 
    playerBlocks, 
    setPlayerBlocks, 
  ] = useGame(state => [
    state.gridSize, 
    state.playerMode, 
    state.playerBlocks, 
    state.setPlayerBlocks,
  ])

  const [pointerPosition, setPointerPosition] = useState([0, 0, 0])
  const [hovering, setHovering] = useState(false)
  const [blockRotation, setBlockRotation] = useState(0)
  const [currentBlock, setCurrentBlock] = useState({
    name: "highrise",
    settings: {
      height: (Math.random() * 4) + 1,
      texture: getRandomHighriseTexture(),
      floors: calculateProceduralHighrise()
    }
  })
  
  function placeBlock(x, z) {
    const xIndex = x + (gridSize/2)
    const zIndex = z + (gridSize/2)

    console.log("Trying to place at x: " + x + " z: " + z)
    console.log("Index positions at x: " + xIndex + " z: " + zIndex)

    if ( xIndex >= 0 && xIndex < gridSize && zIndex >= 0 && zIndex < gridSize ) {
      console.log("Placing Block")
      const newGrid = [...playerBlocks]
      const incomeResetTime = new Date()

      newGrid[xIndex][zIndex] = {
        block: currentBlock.name,
        settings: currentBlock.settings,
        x: x,
        z: z,
        blockRotation: blockRotation,
        incomeResetTime: incomeResetTime
      }

      setPlayerBlocks(newGrid)
    }
  }

  function checkAdjacentBlocks(x, z) {
    const xIndex = x + (gridSize/2)
    const zIndex = z + (gridSize/2)

    const adjacentBlocks = []
    if ( xIndex > 0 ) {
      adjacentBlocks.push(playerBlocks[xIndex - 1][zIndex])
    }
    if ( xIndex < gridSize - 1 ) {
      adjacentBlocks.push(playerBlocks[xIndex + 1][zIndex])
    }
    if ( zIndex > 0 ) {
      adjacentBlocks.push(playerBlocks[xIndex][zIndex - 1])
    }
    if ( zIndex < gridSize - 1 ) {
      adjacentBlocks.push(playerBlocks[xIndex][zIndex + 1])
    }

    return adjacentBlocks
  }

  function handleKeyDown(e) {
    if ( e.key === "q" || e.key === "e" ) {
      setBlockRotation((prev) => {
        const newRotation = prev + (e.key === 'q' ? Math.PI / 2 : - Math.PI / 2)
        return newRotation > 2 * Math.PI ? newRotation - 2 * Math.PI : newRotation
      })
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])


  return (
    <>
      <Suspense fallback={<Loading />}>
        <UserInterface
          currentBlock={currentBlock.name}
          setCurrentBlock={setCurrentBlock}
          />
        <div className="app">
          <Canvas
            camera={{ position: [0, 10, 10], fov: 50 }}
            shadows={true}
            >
            <Sky 
              distance={450000}
              sunPosition={[0, 1, 0]}
              inclination={0}
              azimuth={0.25}
              />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1}
              castShadow
              shadow-camera-top={20}
              shadow-camera-right={20}
              shadow-camera-bottom={-20}
              shadow-camera-left={-20}
              />
            <Environment 
              files={"park_parking_2k.hdr"}
              />
            { enableEffects &&
              <EffectComposer>
                <DepthOfField
                  focusDistance={0.01}
                  focalLength={0.03}
                  bokehScale={10}
                  />
              </EffectComposer>
            }
            <fog attach="fog" args={["#ebeff2", 10, 60]} />


            {playerBlocks.map((row, x) => {
              return row.map((block, z) => {
                if (block) {
                  return <RenderBlock 
                      key={x + "-" + z}
                      block={block}
                      useDefault={false}
                      />
                }
                return null
              })
            })}
            
            { playerMode === "build" && <PlacingBlock 
              position={pointerPosition} 
              hovering={hovering}
              blockRotation={blockRotation}
              currentBlock={currentBlock}
              />}
            

            <Grid 
              gridSize={gridSize}
              position={[0, 0, 0]}
              rotation-x={ - Math.PI / 2 }
              pointerFunction={setPointerPosition}
              hoveringFunction={setHovering}
              checkAdjacentBlocks={checkAdjacentBlocks}
              placeBlock={placeBlock}
              currentBlock={currentBlock.name}
              />
            <OrbitControls
              makeDefault
              />
          </Canvas>
        </div>
      </Suspense>
    </>
  );
}

export default App