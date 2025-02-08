import { MaterialType } from '~/hooks/use-textures'
import { cva } from 'class-variance-authority'
import { cn } from '~/lib/utils'

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

const textureSelectorButtonVariants = cva(
  'w-16 h-16 rounded-md overflow-hidden border-2 transition-colors border-black text-sm font-medium  hover:scale-110 transition-transform duration-200',
  {
    variants: {
      variant: {
        default: 'bg-cover bg-center',
        none: 'bg-white text-primary hover:bg-accent hover:text-accent-foreground',
      },
      selected: {
        true: 'border-black ring-2 ring-black/60',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      selected: false,
    },
  },
)

interface TextureSelectorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'none'
  selected?: boolean
  preview?: string
  label: string
}

const TextureSelectorButton = ({
  variant = 'default',
  selected = false,
  preview,
  label,
  className,
  style,
  ...props
}: TextureSelectorButtonProps) => {
  return (
    <button
      className={cn(
        textureSelectorButtonVariants({ variant, selected }),
        className,
      )}
      style={{
        ...style,
        ...(preview && { backgroundImage: `url(${preview})` }),
      }}
      aria-label={label}
      aria-pressed={selected}
      {...props}
    />
  )
}

export default function TextureSelector({
  selectedMaterial,
  onSelectMaterial,
}: {
  selectedMaterial: MaterialType | undefined
  onSelectMaterial: (material: MaterialType | undefined) => void
}) {
  return (
    <div className="absolute flex flex-col gap-2 top-3 left-3 z-10">
      <TextureSelectorButton
        variant="none"
        selected={selectedMaterial === undefined}
        label="Remove texture"
        onClick={() => onSelectMaterial(undefined)}
      >
        <div className="w-full h-full flex items-center justify-center">
          None
        </div>
      </TextureSelectorButton>

      {MATERIALS.map((material) => (
        <TextureSelectorButton
          key={material.id}
          selected={selectedMaterial === material.id}
          preview={material.preview}
          label={`Select ${material.name} texture`}
          onClick={() => onSelectMaterial(material.id)}
        />
      ))}
    </div>
  )
}
