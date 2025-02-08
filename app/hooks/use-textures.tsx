import { useTexture } from '@react-three/drei'
import { Texture, Color } from 'three'
import { useControls, folder } from 'leva'

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

  // Add Leva controls for each material's properties
  const denimControls = useControls(
    'Material Properties',
    {
      Denim: folder(
        {
          roughness: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
          },
          metalness: {
            value: 0,
            min: 0,
            max: 1,
            step: 0.01,
          },
          sheen: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  )

  const redPlaidControls = useControls(
    'Material Properties',
    {
      'Red Plaid': folder(
        {
          Displacement: folder(
            {
              scale: {
                value: 0.01,
                min: 0,
                max: 0.5,
                step: 0.0001,
                format: (v: number) => v.toFixed(4),
              },
              bias: {
                value: 0,
                min: -0.5,
                max: 0,
                step: 0.0001,
                format: (v: number) => v.toFixed(4),
              },
            },
            { collapsed: true },
          ),
          normalScale: {
            value: 2,
            min: 0,
            max: 2,
            step: 0.01,
          },
          bumpScale: {
            value: 0.5,
            min: 0,
            max: 2,
            step: 0.01,
          },
          roughness: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
          },
          metalness: {
            value: 0,
            min: 0,
            max: 1,
            step: 0.01,
          },
          sheen: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  )

  const houndstoothControls = useControls(
    'Material Properties',
    {
      Houndstooth: folder(
        {
          Displacement: folder(
            {
              scale: {
                value: 0.003,
                min: -0.1,
                max: 0.1,
                step: 0.0001,
                format: (v: number) => v.toFixed(4),
              },
              bias: {
                value: -0.002,
                min: -0.1,
                max: 0.1,
                step: 0.0001,
                format: (v: number) => v.toFixed(4),
              },
            },
            { collapsed: true },
          ),
          normalScale: {
            value: 2,
            min: 0,
            max: 2,
            step: 0.01,
          },
          bumpScale: {
            value: 0.5,
            min: 0,
            max: 2,
            step: 0.01,
          },
          roughness: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
          },
          metalness: {
            value: 0,
            min: 0,
            max: 1,
            step: 0.01,
          },
          sheen: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  )

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

  // Use the Leva controls to dynamically update the texture details
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
      normalScale: number
    }
  > = {
    denim: {
      bumpScale: 0,
      displacementScale: 0,
      displacementBias: 0,
      roughness: denimControls.roughness,
      metalness: denimControls.metalness,
      sheen: denimControls.sheen,
      sheenColor: new Color(1, 1, 1),
      normalScale: 1,
    },
    'red-plaid': {
      bumpScale: redPlaidControls.bumpScale,
      displacementScale: redPlaidControls.scale,
      displacementBias: redPlaidControls.bias,
      roughness: redPlaidControls.roughness,
      metalness: redPlaidControls.metalness,
      sheen: redPlaidControls.sheen,
      sheenColor: new Color(1, 1, 1),
      normalScale: redPlaidControls.normalScale,
    },
    'houndstooth-fabric-weave': {
      bumpScale: houndstoothControls.bumpScale,
      displacementScale: houndstoothControls.scale,
      displacementBias: houndstoothControls.bias,
      roughness: houndstoothControls.roughness,
      metalness: houndstoothControls.metalness,
      sheen: houndstoothControls.sheen,
      sheenColor: new Color(1, 1, 1),
      normalScale: houndstoothControls.normalScale,
    },
  }

  return { textures, textureDetails }
}
