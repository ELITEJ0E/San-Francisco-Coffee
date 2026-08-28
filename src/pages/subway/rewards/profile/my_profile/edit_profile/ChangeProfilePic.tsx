import React, { useState, useRef, type ChangeEvent } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "@/app/context/LanguageContext/useTranslation";
import { toast } from "sonner";

interface EditProfileSheetProps {
  accountId: string;
  onPhotoCapture?: (
    success: boolean,
    filename?: string,
    fileData?: File,
  ) => void;
}

interface CameraComponentProps {
  accountId: string;
  onPhotoCapture?: (
    success: boolean,
    filename?: string,
    fileData?: File,
  ) => void;
  onClose?: () => void;
}

const CameraComponent = ({
  accountId,
  onPhotoCapture,
  onClose,
}: CameraComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { translate } = useTranslation();

  const handleCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Please choose an image under 5MB.");
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setCapturedImage(file);
  };

  const handleUpload = async () => {
    if (!capturedImage || !accountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const fileExtension = capturedImage.name.split(".").pop() || "jpg";
      
      if (fileExtension === "svg" || capturedImage.type === "image/svg+xml") {
        toast.error(translate("NotAllowSvgImageFormat"));
        return;
      }     
      
      const newFile = new File(
        [capturedImage],
        `${accountId}.${fileExtension}`,
        {
          type: capturedImage.type,
        },
      );

      const formData = new FormData();
      formData.append("file", newFile);

      // const response = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_URL}/Loyalty/account/${accountId}/upload?brandid=${process.env.NEXT_PUBLIC_BRAND_ID}&isPublic=false`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Accept: "*/*",
      //     },
      //     body: formData,
      //   },
      // );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMP_API_URL}/image/profile/upload?accountId=${accountId}&storeBrand=${process.env.NEXT_PUBLIC_BRAND_ID}&isPublic=false`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            // "X-API-Key": process.env.NEXT_PUBLIC_API_KEY ?? "",
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      if (onPhotoCapture) {
        onPhotoCapture(true, newFile.name, capturedImage);
      }
      onClose?.();
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.",
      );
      if (onPhotoCapture) {
        onPhotoCapture(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center w-full h-full bg-black">
      <div className="relative w-full max-w-md aspect-square">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleCapture}
              className="hidden"
              id="cameraInput"
            />
            <label
              htmlFor="cameraInput"
              className="bg-white text-black px-6 py-3 rounded-full cursor-pointer"
            >
              Take Photo
            </label>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="p-4 w-full max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="p-4 w-full max-w-md space-y-2">
          <Button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full rounded-full bg-primary text-white"
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
          <Button
            onClick={() => {
              setCapturedImage(null);
              setPreviewUrl(null);
              setError(null);
            }}
            variant="outline"
            className="w-full rounded-full text-red-500"
          >
            Retake Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export function EditProfileSheet({
  accountId,
  onPhotoCapture,
}: EditProfileSheetProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { translate } = useTranslation();

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExtension = file.name.split(".").pop() || "jpg";

      if (fileExtension === "svg" || file.type === "image/svg+xml") {
        toast.error(translate("NotAllowSvgImageFormat"));
        return;
      }           

      const newFile = new File([file], `${accountId}.${fileExtension}`, {
        type: file.type,
      });

      const formData = new FormData();
      formData.append("file", newFile);

      // const response = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_URL}/Loyalty/account/${accountId}/upload?brandid=${process.env.NEXT_PUBLIC_BRAND_ID}&isPublic=false`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Accept: "*/*",
      //     },
      //     body: formData,
      //   },
      // );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EMP_API_URL}/image/profile/upload?accountId=${accountId}&storeBrand=${process.env.NEXT_PUBLIC_BRAND_ID}&isPublic=false`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            // "X-API-Key": process.env.NEXT_PUBLIC_API_KEY ?? "",
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      if (onPhotoCapture) {
        onPhotoCapture(true, newFile.name, file);
      }
      setIsCameraOpen(false);
    } catch (error) {
      console.error("Error uploading photo:", error);
      if (onPhotoCapture) {
        onPhotoCapture(false);
      }
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer">
          <span className="text-sm text-primary font-normal mt-1">
            {translate("Change")}
          </span>
        </div>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="p-0 mx-auto max-w-md rounded-t-3xl overflow-hidden"
      >
        {isCameraOpen ? (
          <CameraComponent
            accountId={accountId}
            onPhotoCapture={onPhotoCapture}
            onClose={() => setIsCameraOpen(false)}
          />
        ) : (
          <div className="flex flex-col gap-4 bg-white text-primary pb-3">
            <div className="text-lg font-bold mx-auto items-center pt-4">
              Edit Profile Picture
            </div>
            <div className="border-b border-gray-300" />

            <div
              className="flex items-center gap-3 cursor-pointer py-2 px-4"
              onClick={() => setIsCameraOpen(true)}
            >
              <Camera className="size-7" />
              <span>Take Photo</span>
            </div>

            <div className="border-b border-gray-300" />

            <div
              className="flex items-center gap-3 cursor-pointer py-2 px-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <Upload className="size-7" />
              <span>Upload Photo</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default EditProfileSheet;
