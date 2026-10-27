import { useEffect } from 'react';

// While on an Orange Acorn page the browser tab shows the studio, not the
// personal site. `title` prefixes the studio name, e.g. a blog post's title.
function useStudioTab(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | Orange Acorn Games` : 'Orange Acorn Games';

    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/png';
    icon.href = 'images/orange_acorn_logo.png';
    document.head.appendChild(icon);

    return () => {
      document.title = prevTitle;
      icon.remove();
    };
  }, [title]);
}

export default useStudioTab;
