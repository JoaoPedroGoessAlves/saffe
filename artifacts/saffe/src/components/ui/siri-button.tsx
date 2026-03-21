import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

export interface SiriButtonProps extends ButtonProps {}

const SiriButton = React.forwardRef<HTMLButtonElement, SiriButtonProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isClicked, setIsClicked] = React.useState(false)

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => {
      setIsHovered(false)
      setIsClicked(false)
    }
    const handleMouseDown = () => setIsClicked(true)
    const handleMouseUp = () => setIsClicked(false)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) onClick(e)
    }

    return (
      <div
        className={cn(
          "siri-button-wrapper relative inline-flex",
          isHovered && "siri-active",
          isClicked && "siri-clicking"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className={cn(
            "siri-glow-border absolute inset-0 rounded-[980px] pointer-events-none",
            isHovered ? "siri-glow-visible" : "siri-glow-hidden"
          )}
          aria-hidden="true"
        />
        <Button
          ref={ref}
          className={cn("relative z-10", className)}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Button>
      </div>
    )
  }
)
SiriButton.displayName = "SiriButton"

export { SiriButton }
