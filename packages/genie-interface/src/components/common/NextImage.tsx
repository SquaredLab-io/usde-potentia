import Image from "next/image";

type NextImageProps = {
  src: string;
  altText: string;
  className?: string;
  priority?: boolean
};

/**
 * A not have to use fixed width and height, and keeps your images optimized.
 *
 * @params `src`, `altText`, `className`
 */
export default function NextImage({ src, altText, className, priority = false }: NextImageProps) {
  return (
    <Image
      src={src}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%" }}
      alt={altText}
      className={className}
      loading="lazy"
      priority={priority}
    />
  );
}
