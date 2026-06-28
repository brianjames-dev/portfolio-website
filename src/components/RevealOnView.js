import { motion, useReducedMotion } from "framer-motion";

export default function RevealOnView({
  as = "div",
  children,
  className = "",
  delay = 0,
  distance = 28,
  viewport = { once: true, amount: 0.18 },
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{
        duration: 0.42,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
