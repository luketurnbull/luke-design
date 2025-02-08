import { useTexture } from '@react-three/drei'
import { Texture, Color } from 'three'

export type MaterialType = 'denim' | 'red-plaid' | 'houndstooth-fabric-weave'

// Textures given all had the same stucture besides the roughness texture
// So roughness is optional
export type LoadedTexture = {
  albedo: Texture
  normal: Texture
  height: Texture
  metallic: Texture
  roughness?: Texture
  ao: Texture
}

// Created a type for the textures so that we can easily access the textures by the material type
// And add new textures in the future easily
export type MaterialTextures = {
  denim: LoadedTexture
  'red-plaid': LoadedTexture
  'houndstooth-fabric-weave': LoadedTexture
}

// Paths to the textures
const TEXTURE_PATHS: Record<MaterialType, string[]> = {
  denim: [
    '/material/denim/albedo.png',
    '/material/denim/normal-ogl.png',
    '/material/denim/height.png',
    '/material/denim/metallic.png',
    '/material/denim/ao.png',
  ],
  'red-plaid': [
    '/material/red-plaid/albedo.png',
    '/material/red-plaid/normal-ogl.png',
    '/material/red-plaid/height.png',
    '/material/red-plaid/metallic.png',
    '/material/red-plaid/ao.png',
  ],
  'houndstooth-fabric-weave': [
    '/material/houndstooth-fabric-weave/albedo.png',
    '/material/houndstooth-fabric-weave/normal-ogl.png',
    '/material/houndstooth-fabric-weave/height.png',
    '/material/houndstooth-fabric-weave/metallic.png',
    '/material/houndstooth-fabric-weave/roughness.png',
    '/material/houndstooth-fabric-weave/ao.png',
  ],
}

// Hook to load the textures
// Returns a map of the textures for the given material type
// Added it here to abstract the textures from the component
export function useTextures() {
  // Load denim textures
  const [denimAlbedo, denimNormal, denimHeight, denimMetallic, denimAo] =
    useTexture(TEXTURE_PATHS.denim)

  // Load red plaid textures
  const [
    redPlaidAlbedo,
    redPlaidNormal,
    redPlaidHeight,
    redPlaidMetallic,
    redPlaidAo,
  ] = useTexture(TEXTURE_PATHS['red-plaid'])

  // Load houndstooth textures
  const [
    houndstoothAlbedo,
    houndstoothNormal,
    houndstoothHeight,
    houndstoothMetallic,
    houndstoothRoughness,
    houndstoothAo,
  ] = useTexture(TEXTURE_PATHS['houndstooth-fabric-weave'])

  // I decided to use a map to access the textures by the material type instead of an array
  // This way it's easier and quicker to select the textures by the material type
  // If this were a real project, I would probably use a database to store the textures and have an admin panel to add new textures
  // This would result in the textures being an array of objects with the texture data, making it easier to add new textures in the future
  const textures: MaterialTextures = {
    denim: {
      albedo: denimAlbedo,
      normal: denimNormal,
      height: denimHeight,
      metallic: denimMetallic,
      ao: denimAo,
    },
    'red-plaid': {
      albedo: redPlaidAlbedo,
      normal: redPlaidNormal,
      height: redPlaidHeight,
      metallic: redPlaidMetallic,
      ao: redPlaidAo,
    },
    'houndstooth-fabric-weave': {
      albedo: houndstoothAlbedo,
      normal: houndstoothNormal,
      height: houndstoothHeight,
      metallic: houndstoothMetallic,
      roughness: houndstoothRoughness,
      ao: houndstoothAo,
    },
  }

  // Created a map to access the texture details by the material type
  // Needed to make the displacement scale and bias different for each material
  // This is because the roughness and height maps are different for each material
  // And the displacement scale and bias need to be different to get a good look
  const textureDetails: Record<
    MaterialType,
    {
      bumpScale: number
      displacementScale: number
      displacementBias: number
      roughness: number
      metalness: number
      sheen: number
      sheenColor: Color
    }
  > = {
    denim: {
      bumpScale: 1000,
      displacementScale: 0,
      displacementBias: 0,
      roughness: 1,
      metalness: 0,
      sheen: 1,
      sheenColor: new Color(1, 1, 1),
    },
    'red-plaid': {
      bumpScale: 1000,
      displacementScale: 0.005,
      displacementBias: -0.0025,
      roughness: 1,
      metalness: 0,
      sheen: 1,
      sheenColor: new Color(1, 1, 1),
    },
    'houndstooth-fabric-weave': {
      bumpScale: 1000,
      displacementScale: 0.003,
      displacementBias: -0.002,
      roughness: 1,
      metalness: 0,
      sheen: 1,
      sheenColor: new Color(1, 1, 1),
    },
  }

  return { textures, textureDetails }
}
