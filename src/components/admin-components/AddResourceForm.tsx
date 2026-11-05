// /**
//  * AddResourceForm Component
//  *
//  * Form for creating and editing resources with validation
//  */

// import { useState, useEffect } from "react";
// import type { FormEvent } from "react";
// import type {
//   Resource,
//   CreateResourcePayload,
// } from "../../types/resource.types";

// // ==================== TYPES ====================

// interface AddResourceFormProps {
//   onSubmit: (payload: CreateResourcePayload) => Promise<boolean>;
//   onCancel?: () => void;
//   initialData?: Resource | null;
//   isLoading?: boolean;
// }

// // ==================== CONSTANTS ====================

// const CATEGORIES = ["Frontend", "Backend", "Cybersecurity"] as const;
// const TYPES = ["Video", "Documentation", "Book", "Other"] as const;
// const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

// // ==================== MAIN COMPONENT ====================

// export default function AddResourceForm({
//   onSubmit,
//   onCancel,
//   initialData,
//   isLoading = false,
// }: AddResourceFormProps) {
//   // Form State
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState<string>(CATEGORIES[0]);
//   const [type, setType] = useState<string>(TYPES[0]);
//   const [difficulty, setDifficulty] = useState<string>(DIFFICULTY_LEVELS[0]);
//   const [url, setUrl] = useState("");
//   const [author, setAuthor] = useState("");
//   const [isPaid, setIsPaid] = useState(false);
//   const [price, setPrice] = useState("");
//   const [platform, setPlatform] = useState("");
//   const [tags, setTags] = useState<string[]>([]);
//   const [tagInput, setTagInput] = useState("");
//   const [duration, setDuration] = useState("");
//   const [isFeatured, setIsFeatured] = useState(false);
//   const [isHosted, setIsHosted] = useState(false);

//   // File State
//   const [imagePreview, setImagePreview] = useState<string>("");

//   // Validation State
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // ==================== INITIALIZE FORM ====================

//   useEffect(() => {
//     if (initialData) {
//       setTitle(initialData.title);
//       setDescription(initialData.description);
//       setCategory(initialData.category);
//       setType(initialData.type);
//       setDifficulty(initialData.difficulty);
//       setUrl(initialData.url || "");
//       setAuthor(initialData.author);
//       setIsPaid(initialData.isPaid);
//       setPrice(initialData.price);
//       setPlatform(initialData.platform || "");
//       setTags(initialData.tags || []);
//       setDuration(String(initialData.duration / 60)); // Convert seconds to minutes
//       setIsFeatured(initialData.isFeatured);
//       setIsHosted(initialData.isHosted);
//       setImagePreview(initialData.imageUrl || "");
//     }
//   }, [initialData]);

//   // ==================== TAG HANDLERS ====================

//   const handleAddTag = () => {
//     const trimmedTag = tagInput.trim();
//     if (trimmedTag && !tags.includes(trimmedTag)) {
//       setTags([...tags, trimmedTag]);
//       setTagInput("");
//     }
//   };

//   const handleRemoveTag = (tagToRemove: string) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleAddTag();
//     }
//   };

//   // ==================== VALIDATION ====================

//   const validate = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!title.trim()) newErrors.title = "Title is required";
//     if (!description.trim()) newErrors.description = "Description is required";
//     if (!author.trim()) newErrors.author = "Author is required";
//     if (isPaid && (!price || parseFloat(price) <= 0))
//       newErrors.price = "Valid price is required for paid resources";
//     if (!duration || parseInt(duration) <= 0)
//       newErrors.duration = "Duration is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ==================== SUBMIT HANDLER ====================

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!validate()) return;

//     // Build payload
//     const payload: CreateResourcePayload = {
//       title: title.trim(),
//       description: description.trim(),
//       category,
//       type,
//       difficulty,
//       author: author.trim(),
//       isPaid,
//       tags,
//       isFeatured,
//       isHosted,
//       duration: parseInt(duration) * 60, // Convert minutes to seconds
//     };

//     // Add optional fields
//     if (url.trim()) payload.url = url.trim();
//     if (isPaid && price) payload.price = price;
//     if (platform.trim()) payload.platform = platform.trim();

//     // Handle file uploads - DO NOT send base64 data
//     // Only send URLs (either existing URLs or newly uploaded URLs)
//     if (imagePreview && !imagePreview.startsWith("data:")) {
//       // If it's already a URL (from existing resource), use it
//       payload.imageUrl = imagePreview;
//     }
//     // If imageFile exists, you should upload it first
//     // For now, we'll skip sending base64 to avoid 413 error
//     // Uncomment and implement when you have file upload endpoint:
//     /*
//     if (imageFile) {
//       try {
//         const imageUrl = await uploadImage(imageFile);
//         payload.imageUrl = imageUrl;
//       } catch (error) {
//         console.error("Image upload failed:", error);
//       }
//     }
//     */

//     // Same for video
//     /*
//     if (videoFile) {
//       try {
//         const videoUrl = await uploadVideo(videoFile);
//         payload.videoUrl = videoUrl;
//       } catch (error) {
//         console.error("Video upload failed:", error);
//       }
//     }
//     */

//     const success = await onSubmit(payload);

//     if (success) {
//       // Reset form
//       resetForm();
//     }
//   };

//   // ==================== RESET FORM ====================

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setCategory(CATEGORIES[0]);
//     setType(TYPES[0]);
//     setDifficulty(DIFFICULTY_LEVELS[0]);
//     setUrl("");
//     setAuthor("");
//     setIsPaid(false);
//     setPrice("");
//     setPlatform("");
//     setTags([]);
//     setTagInput("");
//     setDuration("");
//     setIsFeatured(false);
//     setIsHosted(false);
//     setImagePreview("");
//     setErrors({});
//   };

//   // ==================== RENDER ====================

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white shadow rounded-xl p-10 w-full max-w-4xl mx-auto mt-8 flex flex-col gap-6"
//     >
//       {/* Title */}
//       <div>
//         <input
//           type="text"
//           className={`border rounded-lg px-4 py-3 text-lg w-full ${
//             errors.title ? "border-red-500" : ""
//           }`}
//           placeholder="Resource title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           disabled={isLoading}
//         />
//         {errors.title && (
//           <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//         )}
//       </div>

//       {/* Description */}
//       <div>
//         <textarea
//           className={`border rounded-lg px-4 py-3 text-lg w-full min-h-24 ${
//             errors.description ? "border-red-500" : ""
//           }`}
//           placeholder="Resource description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           disabled={isLoading}
//         />
//         {errors.description && (
//           <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//         )}
//       </div>

//       {/* Image URL Input (Alternative to upload) */}
//       <div>
//         <input
//           type="url"
//           className="border rounded-lg px-4 py-3 w-full"
//           placeholder="Image URL (e.g., https://example.com/image.jpg)"
//           value={imagePreview}
//           onChange={(e) => setImagePreview(e.target.value)}
//           disabled={isLoading}
//         />
//         {imagePreview && (
//           <div className="mt-2">
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="w-32 h-32 object-cover rounded-lg"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src =
//                   "https://via.placeholder.com/128?text=Invalid+URL";
//               }}
//             />
//           </div>
//         )}
//       </div>

//       {/* Video URL Input (shown when type is Video) */}
//       {type === "Video" && (
//         <div>
//           <label className="block mb-2 text-primary font-medium">
//             Video URL (Optional)
//           </label>
//           <input
//             type="url"
//             className="border rounded-lg px-4 py-3 w-full"
//             placeholder="Video URL (e.g., https://youtube.com/watch?v=... or https://vimeo.com/...)"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             disabled={isLoading}
//           />
//           <p className="text-xs text-ink-muted mt-1">
//             Paste the URL to your video (YouTube, Vimeo, or direct video link)
//           </p>
//         </div>
//       )}

//       {/* Category, Type, Difficulty */}
//       <div className="grid grid-cols-3 gap-6">
//         <div className="flex flex-col">
//           <label className="mb-2 text-primary font-medium">Category</label>
//           <select
//             className="border rounded-lg px-4 py-3"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             disabled={isLoading}
//           >
//             {CATEGORIES.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex flex-col">
//           <label className="mb-2 text-primary font-medium">Type</label>
//           <select
//             className="border rounded-lg px-4 py-3"
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             disabled={isLoading}
//           >
//             {TYPES.map((t) => (
//               <option key={t} value={t}>
//                 {t}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex flex-col">
//           <label className="mb-2 text-primary font-medium">Difficulty</label>
//           <select
//             className="border rounded-lg px-4 py-3"
//             value={difficulty}
//             onChange={(e) => setDifficulty(e.target.value)}
//             disabled={isLoading}
//           >
//             {DIFFICULTY_LEVELS.map((level) => (
//               <option key={level} value={level}>
//                 {level}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* URL & Author */}
//       <div className="grid grid-cols-2 gap-6">
//         {/* Resource URL - Only show for non-Video types */}
//         {type !== "Video" && (
//           <div>
//             <label className="block mb-2 text-primary font-medium">
//               Resource URL (Optional)
//             </label>
//             <input
//               type="url"
//               className="border rounded-lg px-4 py-3 w-full"
//               placeholder="https://example.com/resource"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               disabled={isLoading}
//             />
//             <p className="text-xs text-ink-muted mt-1">
//               Link to the resource (documentation, article, book, etc.)
//             </p>
//           </div>
//         )}

//         <div className={type !== "Video" ? "" : "col-span-2"}>
//           <label className="block mb-2 text-primary font-medium">
//             Author Name
//           </label>
//           <input
//             type="text"
//             className={`border rounded-lg px-4 py-3 w-full ${
//               errors.author ? "border-red-500" : ""
//             }`}
//             placeholder="Author name"
//             value={author}
//             onChange={(e) => setAuthor(e.target.value)}
//             disabled={isLoading}
//           />
//           {errors.author && (
//             <p className="text-red-500 text-sm mt-1">{errors.author}</p>
//           )}
//         </div>
//       </div>

//       {/* Paid/Free Toggle */}
//       <div className="flex items-center gap-4">
//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={isPaid}
//             onChange={(e) => setIsPaid(e.target.checked)}
//             disabled={isLoading}
//             className="w-4 h-4"
//           />
//           <span className="text-primary">Paid Resource</span>
//         </label>

//         {isPaid && (
//           <div className="flex-1">
//             <input
//               type="number"
//               step="0.01"
//               min="0"
//               className={`border rounded-lg px-4 py-3 w-full ${
//                 errors.price ? "border-red-500" : ""
//               }`}
//               placeholder="Price ($)"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               disabled={isLoading}
//             />
//             {errors.price && (
//               <p className="text-red-500 text-sm mt-1">{errors.price}</p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Platform & Duration */}
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <input
//             type="text"
//             className="border rounded-lg px-4 py-3 w-full"
//             placeholder="Platform (e.g., Udemy, YouTube)"
//             value={platform}
//             onChange={(e) => setPlatform(e.target.value)}
//             disabled={isLoading}
//           />
//         </div>

//         <div>
//           <input
//             type="number"
//             min="1"
//             className={`border rounded-lg px-4 py-3 w-full ${
//               errors.duration ? "border-red-500" : ""
//             }`}
//             placeholder="Duration (minutes)"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//             disabled={isLoading}
//           />
//           {errors.duration && (
//             <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
//           )}
//         </div>
//       </div>

//       {/* Tags */}
//       <div>
//         <label className="block mb-2 text-primary font-medium">Tags</label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border rounded-lg px-4 py-3 flex-1"
//             placeholder="Add tag and press Enter"
//             value={tagInput}
//             onChange={(e) => setTagInput(e.target.value)}
//             onKeyDown={handleTagKeyDown}
//             disabled={isLoading}
//           />
//           <button
//             type="button"
//             onClick={handleAddTag}
//             className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary transition-colors"
//             disabled={isLoading}
//           >
//             Add
//           </button>
//         </div>
//         {tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-3">
//             {tags.map((tag) => (
//               <span
//                 key={tag}
//                 className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-line text-primary"
//               >
//                 {tag}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveTag(tag)}
//                   className="text-ink-muted hover:text-primary"
//                   disabled={isLoading}
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Additional Options */}
//       <div className="flex gap-6">
//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={isFeatured}
//             onChange={(e) => setIsFeatured(e.target.checked)}
//             disabled={isLoading}
//             className="w-4 h-4"
//           />
//           <span className="text-primary">Featured Resource</span>
//         </label>

//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={isHosted}
//             onChange={(e) => setIsHosted(e.target.checked)}
//             disabled={isLoading}
//             className="w-4 h-4"
//           />
//           <span className="text-primary">Self-Hosted</span>
//         </label>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-4 mt-2">
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {isLoading ? "Saving..." : initialData ? "Update" : "Save"}
//         </button>

//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={isLoading}
//             className="border border-line text-primary px-8 py-3 rounded-lg hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </form>
//   );
// }

/**
 * AddResourceForm Component
 *
 * Form for creating and editing resources with validation
 */

import React from "react";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type {
  Resource,
  CreateResourcePayload,
} from "../../types/resource.types";

// ==================== TYPES ====================

interface AddResourceFormProps {
  onSubmit: (payload: CreateResourcePayload) => Promise<boolean>;
  onCancel?: () => void;
  initialData?: Resource | null;
  isLoading?: boolean;
}

// ==================== CONSTANTS ====================

const CATEGORIES = ["Frontend", "Backend", "Cybersecurity"] as const;
const TYPES = ["Video", "Documentation", "Book", "Other"] as const;
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

// ==================== MAIN COMPONENT ====================

export default function AddResourceForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: AddResourceFormProps) {
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [type, setType] = useState<string>(TYPES[0]);
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTY_LEVELS[0]);
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [platform, setPlatform] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [duration, setDuration] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHosted, setIsHosted] = useState(false);

  // File State
  const [imagePreview, setImagePreview] = useState<string>("");

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ==================== INITIALIZE FORM ====================

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setType(initialData.type);
      setDifficulty(initialData.difficulty);
      setUrl(initialData.url || "");
      setAuthor(initialData.author);
      setIsPaid(initialData.isPaid);
      setPrice(initialData.price);
      setPlatform(initialData.platform || "");
      setTags(initialData.tags || []);
      setDuration(String(initialData.duration / 60)); // Convert seconds to minutes
      setIsFeatured(initialData.isFeatured);
      setIsHosted(initialData.isHosted);
      setImagePreview(initialData.imageUrl || "");
    }
  }, [initialData]);

  // ==================== TAG HANDLERS ====================

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // ==================== VALIDATION ====================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!author.trim()) newErrors.author = "Author is required";
    if (isPaid && (!price || parseFloat(price) <= 0))
      newErrors.price = "Valid price is required for paid resources";
    if (!duration || parseInt(duration) <= 0)
      newErrors.duration = "Duration is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== SUBMIT HANDLER ====================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Build payload
    const payload: CreateResourcePayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      difficulty,
      author: author.trim(),
      isPaid,
      tags,
      isFeatured,
      isHosted,
      duration: parseInt(duration) * 60, // Convert minutes to seconds
    };

    // Add optional fields
    if (url.trim()) payload.url = url.trim();
    if (isPaid && price) payload.price = price;
    if (platform.trim()) payload.platform = platform.trim();

    // Handle image URL - send if it's a valid URL (not base64)
    if (imagePreview && imagePreview.trim()) {
      // Only send if it's a valid URL (http/https) or existing URL
      if (
        imagePreview.startsWith("http://") ||
        imagePreview.startsWith("https://")
      ) {
        payload.imageUrl = imagePreview.trim();
      }
    }

    const success = await onSubmit(payload);

    if (success) {
      // Reset form
      resetForm();
    }
  };

  // ==================== RESET FORM ====================

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setType(TYPES[0]);
    setDifficulty(DIFFICULTY_LEVELS[0]);
    setUrl("");
    setAuthor("");
    setIsPaid(false);
    setPrice("");
    setPlatform("");
    setTags([]);
    setTagInput("");
    setDuration("");
    setIsFeatured(false);
    setIsHosted(false);
    setImagePreview("");
    setErrors({});
  };

  // ==================== RENDER ====================

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-10 w-full max-w-4xl mx-auto mt-8 flex flex-col gap-6"
    >
      {/* Title */}
      <div>
        <input
          type="text"
          className={`border rounded-lg px-4 py-3 text-lg w-full ${
            errors.title ? "border-red-500" : ""
          }`}
          placeholder="Resource title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <textarea
          className={`border rounded-lg px-4 py-3 text-lg w-full min-h-24 ${
            errors.description ? "border-red-500" : ""
          }`}
          placeholder="Resource description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Image URL Input (Alternative to upload) */}
      <div>
        <label className="block mb-2 text-navy-800 font-medium">
          Image URL (Optional)
        </label>
        <input
          type="url"
          className="border rounded-lg px-4 py-3 w-full"
          placeholder="https://example.com/image.jpg"
          value={imagePreview}
          onChange={(e) => setImagePreview(e.target.value)}
          disabled={isLoading}
        />
        <p className="text-xs text-mist-500 mt-1">
          Paste the full URL of your resource image (must start with https://)
        </p>
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-mist-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/128?text=Invalid+URL";
              }}
            />
          </div>
        )}
      </div>

      {/* Video URL Input (shown when type is Video) */}
      {type === "Video" && (
        <div>
          <label className="block mb-2 text-navy-800 font-medium">
            Video URL (Optional)
          </label>
          <input
            type="url"
            className="border border-mist-300 rounded-lg px-4 py-3 w-full"
            placeholder="Video URL (e.g., https://youtube.com/watch?v=... or https://vimeo.com/...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-mist-500 mt-1">
            Paste the URL to your video (YouTube, Vimeo, or direct video link)
          </p>
        </div>
      )}

      {/* Category, Type, Difficulty */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="mb-2 text-navy-800 font-medium">Category</label>
          <select
            className="border border-mist-300 rounded-lg px-4 py-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-navy-800 font-medium">Type</label>
          <select
            className="border border-mist-300 rounded-lg px-4 py-3"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={isLoading}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-navy-800 font-medium">Difficulty</label>
          <select
            className="border border-mist-300 rounded-lg px-4 py-3"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isLoading}
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* URL & Author - was a bare grid-cols-2 with no mobile fallback,
          squeezing two text inputs into half a narrow phone screen each. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Resource URL - Only show for non-Video types */}
        {type !== "Video" && (
          <div>
            <label className="block mb-2 text-navy-800 font-medium">
              Resource URL (Optional)
            </label>
            <input
              type="url"
              className="border border-mist-300 rounded-lg px-4 py-3 w-full"
              placeholder="https://example.com/resource"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-mist-500 mt-1">
              Link to the resource (documentation, article, book, etc.)
            </p>
          </div>
        )}

        <div className={type !== "Video" ? "" : "col-span-2"}>
          <label className="block mb-2 text-navy-800 font-medium">
            Author Name
          </label>
          <input
            type="text"
            className={`border rounded-lg px-4 py-3 w-full ${
              errors.author ? "border-red-500" : ""
            }`}
            placeholder="Author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isLoading}
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">{errors.author}</p>
          )}
        </div>
      </div>

      {/* Paid/Free Toggle */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4"
          />
          <span className="text-navy-800">Paid Resource</span>
        </label>

        {isPaid && (
          <div className="flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              className={`border rounded-lg px-4 py-3 w-full ${
                errors.price ? "border-red-500" : ""
              }`}
              placeholder="Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isLoading}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        )}
      </div>

      {/* Platform & Duration - was a bare grid-cols-2 with no mobile
          fallback, squeezing two text inputs into half a narrow phone
          screen each. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <input
            type="text"
            className="border rounded-lg px-4 py-3 w-full"
            placeholder="Platform (e.g., Udemy, YouTube)"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <input
            type="number"
            min="1"
            className={`border rounded-lg px-4 py-3 w-full ${
              errors.duration ? "border-red-500" : ""
            }`}
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={isLoading}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block mb-2 text-navy-800 font-medium">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="border border-mist-300 rounded-lg px-4 py-3 flex-1"
            placeholder="Add tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-navy-800 text-white px-6 py-3 rounded-lg hover:bg-navy-700 transition-colors"
            disabled={isLoading}
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-mist-200 text-mist-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-mist-500 hover:text-navy-800"
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Additional Options */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4"
          />
          <span className="text-navy-800">Featured Resource</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isHosted}
            onChange={(e) => setIsHosted(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4"
          />
          <span className="text-navy-800">Self-Hosted</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-navy-800 text-white px-8 py-3 rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : initialData ? "Update" : "Save"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="border border-mist-300 text-navy-800 px-8 py-3 rounded-lg hover:bg-mist-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
