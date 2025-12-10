"use client";

import { useState, useRef, useEffect } from "react";
import { updateSettings } from "./actions";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

type Settings = {
  province: string | null;
  city_municipality: string | null;
  barangay_name: string | null;
  punong_barangay: string | null;
  barangay_secretary: string | null;
  logo_barangay_url: string | null;
  logo_city_url: string | null;
};

interface LogoUploaderProps {
  label: string;
  name: string;
  urlName?: string;
  currentUrl?: string | null;
  disabled?: boolean;
}

function LogoUploader({
  label,
  name,
  urlName,
  currentUrl,
  disabled,
}: LogoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const displayUrl = previewUrl || currentUrl;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <div className="relative group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt={label}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {previewUrl
                  ? "New Selection"
                  : currentUrl
                    ? "Current Logo"
                    : "No Logo"}
              </span>
              {previewUrl && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  New
                </span>
              )}
              {!previewUrl && currentUrl && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Uploaded
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-3 h-3 mr-1.5" />
                {displayUrl ? "Change" : "Upload"}
              </button>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-800 dark:text-red-400 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-3 h-3 mr-1.5" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <input
        type="hidden"
        name={urlName || name.replace("_file", "_url")}
        defaultValue={currentUrl || ""}
      />
    </div>
  );
}

export default function SystemSettingsForm({
  settings,
}: {
  settings: Settings;
}) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle Unsaved Changes Warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleDirty = () => {
    if (!isDirty) setIsDirty(true);
    setShowSuccess(false);
  };

  return (
    <div className="w-full relative">
      {/* Unsaved Changes Banner */}
      {isDirty && (
        <div className="sticky top-0 z-10 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-yellow-800">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium text-sm">
              You have unsaved changes. Don&apos;t forget to save.
            </span>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          System Configuration
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage global settings for print documents and reports.
        </p>
      </div>

      <form
        action={async (formData) => {
          setIsLoading(true);
          try {
            // Handle Logo Uploads
            const uploadLogo = async (file: File, name: string) => {
              if (!file || file.size === 0) return null;
              const fileExt = file.name.split(".").pop();
              const fileName = `${name}-${Date.now()}.${fileExt}`;

              try {
                const { error: uploadError } = await supabase.storage
                  .from("branding")
                  .upload(fileName, file, {
                    upsert: true,
                  });

                if (uploadError) {
                  console.error("Error uploading logo:", uploadError);
                  toast.error(
                    `Failed to upload ${name}: ${uploadError.message}`,
                  );
                  return null;
                }

                const {
                  data: { publicUrl },
                } = supabase.storage.from("branding").getPublicUrl(fileName);

                return publicUrl;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                console.error("Unexpected error uploading logo:", e);
                toast.error(`Unexpected error uploading ${name}: ${e.message}`);
                return null;
              }
            };

            const barangayLogoFile = formData.get("barangay_logo_file") as File;
            const cityLogoFile = formData.get("city_logo_file") as File;

            if (barangayLogoFile && barangayLogoFile.size > 0) {
              const url = await uploadLogo(barangayLogoFile, "barangay-logo");
              if (url) formData.set("logo_barangay_url", url);
            }

            if (cityLogoFile && cityLogoFile.size > 0) {
              const url = await uploadLogo(cityLogoFile, "city-logo");
              if (url) formData.set("logo_city_url", url);
            }

            const result = await updateSettings(formData);

            if (result?.error) {
              toast.error(result.error);
            } else if (result?.success) {
              toast.success(result.message);
              setIsDirty(false);
              setShowSuccess(true);
            }
          } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("An unexpected error occurred");
          } finally {
            setIsLoading(false);
          }
        }}
        className="space-y-8"
        onChange={handleDirty}
      >
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Location Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Province
              </label>
              <input
                type="text"
                name="province"
                defaultValue={settings?.province || ""}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="e.g. Metro Manila"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                City / Municipality
              </label>
              <input
                type="text"
                name="city_municipality"
                defaultValue={settings?.city_municipality || ""}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="e.g. Quezon City"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Barangay Name
              </label>
              <input
                type="text"
                name="barangay_name"
                defaultValue={settings?.barangay_name || ""}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="e.g. Barangay 123"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Branding & Logos
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <LogoUploader
              label="Barangay Logo"
              name="barangay_logo_file"
              urlName="logo_barangay_url"
              currentUrl={settings?.logo_barangay_url}
              disabled={isLoading}
            />
            <LogoUploader
              label="City Logo"
              name="city_logo_file"
              urlName="logo_city_url"
              currentUrl={settings?.logo_city_url}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Officials
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Punong Barangay
              </label>
              <input
                type="text"
                name="punong_barangay"
                defaultValue={settings?.punong_barangay || ""}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Barangay Secretary
              </label>
              <input
                type="text"
                name="barangay_secretary"
                defaultValue={settings?.barangay_secretary || ""}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 transition-all shadow-sm"
                placeholder="Full Name"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {showSuccess && (
            <p className="text-sm text-green-600 font-medium animate-in fade-in">
              Settings saved successfully!
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Saving Changes..." : "Save System Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
