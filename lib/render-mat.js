/**
 * Render-Mat.js - Markdown & LaTeX Renderer for TeakaLearn
 */

(function () {
  // Load dependencies via CDN if not present
  const CDN_SCRIPTS = [
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js'
  ];
  
  const CDN_STYLES = [
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js',
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'
  ];

  // Helper load CSS
  function loadStyle(url) {
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }

  // Helper load JS async
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Parse Markdown + KaTeX (Support $inline$ dan $$display$$)
  function renderMarkdownAndLatex(rawText) {
    // 1. Temporary placeholder array to protect LaTeX from Marked JS
    const mathBlocks = [];
    
    // Replace Display Math $$...$$
    let prepText = rawText.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      mathBlocks.push({ type: 'display', formula });
      return `%%%MATH_BLOCK_${mathBlocks.length - 1}%%%`;
    });

    // Replace Inline Math $...$
    prepText = prepText.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
      mathBlocks.push({ type: 'inline', formula });
      return `%%%MATH_BLOCK_${mathBlocks.length - 1}%%%`;
    });

    // 2. Parse Markdown
    let html = marked.parse(prepText);

    // 3. Render LaTeX back into HTML using KaTeX
    html = html.replace(/%%%MATH_BLOCK_(\d+)%%%/g, (match, index) => {
      const block = mathBlocks[index];
      try {
        return katex.renderToString(block.formula, {
          displayMode: block.type === 'display',
          throwOnError: false
        });
      } catch (err) {
        return `<span style="color:red;">[LaTeX Error: ${err.message}]</span>`;
      }
    });

    return html;
  }

  // Auto Init function
  async function initRenderer() {
    // Load CSS
    CDN_STYLES.forEach(loadStyle);
    
    // Load JS Scripts
    await Promise.all(CDN_SCRIPTS.map(loadScript));

    // Target render container
    const targetContainer = document.getElementById('materi-render-target');
    const sourceScript = document.getElementById('materi-source');

    if (targetContainer && sourceScript) {
      const rawMarkdown = sourceScript.textContent || sourceScript.innerText;
      targetContainer.innerHTML = renderMarkdownAndLatex(rawMarkdown);
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRenderer);
  } else {
    initRenderer();
  }
})();
