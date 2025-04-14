import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust the path if necessary
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue} from "@/components/ui/select";
import { toast } from "sonner";

// Define an interface for form data
interface FormData {
    name: string;
    email: string;
    phone: string;
    reason: string;
    message: string;
    [key: string]: string; // Index signature to allow formData[field.id]
}

const fadeInUpVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

const ContactForm = () => {
    // Set up state to hold form values.
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        reason: "",
        message: "",
    });


    // Format phone number as (XXX) XXX-XXXX
    const formatPhoneNumber = (value: string): string => {
        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, "");

        // Limit to 10 digits
        const trimmedDigits = digitsOnly.slice(0, 10);

        // Format based on length
        if (trimmedDigits.length === 0) return "";
        if (trimmedDigits.length <= 3) return `(${trimmedDigits}`;
        if (trimmedDigits.length <= 6) return `(${trimmedDigits.slice(0, 3)}) ${trimmedDigits.slice(3)}`;
        return `(${trimmedDigits.slice(0, 3)}) ${trimmedDigits.slice(3, 6)}-${trimmedDigits.slice(6)}`;
    };

    // Validate if phone number is complete (10 digits)
    const validatePhone = (phoneNumber: string): boolean => {
        const digitsOnly = phoneNumber.replace(/\D/g, "");
        return digitsOnly.length === 10;
    };

    // Generic change handler for inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Special handling for phone numbers
        if (name === "phone") {
            const formattedPhone = formatPhoneNumber(value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: formattedPhone,
            }));

        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Special handler for the Select component change
    const handleSelectChange = (value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            reason: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent default form submission

        // Additional validation for phone before submission
        if (formData.phone && !validatePhone(formData.phone)) {
            toast.error("Please enter a valid phone number");
            return;
        }

        try {
            // Write document to "contact_requests" collection in Firestore.
            await addDoc(collection(db, "contact_requests"), formData);
            toast.success("Form submitted successfully!", {
                description: "You will hear back from us soon!",
            })
            // Optionally clear form fields
            setFormData({
                name: "",
                email: "",
                phone: "",
                reason: "",
                message: "",
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            toast.error("Error submitting form", {
                description: "Please try again.",
            })
        }
    };

    return (
        <motion.div className="mx-auto max-w-lg mt-8 w-full" variants={fadeInUpVariants}>
            <motion.form
                className="space-y-4 w-full"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {[
                    { name: "name", label: "Name", type: "text", placeholder: "Your name" },
                    { name: "email", label: "Email", type: "email", placeholder: "Your email" },
                ].map((field, index) => (
                    <motion.div
                        key={field.name}
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
                    >
                        <Label htmlFor={field.name} className="text-blue-600 dark:text-blue-400">
                            {field.label}
                        </Label>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                required
                                autoComplete={field.name}
                                onChange={handleChange}
                                value={formData[field.name]} // binding value for controlled component
                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                            />
                        </motion.div>
                    </motion.div>
                ))}

                {/* Phone input with special handling */}
                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Label htmlFor="phone" className="text-blue-600 dark:text-blue-400">
                        Phone
                    </Label>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="(123) 456-7890"
                            required
                            autoComplete="tel"
                            onChange={handleChange}
                            value={formData.phone}
                            className='border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600'
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Label htmlFor="reason" className="text-blue-600 dark:text-blue-400">
                        Reason for Contact
                    </Label>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Select
                            name="reason"
                            required
                            value={formData.reason}
                            onValueChange={handleSelectChange}
                        >
                            <SelectTrigger
                                id="reason"
                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:border-blue-800 dark:text-white">
                                <SelectItem value="invest">To Invest</SelectItem>
                                <SelectItem value="ride">To Ride</SelectItem>
                                <SelectItem value="drive">To Drive</SelectItem>
                                <SelectItem value="interview">To Interview</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Label htmlFor="message" className="text-blue-600 dark:text-blue-400">
                        Comments
                    </Label>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Your message"
                            onChange={handleChange}
                            autoComplete="off"
                            value={formData.message}
                            className="min-h-[120px] border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-800 dark:bg-gray-800 dark:text-white dark:focus:border-blue-600 dark:focus:ring-blue-600"
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700"
                    >
                        Submit
                    </Button>
                </motion.div>
            </motion.form>
        </motion.div>
    );
};

export default ContactForm;