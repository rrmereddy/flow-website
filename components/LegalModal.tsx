import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LegalModalProps {
    openModal: "terms" | "privacy" | null;
    onCloseAction: () => void;
}

export default function LegalModal({ openModal, onCloseAction }: LegalModalProps) {
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
                    {openModal === "privacy" ? (
                        <div className="space-y-4">

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">1. Introduction</h2>
                                <p>Welcome to <span className="font-semibold">Flow</span> (&#34;we,&#34; &#34;our,&#34; &#34;us&#34;). Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect your personal information when using our rideshare platform.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">2. Information We Collect</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><span className="font-medium">Personal Information</span>: When you create an account, we collect your name, phone number, email, payment information, and profile photo.</li>
                                    <li><span className="font-medium">Driver Information</span>: Drivers must provide additional details such as license, insurance, vehicle details, and background check information.</li>
                                    <li><span className="font-medium">Usage Data</span>: We collect data related to your app usage, including ride history, ratings, and support interactions.</li>
                                    <li><span className="font-medium">Location Data</span>: We collect real-time location data from Riders and Drivers to facilitate rides. Location tracking can be adjusted via device settings.</li>
                                    <li><span className="font-medium">Device & Log Data</span>: We may collect device type, operating system, IP address, and app usage logs.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>To provide and improve our rideshare services.</li>
                                    <li>To process payments and prevent fraud.</li>
                                    <li>To ensure safety and compliance with regulations.</li>
                                    <li>To provide customer support and enhance user experience.</li>
                                    <li>To send promotional messages (with opt-out options).</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">4. How We Share Your Information</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><span className="font-medium">With Drivers and Riders</span>: To enable ride-matching and communications.</li>
                                    <li><span className="font-medium">With Service Providers</span>: We share data with third parties such as payment processors and background check services.</li>
                                    <li><span className="font-medium">With Law Enforcement</span>: If required by law or to protect users&#39; safety.</li>
                                    <li><span className="font-medium">With Business Partners</span>: In cases of mergers, acquisitions, or partnerships.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">5. Data Security</h2>
                                <p>We implement security measures to protect your information. However, no method of transmission is 100% secure, and we cannot guarantee absolute security.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">6. Data Retention</h2>
                                <p>We retain personal data as long as necessary for business, legal, and security purposes. Users can request data deletion by contacting support.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">7. User Rights</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><span className="font-medium">Access & Update</span>: Users can access and update their information in the app settings.</li>
                                    <li><span className="font-medium">Opt-Out</span>: Users can opt out of promotional communications.</li>
                                    <li><span className="font-medium">Data Deletion</span>: Users can request account deletion by contacting support.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">8. Children&#34;s Privacy</h2>
                                <p>Our service is not intended for children under 18. We do not knowingly collect data from minors.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
                                <p>We may update this Privacy Policy. Continued use of the app after changes means acceptance of the new policy.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">10. Contact Information</h2>
                                <p>For questions regarding this Privacy Policy, please contact us at [support@email.com].</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">1. Introduction</h2>
                                <p>Welcome to <span className="font-semibold">Flow</span> (&#34;we,&#34; &#34;our,&#34; &#34;us&#34;). These Terms & Conditions (&#34;Terms&#34;) govern your use of our ride share platform, which connects independent contractor drivers (&#34;Drivers&#34;) with riders (&#34;Riders&#34;). By accessing or using our app, you agree to comply with these Terms. If you do not agree, please do not use the service.</p>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">2. Eligibility</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Riders must be at least 18 years old to create an account and use the app.</li>
                                    <li>Drivers must be at least 18 years old, pass a background check via Checkr, and meet all vehicle and insurance requirements.</li>
                                    <li>Drivers must not have a history of DUI or distracted driving violations.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">3. User Accounts</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>You must create an account to use the platform. You are responsible for maintaining the security of your account credentials.</li>
                                    <li>Providing false or misleading information may result in account suspension or termination.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">4. Payments & Fees</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Riders agree to pay the fare displayed in the app at the time of booking.</li>
                                    <li>Additional charges, such as cancellation or cleaning fees, may apply as specified in the app.</li>
                                    <li>Drivers are independent contractors and will receive payment based on completed rides.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">5. Cancellations & Refunds</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Riders can cancel a ride before the driver arrives, subject to potential cancellation fees.</li>
                                    <li>No refunds will be issued once a ride has started unless determined otherwise by customer support.</li>
                                    <li>Drivers can cancel a ride for safety reasons, but excessive cancellations may result in account review.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">6. Driver & Rider Conduct</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>Drivers and Riders must treat each other with respect and follow all local traffic laws.</li>
                                    <li>Any form of discrimination, harassment, or illegal activity will result in account suspension or termination.</li>
                                    <li>Drivers must maintain their vehicles in good working condition and ensure they meet all safety requirements.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">7. Safety & Insurance</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>All Drivers must maintain the required insurance, including contingent liability and general liability coverage.</li>
                                    <li>The app provides a safety check process before allowing drivers to operate. However, we do not guarantee safety and are not liable for accidents or damages.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>We provide the platform &#34;as is&#34; and disclaim all warranties regarding service reliability, availability, and safety.</li>
                                    <li>We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of the service.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">9. Termination</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>We reserve the right to suspend or terminate any account at our discretion, including but not limited to violations of these Terms.</li>
                                    <li>Users may delete their accounts at any time via the app settings.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">10. Modifications to Terms</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>We may update these Terms at any time. Continued use of the app after changes means you accept the updated Terms.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">11. Governing Law</h2>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>These Terms are governed by the laws of the state of Texas, without regard to its conflict of law principles.</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">12. Contact Information</h2>
                                <p>For any questions regarding these Terms, please contact us at [support@email.com].</p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}