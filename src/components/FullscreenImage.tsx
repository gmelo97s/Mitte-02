import { ReactNode } from "react";

interface FullscreenImageProps {
  src: string;
  alt: string;
  children?: ReactNode;
  overlay?: boolean;
}

const FullscreenImage = ({ src, alt, children, overlay = true }: FullscreenImageProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Zoom Animation */}
      <div className="absolute inset-0">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover animate-zoom-slow"
        />
      </div>
      
      {/* Gradient Overlays */}
      {overlay && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          <div className="absolute inset-0 scanline-overlay" />
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {children}
      </div>
    </div>
  );
};

export default FullscreenImage;
