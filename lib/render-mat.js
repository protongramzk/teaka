/**
 * Render-Mat.js - Markdown & LaTeX Renderer for TeakaLearn
 */

(function () {
  // Parse Markdown + KaTeX (Support $inline$ dan $$display$$)
  function renderMarkdownAndLatex(rawText) {
    if (!rawText) return '';

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
    let html = typeof marked !== 'undefined' ? marked.parse(prepText) : prepText;

    // 3. Render LaTeX back into HTML using KaTeX
    html = html.replace(/%%%MATH_BLOCK_(\d+)%%%/g, (match, index) => {
      const block = mathBlocks[index];
      if (typeof katex !== 'undefined') {
        try {
          return katex.renderToString(block.formula, {
            displayMode: block.type === 'display',
            throwOnError: false
          });
        } catch (err) {
          return `<span style="color:red;">[LaTeX Error: ${err.message}]</span>`;
        }
      } else {
        return block.type === 'display' ? `$$${block.formula}$$` : `$${block.formula}$`;
      }
    });

    return html;
  }

  // Expose global helper
  window.renderMarkdownAndLatex = renderMarkdownAndLatex;

  // Auto Init function if static script elements are present
  async function initRenderer() {
    const targetContainer = document.getElementById('materi-render-target');
    const sourceScript = document.getElementById('materi-source');

    if (targetContainer && sourceScript) {
      const rawMarkdown = sourceScript.textContent || sourceScript.innerText;
      targetContainer.innerHTML = renderMarkdownAndLatex(rawMarkdown);
    }
  }

  // Run on DOM Ready if targets exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRenderer);
  } else {
    initRenderer();
  }
})();
