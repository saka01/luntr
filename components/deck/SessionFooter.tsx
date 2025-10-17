import { COPY } from "@/content/copy"

interface SessionFooterProps {
  currentIndex: number
  totalCards: number
}

export function SessionFooter({ currentIndex, totalCards }: SessionFooterProps) {
  const progress = (currentIndex / totalCards) * 100

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">Progress</span>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
