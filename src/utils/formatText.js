import React from "react";

/**
 * A lightweight formatter that converts basic markdown-like syntax to React elements.
 * Supports:
 * - \n\n -> Paragraphs
 * - **bold** -> <strong>
 * - *italic* or _italic_ -> <em>
 * - __underline__ -> <u>
 * - [text](url) -> <a>
 */
export const formatText = (text) => {
  if (!text) return null;

  // Split into paragraphs first
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((para, i) => (
    <p key={i} className="mb-4 last:mb-0">
      {parseInline(para)}
    </p>
  ));
};

const parseInline = (text) => {
  if (!text) return "";

  const rules = [
    {
      name: 'bold',
      regex: /\*\*(.*?)\*\*/,
      render: (content) => <strong className="font-bold text-white">{parseInline(content)}</strong>,
    },
    {
      name: 'underline',
      regex: /__(.*?)__/,
      render: (content) => <u className="underline decoration-amber-500/50">{parseInline(content)}</u>,
    },
    {
      name: 'link',
      regex: /\[(.*?)\]\((.*?)\)/,
      render: (content, url) => (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-amber-500 hover:text-amber-400 underline decoration-amber-500/30 transition-colors inline"
        >
          {parseInline(content)}
        </a>
      ),
    },
    {
      name: 'italic',
      regex: /[*_](.*?)[*_]/,
      render: (content) => <em className="italic">{parseInline(content)}</em>,
    },
  ];

  let currentText = text;
  let result = [];

  while (currentText) {
    let bestMatch = null;
    let bestRule = null;

    for (const rule of rules) {
      const match = rule.regex.exec(currentText);
      if (match && (!bestMatch || match.index < bestMatch.index)) {
        bestMatch = match;
        bestRule = rule;
      }
    }

    if (bestMatch) {
      // Add text before match
      if (bestMatch.index > 0) {
        result.push(currentText.substring(0, bestMatch.index));
      }

      // Add matched content
      if (bestRule.name === 'link') {
        result.push(React.cloneElement(bestRule.render(bestMatch[1], bestMatch[2]), { key: `match-${currentText.length}-${bestMatch.index}` }));
      } else {
        result.push(React.cloneElement(bestRule.render(bestMatch[1]), { key: `match-${currentText.length}-${bestMatch.index}` }));
      }

      // Update currentText to remaining
      currentText = currentText.substring(bestMatch.index + bestMatch[0].length);
    } else {
      result.push(currentText);
      currentText = "";
    }
  }

  return result;
};
