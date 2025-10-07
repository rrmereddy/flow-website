import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface LegalModalProps {
    openModal: "terms" | "privacy" | null;
    onCloseAction: () => void;
}

export default function LegalModal({ openModal, onCloseAction }: LegalModalProps) {
    const termsAndConditions = [
        { heading: "1. Introduction", content: "Welcome to Flow (\"we,\" \"our,\" \"us\"). These Terms & Conditions (\"Terms\") govern your use of our rideshare platform, which connects independent contractor drivers (\"Drivers\") with riders (\"Riders\"). By accessing or using our app, you agree to comply with these Terms. If you do not agree, please do not use the service." },
        { heading: "2. Eligibility", content: "- Riders must be at least 18 years old to create an account and use the app.\n- Drivers must be at least 18 years old, pass a background check via Checkr, and meet all vehicle and insurance requirements.\n- Drivers must not have a history of DUI or distracted driving violations." },
        { heading: "3. User Accounts", content: "- You must create an account to use the platform. You are responsible for maintaining the security of your account credentials.\n- Providing false or misleading information may result in account suspension or termination." },
        { heading: "4. Payments & Fees", content: "- Riders agree to pay the fare displayed in the app at the time of booking.\n- Additional charges, such as cancellation or cleaning fees, may apply as specified in the app.\n- Drivers are independent contractors and will receive payment based on completed rides." },
        { heading: "5. Cancellations & Refunds", content: "- Riders can cancel a ride before the driver arrives, subject to potential cancellation fees.\n- No refunds will be issued once a ride has started unless determined otherwise by customer support.\n- Drivers can cancel a ride for safety reasons, but excessive cancellations may result in account review." },
        { heading: "6. Driver & Rider Conduct", content: "- Drivers and Riders must treat each other with respect and follow all local traffic laws.\n- Any form of discrimination, harassment, or illegal activity will result in account suspension or termination.\n- Drivers must maintain their vehicles in good working condition and ensure they meet all safety requirements." },
        { heading: "7. Safety & Insurance", content: "- All Drivers must maintain the required insurance, including contingent liability and general liability coverage.\n- The app provides a safety check process before allowing drivers to operate. However, we do not guarantee safety and are not liable for accidents or damages." },
        { heading: "8. Limitation of Liability", content: "- We provide the platform \"as is\" and disclaim all warranties regarding service reliability, availability, and safety.\n- We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of the service." },
        { heading: "9. Termination", content: "- We reserve the right to suspend or terminate any account at our discretion, including but not limited to violations of these Terms.\n- Users may delete their accounts at any time via the app settings." },
        { heading: "10. Modifications to Terms", content: "- We may update these Terms at any time. Continued use of the app after changes means you accept the updated Terms." },
        { heading: "11. Governing Law", content: "- These Terms are governed by the laws of the state of Texas, without regard to its conflict of law principles." },
        { heading: "12. Contact Information", content: "For any questions regarding these Terms, please contact us at [team@roamwithflow.com]." }
      ];
    
      const privacyPolicy = [
        { heading: "1. Introduction", content: "Welcome to Flow (\"we,\" \"our,\" \"us\"). Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect your personal information when using our rideshare platform." },
        { heading: "2. Information We Collect", content: "- Personal Information: When you create an account, we collect your name, phone number, email, payment information, and profile photo.\n- Driver Information: Drivers must provide additional details such as license, insurance, vehicle details, and background check information.\n- Usage Data: We collect data related to your app usage, including ride history, ratings, and support interactions.\n- Location Data: We collect real-time location data from Riders and Drivers to facilitate rides. Location tracking can be adjusted via device settings.\n- Device & Log Data: We may collect device type, operating system, IP address, and app usage logs." },
        { heading: "3. How We Use Your Information", content: "- To provide and improve our rideshare services.\n- To process payments and prevent fraud.\n- To ensure safety and compliance with regulations.\n- To provide customer support and enhance user experience.\n- To send promotional messages (with opt-out options)." },
        { heading: "4. How We Share Your Information", content: "- With Drivers and Riders: To enable ride-matching and communications.\n- With Service Providers: We share data with third parties such as payment processors and background check services.\n- With Law Enforcement: If required by law or to protect users' safety.\n- With Business Partners: In cases of mergers, acquisitions, or partnerships." },
        { heading: "5. Data Security", content: "We implement security measures to protect your information. However, no method of transmission is 100% secure, and we cannot guarantee absolute security." },
        { heading: "6. Data Retention", content: "- We retain personal data as long as necessary for business, legal, and security purposes.\n- Users can request data deletion by contacting support." },
        { heading: "7. User Rights", content: "- Access & Update: Users can access and update their information in the app settings.\n- Opt-Out: Users can opt out of promotional communications.\n- Data Deletion: Users can request account deletion by contacting support." },
        { heading: "8. Children's Privacy", content: "Our service is not intended for children under 18. We do not knowingly collect data from minors." },
        { heading: "9. Changes to This Policy", content: "We may update this Privacy Policy. Continued use of the app after changes means acceptance of the new policy." },
        { heading: "10. Contact Information", content: "For questions regarding this Privacy Policy, please contact us at [team@roamwithflow.com]." }
      ];

    return (
        <Dialog open={!!openModal} onOpenChange={onCloseAction}>
            <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader className="border-b pb-2">
                    <DialogTitle className="text-2xl font-bold">
                        {openModal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
                    </DialogTitle>
                </DialogHeader>
                {/* Scrollable area with preserved formatting */}
                <div className="prose dark:prose-invert overflow-y-auto max-h-[70vh] pr-4">
                    <div className="space-y-6">
                        {(openModal === "privacy" ? privacyPolicy : termsAndConditions).map((section, index) => (
                            <div key={index} className="space-y-3">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-1">
                                    {section.heading}
                                </h2>
                                <div className="text-sm leading-relaxed text-muted-foreground">
                                    {section.content.split('\n').map((line, lineIndex) => {
                                        // Check if line starts with "- " for bullet points
                                        if (line.trim().startsWith('- ')) {
                                            return (
                                                <div key={lineIndex} className="flex items-start space-x-2 mb-1">
                                                    <span className="text-primary mt-1">•</span>
                                                    <span className="flex-1">{line.trim().substring(2)}</span>
                                                </div>
                                            );
                                        }
                                        // Regular paragraph
                                        return (
                                            <p key={lineIndex} className="mb-2">
                                                {line}
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}