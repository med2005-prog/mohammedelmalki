export function optimizeImage(url: string, width = 800, quality = 'auto') {
  if (!url) return url;
  
  // Check if it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Insert transformation parameters after /upload/
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/c_scale,w_${width},q_${quality},f_auto/${parts[1]}`;
    }
  }
  
  return url;
}
