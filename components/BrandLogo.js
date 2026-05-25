import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({ className = "", linkClassName = "" }) {
  return (
    <Link href="/" className={`flex items-center space-x-3 ${linkClassName}`}>
      <Image
        src="/favicon.png"
        alt="SpinRec Icon"
        width={32}
        height={32}
        className="w-8 h-8"
        priority
      />
      <div className={`text-2xl font-bold ${className}`}>
        <span className="text-white">Spin</span>
        <span className="text-spindeck-red">Rec</span>
      </div>
    </Link>
  );
}