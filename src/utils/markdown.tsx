import React from 'react';

const styleMap = {
  h1: "text-3xl font-bold text-white my-3",
  h2: "text-2xl font-bold text-white my-2",
  h3: "text-xl font-bold text-white my-2",
  p: "text-white my-1 leading-relaxed",
  li: "text-white ml-6 list-disc",
  liNum: "text-white ml-6 list-decimal",
  blockquote: "border-l-4 border-gray-500 pl-4 italic text-gray-300 my-2",
  strong: "font-bold text-blue-300",
  em: "italic text-gray-300"
};

const parseInline = (text: string) => {
  // Regex menangkap **bold** atau *italic*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) 
      return <strong key={i} className={styleMap.strong}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*')) 
      return <em key={i} className={styleMap.em}>{part.slice(1, -1)}</em>;
    return part;
  });
};

export const parseMarkdownToReact = (text: string): React.ReactNode[] => {
  return text.split('\n').map((line, index) => {
    const trimmed = line.trim();

    // 1. Heading
    if (line.startsWith('# ')) return <h1 key={index} className={styleMap.h1}>{parseInline(line.slice(2))}</h1>;
    if (line.startsWith('## ')) return <h2 key={index} className={styleMap.h2}>{parseInline(line.slice(3))}</h2>;
    if (line.startsWith('### ')) return <h3 key={index} className={styleMap.h3}>{parseInline(line.slice(4))}</h3>;
    
    // 2. Blockquote
    if (line.startsWith('> ')) return <blockquote key={index} className={styleMap.blockquote}>{parseInline(line.slice(2))}</blockquote>;
    
    // 3. Bullet List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) 
      return <li key={index} className={styleMap.li}>{parseInline(trimmed.slice(2))}</li>;
    
    // 4. Number List (regex untuk menangkap "1. ")
    if (/^\d+\.\s/.test(trimmed)) 
      return <li key={index} className={styleMap.liNum}>{parseInline(trimmed.replace(/^\d+\.\s/, ''))}</li>;
    
    // 5. Empty line (br)
    if (trimmed === '') return <br key={index} />;

    // 6. Paragraf biasa
    return <p key={index} className={styleMap.p}>{parseInline(line)}</p>;
  });
};