// React, Next.js
import Image from "next/image";
import { FC } from "react";

// Logo image
import LogoImg from "@/public/assets/icons/logo.svg";

interface LogoProps {
  width: string;
  height: string;
}

const Logo: FC<LogoProps> = ({ width, height }) => {
  return (
    <div className="z-50" style={{ width: width, height: height }}>
      <Image
        src={LogoImg}
        alt="Suzy Shop"
        className="w-full h-full object-cover overflow-visible"
      />
    </div>
  );
};

export default Logo;
