import React from "react";

/**
 * Lazy motion <div> that:
 * - Forwards refs (fixes the "Function components cannot be given refs" warning)
 * - Uses motion.create('div') when available (fixes the deprecation warning)
 * - Falls back to a plain <div> until framer-motion is loaded, stripping motion-only props
 */
const MotionDiv = React.forwardRef(function MotionDiv(props, ref) {
  const [Comp, setComp] = React.useState(() => "div");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    import("framer-motion").then((mod) => {
      if (!alive) return;
      const factory = mod.motion.create
        ? mod.motion.create // framer-motion v11+
        : (tag) => mod.motion(tag); // fallback for older versions
      const MDiv = factory("div");
      setComp(() => MDiv);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Drop motion-only props while rendering the plain <div>
  const {
    initial,
    animate,
    exit,
    whileInView,
    variants,
    transition,
    layout,
    layoutId,
    ...rest
  } = props;

  return ready ? (
    <Comp
      ref={ref}
      initial={initial}
      animate={animate}
      exit={exit}
      whileInView={whileInView}
      variants={variants}
      transition={transition}
      layout={layout}
      layoutId={layoutId}
      {...rest}
    />
  ) : (
    <div ref={ref} {...rest} />
  );
});

export default MotionDiv;
