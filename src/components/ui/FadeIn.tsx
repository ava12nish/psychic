'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
    duration?: number;
    once?: boolean;
}

export function FadeIn({
    children,
    delay = 0,
    direction = 'up',
    className,
    duration = 0.5,
    once = true,
}: FadeInProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-10% 0px' });

    const directions = {
        up: { y: 24, x: 0 },
        down: { y: -24, x: 0 },
        left: { x: 24, y: 0 },
        right: { x: -24, y: 0 },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...directions[direction] }}
            animate={
                isInView
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 0, ...directions[direction] }
            }
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1], // premium cubic bezier bounce
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
