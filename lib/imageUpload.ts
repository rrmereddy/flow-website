/**
 * Global Image Upload Utilities for Web
 * 
 * This module provides centralized image upload functionality for the Flow web app.
 * It handles both profile picture uploads and driver document uploads.
 * 
 * Key Features:
 * - File input handling for web browsers
 * - Image preview and validation
 * - Firebase Storage upload
 * - Firestore document updates
 * - Local state updates for immediate UI feedback
 * 
 * Usage Examples:
 * 
 * 1. Profile Picture Upload (with local state update):
 *    const downloadURL = await completeImageUploadFlow({
 *        setUploadingImage,
 *        setProfileData,
 *        uploadType: 'profile',
 *        fileInputRef: fileInputRef
 *    });
 * 
 * 2. Driver Document Upload:
 *    const downloadURL = await completeImageUploadFlow({
 *        setUploadingImage,
 *        uploadType: 'document',
 *        documentType: 'license',
 *        fileInputRef: fileInputRef
 *    });
 * 
 * 3. Simple File Selection Only:
 *    const file = await selectImageFile({
 *        accept: 'image/*',
 *        multiple: false
 *    });
 */

import { auth, storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Image file validation
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith('image/')) {
        return { isValid: false, error: 'Please select a valid image file.' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return { isValid: false, error: 'Image size must be less than 5MB.' };
    }

    return { isValid: true };
};

/**
 * Convert File to blob and upload to Firebase Storage
 */
export const uploadImageAsync = async (
    file: File, 
    folder: string, 
    fileName?: string
): Promise<string> => {
    try {
        const fileNameToUse = fileName || `${Date.now()}_${file.name}`;
        const fileRef = ref(storage, `${folder}/${fileNameToUse}`);
        
        await uploadBytes(fileRef, file, { contentType: file.type });
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

/**
 * Select image file using file input
 */
export const selectImageFile = async (
    options: {
        accept?: string;
        multiple?: boolean;
    } = {}
): Promise<File | null> => {
    const { accept = 'image/*', multiple = false } = options;

    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0] || null;
            resolve(file);
        };
        
        input.oncancel = () => resolve(null);
        input.click();
    });
};

/**
 * Create a file input element with proper styling and event handling
 */
export const createFileInput = (
    options: {
        accept?: string;
        multiple?: boolean;
        onChange?: (file: File | null) => void;
        className?: string;
    } = {}
): HTMLInputElement => {
    const { accept = 'image/*', multiple = false, onChange, className = '' } = options;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.className = className;
    input.style.display = 'none';
    
    if (onChange) {
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0] || null;
            onChange(file);
        };
    }
    
    return input;
};

/**
 * Upload profile picture and update user document
 */
export const uploadProfilePicture = async (
    file: File,
    setUploadingImage: (uploading: boolean) => void,
    setProfileData?: (updater: (prevData: Record<string, unknown>) => Record<string, unknown>) => void
): Promise<string | null> => {
    if (!file) return null;

    const user = auth.currentUser;
    if (!user) {
        alert("No user found. Please log in.");
        return null;
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
        alert(validation.error);
        return null;
    }

    setUploadingImage(true);

    try {
        // Upload image to Firebase Storage
        const downloadURL = await uploadImageAsync(
            file, 
            `users/${user.uid}`, 
            'profilePicture'
        );

        // Update user document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            profilePictureURL: downloadURL
        }, { merge: true });

        // Update local state if setProfileData is provided
        if (setProfileData) {
            setProfileData((prevData: Record<string, unknown>) => ({
                ...prevData,
                profileImage: downloadURL
            }));
        }

        alert('Profile picture updated successfully!');
        return downloadURL;

    } catch (error) {
        console.error("Error uploading profile picture: ", error);
        alert('Failed to upload image. Please try again.');
        return null;
    } finally {
        setUploadingImage(false);
    }
};

/**
 * Upload driver document image
 */
export const uploadDriverDocument = async (
    file: File,
    documentType: string,
    uid: string
): Promise<string> => {
    if (!file) throw new Error('No file provided');

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }

    try {
        // Upload image to Firebase Storage
        const downloadURL = await uploadImageAsync(
            file, 
            `drivers/${uid}/documents`, 
            `${documentType}_${Date.now()}.${file.name.split('.').pop()}`
        );

        return downloadURL;

    } catch (error) {
        console.error(`Error uploading ${documentType} document:`, error);
        throw error;
    }
};

/**
 * Complete image upload flow with file selection and upload
 */
export const completeImageUploadFlow = async (config: {
    setUploadingImage: (uploading: boolean) => void;
    setProfileData?: (updater: (prevData: Record<string, unknown>) => Record<string, unknown>) => void;
    uploadType: 'profile' | 'document';
    documentType?: string;
    accept?: string;
}): Promise<string | null> => {
    const {
        setUploadingImage,
        setProfileData = null,
        uploadType = 'profile',
        documentType = null,
        accept = 'image/*'
    } = config;

    try {
        // Select image file
        const file = await selectImageFile({ accept, multiple: false });
        
        if (!file) return null;

        const user = auth.currentUser;
        if (!user) {
            alert("No user found. Please log in.");
            return null;
        }

        if (uploadType === 'profile') {
            return await uploadProfilePicture(file, setUploadingImage, setProfileData || undefined);
        } else if (uploadType === 'document' && documentType) {
            setUploadingImage(true);
            const downloadURL = await uploadDriverDocument(file, documentType, user.uid);
            setUploadingImage(false);
            return downloadURL;
        } else {
            throw new Error('Invalid upload type or missing document type');
        }

    } catch (error) {
        console.error('Complete image upload flow error:', error);
        alert('Failed to upload image. Please try again.');
        return null;
    }
};

/**
 * Create image preview URL from file
 */
export const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target?.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Resize image file to specified dimensions
 */
export const resizeImageFile = (
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.8
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(resizedFile);
                    } else {
                        reject(new Error('Failed to resize image'));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};