import React, { useState, useEffect } from "react";

export default function SafeImage({ src: dbSrc, alt, className, style, ...props }) {
  const primaryCloudinaryUrl = "https://res.cloudinary.com/dkwsaccn9/image/upload/v1779563987/menus/phpA2B0_gcwhby.jpg";
  const localBackupUrl = `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/storage/menus/image.png`;

  // Helper to format local path for a given image source
  const getLocalUrl = (val) => {
    if (!val) return null;
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    // If it's already a full URL, extract folder and filename to construct local URL
    if (val.startsWith("http://") || val.startsWith("https://")) {
      const parts = val.split("/");
      const filename = parts[parts.length - 1];

      let folder = "menus"; // Default folder
      if (val.includes("/restaurant/")) {
        folder = "restaurant";
      } else if (val.includes("/menus/")) {
        folder = "menus";
      }

      return `${baseUrl}/storage/${folder}/${filename}`;
    }

    // Relative path (like 'menus/abc.jpg' or 'storage/menus/abc.jpg')
    const cleanVal = val.startsWith("/") ? val.substring(1) : val;
    const path = cleanVal.startsWith("storage/") ? cleanVal : `storage/${cleanVal}`;
    return `${baseUrl}/${path}`;
  };

  const localUrl = getLocalUrl(dbSrc);

  // States to track current URL and fallback steps
  const [currentSrc, setCurrentSrc] = useState(null);
  const [step, setStep] = useState(0); // 0: Local DB image, 1: Cloudinary URL, 2: local backup image.png, 3: fail/nothing

  useEffect(() => {
    if (localUrl) {
      setCurrentSrc(localUrl);
      setStep(0);
    } else {
      setCurrentSrc(primaryCloudinaryUrl);
      setStep(1);
    }
  }, [localUrl]);

  const handleError = () => {
    if (step === 0) {
      // Local DB image failed, try Cloudinary.
      // If original dbSrc is a full Cloudinary URL, try that. Otherwise, try fallback Cloudinary URL.
      if (dbSrc && (dbSrc.startsWith("http://") || dbSrc.startsWith("https://"))) {
        setCurrentSrc(dbSrc);
      } else {
        setCurrentSrc(primaryCloudinaryUrl);
      }
      setStep(1);
    } else if (step === 1) {
      // Cloudinary failed, try local backup image.png
      setCurrentSrc(localBackupUrl);
      setStep(2);
    } else {
      // Backup failed, show nothing
      setStep(3);
    }
  };

  if (step >= 3) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
}
