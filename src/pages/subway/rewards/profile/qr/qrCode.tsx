import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

function CustomQRCode({ value, logo, onRendered }: { value: string; logo?: string; onRendered?: () => void }) {
  useEffect(() => {
    onRendered?.(); // notify parent when mounted
  }, []);

  return (
    <div className="relative">
      <QRCodeSVG
        value={value}
        size={220}
        level="H"
        includeMargin
        bgColor="#FFFFFF"
        fgColor="#000000"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-2 rounded-full">
          <img
            src={logo ?? "/images/MKLogo.svg"}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default CustomQRCode;