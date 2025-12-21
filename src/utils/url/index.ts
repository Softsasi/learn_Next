export  const isValidUrl = (url: string | null | undefined) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };
