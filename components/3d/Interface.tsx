"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from "@react-three/drei"
import { Athlete } from './Athlete'
import { useRef } from 'react'
import * as THREE from 'three'

const RotatingModel = () => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    // mouse.x and mouse.y range from -1 to 1
    const x = state.mouse.x
    const y = state.mouse.y

    // smooth rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.5,
      0.1
    )

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -y * 0.2,
      0.1
    )
  })

  return (
    <group ref={groupRef}>
      <Athlete scale={1.1} rotation={[0, -0.4, 0]} />
    </group>
  )
}

const Interface = () => {
  return (
    <Canvas shadows camera={{ position: [0, 0.2, 2], fov: 65 }}>
      <spotLight position={[1, 1, 1]} intensity={10} />
      <Environment preset="night" />

      <RotatingModel />
    </Canvas>
  )
}

export default Interface