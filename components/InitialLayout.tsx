import { Stack } from 'expo-router'
import React from 'react'

const InitialLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    />
  )
}

export default InitialLayout