import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, FileImage, X, CheckCircle, AlertTriangle } from "lucide-react";

interface ReceiptUploadProps {
  onSubmit: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function ReceiptUpload({ onSubmit, isLoading }: ReceiptUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG)");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (file) {
      onSubmit(file);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Receipt Fraud Analysis</h3>
      <p className="text-sm text-muted-foreground">
        Upload a receipt image to verify its authenticity.
      </p>

      {/* Drop Zone */}
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">
            Drag & drop your receipt here
          </p>
          <p className="mb-3 text-xs text-muted-foreground">
            PNG, JPG, or JPEG up to 10MB
          </p>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>Browse files</span>
            </Button>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        /* Preview */
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                <img
                  src={preview || ""}
                  alt="Receipt preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">
                    {file.name}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!file || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Receipt...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Verify Receipt
          </>
        )}
      </Button>
    </div>
  );
}