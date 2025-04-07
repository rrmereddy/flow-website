"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useInView } from "framer-motion"

export function useScrollAnimation(ref: React.RefObject<HTMLElement>, threshold = 0.3) {
    const [hasAnimated, setHasAnimated] = useState(false)
    const isInView = useInView(ref, { once: true, amount: threshold })

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true)
        }
    }, [isInView, hasAnimated])

    return { isInView, hasAnimated }
}

