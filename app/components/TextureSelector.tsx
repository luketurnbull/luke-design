import { MaterialType } from '~/hooks/use-textures'

// Material options with their display names and paths
const MATERIALS = [
  {
    id: 'denim' as MaterialType,
    name: 'Denim',
    preview: '/material/denim/albedo.png',
  },
  {
    id: 'red-plaid' as MaterialType,
    name: 'Red Plaid',
    preview: '/material/red-plaid/albedo.png',
  },
  {
    id: 'houndstooth-fabric-weave' as MaterialType,
    name: 'Houndstooth',
    preview: '/material/houndstooth-fabric-weave/albedo.png',
  },
] as const

export default function TextureSelector({
  selectedMaterial,
  onSelectMaterial,
}: {
  selectedMaterial: MaterialType | undefined
  onSelectMaterial: (material: MaterialType | undefined) => void
}) {
  return (
    <div className="absolute flex flex-col gap-2 top-3 left-3 z-10">
      <button
        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors bg-white ${
          selectedMaterial === undefined
            ? 'border-white ring-2 ring-white/60'
            : 'border-white/20 hover:border-white/40'
        }`}
        aria-label="Remove texture"
        aria-pressed={selectedMaterial === undefined}
        onClick={() => onSelectMaterial(undefined)}
      >
        <div className="w-full h-full flex items-center justify-center text-black/50 text-sm font-medium">
          None
        </div>
      </button>

      {MATERIALS.map((material) => (
        <button
          key={material.id}
          className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors bg-cover bg-center ${
            selectedMaterial === material.id
              ? 'border-white ring-2 ring-white/60'
              : 'border-white/20 hover:border-white/40'
          }`}
          style={{
            backgroundImage: `url(${material.preview})`,
          }}
          aria-label={`Select ${material.name} texture`}
          aria-pressed={selectedMaterial === material.id}
          onClick={() => onSelectMaterial(material.id)}
        />
      ))}
    </div>
  )
}
