"use client";

import FileManager from "@/app/admin/(protected)/file-manager/components/FileManager";
import { FileItem } from "@/app/admin/(protected)/file-manager/fileManager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface MediaSelectorProps {
  value?: any | null;
  onChange: (file: FileItem | null) => void;
  className?: string;
  placeholder?: string;
  required?: boolean; // Add this
  error?: string; // Add this for validation feedback
}

export function MediaSelector({
  value,
  onChange,
  className,
  placeholder = "Select media...",
  required = false, // Default to false
  error, // Passed from parent form
}: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: FileItem) => {
    if (!item?.isDirectory) {
      onChange(item);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null); // Explicitly pass null to indicate the field is cleared
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        {/* Preview */}
        <div
          onClick={() => setIsOpen(true)}
          className="w-28 h-28 relative z-0 border rounded-lg overflow-hidden flex items-center cursor-pointer justify-center hover:border-primary transition-colors"
        >
          {value?.type === "image" ? (
            <img
              src={value?.filePath}
              alt={value?.name}
              className="w-full h-full object-cover"
            />
          ) : value?.type === "document" ? (
            <div className="flex flex-col items-center gap-2">
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.5999 2.07227L30.1639 7.87227V29.9283H9.37891V30.0003H30.2349V7.94527L24.5999 2.07227Z"
                  fill="#909090"
                />
                <path
                  d="M24.5311 2H9.30811V29.928H30.1641V7.873L24.5311 2Z"
                  fill="#F4F4F4"
                />
                <path
                  d="M9.15514 3.5H2.76514V10.327H22.8651V3.5H9.15514Z"
                  fill="#7A7B7C"
                />
                <path
                  d="M22.972 10.2109H2.89502V3.37891H22.972V10.2109Z"
                  fill="#DD2025"
                />
                <path
                  d="M9.55212 4.53465H8.24512V9.33465H9.27312V7.71565L9.50012 7.72865C9.72076 7.72561 9.93938 7.68608 10.1471 7.61165C10.3297 7.54964 10.4976 7.45057 10.6401 7.32065C10.7863 7.19809 10.9011 7.04246 10.9751 6.86665C11.0764 6.57537 11.1122 6.26536 11.0801 5.95865C11.0744 5.7395 11.036 5.52244 10.9661 5.31465C10.9031 5.16446 10.8095 5.02907 10.6912 4.91714C10.5729 4.80521 10.4326 4.71922 10.2791 4.66465C10.1468 4.61566 10.0097 4.5808 9.87012 4.56065C9.76465 4.54348 9.65797 4.53478 9.55112 4.53465M9.36212 6.82865H9.27312V5.34865H9.46612C9.5513 5.34251 9.63677 5.35559 9.71622 5.38691C9.79566 5.41824 9.86706 5.46702 9.92512 5.52965C10.0454 5.69067 10.1097 5.88665 10.1081 6.08765C10.1081 6.33365 10.1081 6.55665 9.88612 6.71365C9.72622 6.80172 9.54415 6.84234 9.36212 6.82865ZM13.0331 4.52165C12.9221 4.52165 12.8141 4.52965 12.7381 4.53265L12.5001 4.53865H11.7201V9.33865H12.6381C12.9889 9.34767 13.3381 9.28823 13.6661 9.16365C13.9302 9.05935 14.164 8.89054 14.3461 8.67265C14.5246 8.4538 14.652 8.19793 14.7191 7.92365C14.798 7.61358 14.8363 7.29458 14.8331 6.97465C14.8527 6.59681 14.8235 6.21802 14.7461 5.84765C14.6721 5.57534 14.5351 5.32425 14.3461 5.11465C14.1979 4.94516 14.0156 4.80886 13.8111 4.71465C13.6359 4.63345 13.4516 4.57369 13.2621 4.53665C13.1868 4.5243 13.1105 4.51861 13.0341 4.51965M12.8521 8.45665H12.7521V5.39265H12.7651C12.9713 5.36881 13.1799 5.40602 13.3651 5.49965C13.5008 5.60798 13.6113 5.74445 13.6891 5.89965C13.7731 6.06299 13.8215 6.24226 13.8311 6.42565C13.8401 6.64565 13.8311 6.82565 13.8311 6.97465C13.8348 7.14628 13.8238 7.31791 13.7981 7.48765C13.7667 7.66172 13.7097 7.83019 13.6291 7.98765C13.5381 8.1345 13.4137 8.25783 13.2661 8.34765C13.1428 8.42766 12.9967 8.4649 12.8501 8.45365M17.9301 4.53865H15.5001V9.33865H16.5281V7.43465H17.8281V6.54265H16.5281V5.43065H17.9281V4.53865"
                  fill="#464648"
                />
                <path
                  d="M22.2812 20.2555C22.2812 20.2555 25.4692 19.6775 25.4692 20.7665C25.4692 21.8555 23.4942 21.4125 22.2812 20.2555ZM19.9242 20.3385C19.4176 20.4501 18.9239 20.614 18.4512 20.8275L18.8512 19.9275C19.2512 19.0275 19.6662 17.8005 19.6662 17.8005C20.1423 18.6046 20.6977 19.359 21.3242 20.0525C20.8526 20.1228 20.3852 20.2189 19.9242 20.3405V20.3385ZM18.6622 13.8385C18.6622 12.8895 18.9692 12.6305 19.2082 12.6305C19.4472 12.6305 19.7162 12.7455 19.7252 13.5695C19.6472 14.398 19.4737 15.2148 19.2082 16.0035C18.8432 15.3418 18.6548 14.5972 18.6612 13.8415L18.6622 13.8385ZM14.0132 24.3545C13.0352 23.7695 16.0642 21.9685 16.6132 21.9105C16.6102 21.9115 15.0372 24.9665 14.0132 24.3545ZM26.4002 20.8955C26.3902 20.7955 26.3002 19.6885 24.3302 19.7355C23.509 19.7211 22.6882 19.779 21.8772 19.9085C21.0911 19.1172 20.4144 18.2243 19.8652 17.2535C20.211 16.2528 20.4205 15.2101 20.4882 14.1535C20.4592 12.9535 20.1722 12.2655 19.2522 12.2755C18.3322 12.2855 18.1982 13.0905 18.3192 14.2885C18.4376 15.0936 18.6612 15.8796 18.9842 16.6265C18.9842 16.6265 18.5592 17.9495 17.9972 19.2655C17.4352 20.5815 17.0512 21.2715 17.0512 21.2715C16.0738 21.5893 15.1537 22.062 14.3262 22.6715C13.5022 23.4385 13.1672 24.0275 13.6012 24.6165C13.9752 25.1245 15.2842 25.2395 16.4542 23.7065C17.0748 22.9139 17.6427 22.0815 18.1542 21.2145C18.1542 21.2145 19.9382 20.7255 20.4932 20.5915C21.0482 20.4575 21.7192 20.3515 21.7192 20.3515C21.7192 20.3515 23.3482 21.9905 24.9192 21.9325C26.4902 21.8745 26.4142 20.9935 26.4042 20.8975"
                  fill="#DD2025"
                />
                <path
                  d="M24.4541 2.07617V7.94917H30.0871L24.4541 2.07617Z"
                  fill="#909090"
                />
                <path d="M24.5308 2V7.873H30.1638L24.5308 2Z" fill="#F4F4F4" />
                <path
                  d="M9.47497 4.45653H8.16797V9.25653H9.19997V7.63853L9.42797 7.65153C9.64861 7.64849 9.86723 7.60895 10.075 7.53453C10.2576 7.47252 10.4254 7.37345 10.568 7.24353C10.713 7.12063 10.8268 6.96502 10.9 6.78953C11.0012 6.49824 11.0371 6.18823 11.005 5.88153C10.9993 5.66238 10.9608 5.44531 10.891 5.23753C10.828 5.08734 10.7344 4.95194 10.6161 4.84002C10.4978 4.72809 10.3574 4.64209 10.204 4.58753C10.0711 4.53806 9.9333 4.50286 9.79297 4.48253C9.6875 4.46535 9.58083 4.45666 9.47397 4.45653M9.28497 6.75053H9.19597V5.27053H9.38997C9.47515 5.26438 9.56062 5.27746 9.64007 5.30879C9.71952 5.34012 9.79091 5.3889 9.84897 5.45153C9.96929 5.61254 10.0336 5.80853 10.032 6.00953C10.032 6.25553 10.032 6.47853 9.80997 6.63553C9.65008 6.7236 9.468 6.76321 9.28597 6.74953M12.956 4.44353C12.845 4.44353 12.737 4.45153 12.661 4.45453L12.426 4.46053H11.646V9.26053H12.564C12.9148 9.26955 13.2639 9.21011 13.592 9.08553C13.8561 8.98122 14.0899 8.81242 14.272 8.59453C14.4504 8.37568 14.5778 8.11981 14.645 7.84553C14.7238 7.53545 14.7622 7.21646 14.759 6.89653C14.7785 6.51868 14.7493 6.13989 14.672 5.76953C14.5979 5.49722 14.4609 5.24613 14.272 5.03653C14.1238 4.86704 13.9415 4.73073 13.737 4.63653C13.5618 4.55533 13.3775 4.49556 13.188 4.45853C13.1126 4.44618 13.0363 4.44049 12.96 4.44153M12.778 8.37853H12.678V5.31453H12.691C12.8971 5.29069 13.1058 5.32789 13.291 5.42153C13.4266 5.52985 13.5372 5.66633 13.615 5.82153C13.6989 5.98486 13.7473 6.16413 13.757 6.34753C13.766 6.56753 13.757 6.74753 13.757 6.89653C13.7607 7.06816 13.7496 7.23979 13.724 7.40953C13.6925 7.58359 13.6356 7.75207 13.555 7.90953C13.4639 8.05637 13.3396 8.1797 13.192 8.26953C13.0687 8.34953 12.9225 8.38678 12.776 8.37553M17.853 4.46053H15.423V9.26053H16.451V7.35653H17.751V6.46453H16.451V5.35253H17.851V4.46053"
                  fill="white"
                />
              </svg>
            </div>
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <div className="relative flex-1">
          <Input
            type="text"
            value={value?.filePath || ""}
            placeholder={placeholder}
            readOnly
            onClick={() => setIsOpen(true)}
            className={`pr-10 cursor-pointer ${
              required && !value ? "border-red-500" : ""
            }`}
          />

          {value?.filePath && (
            <>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={handleClear} // Use handleClear to ensure onChange(null) is called
              >
                <X />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(value.filePath);
                  toast.success("URL copied to clipboard");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
          {required && !value && (
            <p className="text-red-500 text-sm mt-1">This field is required.</p>
          )}
        </div>
      </div>

      {/* File Manager Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          aria-describedby="media-dialog-description"
          className="min-w-[90dvw] max-h-[90dvh] overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:cursor-point dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <DialogHeader>
            <DialogTitle>Select Media</DialogTitle>
          </DialogHeader>
          <div id="media-dialog-description" className="sr-only">
            Dialog for selecting media files from the file manager
          </div>
          <div className="flex-1 overflow-hidden">
            <FileManager onSelect={handleSelect} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
