interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export function getOptimizedImageUrl(url: string, options: ImageOptions = {}): string {
  if (!url) return '';

  // If the URL is from a CDN that supports image optimization (like Cloudinary or Imgix)
  if (url.includes('cloudinary.com')) {
    return optimizeCloudinaryUrl(url, options);
  } else if (url.includes('imgix.net')) {
    return optimizeImgixUrl(url, options);
  }

  // For other URLs, you might want to use a service like Cloudinary or Imgix
  // This is a placeholder for your preferred image optimization service
  return url;
}

function optimizeCloudinaryUrl(url: string, options: ImageOptions): string {
  const { width, height, quality = 80, format = 'webp' } = options;
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  if (transformations.length === 0) return url;

  // Insert transformations into the Cloudinary URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
}

function optimizeImgixUrl(url: string, options: ImageOptions): string {
  const { width, height, quality = 80, format = 'webp' } = options;
  const params = new URLSearchParams();

  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  params.append('fm', format);

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

export function getImagePlaceholder(width: number, height: number): string {
  // Generate a placeholder image URL (you can use services like placehold.co)
  return `https://placehold.co/${width}x${height}/f3f4f6/666666?text=Loading...`;
}

export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

export function getImageAspectRatio(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };
    img.onerror = reject;
    img.src = url;
  });
}
