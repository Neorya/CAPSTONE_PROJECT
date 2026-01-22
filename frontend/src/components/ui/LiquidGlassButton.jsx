import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const liquidbuttonVariants = cva(
    "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    {
        variants: {
            variant: {
                default: "bg-transparent hover:scale-105 duration-300 transition text-primary",
                destructive:
                    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 text-xs gap-1.5 px-4 has-[>svg]:px-4",
                lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
                xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
                xxl: "h-14 rounded-md px-10 has-[>svg]:px-8",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "xxl",
        },
    }
)

function GlassFilter() {
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <filter
                    id="container-glass"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    colorInterpolationFilters="sRGB"
                >
                    {/* Generate turbulent noise for distortion */}
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05 0.05"
                        numOctaves="1"
                        seed="1"
                        result="turbulence"
                    />

                    {/* Blur the turbulence pattern slightly */}
                    <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />

                    {/* Displace the source graphic with the noise */}
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blurredNoise"
                        scale="70"
                        xChannelSelector="R"
                        yChannelSelector="B"
                        result="displaced"
                    />

                    {/* Apply overall blur on the final result */}
                    <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />

                    {/* Output the result */}
                    <feComposite in="finalBlur" in2="finalBlur" operator="over" />
                </filter>
            </defs>
        </svg>
    );
}

export function LiquidButton({
    className,
    variant,
    size,
    asChild = false,
    children,
    ...props
}) {
    const Comp = asChild ? Slot : "button"

    return (
        <>
            <Comp
                data-slot="button"
                className={cn(
                    "relative",
                    liquidbuttonVariants({ variant, size, className })
                )}
                {...props}
            >
                <div
                    className="absolute top-0 left-0 z-0 h-full w-full rounded-full transition-all"
                    style={{
                        boxShadow: `
              0 0 6px rgba(0,0,0,0.03),
              0 2px 6px rgba(0,0,0,0.08),
              inset 3px 3px 0.5px -3.5px rgba(255,255,255,0.09),
              inset -3px -3px 0.5px -3.5px rgba(255,255,255,0.85),
              inset 1px 1px 1px -0.5px rgba(255,255,255,0.6),
              inset -1px -1px 1px -0.5px rgba(255,255,255,0.6),
              inset 0 0 6px 6px rgba(255,255,255,0.12),
              inset 0 0 2px 2px rgba(255,255,255,0.06),
              0 0 12px rgba(0,0,0,0.15)
            `
                    }}
                />
                <div
                    className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full"
                    style={{ backdropFilter: 'url("#container-glass")' }}
                />

                <div className="pointer-events-none z-10 relative">
                    {children}
                </div>
                <GlassFilter />
            </Comp>
        </>
    )
}

export { liquidbuttonVariants }
