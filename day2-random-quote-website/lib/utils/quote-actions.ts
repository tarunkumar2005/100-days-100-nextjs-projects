export const downloadQuote = (quote: { text: string; author: string }) => {
  const content = `"${quote.text}"\n- ${quote.author}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ninja-quote.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const shareOnTwitter = (quote: { text: string; author: string }) => {
  const text = encodeURIComponent(`"${quote.text}" - ${quote.author}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&hashtags=NinjaQuotes`, '_blank');
};