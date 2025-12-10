/**
 * Client-side image compression utility
 * Compresses images before upload to reduce file size and improve performance
 */

export interface CompressedImage {
  file: File;
  preview: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  mimeType: 'image/jpeg',
};

/**
 * Compress an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Compressed image details
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.onload = () => {
        try {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;
          
          if (width > opts.maxWidth || height > opts.maxHeight) {
            const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '.jpg'),
                { type: opts.mimeType }
              );
              
              const preview = canvas.toDataURL(opts.mimeType, opts.quality);
              const originalSize = file.size;
              const compressedSize = blob.size;
              const compressionRatio = ((1 - compressedSize / originalSize) * 100);
              
              resolve({
                file: compressedFile,
                preview,
                originalSize,
                compressedSize,
                compressionRatio,
              });
            },
            opts.mimeType,
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images
 * @param files - Array of files to compress
 * @param options - Compression options
 * @returns Array of compressed image details
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressedImage[]> {
  return Promise.all(files.map(file => compressImage(file, options)));
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
