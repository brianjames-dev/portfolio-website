function ThemedIcon({ src, className = "" }) {
  return (
    <span
      className={`themed-icon ${className}`.trim()}
      style={{ "--themed-icon-mask": `url("${src}")` }}
      aria-hidden="true"
    />
  );
}

export default ThemedIcon;
