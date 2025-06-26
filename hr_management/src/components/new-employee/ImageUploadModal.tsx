"use client";
import ResponsiveModel from "@/components/ResponsiveModel";
import { UploadDropzone } from "@/utils/uploadthing";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";
interface ImageUploadModalProps {
    employee_id?: string;
    open: boolean;
    onOpenChanage: (open: boolean) => void;
}

const ImageUploadModal = ({ open, onOpenChanage, employee_id}: ImageUploadModalProps) => {
  const [isUploading, setIsUploading] = useState(false); 
  const utils = trpc.useUtils()
  return (

    <ResponsiveModel title="Upload Image" open={open} onOpenChange={onOpenChanage}>
      
        <UploadDropzone
        input={{employee_id}}
        endpoint="imageUploader"
        appearance={{
          container: "my-6 flex cursor-pointer items-center justify-center border border-gray-400 rounded-sm p-8 bg-gray-100 dark:bg-gray-800",
          button: `bg-blue-600  text-primary-foreground mt-4 px-4 py-2 rounded hover:bg-blue-600/90 ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`,
          allowedContent: "text-sm text-gray-500 mt-2",
          label: "text-lg font-bold text-gray-700",
        }}
        onUploadBegin={() => {
          setIsUploading(true); // disable button
        }}
        onClientUploadComplete={() => {
          toast.success("Image uploaded successfully!");
          utils.getEmployees.getOneEmployee.invalidate()
          utils.getEmployees.getAllEmployees.invalidate()
          setIsUploading(false);
          onOpenChanage(false); 
        }}
        onUploadError={() => {
          setIsUploading(false); 
        }}
        
      />
       
    </ResponsiveModel>
  )
}

export default ImageUploadModal