import { Badge } from "@/components/ui/badge"
import { COPY } from "@/content/copy"

interface SessionHeaderProps {
  currentIndex: number
  totalCards: number
}

export function SessionHeader({ currentIndex, totalCards }: SessionHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{COPY.session.header}</h1>
        <p className="text-muted-foreground">{COPY.session.progress(currentIndex, totalCards)}</p>
      </div>
      <Badge variant="outline" className="text-lg px-4 py-2">
        {currentIndex}/{totalCards}
      </Badge>
    </div>
  )
}
