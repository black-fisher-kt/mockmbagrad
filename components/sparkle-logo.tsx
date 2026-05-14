export default function SparkleLogo({ 
  size = 24, 
  color = "#F59E0B" 
}: { 
  size?: number, 
  color?: string 
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="
          M50 5
          C52 20, 62 25, 95 22
          C80 28, 78 38, 90 55
          C75 45, 65 48, 68 75
          C58 60, 52 62, 45 95
          C44 75, 38 68, 10 72
          C28 62, 30 52, 8 42
          C28 46, 38 40, 35 10
          C42 28, 48 25, 50 5
          Z
        "
        fill={color}
      />
      <path
        d="
          M50 32
          C54 36, 60 38, 66 36
          C62 42, 64 48, 68 52
          C62 50, 56 52, 52 58
          C50 52, 46 50, 38 54
          C42 48, 40 42, 34 38
          C40 40, 46 38, 50 32
          Z
        "
        fill="black"
      />
    </svg>
  )
}