// /utils/renderContentBlock.js
export function renderContentBlock(block, i) {
  if (!block || !block.type) return null;

  if (block.type === 'text') {
    return (
      <div
        key={`text-${i}`}
        className={block.className || ''}
      >
        <p dangerouslySetInnerHTML={{ __html: block.content }} />
      </div>
    );
  }

  if (block.type === 'bullet') {
    const items = Array.isArray(block.items) ? block.items : [];
    return (
      <ul key={`bullet-${i}`} className="custom-bullet-list">
        {items.map((item, j) => (
          <li
            key={`bullet-${i}-${j}`}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ul>
    );
  }

  if (block.type === 'image') {
    return (
      <figure key={`image-${i}`} className={`block-image ${block.className || ''}`}>
        <img
          src={block.src}
          alt={block.alt || ''}
        />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    );
  }

  if (block.type === 'group') {
    return (
      <div 
        key={`group-${i}`} 
        className={`block-group ${block.className || ''}`}
        >
        {block.blocks.map((child, j) => renderContentBlock(child, `${i}-${j}`))}
      </div>
    );
  }
  
  return null;
}
